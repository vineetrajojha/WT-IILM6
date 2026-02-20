import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Dummy batch processing logic
    const processed = 50;
    console.log(`Processed ${processed} daily reminders.`);

    return NextResponse.json({ ok: true, processed });
}
