"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Home, BookOpen, Type, Flame, Volume2, Send, Settings, RotateCcw, Check, X, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { LANGUAGES, DEFAULT_LANG, type Language, type Lesson, type Week, type Kana } from "@/lib/curriculum";

/* ---------- palette: washi / sumi / indigo(藍) / vermilion(朱) ---------- */
const C = {
  paper: "#EFEBE1", card: "#F6F3EB", card2: "#E9E4D6",
  ink: "#1C1B21", inkSoft: "#57545C", inkFaint: "#8C8878",
  indigo: "#20416A", indigoSoft: "#4E6C93",
  vermilion: "#CB3A22", vermilionSoft: "#E0644E", matcha: "#6E7F5B", line: "#D9D3C4",
};

const VERSION = "0.4.0";
const MILESTONES: Record<number, string> = {
  1: "Record a 30-second voice memo today — your Day 1 baseline.",
  30: "Record a 90-second self-intro, no script. Compare to Day 1.",
  60: "Record a 3-minute talk on your daily life & hobbies.",
  90: "Record a 10-minute conversation. Play all four recordings back-to-back.",
};

/* ---------- storage ---------- */
function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function save(key: string, obj: unknown) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch { /* */ } }

/* ---------- dates ---------- */
const ymd = (d: Date | string) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`; };
function nextMondayYmd() { const d = new Date(); const diff = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + diff); return ymd(d); }
function dayNumber(startYmd: string | null) {
  if (!startYmd) return 0;
  const start = new Date(startYmd + "T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((+now - +start) / 86400000) + 1;
}
function dateForDay(startYmd: string, day: number) {
  const d = new Date(startYmd + "T00:00:00"); d.setDate(d.getDate() + (day - 1));
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function streakFrom(dates: string[]) {
  const set = new Set(dates); let n = 0; const d = new Date(); d.setHours(0, 0, 0, 0);
  while (set.has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- speech (native; works in a real browser/PWA) ---------- */
let VOICES: SpeechSynthesisVoice[] = [];
function refreshVoices() { try { VOICES = window.speechSynthesis.getVoices() || []; } catch { /* */ } }
function speak(text: string, ttsLang = "ja-JP") {
  const t = (text || "").trim(); if (!t) return;
  try {
    refreshVoices();
    const pref = ttsLang.slice(0, 2).toLowerCase();
    const v = VOICES.find((x) => (x.lang || "").toLowerCase().replace("_", "-").startsWith(pref)) || null;
    const u = new SpeechSynthesisUtterance(t);
    if (v) u.voice = v;
    u.lang = ttsLang; u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch { /* no voice on this device */ }
}
function jpInLine(line: string) {
  const m = (line || "").match(/[\u3040-\u30ff\u4e00-\u9faf\u3005\u3006\u30fc々〆ヶ、。！？]+/g);
  return m ? m.join("") : "";
}

/* ================================================================= */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"today" | "learn" | "kana">("today");
  const [langCode, setLangCode] = useState<string>(DEFAULT_LANG);
  const [start, setStart] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ doneDays: number[]; studyDates: string[] }>({ doneDays: [], studyDates: [] });
  const [kanaStats, setKanaStats] = useState<Record<string, { seen: number; correct: number }>>({});
  const [wordStats, setWordStats] = useState<Record<string, { right: number; wrong: number }>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [showLang, setShowLang] = useState(false);

  useEffect(() => {
    setLangCode(load<string>("app_lang", DEFAULT_LANG));
    setStart(load<string | null>("jp_start", null));
    setProgress(load("jp_progress", { doneDays: [], studyDates: [] }));
    setKanaStats(load("jp_kana", {}));
    setLoaded(true);
    try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = refreshVoices; } catch { /* */ }
  }, []);

  useEffect(() => { if (loaded) setWordStats(load(`words_${langCode}`, {})); }, [langCode, loaded]);

  const L = LANGUAGES[langCode] || LANGUAGES[DEFAULT_LANG];
  const day = dayNumber(start);
  const streak = streakFrom(progress.studyDates);

  const saveProgress = useCallback((p: typeof progress) => { setProgress(p); save("jp_progress", p); }, []);
  const saveKana = useCallback((k: typeof kanaStats) => { setKanaStats(k); save("jp_kana", k); }, []);
  const completeDay = useCallback((d: number) => {
    setProgress((p) => {
      const np = { doneDays: [...new Set([...p.doneDays, d])], studyDates: [...new Set([...p.studyDates, ymd(new Date())])] };
      save("jp_progress", np); return np;
    });
  }, []);
  const answerWord = useCallback((wordKey: string, correct: boolean) => {
    setWordStats((w) => {
      const s = w[wordKey] || { right: 0, wrong: 0 };
      const nw = { ...w, [wordKey]: { right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) } };
      save(`words_${langCode}`, nw); return nw;
    });
  }, [langCode]);
  function pickLang(code: string) { setLangCode(code); save("app_lang", code); setShowLang(false); if (tab === "kana" && !LANGUAGES[code].hasScript) setTab("learn"); }

  if (!loaded) return <Splash />;
  if (!start) return <SetupScreen L={L} onOpenLang={() => setShowLang(true)} onStart={(s) => { setStart(s); save("jp_start", s); }} />;

  return (
    <div style={{ background: C.paper, color: C.ink, minHeight: "100dvh" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", paddingBottom: 84, minHeight: "100dvh", position: "relative" }}>
        <TopBar L={L} onLang={() => setShowLang(true)} onSettings={() => setShowSettings(true)} />
        {tab === "today" && <Today L={L} day={day} streak={streak} progress={progress} start={start} onLearn={() => setTab("learn")} />}
        {tab === "learn" && <LearnTab L={L} currentDay={day} start={start} progress={progress} onComplete={completeDay} wordStats={wordStats} onAnswer={answerWord} />}
        {tab === "kana" && L.kana && <KanaTrainer kanaSet={L.kana} ttsLang={L.ttsLang} kanaStats={kanaStats} saveKana={saveKana} />}
        <TabBar tab={tab} setTab={setTab} hasScript={L.hasScript} />
        {showLang && <LangSheet current={langCode} onPick={pickLang} onClose={() => setShowLang(false)} />}
        {showSettings && (
          <SettingsSheet start={start} onClose={() => setShowSettings(false)}
            onReset={() => { saveProgress({ doneDays: [], studyDates: [] }); saveKana({}); setShowSettings(false); }}
            onSetStart={(s) => { setStart(s); save("jp_start", s); setShowSettings(false); }} />
        )}
      </div>
    </div>
  );
}

/* ---------- chrome ---------- */
function TopBar({ L, onLang, onSettings }: { L: Language; onLang: () => void; onSettings: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontWeight: 700, fontSize: 22, color: C.indigo }}>Vocari</span>
        <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", color: C.inkFaint, fontSize: 14 }}>90</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button onClick={onLang} aria-label="Change language" style={{ ...pillBtn }}>
          <Globe size={15} color={C.indigo} /> <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif" }}>{L.nativeName}</span>
        </button>
        <button onClick={onSettings} aria-label="Settings" style={iconBtn}><Settings size={18} color={C.inkSoft} /></button>
      </div>
    </div>
  );
}
function TabBar({ tab, setTab, hasScript }: { tab: string; setTab: (t: "today" | "learn" | "kana") => void; hasScript: boolean }) {
  const items: [("today" | "learn" | "kana"), typeof Home, string][] = [["today", Home, "Today"], ["learn", BookOpen, "Learn"]];
  if (hasScript) items.push(["kana", Type, "Kana"]);
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
function Today({ L, day, streak, progress, start, onLearn }:
  { L: Language; day: number; streak: number; progress: { doneDays: number[]; studyDates: string[] }; start: string; onLearn: () => void }) {
  const notStarted = day < 1;
  const done = day > 90;
  const doneToday = progress.doneDays.includes(day);
  const milestone = MILESTONES[day];
  const week = L.weeks.length ? L.weeks[Math.min(L.weeks.length - 1, Math.max(0, Math.ceil(day / 7) - 1))] : null;
  const lesson = L.lessons.find((l) => l.day === day);

  if (notStarted) {
    return (
      <div style={{ padding: "8px 20px 20px" }}>
        <Card>
          <Eyebrow>Not started yet</Eyebrow>
          <h2 style={h2}>{Math.abs(day) + 1} day{Math.abs(day) === 0 ? "" : "s"} to go</h2>
          <p style={{ color: C.inkSoft, lineHeight: 1.55, margin: "8px 0 0" }}>
            Your sprint begins <b>{new Date(start + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</b>. Warm up early — open Learn to preview Day 1{L.hasScript ? ", or start reading in the Kana tab" : ""}.
          </p>
        </Card>
        <PrimaryButton onClick={onLearn} style={{ marginTop: 14 }}>Preview Day 1 <ChevronRight size={18} /></PrimaryButton>
        <VersionFooter />
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 20px 20px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <Eyebrow>{done ? "Complete" : week ? week.phase : L.name}</Eyebrow>
          <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 44, lineHeight: 1, color: C.ink }}>
            {done ? "終" : <>Day <span style={{ color: C.vermilion }}>{day}</span></>}
            {!done && <span style={{ fontSize: 20, color: C.inkFaint, fontWeight: 400 }}> / 90</span>}
          </div>
          {!done && week && <div style={{ marginTop: 6, color: C.inkSoft, fontSize: 14 }}>Week {Math.ceil(day / 7)} · {week.title}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 14px" }}>
          <Flame size={18} color={streak > 0 ? C.vermilion : C.inkFaint} fill={streak > 0 ? C.vermilion : "none"} />
          <span style={{ fontWeight: 700, fontSize: 17 }}>{streak}</span>
          <span style={{ fontSize: 12, color: C.inkFaint }}>day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>

      {/* start today's lesson */}
      {!done && (
        <Card style={{ marginBottom: 14 }}>
          <Eyebrow>{doneToday ? "Today · complete" : "Today's lesson"}</Eyebrow>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 21, margin: "6px 0 4px" }}>{lesson ? lesson.title : week ? week.title : "Lesson"}</h3>
          {lesson && <p style={{ color: C.inkSoft, fontSize: 13.5, margin: "0 0 14px" }}>{lesson.grammar.name}</p>}
          <PrimaryButton onClick={onLearn} style={{ width: "100%", background: doneToday ? C.card2 : C.vermilion, color: doneToday ? C.ink : "#fff" }}>
            {doneToday ? <><Check size={18} color={C.matcha} /> Completed — review</> : <>Start today&apos;s lesson <ChevronRight size={18} /></>}
          </PrimaryButton>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <Eyebrow>御朱印 · your stamp path</Eyebrow>
          <span style={{ fontSize: 12, color: C.inkFaint }}>{progress.doneDays.length} / 90</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 5 }}>
          {Array.from({ length: 90 }, (_, i) => {
            const d = i + 1; const stamped = progress.doneDays.includes(d); const isToday = d === day;
            return <div key={d} title={`Day ${d}`} className={isToday && !stamped ? "jp-pulse" : ""}
              style={{ aspectRatio: "1", borderRadius: 4, background: stamped ? C.vermilion : "transparent", border: stamped ? "none" : `1.5px solid ${isToday ? C.indigo : C.line}`, boxShadow: stamped ? "inset 0 0 0 1.5px rgba(255,255,255,0.35)" : "none" }} />;
          })}
        </div>
      </Card>

      {milestone && (
        <div style={{ marginTop: 14, background: C.indigo, color: "#F6F3EB", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>Milestone day</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{milestone}</div>
        </div>
      )}
      <VersionFooter />
    </div>
  );
}
function VersionFooter() {
  return <div style={{ textAlign: "center", marginTop: 22, fontSize: 11, color: C.inkFaint, letterSpacing: 0.5 }}>Vocari v{VERSION}</div>;
}

/* ---------- LEARN (fixed lesson + practice, per day) ---------- */
function LearnTab({ L, currentDay, start, progress, onComplete, wordStats, onAnswer }: { L: Language; currentDay: number; start: string; progress: { doneDays: number[]; studyDates: string[] }; onComplete: (d: number) => void; wordStats: Record<string, { right: number; wrong: number }>; onAnswer: (w: string, c: boolean) => void }) {
  const maxDay = Math.max(1, Math.min(90, currentDay < 1 ? 1 : currentDay));
  const preview = currentDay < 1;
  const [viewDay, setViewDay] = useState(maxDay);
  const [mode, setMode] = useState<"lesson" | "practice">("lesson");
  useEffect(() => { setViewDay((v) => Math.min(v, maxDay)); }, [maxDay]);
  useEffect(() => { setMode("lesson"); }, [viewDay]); // always land on the lesson first

  if (!L.ready) {
    return (
      <div style={{ padding: "8px 20px 20px" }}>
        <Card style={{ textAlign: "center", padding: "40px 22px" }}>
          <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 34, color: C.indigo, marginBottom: 10 }}>{L.nativeName}</div>
          <Eyebrow>Coming soon</Eyebrow>
          <p style={{ color: C.inkSoft, lineHeight: 1.6, marginTop: 8 }}>{L.name} lessons aren&apos;t written yet. Switch back to a ready language from the globe icon up top.</p>
        </Card>
      </div>
    );
  }

  const lesson = L.lessons.find((l) => l.day === viewDay);
  const week = L.weeks[Math.min(L.weeks.length - 1, Math.max(0, Math.ceil(viewDay / 7) - 1))];

  return (
    <div style={{ padding: "8px 20px 0", display: "flex", flexDirection: "column", height: "calc(100dvh - 132px)" }}>
      {/* day nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setViewDay((d) => Math.max(1, d - 1))} disabled={viewDay <= 1} aria-label="Previous day"
          style={{ ...navBtn, opacity: viewDay <= 1 ? 0.3 : 1 }}><ChevronLeft size={20} color={C.indigo} /></button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 20 }}>Day {viewDay}{preview && " · preview"}</div>
          <div style={{ fontSize: 12, color: C.inkFaint }}>{dateForDay(start, viewDay)} · Week {Math.ceil(viewDay / 7)}</div>
        </div>
        <button onClick={() => setViewDay((d) => Math.min(maxDay, d + 1))} disabled={viewDay >= maxDay} aria-label="Next day"
          style={{ ...navBtn, opacity: viewDay >= maxDay ? 0.3 : 1 }}><ChevronRight size={20} color={C.indigo} /></button>
      </div>

      {/* segmented — Sensei first, but opens on Lesson */}
      <div style={{ display: "flex", gap: 4, background: C.card2, borderRadius: 12, padding: 4, marginBottom: 12 }}>
        {(["practice", "lesson"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, border: "none", borderRadius: 9, padding: "8px 0", fontWeight: 700, fontSize: 13.5, cursor: "pointer", background: mode === m ? C.card : "transparent", color: mode === m ? C.ink : C.inkFaint, boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
            {m === "practice" ? "Sensei" : "Lesson"}
          </button>
        ))}
      </div>

      {mode === "lesson"
        ? <div style={{ overflowY: "auto", paddingBottom: 20 }}><LessonView L={L} lesson={lesson} week={week} viewDay={viewDay} done={progress.doneDays.includes(viewDay)} onComplete={() => onComplete(viewDay)} wordStats={wordStats} onAnswer={onAnswer} /></div>
        : <Practice L={L} viewDay={viewDay} lesson={lesson} week={week} />}
    </div>
  );
}

function Row({ text, reading, meaning, ttsLang }: { text: string; reading: string; meaning: string; ttsLang: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 18, color: C.ink, lineHeight: 1.35 }}>{text}</div>
        <div style={{ fontSize: 12.5, color: C.inkFaint, marginTop: 1 }}>{reading}</div>
        <div style={{ fontSize: 13.5, color: C.inkSoft, marginTop: 2 }}>{meaning}</div>
      </div>
      <button onClick={() => speak(text, ttsLang)} aria-label={`Hear ${text}`} style={{ ...iconBtn, flexShrink: 0 }}><Volume2 size={18} color={C.indigoSoft} /></button>
    </div>
  );
}
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><div style={{ ...eyebrowStyle, marginBottom: 6 }}>{label}</div>{children}</div>;
}
function LessonView({ L, lesson, week, viewDay, done, onComplete, wordStats, onAnswer }: { L: Language; lesson?: Lesson; week?: Week; viewDay: number; done: boolean; onComplete: () => void; wordStats: Record<string, { right: number; wrong: number }>; onAnswer: (w: string, c: boolean) => void }) {
  const ttsLang = L.ttsLang;
  const [quizOpen, setQuizOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => { setQuizOpen(false); setReviewOpen(false); setReviewed(false); }, [viewDay]);

  if (!lesson) {
    return (
      <Card>
        <Eyebrow>Full lesson coming soon</Eyebrow>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 19, margin: "6px 0 8px" }}>{week?.title || "This week"}</h3>
        <p style={{ color: C.inkSoft, lineHeight: 1.6, fontFamily: "'Zen Kaku Gothic New',sans-serif" }}>{week?.grammar}</p>
        <p style={{ color: C.inkFaint, fontSize: 13.5, marginTop: 12 }}>The written lesson for this day is on its way. Meanwhile, switch to <b>Sensei</b> — the tutor can teach and drill this week&apos;s focus with you now.</p>
      </Card>
    );
  }

  if (quizOpen) return <Quiz build={() => buildQuiz(L, viewDay)} kind="lesson" onAnswer={onAnswer} onFinish={(passed) => { if (passed) onComplete(); }} onExit={() => setQuizOpen(false)} />;
  if (reviewOpen) return <Quiz build={() => buildReview(L, viewDay, wordStats)} kind="review" onAnswer={onAnswer} onFinish={() => setReviewed(true)} onExit={() => { setReviewed(true); setReviewOpen(false); }} />;

  const reviewCount = buildReview(L, viewDay, wordStats).length;

  return (
    <div>
      {/* spaced review first */}
      {reviewCount > 0 && (
        <div style={{ background: reviewed ? C.card : "#EAF0EA", border: `1px solid ${reviewed ? C.line : C.matcha}`, borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                {reviewed ? <><Check size={16} color={C.matcha} /> Reviewed</> : <>🔁 Warm-up review</>}
              </div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{reviewed ? "Nice — now dive into today's lesson." : `${reviewCount} words from past days, before you learn new ones.`}</div>
            </div>
            {!reviewed && <button onClick={() => setReviewOpen(true)} style={{ ...secondaryBtn, whiteSpace: "nowrap", borderColor: C.matcha, color: C.matcha }}>Start</button>}
          </div>
        </div>
      )}

      <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 22, margin: "0 0 14px" }}>{lesson.title}</h3>

      <div style={{ background: C.indigo, color: "#F6F3EB", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", opacity: 0.7, marginBottom: 5 }}>Grammar · {lesson.grammar.name}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55 }}>{lesson.grammar.explain}</div>
      </div>

      {lesson.vocab.length > 0 && <Section label={`Vocabulary · ${lesson.vocab.length}`}>{lesson.vocab.map((v, i) => <Row key={i} {...v} ttsLang={ttsLang} />)}</Section>}
      {lesson.examples.length > 0 && <Section label="Examples">{lesson.examples.map((e, i) => <Row key={i} {...e} ttsLang={ttsLang} />)}</Section>}
      {lesson.practice.length > 0 && (
        <Section label="Your turn — say it out loud">{lesson.practice.map((p, i) => <PracticeItem key={i} p={p} ttsLang={ttsLang} />)}</Section>
      )}
      {lesson.note && <div style={{ background: C.card2, borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: C.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>💡 {lesson.note}</div>}

      {/* complete via quiz */}
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 16, marginTop: 4 }}>
        {done && <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.matcha, fontWeight: 700, fontSize: 14, marginBottom: 10 }}><Check size={17} /> Day complete</div>}
        <PrimaryButton onClick={() => setQuizOpen(true)} style={{ width: "100%", background: done ? C.card : C.vermilion, color: done ? C.indigo : "#fff", border: done ? `1px solid ${C.line}` : "none" }}>
          {done ? "Retake quiz" : "Take the quiz to complete this day"}
        </PrimaryButton>
        {!done && <p style={{ fontSize: 12, color: C.inkFaint, textAlign: "center", marginTop: 8 }}>Pass the quiz (80%) to stamp the day.</p>}
      </div>
    </div>
  );
}
function PracticeItem({ p, ttsLang }: { p: { prompt: string; answer: string; reading: string }; ttsLang: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 14.5, color: C.ink, marginBottom: 6 }}>{p.prompt}</div>
      {show ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 17, color: C.vermilion }}>{p.answer}</div>
            <div style={{ fontSize: 12.5, color: C.inkFaint }}>{p.reading}</div>
          </div>
          <button onClick={() => speak(p.answer, ttsLang)} aria-label="Hear answer" style={iconBtn}><Volume2 size={18} color={C.indigoSoft} /></button>
        </div>
      ) : (
        <button onClick={() => setShow(true)} style={{ ...secondaryBtn, padding: "6px 12px", fontSize: 12.5 }}>Show answer</button>
      )}
    </div>
  );
}

/* ---------- QUIZ ENGINE (shared by lesson quiz + spaced review) ---------- */
type QOption = { label: string; correct: boolean };
type Question = { key: string; prompt: string; sub?: string; ask: string; options: QOption[] };
function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function buildQuiz(L: Language, viewDay: number): Question[] {
  const seen: Record<string, { text: string; reading: string; meaning: string }> = {};
  L.lessons.filter((l) => l.day <= viewDay).forEach((l) => l.vocab.forEach((v) => { seen[v.text] = v; }));
  const pool = Object.values(seen);
  const own = (L.lessons.find((l) => l.day === viewDay)?.vocab) || [];
  const ownUniq = own.filter((v, i, arr) => arr.findIndex((x) => x.text === v.text) === i);
  let targets = shuffle(ownUniq).slice(0, 5);
  if (targets.length < 5) targets = targets.concat(shuffle(pool.filter((p) => !targets.some((t) => t.text === p.text))).slice(0, 5 - targets.length));
  if (pool.length < 4) return [];
  return targets.map((t, i) => makeQuestion(t, pool, i));
}

// Spaced review: pulled from days BEFORE viewDay, weighted toward words the
// learner has gotten wrong more (or hasn't been quizzed on at all yet).
function buildReview(L: Language, viewDay: number, stats: Record<string, { right: number; wrong: number }>): Question[] {
  const seen: Record<string, { text: string; reading: string; meaning: string }> = {};
  L.lessons.filter((l) => l.day < viewDay).forEach((l) => l.vocab.forEach((v) => { seen[v.text] = v; }));
  const pool = Object.values(seen);
  if (pool.length < 4) return [];
  const weighted = pool.map((v) => {
    const s = stats[v.text];
    let w = 3; // never-tested words get solid priority
    if (s) { const total = s.right + s.wrong; const acc = total ? s.right / total : 0.5; w = acc < 0.5 ? 5 : acc < 0.85 ? 2.5 : 0.6; }
    return { v, w };
  });
  const total = weighted.reduce((a, b) => a + b.w, 0);
  const picked: typeof pool = [];
  const avail = [...weighted];
  const count = Math.min(5, pool.length);
  for (let n = 0; n < count && avail.length; n++) {
    let r = Math.random() * avail.reduce((a, b) => a + b.w, 0);
    let idx = 0;
    for (; idx < avail.length; idx++) { r -= avail[idx].w; if (r <= 0) break; }
    idx = Math.min(idx, avail.length - 1);
    picked.push(avail[idx].v);
    avail.splice(idx, 1);
  }
  void total;
  return picked.map((t, i) => makeQuestion(t, pool, i));
}
function makeQuestion(t: { text: string; reading: string; meaning: string }, pool: { text: string; reading: string; meaning: string }[], i: number): Question {
  const distract = shuffle(pool.filter((p) => p.text !== t.text)).slice(0, 3);
  if (i % 2 === 0) {
    const opts = shuffle([t, ...distract]).map((v) => ({ label: v.meaning, correct: v.text === t.text }));
    return { key: t.text, prompt: t.text, sub: t.reading, ask: "What does this mean?", options: opts };
  }
  const opts = shuffle([t, ...distract]).map((v) => ({ label: v.text, correct: v.text === t.text }));
  return { key: t.text, prompt: t.meaning, ask: "How do you say this?", options: opts };
}

function Quiz({ build, kind, onAnswer, onFinish, onExit }: { build: () => Question[]; kind: "lesson" | "review"; onAnswer: (w: string, c: boolean) => void; onFinish: (passed: boolean) => void; onExit: () => void }) {
  const [qs, setQs] = useState<Question[]>(build);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const need = Math.ceil(qs.length * 0.8);
  const passed = score >= need;

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = qs[idx].options[i].correct;
    onAnswer(qs[idx].key, correct);
    if (correct) setScore((s) => s + 1);
  }
  function next() { if (idx + 1 >= qs.length) setFinished(true); else { setIdx((n) => n + 1); setPicked(null); } }
  function retry() { setQs(build()); setIdx(0); setPicked(null); setScore(0); setFinished(false); }

  useEffect(() => { if (finished) onFinish(passed); /* eslint-disable-next-line */ }, [finished]);

  if (qs.length === 0) {
    return <Card style={{ textAlign: "center" }}><p style={{ color: C.inkSoft }}>{kind === "review" ? "Nothing to review yet — come back after a few more days." : "Not enough vocabulary yet to build a quiz for this day."}</p><button onClick={onExit} style={{ ...secondaryBtn, marginTop: 12 }}>Back to lesson</button></Card>;
  }

  if (finished) {
    const title = kind === "review" ? (passed ? "Warmed up! 🔁" : "Good review") : (passed ? "Day complete! 🎌" : "Almost there");
    const body = kind === "review"
      ? "Nice — those come back around based on how you did."
      : passed ? "The day is stamped on your path. Keep the streak alive." : `You need ${need}/${qs.length} to pass. Review the lesson and try again.`;
    return (
      <Card style={{ textAlign: "center", padding: "34px 22px" }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 40, color: passed ? C.matcha : C.vermilion, fontWeight: 600 }}>{score}/{qs.length}</div>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, margin: "8px 0 6px" }}>{title}</h3>
        <p style={{ color: C.inkSoft, lineHeight: 1.5, marginBottom: 18 }}>{body}</p>
        <div style={{ display: "flex", gap: 10 }}>
          {kind === "lesson" && !passed && <PrimaryButton onClick={retry} style={{ flex: 1, background: C.indigo }}>Try again</PrimaryButton>}
          <button onClick={onExit} style={{ ...secondaryBtn, flex: 1 }}>{kind === "review" ? "Continue to lesson" : "Back to lesson"}</button>
        </div>
      </Card>
    );
  }

  const q = qs[idx];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onExit} style={{ ...secondaryBtn, padding: "6px 12px" }}>Exit</button>
        <span style={{ fontSize: 13, color: C.inkFaint, fontWeight: 600 }}>{kind === "review" ? "Review" : "Question"} {idx + 1} / {qs.length}</span>
      </div>
      <div style={{ height: 6, background: C.card2, borderRadius: 999, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${(idx / qs.length) * 100}%`, background: kind === "review" ? C.matcha : C.vermilion, transition: "width .3s" }} />
      </div>

      <Card style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ ...eyebrowStyle, marginBottom: 8 }}>{q.ask}</div>
        <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 34, color: C.ink, lineHeight: 1.2 }}>{q.prompt}</div>
        {q.sub && <div style={{ fontSize: 14, color: C.inkFaint, marginTop: 4 }}>{q.sub}</div>}
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((o, i) => {
          const isPicked = picked === i;
          const reveal = picked !== null;
          const bg = reveal && o.correct ? "#E7EFE4" : isPicked ? "#F3E1DC" : C.card;
          const bd = reveal && o.correct ? C.matcha : isPicked ? C.vermilion : C.line;
          return (
            <button key={i} onClick={() => pick(i)} disabled={reveal}
              style={{ textAlign: "left", background: bg, border: `1.5px solid ${bd}`, borderRadius: 12, padding: "14px 16px", cursor: reveal ? "default" : "pointer", fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 16, color: C.ink, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span>{o.label}</span>
              {reveal && o.correct && <Check size={18} color={C.matcha} />}
              {reveal && isPicked && !o.correct && <X size={18} color={C.vermilion} />}
            </button>
          );
        })}
      </div>

      {picked !== null && <PrimaryButton onClick={next} style={{ width: "100%", marginTop: 16 }}>{idx + 1 >= qs.length ? "See result" : "Next"} <ChevronRight size={18} /></PrimaryButton>}
    </div>
  );
}

/* ---------- PRACTICE CHAT (Sensei, grounded in the day's lesson, saved per day) ---------- */
type Msg = { role: "user" | "assistant"; content: string };
function Practice({ L, viewDay, lesson, week }: { L: Language; viewDay: number; lesson?: Lesson; week?: Week }) {
  const key = `chat_${L.code}_${viewDay}`;
  const seed: Msg = { role: "assistant", content: lesson ? `Hi! I'm Sensei. Read the Lesson tab for Day ${viewDay} first — "${lesson.title}" — then come back here and I'll help you practice it. When you're ready, type a sentence or ask me anything.` : `Hi! I'm Sensei. Ask me anything about ${L.name}, or type a sentence and I'll check it.` };
  const [msgs, setMsgs] = useState<Msg[]>([seed]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { setMsgs(load<Msg[]>(key, [seed])); /* eslint-disable-next-line */ }, [key]);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy]);

  const brief = lesson
    ? `The learner is on the FIXED lesson for Day ${viewDay}: "${lesson.title}". Grammar: ${lesson.grammar.name} — ${lesson.grammar.explain} Key vocabulary: ${lesson.vocab.map((v) => `${v.text} (${v.reading}) = ${v.meaning}`).join("; ")}. Stay on THIS lesson's material; do not introduce grammar beyond it.`
    : `The learner is in Week ${Math.ceil(viewDay / 7)} (${week?.title}). Focus: ${week?.grammar}.`;
  const system = `You are "Sensei", a warm, expert ${L.name} tutor for an English speaker on a 90-day conversational sprint. ${brief}
Rules:
- Keep replies SHORT — a few lines, one idea at a time. Never lecture or dump walls of text.
- Put each ${L.name} sentence on ITS OWN line, formatted: <target> (romaji/reading) — English. One sentence per line, blank line between blocks.
- When the learner attempts ${L.name}, gently correct: show what they wrote, the fix, and one short reason.
- End every turn with one concrete thing to SAY or DO next, and nudge them to say it out loud.
- Be encouraging and human. No emoji spam.`;

  async function send(text: string) {
    const content = text.trim(); if (!content || busy) return;
    const history = [...msgs, { role: "user", content } as Msg];
    setMsgs(history); save(key, history); setInput(""); setBusy(true);
    try {
      const res = await fetch("/api/tutor", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ system, messages: history }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "error");
      const next = [...history, { role: "assistant", content: (data.text || "…").trim() } as Msg];
      setMsgs(next); save(key, next);
    } catch {
      const next = [...history, { role: "assistant", content: "I couldn't reach the tutor. Check your connection (and that ANTHROPIC_API_KEY is set on the server), then tap send again." } as Msg];
      setMsgs(next); save(key, next);
    } finally { setBusy(false); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <div ref={scroller} style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
        {msgs.map((m, i) => <Bubble key={i} role={m.role} text={m.content} ttsLang={L.ttsLang} canSpeak={L.code === "ja"} />)}
        {busy && <Bubble role="assistant" text="…" typing ttsLang={L.ttsLang} canSpeak={false} />}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", padding: "6px 0 14px" }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder={`Type in English or ${L.name}…`}
          style={{ flex: 1, resize: "none", fontSize: 15, padding: "11px 14px", border: `1px solid ${C.line}`, borderRadius: 16, background: C.card, color: C.ink, outline: "none", maxHeight: 120, fontFamily: "inherit" }} />
        <button onClick={() => send(input)} disabled={busy || !input.trim()} aria-label="Send"
          style={{ background: input.trim() ? C.vermilion : C.card2, border: "none", borderRadius: 14, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "default", flexShrink: 0 }}>
          <Send size={20} color={input.trim() ? "#fff" : C.inkFaint} />
        </button>
      </div>
    </div>
  );
}
function Bubble({ role, text, typing, ttsLang, canSpeak }: { role: string; text: string; typing?: boolean; ttsLang: string; canSpeak: boolean }) {
  const me = role === "user";
  const iconColor = me ? "rgba(246,243,235,0.85)" : C.indigoSoft;
  const lines = typing ? [] : (text || "").split("\n");
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 10 }}>
      <div style={{ maxWidth: "86%", padding: "10px 14px", borderRadius: 16, background: me ? C.indigo : C.card, color: me ? "#F6F3EB" : C.ink, border: me ? "none" : `1px solid ${C.line}`, borderBottomRightRadius: me ? 4 : 16, borderBottomLeftRadius: me ? 16 : 4, fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif", fontSize: 15, lineHeight: 1.6 }}>
        {typing ? <span className="jp-typing">●&nbsp;●&nbsp;●</span> : lines.map((line, i) => {
          if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
          const jp = canSpeak ? jpInLine(line) : "";
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              <span style={{ flex: 1, whiteSpace: "pre-wrap" }}>{line}</span>
              {jp && <button onClick={() => speak(jp, ttsLang)} aria-label={`Hear ${jp}`} title="Hear this line" style={{ flexShrink: 0, marginTop: 3, background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", color: iconColor }}><Volume2 size={15} /></button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- KANA TRAINER ---------- */
function KanaTrainer({ kanaSet, ttsLang, kanaStats, saveKana }: { kanaSet: Kana[]; ttsLang: string; kanaStats: Record<string, { seen: number; correct: number }>; saveKana: (k: Record<string, { seen: number; correct: number }>) => void }) {
  const [cur, setCur] = useState<Kana>(() => pickKana(kanaSet, kanaStats, null));
  const [val, setVal] = useState("");
  const [result, setResult] = useState<null | "right" | "wrong">(null);
  const [showChart, setShowChart] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mastered = kanaSet.filter((h) => { const s = kanaStats[h.k]; return s && s.seen >= 3 && s.correct / s.seen >= 0.9; }).length;

  function check() {
    if (result) { next(); return; }
    const ans = val.trim().toLowerCase(); if (!ans) return;
    const right = ans === cur.r;
    const s = kanaStats[cur.k] || { seen: 0, correct: 0 };
    saveKana({ ...kanaStats, [cur.k]: { seen: s.seen + 1, correct: s.correct + (right ? 1 : 0) } });
    setResult(right ? "right" : "wrong"); speak(cur.k, ttsLang);
  }
  function next() { setCur(pickKana(kanaSet, kanaStats, cur.k)); setVal(""); setResult(null); setTimeout(() => inputRef.current?.focus(), 30); }

  return (
    <div style={{ padding: "8px 20px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div><Eyebrow>Writing system</Eyebrow><div style={{ fontSize: 14, color: C.inkSoft, marginTop: 2 }}><b style={{ color: C.ink }}>{mastered}</b> / {kanaSet.length} mastered</div></div>
        <button onClick={() => setShowChart((s) => !s)} style={secondaryBtn}>{showChart ? "Drill" : "See chart"}</button>
      </div>
      <div style={{ height: 6, background: C.card2, borderRadius: 999, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ height: "100%", width: `${(mastered / kanaSet.length) * 100}%`, background: C.vermilion, transition: "width .4s" }} />
      </div>
      {showChart ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {kanaSet.map((h) => { const s = kanaStats[h.k]; const m = s && s.seen >= 3 && s.correct / s.seen >= 0.9;
            return <button key={h.k} onClick={() => speak(h.k, ttsLang)} style={{ background: C.card, border: `1px solid ${m ? C.vermilion : C.line}`, borderRadius: 10, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 24, color: C.ink }}>{h.k}</span><span style={{ fontSize: 11, color: C.inkFaint }}>{h.r}</span></button>; })}
        </div>
      ) : (
        <Card style={{ textAlign: "center", padding: "34px 20px 24px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 104, lineHeight: 1, color: C.ink }}>{cur.k}</div>
            <button onClick={() => speak(cur.k, ttsLang)} aria-label="Hear it" style={{ ...iconBtn, position: "absolute", top: 4, right: 0 }}><Volume2 size={20} color={C.indigoSoft} /></button>
          </div>
          <input ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="type the sound…" autoCapitalize="none" autoCorrect="off" autoComplete="off" spellCheck={false}
            style={{ marginTop: 22, width: "100%", textAlign: "center", fontSize: 20, padding: "12px 10px", border: `2px solid ${result === "right" ? C.matcha : result === "wrong" ? C.vermilion : C.line}`, borderRadius: 12, background: C.paper, color: C.ink, outline: "none" }} />
          <div style={{ minHeight: 30, marginTop: 12 }}>
            {result === "right" && <span style={{ color: C.matcha, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><Check size={18} /> {cur.r}</span>}
            {result === "wrong" && <span style={{ color: C.vermilion, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><X size={18} /> it&apos;s <b>{cur.r}</b></span>}
          </div>
          <PrimaryButton onClick={check} style={{ marginTop: 10, width: "100%" }}>{result ? "Next" : "Check"}</PrimaryButton>
        </Card>
      )}
      <p style={{ fontSize: 12.5, color: C.inkFaint, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>Tap 🔊 to hear each character using your device&apos;s voice.</p>
    </div>
  );
}
function pickKana(set: Kana[], stats: Record<string, { seen: number; correct: number }>, avoid: string | null): Kana {
  const scored = set.map((h) => { const s = stats[h.k]; let w: number;
    if (!s || s.seen === 0) w = 5; else { const acc = s.correct / s.seen; w = acc < 0.7 ? 4 : acc < 0.9 ? 2 : 0.4; } return { h, w }; }).filter((x) => x.h.k !== avoid);
  const total = scored.reduce((a, b) => a + b.w, 0); let r = Math.random() * total;
  for (const x of scored) { r -= x.w; if (r <= 0) return x.h; } return scored[0].h;
}

/* ---------- setup / sheets ---------- */
function SetupScreen({ L, onStart, onOpenLang }: { L: Language; onStart: (s: string) => void; onOpenLang: () => void }) {
  const [date, setDate] = useState(nextMondayYmd());
  return (
    <div style={{ background: C.paper, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, color: C.ink }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 40, color: C.indigo }}>Vocari<span style={{ color: C.vermilion }}>.</span></div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 24, margin: "10px 0 8px" }}>Ninety days to a conversation.</h1>
        <p style={{ color: C.inkSoft, lineHeight: 1.6, marginBottom: 20 }}>Learning <b>{L.name}</b> ({L.nativeName}). <button onClick={onOpenLang} style={{ background: "none", border: "none", color: C.indigo, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}>Change</button></p>
        <label style={{ ...eyebrowStyle, display: "block", marginBottom: 8 }}>Start date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", fontSize: 16, padding: "12px 14px", border: `1px solid ${C.line}`, borderRadius: 12, background: C.card, color: C.ink }} />
        <PrimaryButton onClick={() => onStart(date)} style={{ marginTop: 16, width: "100%" }}>Begin the sprint</PrimaryButton>
      </div>
    </div>
  );
}
function LangSheet({ current, onPick, onClose }: { current: string; onPick: (c: string) => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={sheetWrap}>
      <div onClick={(e) => e.stopPropagation()} style={sheetInner}>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, margin: "0 0 14px" }}>Language</h3>
        {Object.values(LANGUAGES).map((l) => (
          <button key={l.code} onClick={() => onPick(l.code)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: current === l.code ? C.card2 : C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 15px", marginBottom: 8, cursor: "pointer" }}>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'Zen Kaku Gothic New',sans-serif", fontSize: 17, color: C.ink }}>{l.nativeName}</span>
              <span style={{ fontSize: 12.5, color: C.inkFaint }}>{l.name}{!l.ready && " · coming soon"}</span>
            </span>
            {current === l.code && <Check size={18} color={C.vermilion} />}
          </button>
        ))}
        <button onClick={onClose} style={{ marginTop: 6, width: "100%", background: "none", border: "none", color: C.inkFaint, padding: 8, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}
function SettingsSheet({ start, onClose, onReset, onSetStart }: { start: string; onClose: () => void; onReset: () => void; onSetStart: (s: string) => void }) {
  const [date, setDate] = useState(start);
  return (
    <div onClick={onClose} style={sheetWrap}>
      <div onClick={(e) => e.stopPropagation()} style={sheetInner}>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 20, margin: "0 0 16px" }}>Settings</h3>
        <label style={{ ...eyebrowStyle, display: "block", marginBottom: 8 }}>Start date</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ flex: 1, fontSize: 15, padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 10, background: C.card, color: C.ink }} />
          <button onClick={() => onSetStart(date)} style={secondaryBtn}>Save</button>
        </div>
        <button onClick={onReset} style={{ marginTop: 22, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", border: `1px solid ${C.vermilion}`, color: C.vermilion, borderRadius: 12, padding: "12px", fontWeight: 600, cursor: "pointer" }}><RotateCcw size={16} /> Reset progress</button>
        <button onClick={onClose} style={{ marginTop: 10, width: "100%", background: "none", border: "none", color: C.inkFaint, padding: 8, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

/* ---------- primitives ---------- */
const iconBtn: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 10, display: "inline-flex" };
const pillBtn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 5, background: C.card, border: `1px solid ${C.line}`, color: C.ink, borderRadius: 999, padding: "6px 11px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const navBtn: React.CSSProperties = { background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: 6, cursor: "pointer", display: "inline-flex" };
const secondaryBtn: React.CSSProperties = { background: C.card, border: `1px solid ${C.line}`, color: C.indigo, borderRadius: 12, padding: "9px 14px", fontWeight: 600, fontSize: 13.5, cursor: "pointer" };
const h2: React.CSSProperties = { fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 28, margin: "4px 0 0" };
const eyebrowStyle: React.CSSProperties = { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.inkFaint, fontWeight: 700 };
const sheetWrap: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(28,27,33,0.4)", zIndex: 40, display: "flex", alignItems: "flex-end", justifyContent: "center" };
const sheetInner: React.CSSProperties = { background: C.paper, width: "100%", maxWidth: 480, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: "22px 22px 30px" };
function Eyebrow({ children }: { children: React.ReactNode }) { return <div style={eyebrowStyle}>{children}</div>; }
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) { return <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 18, ...style }}>{children}</div>; }
function PrimaryButton({ children, style, disabled, onClick }: { children: React.ReactNode; style?: React.CSSProperties; disabled?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? C.card2 : C.vermilion, color: disabled ? C.inkFaint : "#fff", border: "none", borderRadius: 14, padding: "13px 18px", fontWeight: 700, fontSize: 15, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, ...style }}>{children}</button>;
}
function Splash() { return <div style={{ background: C.paper, minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", color: C.indigo, fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 600 }}>Vocari</div>; }
