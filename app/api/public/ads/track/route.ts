import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { adImageId, eventType, pageUrl } = body;

    if (!adImageId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert analytics record
    const { error } = await supabase.from("ad_analytics").insert({
      ad_image_id: adImageId,
      event_type: eventType, // 'impression' or 'click'
      page_url: pageUrl,
      user_agent: request.headers.get("user-agent"),
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
