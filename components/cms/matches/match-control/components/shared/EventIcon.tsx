// components/cms/matches/match-control/components/shared/EventIcon.tsx
"use client";

import { EVENT_TYPE_CONFIG } from "../../constants";

interface EventIconProps {
  type: string;
  className?: string;
}

export function EventIcon({ type, className = "" }: EventIconProps) {
  const config = EVENT_TYPE_CONFIG[type];

  if (!config) {
    return null;
  }

  const Icon = config.icon;
  return <Icon className={`h-4 w-4 ${config.color} shrink-0 ${className}`} />;
}

export function getEventLabel(type: string): string {
  const config = EVENT_TYPE_CONFIG[type];
  return config?.label || type;
}
