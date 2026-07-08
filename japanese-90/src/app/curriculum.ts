// ---------------------------------------------------------------------------
//  Curriculum + language data.  Add languages by adding entries to LANGUAGES.
//  Each authored day is a fixed Lesson; un-authored days fall back to a
//  placeholder built from the week's focus (see getLesson in page.tsx).
// ---------------------------------------------------------------------------

export type Item = { text: string; reading: string; meaning: string };
export type Practice = { prompt: string; answer: string; reading: string };
export type Lesson = {
  day: number;
  title: string;
  grammar: { name: string; explain: string };
  vocab: Item[];
  examples: Item[];
  practice: Practice[];
  note?: string;
};
export type Week = { n: number; phase: string; title: string; grammar: string };
export type Kana = { k: string; r: string };
export type Language = {
  code: string;        // 'ja'
  name: string;        // English name
  nativeName: string;  // shown in the picker
  ttsLang: string;     // BCP-47 tag for speech, e.g. 'ja-JP'
  hasScript: boolean;  // true when there's a writing-system trainer (kana)
  kana: Kana[] | null;
  weeks: Week[];
  lessons: Lesson[];
  ready: boolean;      // false => "coming soon"
};

/* ---------- Japanese: hiragana ---------- */
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

/* ---------- Japanese: 13-week meta ---------- */
const JA_WEEKS: Week[] = [
  { n: 1, phase: "Foundations", title: "Hiragana + first sentences", grammar: "XはYです・これ/それ/あれ・か (question)・negation じゃありません・の" },
  { n: 2, phase: "Foundations", title: "Katakana + numbers & time", grammar: "numbers・time・いくら・も (also)・katakana・〜ませんか (invite)" },
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

/* ---------- Japanese: authored Days 1–14 ---------- */
const JA_LESSONS: Lesson[] = [
  {
    day: 1,
    title: "Greetings & meeting people",
    grammar: { name: "Greetings by time of day", explain: "Japanese greetings change with the time of day, and politeness is baked into set phrases. Today: greet people and say who you are." },
    vocab: [
      { text: "おはようございます", reading: "ohayō gozaimasu", meaning: "Good morning (polite)" },
      { text: "こんにちは", reading: "konnichiwa", meaning: "Hello / Good afternoon" },
      { text: "こんばんは", reading: "konbanwa", meaning: "Good evening" },
      { text: "さようなら", reading: "sayōnara", meaning: "Goodbye" },
      { text: "はじめまして", reading: "hajimemashite", meaning: "Nice to meet you (first time)" },
      { text: "ありがとうございます", reading: "arigatō gozaimasu", meaning: "Thank you (polite)" },
    ],
    examples: [
      { text: "はじめまして。", reading: "hajimemashite", meaning: "Nice to meet you." },
      { text: "どうぞ よろしく おねがいします。", reading: "dōzo yoroshiku onegai shimasu", meaning: "Pleased to meet you." },
    ],
    practice: [
      { prompt: "Greet someone in the afternoon", answer: "こんにちは", reading: "konnichiwa" },
      { prompt: "Say 'nice to meet you'", answer: "はじめまして", reading: "hajimemashite" },
    ],
    note: "Pair this with the Kana tab — start learning to read あ–お today.",
  },
  {
    day: 2,
    title: "AはBです — saying what something is",
    grammar: { name: "AはBです", explain: "は (written 'ha', said 'wa') marks the topic. です means is/am/are. Together: わたしは がくせいです = I am a student." },
    vocab: [
      { text: "わたし", reading: "watashi", meaning: "I, me" },
      { text: "がくせい", reading: "gakusei", meaning: "student" },
      { text: "せんせい", reading: "sensei", meaning: "teacher" },
      { text: "ともだち", reading: "tomodachi", meaning: "friend" },
      { text: "にほんじん", reading: "nihonjin", meaning: "Japanese (person)" },
      { text: "です", reading: "desu", meaning: "is / am / are" },
    ],
    examples: [
      { text: "わたしは がくせいです。", reading: "watashi wa gakusei desu", meaning: "I am a student." },
      { text: "たなかさんは せんせいです。", reading: "Tanaka-san wa sensei desu", meaning: "Mr./Ms. Tanaka is a teacher." },
    ],
    practice: [
      { prompt: "Say 'I am a student'", answer: "わたしは がくせいです", reading: "watashi wa gakusei desu" },
      { prompt: "Say 'I am a teacher'", answer: "わたしは せんせいです", reading: "watashi wa sensei desu" },
    ],
    note: "さん (san) is added to other people's names — never to your own.",
  },
  {
    day: 3,
    title: "これ・それ・あれ — this & that",
    grammar: { name: "これ / それ / あれ", explain: "これ = near me, それ = near you, あれ = far from both. Use with です to point things out: これは ほんです = This is a book." },
    vocab: [
      { text: "これ", reading: "kore", meaning: "this (near me)" },
      { text: "それ", reading: "sore", meaning: "that (near you)" },
      { text: "あれ", reading: "are", meaning: "that (over there)" },
      { text: "ほん", reading: "hon", meaning: "book" },
      { text: "みず", reading: "mizu", meaning: "water" },
      { text: "なん", reading: "nan", meaning: "what" },
    ],
    examples: [
      { text: "これは ほんです。", reading: "kore wa hon desu", meaning: "This is a book." },
      { text: "それは なんですか。", reading: "sore wa nan desu ka", meaning: "What is that?" },
    ],
    practice: [
      { prompt: "Say 'This is water'", answer: "これは みずです", reading: "kore wa mizu desu" },
      { prompt: "Ask 'What is that (near you)?'", answer: "それは なんですか", reading: "sore wa nan desu ka" },
    ],
    note: "なに (what) becomes なん before です → なんですか.",
  },
  {
    day: 4,
    title: "Yes/No questions with か",
    grammar: { name: "か — the question marker", explain: "Add か to the end of a statement to make a yes/no question — no word-order change. Answer with はい (yes) or いいえ (no)." },
    vocab: [
      { text: "はい", reading: "hai", meaning: "yes" },
      { text: "いいえ", reading: "iie", meaning: "no" },
      { text: "そうです", reading: "sō desu", meaning: "that's right" },
      { text: "ちがいます", reading: "chigaimasu", meaning: "that's wrong / not so" },
      { text: "あなた", reading: "anata", meaning: "you" },
    ],
    examples: [
      { text: "たなかさんは せんせいですか。", reading: "Tanaka-san wa sensei desu ka", meaning: "Is Mr./Ms. Tanaka a teacher?" },
      { text: "はい、そうです。", reading: "hai, sō desu", meaning: "Yes, that's right." },
    ],
    practice: [
      { prompt: "Ask 'Are you a student?'", answer: "がくせいですか", reading: "gakusei desu ka" },
      { prompt: "Answer 'No, that's wrong'", answer: "いいえ、ちがいます", reading: "iie, chigaimasu" },
    ],
  },
  {
    day: 5,
    title: "Saying 'is not' — じゃ ありません",
    grammar: { name: "じゃ ありません", explain: "To say something is NOT something, replace です with じゃ ありません (polite) or では ありません (formal): わたしは いしゃじゃ ありません = I am not a doctor." },
    vocab: [
      { text: "じゃありません", reading: "ja arimasen", meaning: "is not (polite)" },
      { text: "いしゃ", reading: "isha", meaning: "doctor" },
      { text: "かいしゃいん", reading: "kaishain", meaning: "company employee" },
      { text: "しゅふ", reading: "shufu", meaning: "homemaker" },
    ],
    examples: [
      { text: "わたしは いしゃじゃ ありません。", reading: "watashi wa isha ja arimasen", meaning: "I am not a doctor." },
      { text: "これは みずじゃ ありません。", reading: "kore wa mizu ja arimasen", meaning: "This is not water." },
    ],
    practice: [
      { prompt: "Say 'I am not a teacher'", answer: "わたしは せんせいじゃ ありません", reading: "watashi wa sensei ja arimasen" },
      { prompt: "Say 'That is not a book'", answer: "それは ほんじゃ ありません", reading: "sore wa hon ja arimasen" },
    ],
  },
  {
    day: 6,
    title: "Linking nouns with の",
    grammar: { name: "の — of / 's", explain: "の links two nouns to show possession or type. The owner/category comes first: わたしの ほん = my book; にほんごの せんせい = a teacher of Japanese." },
    vocab: [
      { text: "の", reading: "no", meaning: "'s, of (linker)" },
      { text: "にほんご", reading: "nihongo", meaning: "Japanese (language)" },
      { text: "えいご", reading: "eigo", meaning: "English (language)" },
      { text: "なまえ", reading: "namae", meaning: "name" },
      { text: "くるま", reading: "kuruma", meaning: "car" },
    ],
    examples: [
      { text: "わたしの なまえは ジョンです。", reading: "watashi no namae wa Jon desu", meaning: "My name is John." },
      { text: "にほんごの せんせいです。", reading: "nihongo no sensei desu", meaning: "(I) am a Japanese teacher." },
    ],
    practice: [
      { prompt: "Say 'my car'", answer: "わたしの くるま", reading: "watashi no kuruma" },
      { prompt: "Say 'My name is ___'", answer: "わたしの なまえは ___です", reading: "watashi no namae wa ___ desu" },
    ],
  },
  {
    day: 7,
    title: "Week 1 review — your self-introduction",
    grammar: { name: "Put Week 1 together", explain: "You can now greet, say who you are, point things out, ask yes/no questions, negate, and link nouns. Today, combine them into a real self-introduction." },
    vocab: [
      { text: "どうぞよろしく", reading: "dōzo yoroshiku", meaning: "Pleased to meet you" },
      { text: "しゅっしん", reading: "shusshin", meaning: "hometown / origin" },
    ],
    examples: [
      { text: "はじめまして。わたしの なまえは ケンです。がくせいです。どうぞ よろしく。", reading: "hajimemashite. watashi no namae wa Ken desu. gakusei desu. dōzo yoroshiku", meaning: "Nice to meet you. My name is Ken. I'm a student. Pleased to meet you." },
    ],
    practice: [
      { prompt: "Give your own 4-line self-introduction out loud, then type it for Sensei to check", answer: "はじめまして。わたしの なまえは ___です。___です。どうぞ よろしく。", reading: "hajimemashite. watashi no namae wa ___ desu. ___ desu. dōzo yoroshiku" },
    ],
    note: "Milestone: record yourself giving this intro — it's your Day-1 baseline for the whole sprint.",
  },
  {
    day: 8,
    title: "Numbers 1–10",
    grammar: { name: "Counting 1–10", explain: "Learn the core numbers. A few have two readings (4 = よん/し, 7 = なな/しち); the ones below are the safest defaults." },
    vocab: [
      { text: "いち", reading: "ichi", meaning: "1" },
      { text: "に", reading: "ni", meaning: "2" },
      { text: "さん", reading: "san", meaning: "3" },
      { text: "よん", reading: "yon", meaning: "4" },
      { text: "ご", reading: "go", meaning: "5" },
      { text: "ろく", reading: "roku", meaning: "6" },
      { text: "なな", reading: "nana", meaning: "7" },
      { text: "はち", reading: "hachi", meaning: "8" },
      { text: "きゅう", reading: "kyū", meaning: "9" },
      { text: "じゅう", reading: "jū", meaning: "10" },
    ],
    examples: [
      { text: "いち、に、さん、よん、ご。", reading: "ichi, ni, san, yon, go", meaning: "1, 2, 3, 4, 5." },
    ],
    practice: [
      { prompt: "Count 1 to 5 out loud", answer: "いち に さん よん ご", reading: "ichi ni san yon go" },
      { prompt: "Say the number 8", answer: "はち", reading: "hachi" },
    ],
  },
  {
    day: 9,
    title: "Bigger numbers & asking a price",
    grammar: { name: "11–100 + いくらですか", explain: "Combine tens and ones: じゅういち = 11, にじゅう = 20, にじゅうご = 25. Ask a price with いくらですか (how much?)." },
    vocab: [
      { text: "じゅういち", reading: "jūichi", meaning: "11" },
      { text: "にじゅう", reading: "nijū", meaning: "20" },
      { text: "ひゃく", reading: "hyaku", meaning: "100" },
      { text: "えん", reading: "en", meaning: "yen" },
      { text: "いくら", reading: "ikura", meaning: "how much" },
    ],
    examples: [
      { text: "これは いくらですか。", reading: "kore wa ikura desu ka", meaning: "How much is this?" },
      { text: "さんびゃくえんです。", reading: "sanbyaku en desu", meaning: "It's 300 yen." },
    ],
    practice: [
      { prompt: "Say 25", answer: "にじゅうご", reading: "nijūgo" },
      { prompt: "Ask 'How much is that?'", answer: "それは いくらですか", reading: "sore wa ikura desu ka" },
    ],
    note: "100 is ひゃく, but 300 becomes さんびゃく and 600/800 shift sounds — you'll absorb these with use.",
  },
  {
    day: 10,
    title: "Telling time",
    grammar: { name: "〜じ (o'clock)", explain: "Add じ to a number for the hour: いちじ = 1:00. Ask with なんじですか (what time is it?). はん = half past." },
    vocab: [
      { text: "なんじ", reading: "nanji", meaning: "what time" },
      { text: "いちじ", reading: "ichiji", meaning: "1 o'clock" },
      { text: "ごじ", reading: "goji", meaning: "5 o'clock" },
      { text: "はん", reading: "han", meaning: "half (past)" },
      { text: "いま", reading: "ima", meaning: "now" },
    ],
    examples: [
      { text: "いま なんじですか。", reading: "ima nanji desu ka", meaning: "What time is it now?" },
      { text: "ごじ はんです。", reading: "goji han desu", meaning: "It's half past five." },
    ],
    practice: [
      { prompt: "Ask what time it is", answer: "いま なんじですか", reading: "ima nanji desu ka" },
      { prompt: "Say 'it's 3 o'clock'", answer: "さんじです", reading: "sanji desu" },
    ],
    note: "Three irregulars: 4:00 = よじ, 7:00 = しちじ, 9:00 = くじ.",
  },
  {
    day: 11,
    title: "も — 'also / too'",
    grammar: { name: "も (also)", explain: "Replace は with も to mean 'also'. わたしも がくせいです = I'm a student too. も says the same thing is true for another item." },
    vocab: [
      { text: "も", reading: "mo", meaning: "also, too" },
      { text: "かれ", reading: "kare", meaning: "he" },
      { text: "かのじょ", reading: "kanojo", meaning: "she" },
    ],
    examples: [
      { text: "わたしは がくせいです。かれも がくせいです。", reading: "watashi wa gakusei desu. kare mo gakusei desu", meaning: "I'm a student. He is a student too." },
    ],
    practice: [
      { prompt: "Say 'She is also a teacher'", answer: "かのじょも せんせいです", reading: "kanojo mo sensei desu" },
      { prompt: "Say 'I am also Japanese'", answer: "わたしも にほんじんです", reading: "watashi mo nihonjin desu" },
    ],
  },
  {
    day: 12,
    title: "Katakana & loanwords",
    grammar: { name: "Katakana — the second alphabet", explain: "Katakana spells foreign and loan words: コーヒー = coffee, テレビ = TV. Same sounds as hiragana, sharper shapes. Start reading it in the Kana tab." },
    vocab: [
      { text: "コーヒー", reading: "kōhī", meaning: "coffee" },
      { text: "テレビ", reading: "terebi", meaning: "TV" },
      { text: "パン", reading: "pan", meaning: "bread" },
      { text: "コンビニ", reading: "konbini", meaning: "convenience store" },
      { text: "アメリカ", reading: "Amerika", meaning: "America" },
    ],
    examples: [
      { text: "これは コーヒーです。", reading: "kore wa kōhī desu", meaning: "This is coffee." },
      { text: "わたしは アメリカじんです。", reading: "watashi wa Amerika-jin desu", meaning: "I am American." },
    ],
    practice: [
      { prompt: "Say 'This is bread'", answer: "これは パンです", reading: "kore wa pan desu" },
      { prompt: "Say 'I am American'", answer: "わたしは アメリカじんです", reading: "watashi wa Amerikajin desu" },
    ],
  },
  {
    day: 13,
    title: "Inviting someone — 〜ませんか",
    grammar: { name: "〜ませんか (shall we?)", explain: "A gentle invitation. Take a verb + ませんか: いきませんか = shall we go? のみませんか = shall we have a drink?" },
    vocab: [
      { text: "いきます", reading: "ikimasu", meaning: "to go" },
      { text: "のみます", reading: "nomimasu", meaning: "to drink" },
      { text: "たべます", reading: "tabemasu", meaning: "to eat" },
      { text: "いっしょに", reading: "issho ni", meaning: "together" },
    ],
    examples: [
      { text: "いっしょに コーヒーを のみませんか。", reading: "issho ni kōhī o nomimasen ka", meaning: "Shall we have coffee together?" },
    ],
    practice: [
      { prompt: "Invite: 'Shall we eat together?'", answer: "いっしょに たべませんか", reading: "issho ni tabemasen ka" },
      { prompt: "Invite: 'Shall we go?'", answer: "いきませんか", reading: "ikimasen ka" },
    ],
    note: "を (written 'wo', said 'o') marks the object — you'll drill it next week.",
  },
  {
    day: 14,
    title: "Week 2 review — making plans",
    grammar: { name: "Put Week 2 together", explain: "You can count, tell time, ask prices, say 'also', read katakana, and invite someone. Combine them in a short everyday exchange." },
    vocab: [
      { text: "どうですか", reading: "dō desu ka", meaning: "how about it? / how is it?" },
      { text: "すみません", reading: "sumimasen", meaning: "excuse me / sorry" },
    ],
    examples: [
      { text: "すみません、これは いくらですか。", reading: "sumimasen, kore wa ikura desu ka", meaning: "Excuse me, how much is this?" },
      { text: "いっしょに コーヒーを のみませんか。ごじはんは どうですか。", reading: "issho ni kōhī o nomimasen ka. goji han wa dō desu ka", meaning: "Shall we get coffee? How about 5:30?" },
    ],
    practice: [
      { prompt: "Ask a price, then invite someone for coffee at 3:00 — out loud, then type it", answer: "これは いくらですか。いっしょに コーヒーを のみませんか。さんじは どうですか。", reading: "kore wa ikura desu ka. issho ni kōhī o nomimasen ka. sanji wa dō desu ka" },
    ],
    note: "Two weeks in — greetings, self-intro, shopping basics, and making plans are already yours.",
  },
];

/* ---------- languages ---------- */
export const LANGUAGES: Record<string, Language> = {
  ja: {
    code: "ja", name: "Japanese", nativeName: "日本語", ttsLang: "ja-JP",
    hasScript: true, kana: HIRAGANA, weeks: JA_WEEKS, lessons: JA_LESSONS, ready: true,
  },
  es: {
    code: "es", name: "Spanish", nativeName: "Español", ttsLang: "es-ES",
    hasScript: false, kana: null, weeks: [], lessons: [], ready: false,
  },
  ko: {
    code: "ko", name: "Korean", nativeName: "한국어", ttsLang: "ko-KR",
    hasScript: false, kana: null, weeks: [], lessons: [], ready: false,
  },
};

export const DEFAULT_LANG = "ja";
