import { NextRequest, NextResponse } from "next/server";

// Runs on the server, so ANTHROPIC_API_KEY never reaches the browser.
export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Server missing ANTHROPIC_API_KEY. Add it to .env.local (local) or your Vercel project env vars." }, { status: 500 });
  }

  let body: { system?: string; messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request body." }, { status: 400 });
  }

  const messages = (body.messages || []).slice(-20); // keep context bounded
  if (!messages.length) return NextResponse.json({ error: "No messages." }, { status: 400 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Swap for any current model string — see https://docs.claude.com/en/docs/about-claude/models
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: body.system || "You are a helpful Japanese tutor.",
        messages,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Tutor upstream error.", detail }, { status: 502 });
    }

    const data = await r.json();
    const text = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: "Network error reaching the tutor.", detail: String(e) }, { status: 500 });
  }
}
