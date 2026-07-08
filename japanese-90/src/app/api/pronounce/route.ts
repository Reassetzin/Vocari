import { NextRequest, NextResponse } from "next/server";

// Runs on the server so OPENAI_API_KEY never reaches the browser.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Server missing OPENAI_API_KEY. Add it in your Vercel project env vars." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const file = form.get("audio");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "No audio received." }, { status: 400 });
  }

  // Whisper detects format from the filename extension — match it to the blob's mime.
  const type = file.type || "audio/webm";
  const ext = type.includes("mp4") || type.includes("mpeg") || type.includes("m4a") ? "mp4"
    : type.includes("ogg") ? "ogg"
    : type.includes("wav") ? "wav"
    : "webm";

  const out = new FormData();
  out.append("file", file, `speech.${ext}`);
  out.append("model", "whisper-1");
  out.append("language", "ja");
  out.append("response_format", "json");

  try {
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: out,
    });
    if (!r.ok) {
      const detail = await r.text();
      return NextResponse.json({ error: "Transcription failed.", detail }, { status: 502 });
    }
    const data = await r.json();
    return NextResponse.json({ text: (data.text || "").trim() });
  } catch (e) {
    return NextResponse.json({ error: "Network error reaching the checker.", detail: String(e) }, { status: 500 });
  }
}
