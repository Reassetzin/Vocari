# Nihongo 90 🇯🇵

A 90-day sprint to conversational Japanese, as an installable PWA. Three parts:

- **Today** — day/week tracker, streak, and a *goshuin* stamp path you fill in as you go.
- **Kana** — a hiragana speed-trainer that weights toward your weak characters, **with working audio** (uses your device's built-in Japanese voice).
- **Sensei** — a live AI tutor that knows what day you're on and scales from heavy English scaffolding to real Japanese. Each Japanese line has a **Hear it** button.

Stack: Next.js 14 (App Router) · TypeScript · React 18. Progress is stored in `localStorage` (per-device, offline-friendly). The tutor runs through a server route so your API key stays secret.

---

## Run it locally

```bash
npm install
cp .env.local.example .env.local     # then paste your key into .env.local
npm run dev                          # http://localhost:3000
```

Get an API key at https://console.anthropic.com → API Keys.

> Without a key, everything works **except** Sensei — the tutor tab will show a "couldn't reach the tutor" message.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. In **Project → Settings → Environment Variables**, add `ANTHROPIC_API_KEY`.
4. Deploy. Your GitHub auto-deploy flow will handle future pushes.

Once it's on `https://…`, open it on your phone and **Add to Home Screen** — it installs as a standalone app, and the audio uses the phone's native Japanese voice.

---

## Notes & knobs

- **Audio.** Uses the Web Speech API with the device's Japanese voice (iOS has "Kyoko"; Android/desktop usually ship one). No downloads or keys. If a device has *no* Japanese voice, add one in the OS settings once. (This is why audio was silent inside Claude — that sandbox blocks it; a real domain doesn't.)
- **Model.** The tutor uses `claude-sonnet-5` in `src/app/api/tutor/route.ts`. Swap for any current model — see https://docs.claude.com/en/docs/about-claude/models
- **Icons.** Replace `public/icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, and `apple-touch-icon.png` with your own art anytime.

## Migrating to Supabase (when you want cross-device sync)

Right now progress lives in `localStorage` (functions `load`/`save` in `src/app/page.tsx`). To sync across devices:

1. Create two tables, e.g. `progress` (user_id, done_days int[], study_dates text[]) and `kana_stats` (user_id, stats jsonb).
2. Add Supabase auth, then replace the `load`/`save` calls with `supabase.from(...).select/upsert`.
3. Keep `localStorage` as an offline cache and reconcile on reconnect (last-write-wins is fine here).

The tutor route needs no changes — it's already server-side.

---

## Structure

```
src/app/
  layout.tsx            # PWA metadata + service-worker registration
  page.tsx              # the whole app (Today / Kana / Sensei)
  globals.css           # fonts, colors, animations
  api/tutor/route.ts    # server route → Anthropic (holds the key)
public/
  manifest.webmanifest  # install metadata
  sw.js                 # offline app shell
  icon-*.png            # app icons
```
