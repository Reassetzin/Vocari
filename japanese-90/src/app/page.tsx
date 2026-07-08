"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Home, Type, MessageCircle, Flame, Volume2, Send, Settings, RotateCcw, Check, X, ChevronRight } from "lucide-react";

/* ---------- palette: washi / sumi / indigo(藍) / vermilion(朱) ---------- */
const C = {
  paper: "#EFEBE1", card: "#F6F3EB", card2: "#E9E4D6",
  ink: "#1C1B21", inkSoft: "#57545C", inkFaint: "#8C8878",
  indigo: "#20416A", indigoSoft: "#4E6C93",
  vermilion: "#CB3A22", vermilionSoft: "#E0644E", matcha: "#6E7F5B", line: "#D9D3C4",
};

/* ---------- data ---------- */
type Kana = { k: string; r: string };
const HIRAGANA: Kana[] = [
  ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
  ["か","ka"],["き","ki"],["く","ku"],["け","ke"],["こ","ko"],
  ["さ","sa"],["し","shi"],["す","su"],["せ","se"],["そ","so"],
  ["た","ta"],["ち","chi"],["つ","tsu"],["て","te"],["と","to"],
  ["な","na"],["に","ni"],["ぬ","nu"],["ね","ne"],["の","no"],
  ["は","ha"],["ひ","hi"],["ふ","fu"],["へ","he"],["ほ","ho"],
  ["ま","ma"],["み","mi"],["む","mu"],["め","me"],["も","mo"],
  ["や","ya"],["ゆ","yu"],["よ","yo"],
  ["ら","ra"],["り","ri"],["る","ru"],["れ","re"],["ろ","ro"],
  ["わ","wa"],["を","wo"],["ん","n"],
].map(([k, r]) => ({ k, r }));

type Week = { n: number; phase: string; title: string; grammar: string };
const WEEKS: Week[] = [
  { n: 1, phase: "Foundations", title: "Hiragana + first sentences", grammar: "XはYです・これ/それ/あれ・か (question)・negation じゃありません" },
  { n: 2, phase: "Foundations", title: "Katakana + numbers & time", grammar: "の (possessive)・も (also)・counters・time・〜ませんか (invite)" },
  { n: 3, phase: "Foundations", title: "Verbs enter", grammar: "ます-form・past ました・neg ません・を・に/へ・で" },
  { n: 4, phase: "Foundations", title: "Adjectives + Month 1 review", grammar: "い & な adjectives・past/neg adj・が・あります/います" },
  { n: 5, phase: "Building blocks", title: "The te-form", grammar: "て-form・〜てください・〜ています・〜てもいいです" },
  { n: 6, phase: "Building blocks", title: "Plain form + casual", grammar: "dictionary form・〜てはいけません・casual endings・〜ましょう" },
  { n: 7, phase: "Building blocks", title: "Desires & reasons", grammar: "ない-form・〜たい・〜から・〜が (but)・〜が好き/上手" },
  { n: 8, phase: "Building blocks", title: "Potential + Month 2 review", grammar: "potential form・〜より/〜のほうが・一番" },
  { n: 9, phase: "Consolidation", title: "Past plain + giving/receiving", grammar: "plain past・〜たり〜たり・と/たら・あげる/くれる/もらう" },
  { n: 10, phase: "Consolidation", title: "Change & opinions", grammar: "〜なる・transitive/intransitive・〜ば・〜と思います" },
  { n: 11, phase: "Consolidation", title: "Real casual conversation", grammar: "ね/よ/な・casual questions・quoting って・backchannels" },
  { n: 12, phase: "Consolidation", title: "Keigo intro + situations", grammar: "polite/humble/honorific basics・phone & counter language" },
  { n: 13, phase: "Consolidation", title: "Consolidation + final push", grammar: "no new grammar — recycle weak points, go output-heavy" },
];

const DAILY_BLOCKS = ["SRS review", "New vocab", "Grammar", "Listening", "Speaking / shadow", "Reading", "Writing", "Conversation (3×/wk)"];
const MILESTONES: Record<number, string> = {
  1: "Record a 30-second voice memo today — your Day 1 baseline.",
  30: "Record a 90-second self-intro, no script. Compare to Day 1.",
  60: "Record a 3-minute talk on your daily life & hobbies.",
  90: "Record a 10-minute conversation. Play all four recordings back-to-back.",
};

/* ---------- storage (localStorage — per device, offline-friendly) ---------- */
type Progress = { doneDays: number[]; studyDates: string[] };
type KanaStats = Record<string, { seen: number; correct: number }>;

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function save(key: string, obj: unknown) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch { /* */ } }

/* ---------- date helpers ---------- */
const ymd = (d: Date | string) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
function nextMondayYmd() { const d = new Date(); const diff = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + diff); return ymd(d); }
function dayNumber(startYmd: string | null) {
  if (!startYmd) return 0;
  const start = new Date(startYmd + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((+now - +start) / 86400000) + 1;
}
function streakFrom(dates: string[]) {
  const set = new Set(dates); let n = 0; const d = new Date(); d.setHours(0, 0, 0, 0);
  while (set.has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- speech: native Web Speech (works in a real browser / PWA) ---------- */
let JP_VOICE: SpeechSynthesisVoice | null = null;
function refreshVoices() {
  try {
    const vs = window.speechSynthesis.getVoices() || [];
    JP_VOICE = vs.find((v) => (v.lang || "").toLowerCase().replace("_", "-").startsWith("ja")) || null;
  } catch { /* */ }
}
function speak(text: string) {
  const t = (text || "").trim(); if (!t) return;
  try {
    refreshVoices();
    const u = new SpeechSynthesisUtterance(t);
    if (JP_VOICE) u.voice = JP_VOICE;
    u.lang = JP_VOICE?.lang || "ja-JP"; u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* no voice available on this device */ }
}
// Pull the Japanese out of a SINGLE line (kana/kanji + JP punctuation), so we
// can attach audio per line instead of reading the whole message as one blob.
function jpInLine(line: string) {
  const m = (line || "").match(/[\u3040-\u30ff\u4e00-\u9faf\u3005\u3006\u30fc々〆ヶ、。！？]+/g);
  return m ? m.join("") : "";
}

/* ================================================================= */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"today" | "kana" | "sensei">("today");
  const [start, setStart] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({ doneDays: [], studyDates: [] });
  const [kana, setKana] = useState<KanaStats>({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setStart(load<string | null>("jp_start", null));
    setProgress(load<Progress>("jp_progress", { doneDays: [], studyDates: [] }));
    setKana(load<KanaStats>("jp_kana", {}));
    setLoaded(true);
    try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = refreshVoices; } catch { /* */ }
  }, []);

  const day = dayNumber(start);
  const week = Math.min(13, Math.max(1, Math.ceil(day / 7)));
  const wk = WEEKS[week - 1];
  const streak = streakFrom(progress.studyDates);

  const saveProgress = useCallback((p: Progress) => { setProgress(p); save("jp_progress", p); }, []);
  const saveKana = useCallback((k: KanaStats) => { setKana(k); save("jp_kana", k); }, []);

  if (!loaded) return <Splash />;
  if (!start) return <SetupScreen onStart={(s) => { setStart(s); save("jp_start", s); }} />;

  return (
    <div style={{ background: C.paper, color: C.ink, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 84, minHeight: "100dvh", position: "relative" }}>
        <TopBar onSettings={() => setShowSettings(true)} />
        {tab === "today" && <Today day={day} week={week} wk={wk} streak={streak} progress={progress} saveProgress={saveProgress} start={start} onSensei={() => setTab("sensei")} />}
        {tab === "kana" && <KanaTrainer kana={kana} saveKana={saveKana} />}
        {tab === "sensei" && <Sensei day={day} week={week} wk={wk} />}
        <TabBar tab={tab} setTab={setTab} />
        {showSettings && (
          <SettingsSheet
            start={start}
            onClose={() => setShowSettings(false)}
            onReset={() => { const fresh = { doneDays: [], studyDates: [] }; saveProgress(fresh); saveKana({}); setShowSettings(false); }}
            onSetStart={(s) => { setStart(s); save("jp_start", s); setShowSettings(false); }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- chrome ---------- */
function TopBar({ onSettings }: { onSettings: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontWeight: 700, fontSize: 22, color: C.indigo }}>日本語</span>
        <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", color: C.inkFaint, fontSize: 15 }}>ninety</span>
      </div>
      <button onClick={onSettings} aria-label="Settings" style={iconBtn}><Settings size={18} color={C.inkSoft} /></button>
    </div>
  );
}
function TabBar({ tab, setTab }: { tab: string; setTab: (t: "today" | "kana" | "sensei") => void }) {
  const items: [("today" | "kana" | "sensei"), typeof Home, string][] = [["today", Home, "Today"], ["kana", Type, "Kana"], ["sensei", MessageCircle, "Sensei"]];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", background: C.card, borderTop: `1px solid ${C.line}`, boxShadow: "0 -6px 24px rgba(28,27,33,0.06)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {items.map(([id, Icon, label]) => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 0 14px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Icon size={22} color={on ? C.vermilion : C.inkFaint} strokeWidth={on ? 2.4 : 2} />
              <span style={{ fontSize: 11, fontWeight: on ? 700 : 500, color: on ? C.ink : C.inkFaint }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- TODAY ---------- */
function Today({ day, week, wk, streak, progress, saveProgress, start, onSensei }:
  { day: number; week: number; wk: Week; streak: number; progress: Progress; saveProgress: (p: Progress) => void; start: string; onSensei: () => void }) {
  const notStarted = day < 1;
  const done = day > 90;
  const doneToday = progress.doneDays.includes(day);
  const milestone = MILESTONES[day];

  function markComplete() {
    if (doneToday) return;
    saveProgress({
      doneDays: [...new Set([...progress.doneDays, day])],
      studyDates: [...new Set([...progress.studyDates, ymd(new Date())])],
    });
  }

  if (notStarted) {
    return (
      <div style={{ padding: "8px 20px 20px" }}>
        <Card>
          <Eyebrow>Not started yet</Eyebrow>
          <h2 style={h2}>{Math.abs(day) + 1} day{Math.abs(day) === 0 ? "" : "s"} to go</h2>
          <p style={{ color: C.inkSoft, lineHeight: 1.55, margin: "8px 0 0" }}>
            Your sprint begins <b>{new Date(start + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</b>. Don&apos;t wait to warm up — tap Sensei and say <i>konnichiwa</i>, or hit the Kana tab and start learning to read. A head start is free.
          </p>
        </Card>
        <PrimaryButton onClick={onSensei} style={{ marginTop: 14 }}>Warm up with Sensei <ChevronRight size={18} /></PrimaryButton>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <Eyebrow>{done ? "Complete" : wk.phase}</Eyebrow>
          <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 44, lineHeight: 1, color: C.ink }}>
            {done ? "終" : <>Day <span style={{ color: C.vermilion }}>{day}</span></>}
            {!done && <span style={{ fontSize: 20, color: C.inkFaint, fontWeight: 400 }}> / 90</span>}
          </div>
          {!done && <div style={{ marginTop: 6, color: C.inkSoft, fontSize: 14 }}>Week {week} · {wk.title}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 14px" }}>
          <Flame size={18} color={streak > 0 ? C.vermilion : C.inkFaint} fill={streak > 0 ? C.vermilion : "none"} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>{streak}</span>
          <span style={{ fontSize: 12, color: C.inkFaint }}>day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <Eyebrow>御朱印 · your stamp path</Eyebrow>
          <span style={{ fontSize: 12, color: C.inkFaint }}>{progress.doneDays.length} / 90</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5 }}>
          {Array.from({ length: 90 }, (_, i) => {
            const d = i + 1;
            const stamped = progress.doneDays.includes(d);
            const isToday = d === day;
            return (
              <div key={d} title={`Day ${d}`} className={isToday && !stamped ? "jp-pulse" : ""}
                style={{
                  aspectRatio: "1", borderRadius: 4,
                  background: stamped ? C.vermilion : "transparent",
                  border: stamped ? "none" : `1.5px solid ${isToday ? C.indigo : C.line}`,
                  boxShadow: stamped ? "inset 0 0 0 1.5px rgba(255,255,255,0.35)" : "none",
                }} />
            );
          })}
        </div>
      </Card>

      {milestone && (
        <div style={{ marginTop: 14, background: C.indigo, color: "#F6F3EB", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>Milestone day</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{milestone}</div>
        </div>
      )}

      {!done && (
        <Card style={{ marginTop: 14 }}>
          <Eyebrow>This week&apos;s grammar</Eyebrow>
          <p style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 15.5, lineHeight: 1.7, margin: "6px 0 14px", color: C.ink }}>{wk.grammar}</p>
          <Eyebrow>Today&apos;s blocks</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
            {DAILY_BLOCKS.map((b) => <span key={b} style={{ fontSize: 12.5, color: C.inkSoft, background: C.card2, borderRadius: 999, padding: "5px 11px" }}>{b}</span>)}
          </div>
        </Card>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <PrimaryButton onClick={markComplete} disabled={doneToday} style={{ flex: 1 }}>
          {doneToday ? <><Check size={18} /> Stamped</> : "Mark today complete"}
        </PrimaryButton>
        <button onClick={onSensei} style={{ ...secondaryBtn, flex: "0 0 auto" }}>Sensei</button>
      </div>
    </div>
  );
}

/* ---------- KANA TRAINER ---------- */
function KanaTrainer({ kana, saveKana }: { kana: KanaStats; saveKana: (k: KanaStats) => void }) {
  const [cur, setCur] = useState<Kana>(() => pickKana(kana, null));
  const [val, setVal] = useState("");
  const [result, setResult] = useState<null | "right" | "wrong">(null);
  const [showChart, setShowChart] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const mastered = HIRAGANA.filter((h) => { const s = kana[h.k]; return s && s.seen >= 3 && s.correct / s.seen >= 0.9; }).length;

  function check() {
    if (result) { next(); return; }
    const ans = val.trim().toLowerCase(); if (!ans) return;
    const right = ans === cur.r;
    const s = kana[cur.k] || { seen: 0, correct: 0 };
    saveKana({ ...kana, [cur.k]: { seen: s.seen + 1, correct: s.correct + (right ? 1 : 0) } });
    setResult(right ? "right" : "wrong");
    speak(cur.k);
  }
  function next() {
    setCur(pickKana(kana, cur.k)); setVal(""); setResult(null);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  return (
    <div style={{ padding: "8px 20px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <Eyebrow>Hiragana</Eyebrow>
          <div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}><b style={{ color: C.ink }}>{mastered}</b> / 46 mastered</div>
        </div>
        <button onClick={() => setShowChart((s) => !s)} style={secondaryBtn}>{showChart ? "Drill" : "See chart"}</button>
      </div>

      <div style={{ height: 6, background: C.card2, borderRadius: 999, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ height: "100%", width: `${(mastered / 46) * 100}%`, background: C.vermilion, transition: "width .4s" }} />
      </div>

      {showChart ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {HIRAGANA.map((h) => {
            const s = kana[h.k]; const m = s && s.seen >= 3 && s.correct / s.seen >= 0.9;
            return (
              <button key={h.k} onClick={() => speak(h.k)} style={{ background: C.card, border: `1px solid ${m ? C.vermilion : C.line}`, borderRadius: 10, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 24, color: C.ink }}>{h.k}</span>
                <span style={{ fontSize: 11, color: C.inkFaint }}>{h.r}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: "34px 20px 24px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 104, lineHeight: 1, color: C.ink }}>{cur.k}</div>
            <button onClick={() => speak(cur.k)} aria-label="Hear it" style={{ ...iconBtn, position: "absolute", top: 4, right: 0 }}><Volume2 size={20} color={C.indigoSoft} /></button>
          </div>
          <input
            ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="type the sound…" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
            style={{ marginTop: 22, width: "100%", textAlign: "center", fontSize: 20, padding: "12px 10px", border: `2px solid ${result === "right" ? C.matcha : result === "wrong" ? C.vermilion : C.line}`, borderRadius: 12, background: C.paper, color: C.ink, outline: "none" }}
          />
          <div style={{ minHeight: 30, marginTop: 12 }}>
            {result === "right" && <span style={{ color: C.matcha, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><Check size={18} /> {cur.r}</span>}
            {result === "wrong" && <span style={{ color: C.vermilion, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><X size={18} /> it&apos;s <b>{cur.r}</b></span>}
          </div>
          <PrimaryButton onClick={check} style={{ marginTop: 10, width: "100%" }}>{result ? "Next" : "Check"}</PrimaryButton>
        </Card>
      )}
      <p style={{ fontSize: 12.5, color: C.inkFaint, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        Tap 🔊 to hear each kana using your device&apos;s Japanese voice.
      </p>
    </div>
  );
}
function pickKana(stats: KanaStats, avoid: string | null): Kana {
  const scored = HIRAGANA.map((h) => {
    const s = stats[h.k]; let w: number;
    if (!s || s.seen === 0) w = 5;
    else { const acc = s.correct / s.seen; w = acc < 0.7 ? 4 : acc < 0.9 ? 2 : 0.4; }
    return { h, w };
  }).filter((x) => x.h.k !== avoid);
  const total = scored.reduce((a, b) => a + b.w, 0);
  let r = Math.random() * total;
  for (const x of scored) { r -= x.w; if (r <= 0) return x.h; }
  return scored[0].h;
}

/* ---------- SENSEI (calls /api/tutor) ---------- */
type Msg = { role: "user" | "assistant"; content: string };
function Sensei({ day, week, wk }: { day: number; week: number; wk: Week }) {
  const level = day <= 14 ? "absolute beginner who knows almost no Japanese yet" : day <= 30 ? "beginner" : day <= 60 ? "upper beginner" : "lower-intermediate learner";
  const greet = day < 1
    ? "こんにちは (konnichiwa) — hello! 👋 You haven't started yet, but let's warm up. Want me to teach you your first three phrases, or start you on reading hiragana?"
    : `こんにちは (konnichiwa)! I'm your sensei. You're on Day ${day}, Week ${week} — ${wk.title}. Tap a button below or just start typing. Say things OUT LOUD as we go.`;

  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: greet }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy]);

  const system = `You are "Sensei", a warm, expert Japanese tutor for an English speaker on a 90-day conversational sprint. Today is Day ${day} of 90 (Week ${week}: "${wk.title}"). This week's grammar focus: ${wk.grammar}. The learner is an ${level}.
Rules:
- Keep replies SHORT — a few lines, one idea at a time. Never lecture or dump walls of text.
- Whenever you write Japanese, format each line as: 日本語 (romaji) — English meaning. ALWAYS include romaji and English at this level${day > 45 ? ", unless the learner asks you to drop romaji" : ""}.
- When the learner attempts Japanese, gently correct: show what they wrote, the fix, and one short reason.
- Stay near this week's focus; don't pile on grammar far beyond their level.
- End every turn by giving them one concrete thing to SAY or DO next, and nudge them to say it out loud.
- Be encouraging and human. No emoji spam.`;

  async function send(text: string) {
    const content = text.trim(); if (!content || busy) return;
    const history = [...msgs, { role: "user", content } as Msg];
    setMsgs(history); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ system, messages: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "error");
      setMsgs([...history, { role: "assistant", content: (data.text || "…（no reply — try again）").trim() }]);
    } catch {
      setMsgs([...history, { role: "assistant", content: "I couldn't reach the tutor. Check your connection (and that ANTHROPIC_API_KEY is set on the server), then tap send again — your message is still here." }]);
    } finally { setBusy(false); }
  }

  const chips = day < 1
    ? ["Teach me my first 3 phrases", "Start me on hiragana", "How does Japanese word order work?"]
    : ["Teach me today's lesson", "Quiz me on what I know", "Roleplay a simple conversation", "Check a sentence I wrote"];

  return (
    <div style={{ padding: "8px 0 0", display: "flex", flexDirection: "column", height: "calc(100dvh - 148px)" }}>
      <div style={{ padding: "0 20px 6px" }}><Eyebrow>先生 · your tutor</Eyebrow></div>
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", padding: "8px 20px 8px" }}>
        {msgs.map((m, i) => <Bubble key={i} role={m.role} text={m.content} />)}
        {busy && <Bubble role="assistant" text="…" typing />}
      </div>
      <div style={{ padding: "8px 16px 0", display: "flex", gap: 8, overflowX: "auto" }} className="jp-noscroll">
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)} disabled={busy} style={{ whiteSpace: "nowrap", fontSize: 12.5, color: C.indigo, background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "7px 13px", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ padding: "10px 16px 14px", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={input} onChange={(e) => setInput(e.target.value)} rows={1}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Type in English or Japanese…"
          style={{ flex: 1, resize: "none", fontSize: 15, padding: "11px 14px", border: `1px solid ${C.line}`, borderRadius: 16, background: C.card, color: C.ink, outline: "none", maxHeight: 120, fontFamily: "inherit" }}
        />
        <button onClick={() => send(input)} disabled={busy || !input.trim()} aria-label="Send"
          style={{ background: input.trim() ? C.vermilion : C.card2, border: "none", borderRadius: 14, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", flexShrink: 0 }}>
          <Send size={20} color={input.trim() ? "#fff" : C.inkFaint} />
        </button>
      </div>
    </div>
  );
}
function Bubble({ role, text, typing }: { role: string; text: string; typing?: boolean }) {
  const me = role === "user";
  const iconColor = me ? "rgba(246,243,235,0.85)" : C.indigoSoft;
  const lines = typing ? [] : (text || "").split("\n");
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 10 }}>
      <div style={{
        maxWidth: "86%", padding: "10px 14px", borderRadius: 16,
        background: me ? C.indigo : C.card, color: me ? "#F6F3EB" : C.ink,
        border: me ? "none" : `1px solid ${C.line}`,
        borderBottomRightRadius: me ? 4 : 16, borderBottomLeftRadius: me ? 16 : 4,
        fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif", fontSize: 15, lineHeight: 1.6,
      }}>
        {typing ? (
          <span className="jp-typing">●&nbsp;●&nbsp;●</span>
        ) : (
          lines.map((line, i) => {
            if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
            const jp = jpInLine(line);
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{ flex: 1, whiteSpace: "pre-wrap" }}>{line}</span>
                {jp && (
                  <button onClick={() => speak(jp)} aria-label={`Hear ${jp}`} title="Hear this line"
                    style={{ flexShrink: 0, marginTop: 3, background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", color: iconColor }}>
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ---------- setup / settings ---------- */
function SetupScreen({ onStart }: { onStart: (s: string) => void }) {
  const [date, setDate] = useState(nextMondayYmd());
  return (
    <div style={{ background: C.paper, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, color: C.ink }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontWeight: 700, fontSize: 40, color: C.indigo }}>日本語<span style={{ color: C.vermilion }}>90</span></div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 26, margin: "10px 0 8px" }}>Ninety days to a conversation.</h1>
        <p style={{ color: C.inkSoft, lineHeight: 1.6, marginBottom: 22 }}>Pick your start date. Day 1 begins that morning — everything counts forward from there.</p>
        <label style={{ ...eyebrowStyle, display: "block", marginBottom: 8 }}>Start date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", fontSize: 16, padding: "12px 14px", border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, color: C.ink }} />
        <PrimaryButton onClick={() => onStart(date)} style={{ marginTop: 16, width: "100%" }}>Begin the sprint</PrimaryButton>
      </div>
    </div>
  );
}
function SettingsSheet({ start, onClose, onReset, onSetStart }: { start: string; onClose: () => void; onReset: () => void; onSetStart: (s: string) => void }) {
  const [date, setDate] = useState(start);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(28,27,33,0.4)", zIndex: 40, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: C.paper, width: "100%", maxWidth: 480, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "22px 22px 30px" }}>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, margin: "0 0 16px" }}>Settings</h3>
        <label style={{ ...eyebrowStyle, display: "block", marginBottom: 8 }}>Start date</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1, fontSize: 15, padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 10, background: C.card, color: C.ink }} />
          <button onClick={() => onSetStart(date)} style={secondaryBtn}>Save</button>
        </div>
        <button onClick={onReset} style={{ marginTop: 22, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px solid ${C.vermilion}`, color: C.vermilion, borderRadius: 12, padding: "12px", fontWeight: 600, cursor: "pointer" }}>
          <RotateCcw size={16} /> Reset all progress
        </button>
        <button onClick={onClose} style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: C.inkFaint, padding: 8, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */
const iconBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, display: "inline-flex" };
const secondaryBtn: React.CSSProperties = { background: C.card, border: `1px solid ${C.line}`, color: C.indigo, borderRadius: 12, padding: "9px 14px", fontWeight: 600, fontSize: 13.5, cursor: "pointer" };
const h2: React.CSSProperties = { fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 28, margin: "4px 0 0" };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.inkFaint, fontWeight: 700 };
function Eyebrow({ children }: { children: React.ReactNode }) { return <div style={eyebrowStyle}>{children}</div>; }
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 18, ...style }}>{children}</div>;
}
function PrimaryButton({ children, style, disabled, onClick }: { children: React.ReactNode; style?: React.CSSProperties; disabled?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: disabled ? C.card2 : C.vermilion, color: disabled ? C.inkFaint : "#fff", border: "none", borderRadius: 14, padding: "13px 18px", fontWeight: 700, fontSize: 15, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}>
      {children}
    </button>
  );
}
function Splash() {
  return <div style={{ background: C.paper, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: C.indigo, fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 30, fontWeight: 700 }}>日本語</div>;
}
