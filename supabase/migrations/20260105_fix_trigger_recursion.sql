-- ============================================================================
-- FIX: Infinite Trigger Recursion (stack depth limit exceeded)
-- ============================================================================
-- The issue: trigger_update_standings_rankings triggers on UPDATE to standings,
-- then updates standings.rank, which triggers itself infinitely.
--
-- Solution: Use session_replication_role or a condition to prevent recursion.
-- ============================================================================

-- Option 1: Simplest fix - Disable the recursive trigger entirely
-- (You can re-enable later after fixing the trigger logic)
DROP TRIGGER IF EXISTS trigger_update_standings_rankings ON public.standings;

-- Option 2: Fix the trigger with a recursion guard using a session variable
CREATE OR REPLACE FUNCTION update_standings_rankings()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip if we're already inside this trigger (prevents recursion)
  IF current_setting('app.updating_rankings', true) = 'true' THEN
    RETURN NEW;
  END IF;

  -- Set the guard flag
  PERFORM set_config('app.updating_rankings', 'true', true);
  
  -- Update rankings for the league/season
  WITH ranked AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY 
          (points - COALESCE(points_deduction, 0)) DESC,
          gd DESC,
          goals_for DESC,
          won DESC
      ) as new_rank
    FROM public.standings
    WHERE league_id = NEW.league_id AND season = NEW.season
  )
  UPDATE public.standings s
  SET rank = r.new_rank
  FROM ranked r
  WHERE s.id = r.id AND s.rank IS DISTINCT FROM r.new_rank;  -- Only update if different
  
  -- Reset the guard flag
  PERFORM set_config('app.updating_rankings', 'false', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with WHEN condition to only fire on meaningful changes
CREATE TRIGGER trigger_update_standings_rankings
AFTER INSERT OR UPDATE OF played, won, draw, lost, goals_for, goals_against, gd, points ON public.standings
FOR EACH ROW
WHEN (pg_trigger_depth() < 1)  -- Prevent recursive calls
EXECUTE FUNCTION update_standings_rankings();

-- ============================================================================
-- Alternative: If you want to completely disable standings automation for now
-- ============================================================================
-- Uncomment the following lines to disable all standings triggers:
/*
DROP TRIGGER IF EXISTS trigger_update_standings_from_match ON public.matches;
DROP TRIGGER IF EXISTS trigger_update_standings_rankings ON public.standings;
DROP TRIGGER IF EXISTS trigger_update_head_to_head ON public.matches;
*/

-- ============================================================================
-- Quick Fix: Disable just the problematic ranking trigger
-- ============================================================================
-- Run this if you want the simplest solution:
-- DROP TRIGGER IF EXISTS trigger_update_standings_rankings ON public.standings;
