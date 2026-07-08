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
  katakana: Kana[] | null;
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

/* ---------- Japanese: katakana ---------- */
const KATAKANA: Kana[] = [
  ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
  ["カ","ka"],["キ","ki"],["ク","ku"],["ケ","ke"],["コ","ko"],
  ["サ","sa"],["シ","shi"],["ス","su"],["セ","se"],["ソ","so"],
  ["タ","ta"],["チ","chi"],["ツ","tsu"],["テ","te"],["ト","to"],
  ["ナ","na"],["ニ","ni"],["ヌ","nu"],["ネ","ne"],["ノ","no"],
  ["ハ","ha"],["ヒ","hi"],["フ","fu"],["ヘ","he"],["ホ","ho"],
  ["マ","ma"],["ミ","mi"],["ム","mu"],["メ","me"],["モ","mo"],
  ["ヤ","ya"],["ユ","yu"],["ヨ","yo"],
  ["ラ","ra"],["リ","ri"],["ル","ru"],["レ","re"],["ロ","ro"],
  ["ワ","wa"],["ヲ","wo"],["ン","n"],
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
    title: "AはBです: saying what something is",
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
    title: "これ・それ・あれ: this & that",
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
    title: "Saying 'is not' (じゃ ありません)",
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
    title: "Week 1 review: your self-introduction",
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
    title: "も: 'also / too'",
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
    title: "Inviting someone (〜ませんか)",
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
    title: "Week 2 review: making plans",
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
  {
    day: 15,
    title: "Verbs arrive: ます-form",
    grammar: { name: "〜ます (polite present/future)", explain: "Japanese verbs come at the END of the sentence and don't change for I/you/he/she — one form covers all. ます marks polite present or future tense: たべます = eat / will eat." },
    vocab: [
      { text: "たべます", reading: "tabemasu", meaning: "to eat" },
      { text: "のみます", reading: "nomimasu", meaning: "to drink" },
      { text: "みます", reading: "mimasu", meaning: "to see / watch" },
      { text: "ききます", reading: "kikimasu", meaning: "to listen / hear" },
      { text: "よみます", reading: "yomimasu", meaning: "to read" },
      { text: "まいにち", reading: "mainichi", meaning: "every day" },
    ],
    examples: [
      { text: "まいにち パンを たべます。", reading: "mainichi pan o tabemasu", meaning: "I eat bread every day." },
      { text: "おんがくを ききます。", reading: "ongaku o kikimasu", meaning: "I listen to music." },
    ],
    practice: [
      { prompt: "Say 'I read a book' (just the verb part is fine to start)", answer: "ほんを よみます", reading: "hon o yomimasu" },
      { prompt: "Say 'I watch TV'", answer: "テレビを みます", reading: "terebi o mimasu" },
    ],
    note: "を marks the object of the verb — you'll drill it properly tomorrow. For now just notice it sits before the verb.",
  },
  {
    day: 16,
    title: "を — marking the object",
    grammar: { name: "を (object marker)", explain: "を (written 'wo', pronounced 'o') marks the THING a verb acts on. Word order: [subject] は [object] を [verb]. わたしは すしを たべます = I eat sushi." },
    vocab: [
      { text: "すし", reading: "sushi", meaning: "sushi" },
      { text: "にく", reading: "niku", meaning: "meat" },
      { text: "やさい", reading: "yasai", meaning: "vegetables" },
      { text: "しんぶん", reading: "shinbun", meaning: "newspaper" },
      { text: "えいが", reading: "eiga", meaning: "movie" },
    ],
    examples: [
      { text: "わたしは すしを たべます。", reading: "watashi wa sushi o tabemasu", meaning: "I eat sushi." },
      { text: "しんぶんを よみます。", reading: "shinbun o yomimasu", meaning: "I read the newspaper." },
    ],
    practice: [
      { prompt: "Say 'I watch a movie'", answer: "えいがを みます", reading: "eiga o mimasu" },
      { prompt: "Say 'I eat vegetables'", answer: "やさいを たべます", reading: "yasai o tabemasu" },
    ],
  },
  {
    day: 17,
    title: "Verb negatives & past",
    grammar: { name: "ません / ました / ませんでした", explain: "ます → ません (don't/won't), ます → ました (did), ます → ませんでした (didn't). Same verb stem, four endings cover present/future and past, positive and negative." },
    vocab: [
      { text: "たべません", reading: "tabemasen", meaning: "don't/won't eat" },
      { text: "たべました", reading: "tabemashita", meaning: "ate" },
      { text: "たべませんでした", reading: "tabemasen deshita", meaning: "didn't eat" },
      { text: "きのう", reading: "kinō", meaning: "yesterday" },
      { text: "けさ", reading: "kesa", meaning: "this morning" },
    ],
    examples: [
      { text: "けさ なにも たべませんでした。", reading: "kesa nani mo tabemasen deshita", meaning: "I didn't eat anything this morning." },
      { text: "きのう すしを たべました。", reading: "kinō sushi o tabemashita", meaning: "I ate sushi yesterday." },
    ],
    practice: [
      { prompt: "Say 'I didn't watch TV yesterday'", answer: "きのう テレビを みませんでした", reading: "kinō terebi o mimasen deshita" },
      { prompt: "Say 'I read a book' (past tense)", answer: "ほんを よみました", reading: "hon o yomimashita" },
    ],
    note: "なにも + negative = 'nothing/not anything' — a common pattern worth noticing now.",
  },
  {
    day: 18,
    title: "Going places: いきます + へ/に",
    grammar: { name: "へ / に (direction)", explain: "へ (said 'e') or に marks a destination with いきます (go), きます (come), かえります (return): がっこうへ いきます = I go to school. へ and に are interchangeable for simple direction." },
    vocab: [
      { text: "いきます", reading: "ikimasu", meaning: "to go" },
      { text: "きます", reading: "kimasu", meaning: "to come" },
      { text: "かえります", reading: "kaerimasu", meaning: "to go home / return" },
      { text: "がっこう", reading: "gakkō", meaning: "school" },
      { text: "かいしゃ", reading: "kaisha", meaning: "company / office" },
      { text: "いえ", reading: "ie", meaning: "house / home" },
    ],
    examples: [
      { text: "まいにち がっこうへ いきます。", reading: "mainichi gakkō e ikimasu", meaning: "I go to school every day." },
      { text: "ろくじに いえに かえります。", reading: "rokuji ni ie ni kaerimasu", meaning: "I go home at 6:00." },
    ],
    practice: [
      { prompt: "Say 'I go to the office'", answer: "かいしゃへ いきます", reading: "kaisha e ikimasu" },
      { prompt: "Say 'I come home at 5:00'", answer: "ごじに いえに かえります", reading: "goji ni ie ni kaerimasu" },
    ],
    note: "Notice に doing two jobs: goji-NI (at 5:00 — time) and ie-NI (to home — direction). Context tells you which.",
  },
  {
    day: 19,
    title: "で — where an action happens",
    grammar: { name: "で (location of action)", explain: "で marks WHERE something happens (with an action verb). Compare: がっこうに います (I am AT school — existence) vs がっこうで べんきょうします (I study AT school — action)." },
    vocab: [
      { text: "べんきょうします", reading: "benkyō shimasu", meaning: "to study" },
      { text: "はたらきます", reading: "hatarakimasu", meaning: "to work" },
      { text: "かいます", reading: "kaimasu", meaning: "to buy" },
      { text: "としょかん", reading: "toshokan", meaning: "library" },
      { text: "みせ", reading: "mise", meaning: "store" },
    ],
    examples: [
      { text: "としょかんで べんきょうします。", reading: "toshokan de benkyō shimasu", meaning: "I study at the library." },
      { text: "みせで パンを かいます。", reading: "mise de pan o kaimasu", meaning: "I buy bread at the store." },
    ],
    practice: [
      { prompt: "Say 'I work at the company'", answer: "かいしゃで はたらきます", reading: "kaisha de hatarakimasu" },
      { prompt: "Say 'I study at home'", answer: "いえで べんきょうします", reading: "ie de benkyō shimasu" },
    ],
    note: "します (do) turns many nouns into verbs: べんきょう (study, noun) + します = べんきょうします (to study).",
  },
  {
    day: 20,
    title: "Bringing it together: を + に/へ + で",
    grammar: { name: "Combining particles", explain: "A full sentence can stack particles: [time]に [place]で [object]を [verb]. ごじに としょかんで ほんを よみます = At 5:00 I read a book at the library." },
    vocab: [
      { text: "ゆうがた", reading: "yūgata", meaning: "evening" },
      { text: "しゅうまつ", reading: "shūmatsu", meaning: "weekend" },
      { text: "ときどき", reading: "tokidoki", meaning: "sometimes" },
    ],
    examples: [
      { text: "しゅうまつ、としょかんで ほんを よみます。", reading: "shūmatsu, toshokan de hon o yomimasu", meaning: "On weekends, I read books at the library." },
      { text: "ときどき かいしゃで えいごを べんきょうします。", reading: "tokidoki kaisha de eigo o benkyō shimasu", meaning: "I sometimes study English at the office." },
    ],
    practice: [
      { prompt: "Say 'In the evening I study Japanese at home' — out loud, then type it", answer: "ゆうがた いえで にほんごを べんきょうします", reading: "yūgata ie de nihongo o benkyō shimasu" },
    ],
  },
  {
    day: 21,
    title: "Week 3 review — a real daily-routine paragraph",
    grammar: { name: "Put Week 3 together", explain: "You now have verbs, objects (を), direction (へ/に), and location (で). Today: describe a whole routine, several sentences long." },
    vocab: [
      { text: "それから", reading: "sore kara", meaning: "after that, and then" },
      { text: "はじめに", reading: "hajime ni", meaning: "first, to begin" },
    ],
    examples: [
      { text: "はじめに かいしゃへ いきます。かいしゃで はたらきます。それから いえに かえります。", reading: "hajime ni kaisha e ikimasu. kaisha de hatarakimasu. sore kara ie ni kaerimasu.", meaning: "First I go to the office. I work at the office. After that I go home." },
    ],
    practice: [
      { prompt: "Describe your own routine in 3 sentences using はじめに / それから — say it out loud, then type it", answer: "はじめに ___へ いきます。___で ___を ___ます。それから いえに かえります。", reading: "hajime ni ___ e ikimasu. ___ de ___ o ___masu. sore kara ie ni kaerimasu." },
    ],
    note: "This is the first day you're producing multi-sentence, connected speech — a real milestone.",
  },
  {
    day: 22,
    title: "い-adjectives",
    grammar: { name: "い-adjectives", explain: "Adjectives ending in い (おおきい, ちいさい) go directly before a noun, or at the end with です: これは おおきいです = This is big. これは おおきい いえです = This is a big house." },
    vocab: [
      { text: "おおきい", reading: "ōkii", meaning: "big" },
      { text: "ちいさい", reading: "chiisai", meaning: "small" },
      { text: "たかい", reading: "takai", meaning: "expensive / tall" },
      { text: "やすい", reading: "yasui", meaning: "cheap" },
      { text: "あたらしい", reading: "atarashii", meaning: "new" },
      { text: "ふるい", reading: "furui", meaning: "old (things)" },
    ],
    examples: [
      { text: "この いえは おおきいです。", reading: "kono ie wa ōkii desu", meaning: "This house is big." },
      { text: "あたらしい くるまを かいました。", reading: "atarashii kuruma o kaimashita", meaning: "I bought a new car." },
    ],
    practice: [
      { prompt: "Say 'This is expensive'", answer: "これは たかいです", reading: "kore wa takai desu" },
      { prompt: "Say 'a small store' (adjective + noun)", answer: "ちいさい みせ", reading: "chiisai mise" },
    ],
    note: "この (this + noun) is different from これ (this, standalone) — この always needs a noun right after it.",
  },
  {
    day: 23,
    title: "い-adjectives: negative & past",
    grammar: { name: "い-adjective conjugation", explain: "Drop い, add くないです (not) or かったです (was) or くなかったです (wasn't): たかい → たかくないです / たかかったです / たかくなかったです. いい (good) is irregular: よくないです." },
    vocab: [
      { text: "いい", reading: "ii", meaning: "good" },
      { text: "わるい", reading: "warui", meaning: "bad" },
      { text: "おもしろい", reading: "omoshiroi", meaning: "interesting / funny" },
      { text: "つまらない", reading: "tsumaranai", meaning: "boring" },
    ],
    examples: [
      { text: "この えいがは おもしろくないです。", reading: "kono eiga wa omoshiroku nai desu", meaning: "This movie isn't interesting." },
      { text: "てんきは よかったです。", reading: "tenki wa yokatta desu", meaning: "The weather was good." },
    ],
    practice: [
      { prompt: "Say 'It wasn't expensive'", answer: "たかくなかったです", reading: "takaku nakatta desu" },
      { prompt: "Say 'The movie was interesting'", answer: "えいがは おもしろかったです", reading: "eiga wa omoshirokatta desu" },
    ],
    note: "いい is the ONLY irregular い-adjective — every negative/past form uses よ instead of い: よくない, よかった.",
  },
  {
    day: 24,
    title: "な-adjectives",
    grammar: { name: "な-adjectives", explain: "A second adjective type doesn't end in い. Before a noun, add な: しずかな へや (a quiet room). Before です, no な needed: このへやは しずかです." },
    vocab: [
      { text: "しずか", reading: "shizuka", meaning: "quiet" },
      { text: "にぎやか", reading: "nigiyaka", meaning: "lively / bustling" },
      { text: "きれい", reading: "kirei", meaning: "pretty / clean" },
      { text: "げんき", reading: "genki", meaning: "healthy / energetic" },
      { text: "ゆうめい", reading: "yūmei", meaning: "famous" },
      { text: "へや", reading: "heya", meaning: "room" },
    ],
    examples: [
      { text: "この へやは しずかです。", reading: "kono heya wa shizuka desu", meaning: "This room is quiet." },
      { text: "きれいな こうえんですね。", reading: "kirei na kōen desu ne", meaning: "It's a pretty park, isn't it." },
    ],
    practice: [
      { prompt: "Say 'a famous restaurant' (adjective + noun)", answer: "ゆうめいな レストラン", reading: "yūmei na resutoran" },
      { prompt: "Say 'This town is lively'", answer: "この まちは にぎやかです", reading: "kono machi wa nigiyaka desu" },
    ],
    note: "きれい LOOKS like an い-adjective (ends in i) but behaves like a な-adjective — a famous trap. Same with きらい (dislike) and ゆうめい.",
  },
  {
    day: 25,
    title: "な-adjectives: negative & past",
    grammar: { name: "な-adjective conjugation", explain: "な-adjectives conjugate through です, exactly like nouns: しずかです → しずかじゃないです (not) → しずかでした (was) → しずかじゃなかったです (wasn't)." },
    vocab: [
      { text: "ひま", reading: "hima", meaning: "free (time), not busy" },
      { text: "たいへん", reading: "taihen", meaning: "tough, hard (situation)" },
      { text: "べんり", reading: "benri", meaning: "convenient" },
    ],
    examples: [
      { text: "きょうは ひまじゃないです。", reading: "kyō wa hima ja nai desu", meaning: "Today I'm not free." },
      { text: "しごとは たいへんでした。", reading: "shigoto wa taihen deshita", meaning: "Work was tough." },
    ],
    practice: [
      { prompt: "Say 'It wasn't convenient'", answer: "べんりじゃなかったです", reading: "benri ja nakatta desu" },
      { prompt: "Say 'I was free yesterday'", answer: "きのうは ひまでした", reading: "kinō wa hima deshita" },
    ],
    note: "Notice the pattern is identical to how nouns negate/past — です → じゃないです / でした / じゃなかったです — from Day 5.",
  },
  {
    day: 26,
    title: "が — likes, dislikes, ability",
    grammar: { name: "が with 好き/きらい/じょうず/へた", explain: "が marks what you like/dislike or are good/bad at — NOT を. わたしは にほんごが すきです = I like Japanese (literally: as for me, Japanese is likeable)." },
    vocab: [
      { text: "すき", reading: "suki", meaning: "like (な-adj)" },
      { text: "きらい", reading: "kirai", meaning: "dislike (な-adj)" },
      { text: "じょうず", reading: "jōzu", meaning: "good at, skilled (な-adj)" },
      { text: "へた", reading: "heta", meaning: "bad at, unskilled (な-adj)" },
      { text: "りょうり", reading: "ryōri", meaning: "cooking" },
    ],
    examples: [
      { text: "わたしは ねこが すきです。", reading: "watashi wa neko ga suki desu", meaning: "I like cats." },
      { text: "かのじょは りょうりが じょうずです。", reading: "kanojo wa ryōri ga jōzu desu", meaning: "She's good at cooking." },
    ],
    practice: [
      { prompt: "Say 'I'm bad at Japanese'", answer: "にほんごが へたです", reading: "nihongo ga heta desu" },
      { prompt: "Say 'I dislike vegetables'", answer: "やさいが きらいです", reading: "yasai ga kirai desu" },
    ],
    note: "This が-instead-of-を pattern feels backwards in English but is completely regular — 好き/きらい/じょうず/へた ALWAYS take が.",
  },
  {
    day: 27,
    title: "より & ほう — comparing two things",
    grammar: { name: "AよりBのほうが〜", explain: "To say B is more ___ than A: AよりBのほうが〜です. いぬより ねこのほうが すきです = I like cats more than dogs. 一番 (ichiban) = 'the most' for comparing 3+." },
    vocab: [
      { text: "より", reading: "yori", meaning: "than" },
      { text: "ほう", reading: "hō", meaning: "side, direction (comparison)" },
      { text: "いちばん", reading: "ichiban", meaning: "the most, number one" },
      { text: "いぬ", reading: "inu", meaning: "dog" },
      { text: "ねこ", reading: "neko", meaning: "cat" },
    ],
    examples: [
      { text: "いぬより ねこのほうが すきです。", reading: "inu yori neko no hō ga suki desu", meaning: "I like cats more than dogs." },
      { text: "にほんごが いちばん おもしろいです。", reading: "nihongo ga ichiban omoshiroi desu", meaning: "Japanese is the most interesting." },
    ],
    practice: [
      { prompt: "Say 'This is more expensive than that'", answer: "それより これのほうが たかいです", reading: "sore yori kore no hō ga takai desu" },
      { prompt: "Say 'Sushi is the best (most liked)'", answer: "すしが いちばん すきです", reading: "sushi ga ichiban suki desu" },
    ],
  },
  {
    day: 28,
    title: "Month 1 review — describe your world",
    grammar: { name: "Put Weeks 1–4 together", explain: "One month in: you can introduce yourself, talk about daily actions with correct particles, and describe people, places, and preferences with both adjective types. Today, combine all of it." },
    vocab: [
      { text: "せいかつ", reading: "seikatsu", meaning: "daily life" },
      { text: "しゅみ", reading: "shumi", meaning: "hobby" },
    ],
    examples: [
      { text: "わたしの まちは にぎやかで、たのしいです。まいにち かいしゃへ いって、はたらきます。しゅみは りょうりです。", reading: "watashi no machi wa nigiyaka de, tanoshii desu. mainichi kaisha e itte, hatarakimasu. shumi wa ryōri desu.", meaning: "My town is lively and fun. I go to the office and work every day. My hobby is cooking." },
    ],
    practice: [
      { prompt: "Describe your town, your daily routine, and one thing you like — 3+ sentences, out loud, then typed for Sensei to check", answer: "わたしの まちは ___です。まいにち ___へ いきます。___が すきです。", reading: "watashi no machi wa ___ desu. mainichi ___ e ikimasu. ___ ga suki desu." },
    ],
    note: "Milestone: this is the Day-30 self-intro milestone coming up in 2 days — today's practice is your dress rehearsal. Record yourself.",
  },
  {
    day: 29,
    title: "The te-form",
    grammar: { name: "Making the て-form", explain: "The て-form connects verbs and unlocks tons of grammar. う/つ/る→って, む/ぶ/ぬ→んで, く→いて, ぐ→いで, す→して. る-verbs: drop る→て. Irregulars: します→して, きます→きて, いきます→いって." },
    vocab: [
      { text: "たべて", reading: "tabete", meaning: "eat (te-form)" },
      { text: "のんで", reading: "nonde", meaning: "drink (te-form)" },
      { text: "いって", reading: "itte", meaning: "go (te-form)" },
      { text: "みて", reading: "mite", meaning: "see (te-form)" },
      { text: "して", reading: "shite", meaning: "do (te-form)" },
    ],
    examples: [
      { text: "たべて、のんで、はなします。", reading: "tabete, nonde, hanashimasu", meaning: "(I) eat, drink, and talk." },
    ],
    practice: [
      { prompt: "Give the te-form of のみます", answer: "のんで", reading: "nonde" },
      { prompt: "Give the te-form of いきます", answer: "いって", reading: "itte" },
    ],
    note: "Memorize the song-like groups (って/んで/いて/いで/して) now — every te-form grammar point relies on it.",
  },
  {
    day: 30,
    title: "〜てください — please do",
    grammar: { name: "〜てください", explain: "te-form + ください = a polite request/instruction: みてください = please look. Soft, everyday politeness — used constantly." },
    vocab: [
      { text: "まってください", reading: "matte kudasai", meaning: "please wait" },
      { text: "きてください", reading: "kite kudasai", meaning: "please come" },
      { text: "みせてください", reading: "misete kudasai", meaning: "please show me" },
      { text: "もういちど", reading: "mō ichido", meaning: "one more time" },
      { text: "ゆっくり", reading: "yukkuri", meaning: "slowly" },
    ],
    examples: [
      { text: "もういちど いってください。", reading: "mō ichido itte kudasai", meaning: "Please say it one more time." },
      { text: "ゆっくり はなしてください。", reading: "yukkuri hanashite kudasai", meaning: "Please speak slowly." },
    ],
    practice: [
      { prompt: "Say 'please wait'", answer: "まってください", reading: "matte kudasai" },
      { prompt: "Say 'please write it here'", answer: "ここに かいてください", reading: "koko ni kaite kudasai" },
    ],
  },
  {
    day: 31,
    title: "〜ています — ongoing action / state",
    grammar: { name: "〜ています", explain: "te-form + います = an action in progress (たべています = am eating) or an ongoing state (すんでいます = live/reside)." },
    vocab: [
      { text: "しています", reading: "shite imasu", meaning: "am doing" },
      { text: "すんでいます", reading: "sunde imasu", meaning: "live / reside" },
      { text: "しっています", reading: "shitte imasu", meaning: "know" },
      { text: "いま", reading: "ima", meaning: "now" },
      { text: "とうきょう", reading: "Tōkyō", meaning: "Tokyo" },
    ],
    examples: [
      { text: "いま なにを していますか。", reading: "ima nani o shite imasu ka", meaning: "What are you doing now?" },
      { text: "とうきょうに すんでいます。", reading: "Tōkyō ni sunde imasu", meaning: "I live in Tokyo." },
    ],
    practice: [
      { prompt: "Say 'I'm eating now'", answer: "いま たべています", reading: "ima tabete imasu" },
      { prompt: "Ask 'Do you know Tanaka?'", answer: "たなかさんを しっていますか", reading: "Tanaka-san o shitte imasu ka" },
    ],
    note: "しっています = 'I know' (state), but the negative is しりません, not しっていません — a common exception.",
  },
  {
    day: 32,
    title: "Permission & prohibition",
    grammar: { name: "〜てもいいです / 〜てはいけません", explain: "te-form + もいいです = may / it's OK to. te-form + はいけません = must not. たべてもいいですか = may I eat?" },
    vocab: [
      { text: "いいですか", reading: "ii desu ka", meaning: "is it OK?" },
      { text: "だめ", reading: "dame", meaning: "no good / not allowed" },
      { text: "ここ", reading: "koko", meaning: "here" },
      { text: "すわって", reading: "suwatte", meaning: "sit (te-form)" },
      { text: "はいって", reading: "haitte", meaning: "enter (te-form)" },
    ],
    examples: [
      { text: "ここに すわってもいいですか。", reading: "koko ni suwatte mo ii desu ka", meaning: "May I sit here?" },
      { text: "ここで たべてはいけません。", reading: "koko de tabete wa ikemasen", meaning: "You must not eat here." },
    ],
    practice: [
      { prompt: "Ask 'May I come in?'", answer: "はいってもいいですか", reading: "haitte mo ii desu ka" },
      { prompt: "Say 'You must not smoke here'", answer: "ここで タバコを すってはいけません", reading: "koko de tabako o sutte wa ikemasen" },
    ],
  },
  {
    day: 33,
    title: "Linking actions with て",
    grammar: { name: "Sequencing with て", explain: "te-form links actions in order — 'do X, then Y': おきて、たべて、いきます = I get up, eat, and go. The final verb carries the tense." },
    vocab: [
      { text: "おきて", reading: "okite", meaning: "get up (te-form)" },
      { text: "あさ", reading: "asa", meaning: "morning" },
      { text: "シャワーを あびます", reading: "shawā o abimasu", meaning: "take a shower" },
      { text: "あるいて", reading: "aruite", meaning: "walk (te-form)" },
    ],
    examples: [
      { text: "あさ おきて、シャワーを あびて、かいしゃへ いきます。", reading: "asa okite, shawā o abite, kaisha e ikimasu", meaning: "In the morning I get up, take a shower, and go to work." },
    ],
    practice: [
      { prompt: "Say 'I eat, drink coffee, and read the news'", answer: "たべて、コーヒーを のんで、しんぶんを よみます", reading: "tabete, kōhī o nonde, shinbun o yomimasu" },
    ],
    note: "Only the LAST verb shows tense — so past 'did X and Y' just makes the final verb past.",
  },
  {
    day: 34,
    title: "〜てから — after doing",
    grammar: { name: "〜てから", explain: "te-form + から = 'after doing X'. ばんごはんを たべてから、テレビを みます = After eating dinner, I watch TV. Emphasizes sequence." },
    vocab: [
      { text: "ばんごはん", reading: "bangohan", meaning: "dinner" },
      { text: "あさごはん", reading: "asagohan", meaning: "breakfast" },
      { text: "しごと", reading: "shigoto", meaning: "work / job" },
      { text: "ねます", reading: "nemasu", meaning: "to sleep" },
    ],
    examples: [
      { text: "しごとが おわってから、ともだちに あいます。", reading: "shigoto ga owatte kara, tomodachi ni aimasu", meaning: "After work finishes, I'll meet a friend." },
    ],
    practice: [
      { prompt: "Say 'After I eat dinner, I sleep'", answer: "ばんごはんを たべてから、ねます", reading: "bangohan o tabete kara, nemasu" },
    ],
  },
  {
    day: 35,
    title: "Week 5 review — the te-form toolkit",
    grammar: { name: "Put Week 5 together", explain: "You can now request (てください), describe ongoing action (ています), give permission/prohibition, and sequence actions. Combine them into a natural exchange." },
    vocab: [
      { text: "てつだって", reading: "tetsudatte", meaning: "help (te-form)" },
      { text: "だいじょうぶ", reading: "daijōbu", meaning: "OK / fine" },
    ],
    examples: [
      { text: "すみません、ちょっと てつだってください。いま いそがしいですか。", reading: "sumimasen, chotto tetsudatte kudasai. ima isogashii desu ka", meaning: "Excuse me, please help me a bit. Are you busy now?" },
    ],
    practice: [
      { prompt: "Ask for help politely, then ask if it's OK to sit — out loud, then type", answer: "てつだってください。ここに すわってもいいですか。", reading: "tetsudatte kudasai. koko ni suwatte mo ii desu ka" },
    ],
    note: "The te-form is the single biggest unlock in beginner Japanese — from here the language opens up fast.",
  },
  {
    day: 36,
    title: "Dictionary (plain) form",
    grammar: { name: "Plain / dictionary form", explain: "The base form of a verb (たべる, のむ, いく) — casual, and required before lots of grammar. ます-verbs: e-stem+る (たべます→たべる); u-verbs shift the i-sound to u (のみます→のむ)." },
    vocab: [
      { text: "たべる", reading: "taberu", meaning: "eat (plain)" },
      { text: "のむ", reading: "nomu", meaning: "drink (plain)" },
      { text: "いく", reading: "iku", meaning: "go (plain)" },
      { text: "する", reading: "suru", meaning: "do (plain)" },
      { text: "くる", reading: "kuru", meaning: "come (plain)" },
    ],
    examples: [
      { text: "まいにち にほんごを べんきょうする。", reading: "mainichi nihongo o benkyō suru", meaning: "I study Japanese every day. (casual)" },
    ],
    practice: [
      { prompt: "Give the plain form of のみます", answer: "のむ", reading: "nomu" },
      { prompt: "Give the plain form of みます", answer: "みる", reading: "miru" },
    ],
    note: "Plain form isn't just casual speech — it's the 'stem' that connects to と思う, つもり, and many more patterns coming up.",
  },
  {
    day: 37,
    title: "Plain negative (ない-form)",
    grammar: { name: "〜ない (plain negative)", explain: "u-verbs: final u-sound → a-sound + ない (のむ→のまない). る-verbs: drop る + ない (たべる→たべない). Irregulars: する→しない, くる→こない. (う→わ: かう→かわない.)" },
    vocab: [
      { text: "たべない", reading: "tabenai", meaning: "don't eat" },
      { text: "のまない", reading: "nomanai", meaning: "don't drink" },
      { text: "いかない", reading: "ikanai", meaning: "don't go" },
      { text: "しない", reading: "shinai", meaning: "don't do" },
      { text: "わからない", reading: "wakaranai", meaning: "don't understand" },
    ],
    examples: [
      { text: "きょうは にくを たべない。", reading: "kyō wa niku o tabenai", meaning: "I'm not eating meat today. (casual)" },
    ],
    practice: [
      { prompt: "Give the ない-form of いきます", answer: "いかない", reading: "ikanai" },
      { prompt: "Say 'I don't understand' (casual)", answer: "わからない", reading: "wakaranai" },
    ],
    note: "For う-ending u-verbs, the negative is わ not あ: かう (buy) → かわない.",
  },
  {
    day: 38,
    title: "Plain past (た-form)",
    grammar: { name: "〜た (plain past)", explain: "Same sound-changes as the te-form, but with た/だ instead of て/で: のんで→のんだ, いって→いった, たべて→たべた. Means 'did'." },
    vocab: [
      { text: "たべた", reading: "tabeta", meaning: "ate" },
      { text: "のんだ", reading: "nonda", meaning: "drank" },
      { text: "いった", reading: "itta", meaning: "went" },
      { text: "みた", reading: "mita", meaning: "saw" },
      { text: "した", reading: "shita", meaning: "did" },
    ],
    examples: [
      { text: "きのう えいがを みた。", reading: "kinō eiga o mita", meaning: "I watched a movie yesterday. (casual)" },
    ],
    practice: [
      { prompt: "Give the plain past of のみます", answer: "のんだ", reading: "nonda" },
      { prompt: "Say 'I went to Tokyo' (casual)", answer: "とうきょうに いった", reading: "Tōkyō ni itta" },
    ],
    note: "If you know the te-form, the plain past is free — just swap て→た and で→だ.",
  },
  {
    day: 39,
    title: "Plain past negative",
    grammar: { name: "〜なかった", explain: "Take the ない-form and change ない→なかった: たべない→たべなかった (didn't eat). Works for verbs AND い-adjectives (たかい→たかくなかった)." },
    vocab: [
      { text: "たべなかった", reading: "tabenakatta", meaning: "didn't eat" },
      { text: "いかなかった", reading: "ikanakatta", meaning: "didn't go" },
      { text: "しなかった", reading: "shinakatta", meaning: "didn't do" },
      { text: "こなかった", reading: "konakatta", meaning: "didn't come" },
    ],
    examples: [
      { text: "きのう どこにも いかなかった。", reading: "kinō doko ni mo ikanakatta", meaning: "I didn't go anywhere yesterday. (casual)" },
    ],
    practice: [
      { prompt: "Say 'I didn't drink coffee' (casual)", answer: "コーヒーを のまなかった", reading: "kōhī o nomanakatta" },
    ],
    note: "どこにも + negative = 'nowhere', だれにも = 'nobody' — the same なにも pattern from Day 17.",
  },
  {
    day: 40,
    title: "Casual speech",
    grammar: { name: "Speaking casually", explain: "Among friends, drop です/ます and use plain forms. Questions drop か and just rise in tone: たべる? = eating? な-adjectives/nouns drop だ in casual questions: げんき? = you good?" },
    vocab: [
      { text: "うん", reading: "un", meaning: "yeah (casual yes)" },
      { text: "ううん", reading: "uun", meaning: "nah (casual no)" },
      { text: "なに", reading: "nani", meaning: "what" },
      { text: "どこ", reading: "doko", meaning: "where" },
    ],
    examples: [
      { text: "あした どこ いく?", reading: "ashita doko iku", meaning: "Where are you going tomorrow? (casual)" },
      { text: "うん、いくよ。", reading: "un, iku yo", meaning: "Yeah, I'm going." },
    ],
    practice: [
      { prompt: "Ask a friend 'Did you eat?' (casual)", answer: "たべた?", reading: "tabeta" },
      { prompt: "Answer 'Nah, I didn't eat'", answer: "ううん、たべなかった", reading: "uun, tabenakatta" },
    ],
    note: "Casual speech is for friends and family. With strangers, superiors, or in service situations, stay with です/ます.",
  },
  {
    day: 41,
    title: "〜ましょう / 〜ましょうか — let's",
    grammar: { name: "〜ましょう / 〜ましょうか", explain: "Verb stem + ましょう = 'let's ___'. + ましょうか = 'shall we / shall I ___?' (offering). たべましょう = let's eat. てつだいましょうか = shall I help?" },
    vocab: [
      { text: "いきましょう", reading: "ikimashō", meaning: "let's go" },
      { text: "はじめましょう", reading: "hajimemashō", meaning: "let's begin" },
      { text: "やすみましょう", reading: "yasumimashō", meaning: "let's rest" },
      { text: "てつだいましょうか", reading: "tetsudaimashō ka", meaning: "shall I help?" },
    ],
    examples: [
      { text: "そろそろ いきましょうか。", reading: "sorosoro ikimashō ka", meaning: "Shall we get going soon?" },
    ],
    practice: [
      { prompt: "Say 'Let's begin'", answer: "はじめましょう", reading: "hajimemashō" },
      { prompt: "Offer 'Shall I help?'", answer: "てつだいましょうか", reading: "tetsudaimashō ka" },
    ],
  },
  {
    day: 42,
    title: "Week 6 review — switching registers",
    grammar: { name: "Put Week 6 together", explain: "You now have plain form (present, negative, past, past-negative), casual conversation, and ましょう. Practice moving between polite and casual." },
    vocab: [
      { text: "じゃあ", reading: "jā", meaning: "well then / so" },
      { text: "また", reading: "mata", meaning: "again" },
    ],
    examples: [
      { text: "じゃあ、また あした あそぼう。れんらくするね。", reading: "jā, mata ashita asobō. renraku suru ne", meaning: "So, let's hang out again tomorrow. I'll message you." },
    ],
    practice: [
      { prompt: "Tell a friend casually 'Let's eat tomorrow, I'll message you'", answer: "あした たべよう。れんらくするね。", reading: "ashita tabeyō. renraku suru ne" },
    ],
    note: "あそぼう/たべよう is the casual version of ましょう (volitional) — you'll meet it fully in Week 11.",
  },
  {
    day: 43,
    title: "〜たい — want to do",
    grammar: { name: "〜たい", explain: "Verb stem + たい = 'want to ___'. たべたい = want to eat. たい conjugates like an い-adjective: たべたくない (don't want to), たべたかった (wanted to)." },
    vocab: [
      { text: "いきたい", reading: "ikitai", meaning: "want to go" },
      { text: "たべたい", reading: "tabetai", meaning: "want to eat" },
      { text: "みたい", reading: "mitai", meaning: "want to see" },
      { text: "やすみたい", reading: "yasumitai", meaning: "want to rest" },
      { text: "にほん", reading: "Nihon", meaning: "Japan" },
    ],
    examples: [
      { text: "にほんへ いきたいです。", reading: "Nihon e ikitai desu", meaning: "I want to go to Japan." },
      { text: "なにも たべたくないです。", reading: "nani mo tabetaku nai desu", meaning: "I don't want to eat anything." },
    ],
    practice: [
      { prompt: "Say 'I want to see a movie'", answer: "えいがを みたいです", reading: "eiga o mitai desu" },
      { prompt: "Say 'I wanted to go' (past)", answer: "いきたかったです", reading: "ikitakatta desu" },
    ],
    note: "With たい, the object can take が or を: みずが/を のみたい are both fine.",
  },
  {
    day: 44,
    title: "〜がほしい — want a thing",
    grammar: { name: "〜がほしい", explain: "For wanting an OBJECT (not an action), use noun + がほしい: くるまがほしい = I want a car. ほしい is an い-adjective: ほしくない (don't want)." },
    vocab: [
      { text: "ほしい", reading: "hoshii", meaning: "want (a thing)" },
      { text: "じかん", reading: "jikan", meaning: "time" },
      { text: "おかね", reading: "okane", meaning: "money" },
      { text: "あたらしい", reading: "atarashii", meaning: "new" },
      { text: "なにか", reading: "nanika", meaning: "something" },
    ],
    examples: [
      { text: "あたらしい パソコンが ほしいです。", reading: "atarashii pasokon ga hoshii desu", meaning: "I want a new computer." },
      { text: "なにか のみたいですか。", reading: "nanika nomitai desu ka", meaning: "Do you want something to drink?" },
    ],
    practice: [
      { prompt: "Say 'I want time'", answer: "じかんが ほしいです", reading: "jikan ga hoshii desu" },
    ],
    note: "たい = want to DO; ほしい = want to HAVE. Both use が for the target.",
  },
  {
    day: 45,
    title: "から — because",
    grammar: { name: "〜から (because)", explain: "Attach から to a reason clause: あついから、まどを あけます = Because it's hot, I'll open the window. Reason comes first, から at its end." },
    vocab: [
      { text: "あつい", reading: "atsui", meaning: "hot" },
      { text: "さむい", reading: "samui", meaning: "cold" },
      { text: "いそがしい", reading: "isogashii", meaning: "busy" },
      { text: "まど", reading: "mado", meaning: "window" },
      { text: "あける", reading: "akeru", meaning: "to open" },
    ],
    examples: [
      { text: "きょうは いそがしいから、いけません。", reading: "kyō wa isogashii kara, ikemasen", meaning: "Because I'm busy today, I can't go." },
    ],
    practice: [
      { prompt: "Say 'Because it's cold, I'll close the window' (しめます = close)", answer: "さむいから、まどを しめます", reading: "samui kara, mado o shimemasu" },
    ],
  },
  {
    day: 46,
    title: "が / けど — but",
    grammar: { name: "〜が / 〜けど (but)", explain: "Both mean 'but/although', joining two clauses. が is a touch more formal, けど more conversational: たかいですが、いいです = It's expensive, but it's good." },
    vocab: [
      { text: "でも", reading: "demo", meaning: "but (sentence start)" },
      { text: "けど", reading: "kedo", meaning: "but / though" },
      { text: "たかい", reading: "takai", meaning: "expensive" },
      { text: "おいしい", reading: "oishii", meaning: "delicious" },
    ],
    examples: [
      { text: "この レストランは たかいですけど、おいしいです。", reading: "kono resutoran wa takai desu kedo, oishii desu", meaning: "This restaurant is expensive, but delicious." },
    ],
    practice: [
      { prompt: "Say 'I studied, but I don't understand'", answer: "べんきょうしましたが、わかりません", reading: "benkyō shimashita ga, wakarimasen" },
    ],
    note: "でも starts a new sentence ('But...'); が/けど join clauses inside one sentence.",
  },
  {
    day: 47,
    title: "〜ないでください — please don't",
    grammar: { name: "〜ないでください", explain: "ない-form + でください = 'please don't ___'. わすれないでください = please don't forget. The negative counterpart of 〜てください." },
    vocab: [
      { text: "わすれる", reading: "wasureru", meaning: "to forget" },
      { text: "しんぱいする", reading: "shinpai suru", meaning: "to worry" },
      { text: "さわる", reading: "sawaru", meaning: "to touch" },
      { text: "むり", reading: "muri", meaning: "impossible / overdoing it" },
    ],
    examples: [
      { text: "しんぱいしないでください。", reading: "shinpai shinaide kudasai", meaning: "Please don't worry." },
      { text: "ここに ゴミを すてないでください。", reading: "koko ni gomi o sutenaide kudasai", meaning: "Please don't throw trash here." },
    ],
    practice: [
      { prompt: "Say 'Please don't forget'", answer: "わすれないでください", reading: "wasurenaide kudasai" },
    ],
  },
  {
    day: 48,
    title: "Must / don't have to",
    grammar: { name: "〜なければなりません / 〜なくてもいい", explain: "ない-stem + ければなりません = 'must ___'. ない-stem + くてもいいです = 'don't have to ___'. いかなければなりません = must go; いかなくてもいいです = don't have to go." },
    vocab: [
      { text: "べんきょうしなければなりません", reading: "benkyō shinakereba narimasen", meaning: "must study" },
      { text: "いかなくてもいい", reading: "ikanakute mo ii", meaning: "don't have to go" },
      { text: "きょう", reading: "kyō", meaning: "today" },
      { text: "あした", reading: "ashita", meaning: "tomorrow" },
    ],
    examples: [
      { text: "あした はやく おきなければなりません。", reading: "ashita hayaku okinakereba narimasen", meaning: "I have to get up early tomorrow." },
    ],
    practice: [
      { prompt: "Say 'I have to study today'", answer: "きょう べんきょうしなければなりません", reading: "kyō benkyō shinakereba narimasen" },
      { prompt: "Say 'You don't have to come'", answer: "こなくてもいいです", reading: "konakute mo ii desu" },
    ],
    note: "なければなりません is a mouthful — casually people say なきゃ (いかなきゃ = gotta go).",
  },
  {
    day: 49,
    title: "Week 7 review — wants, reasons, obligations",
    grammar: { name: "Put Week 7 together", explain: "You can express desire (たい/ほしい), give reasons (から), contrast (が/けど), and talk about obligation. Combine them to explain a plan." },
    vocab: [
      { text: "しゅうまつ", reading: "shūmatsu", meaning: "weekend" },
      { text: "だから", reading: "dakara", meaning: "so / therefore" },
    ],
    examples: [
      { text: "しゅうまつ にほんへ いきたいですけど、しごとが あるから、いけません。", reading: "shūmatsu Nihon e ikitai desu kedo, shigoto ga aru kara, ikemasen", meaning: "I want to go to Japan this weekend, but because I have work, I can't." },
    ],
    practice: [
      { prompt: "Say what you want to do this weekend and why you can't — out loud, then type", answer: "___たいですけど、___から、___", reading: "___tai desu kedo, ___kara, ___" },
    ],
  },
  {
    day: 50,
    title: "Potential form — 'can do' (formation)",
    grammar: { name: "Potential form", explain: "'Can do': る-verbs drop る + られる (たべる→たべられる). u-verbs shift final u→e + る (のむ→のめる, いく→いける). する→できる, くる→こられる." },
    vocab: [
      { text: "たべられる", reading: "taberareru", meaning: "can eat" },
      { text: "のめる", reading: "nomeru", meaning: "can drink" },
      { text: "いける", reading: "ikeru", meaning: "can go" },
      { text: "できる", reading: "dekiru", meaning: "can do / be able" },
      { text: "よめる", reading: "yomeru", meaning: "can read" },
    ],
    examples: [
      { text: "かんじが すこし よめます。", reading: "kanji ga sukoshi yomemasu", meaning: "I can read a little kanji." },
    ],
    practice: [
      { prompt: "Give the potential of のみます", answer: "のめる", reading: "nomeru" },
      { prompt: "Give the potential of いきます", answer: "いける", reading: "ikeru" },
    ],
  },
  {
    day: 51,
    title: "Potential in use — が + potential",
    grammar: { name: "Using the potential", explain: "The object of a potential verb usually takes が, not を: にほんごが はなせます = I can speak Japanese. できる is the potential of する." },
    vocab: [
      { text: "はなせる", reading: "hanaseru", meaning: "can speak" },
      { text: "ぜんぜん", reading: "zenzen", meaning: "(not) at all" },
      { text: "すこし", reading: "sukoshi", meaning: "a little" },
      { text: "じょうずに", reading: "jōzu ni", meaning: "skillfully / well" },
    ],
    examples: [
      { text: "にほんごが はなせますか。", reading: "nihongo ga hanasemasu ka", meaning: "Can you speak Japanese?" },
      { text: "ぜんぜん およげません。", reading: "zenzen oyogemasen", meaning: "I can't swim at all." },
    ],
    practice: [
      { prompt: "Say 'I can read a little Japanese'", answer: "にほんごが すこし よめます", reading: "nihongo ga sukoshi yomemasu" },
    ],
    note: "ぜんぜん pairs with a negative: ぜんぜん + can't/isn't = 'not at all'.",
  },
  {
    day: 52,
    title: "〜ことができます — another 'can'",
    grammar: { name: "〜ことができます", explain: "Plain dictionary verb + ことができます = 'can do ___'. はなすことができます = can speak. A more formal alternative to the potential form." },
    vocab: [
      { text: "こと", reading: "koto", meaning: "thing / act (nominalizer)" },
      { text: "うんてんする", reading: "unten suru", meaning: "to drive" },
      { text: "りょうりする", reading: "ryōri suru", meaning: "to cook" },
    ],
    examples: [
      { text: "かれは ピアノを ひくことが できます。", reading: "kare wa piano o hiku koto ga dekimasu", meaning: "He can play the piano." },
    ],
    practice: [
      { prompt: "Say 'I can drive'", answer: "うんてんすることが できます", reading: "unten suru koto ga dekimasu" },
    ],
    note: "Same meaning as the potential form; ことができます sounds a bit more formal/written.",
  },
  {
    day: 53,
    title: "〜すぎます — too much",
    grammar: { name: "〜すぎます", explain: "Verb stem or adjective stem + すぎます = 'too ___'. たべすぎました = ate too much. たかすぎます = too expensive (い-adj drops い; な-adj drops な)." },
    vocab: [
      { text: "たべすぎる", reading: "tabesugiru", meaning: "eat too much" },
      { text: "たかすぎる", reading: "takasugiru", meaning: "too expensive" },
      { text: "おおすぎる", reading: "ōsugiru", meaning: "too many" },
      { text: "ちょっと", reading: "chotto", meaning: "a bit" },
    ],
    examples: [
      { text: "この コーヒーは あつすぎます。", reading: "kono kōhī wa atsusugimasu", meaning: "This coffee is too hot." },
    ],
    practice: [
      { prompt: "Say 'I ate too much'", answer: "たべすぎました", reading: "tabesugimashita" },
      { prompt: "Say 'It's a bit too expensive'", answer: "ちょっと たかすぎます", reading: "chotto takasugimasu" },
    ],
  },
  {
    day: 54,
    title: "Adverbs — describing how",
    grammar: { name: "Adjectives → adverbs", explain: "い-adjectives: い→く (はやい→はやく = quickly). な-adjectives: +に (しずか→しずかに = quietly). はやく はなします = speak quickly." },
    vocab: [
      { text: "はやく", reading: "hayaku", meaning: "quickly / early" },
      { text: "おそく", reading: "osoku", meaning: "slowly / late" },
      { text: "しずかに", reading: "shizuka ni", meaning: "quietly" },
      { text: "げんきに", reading: "genki ni", meaning: "energetically" },
      { text: "じょうずに", reading: "jōzu ni", meaning: "skillfully" },
    ],
    examples: [
      { text: "もっと ゆっくり はなしてください。", reading: "motto yukkuri hanashite kudasai", meaning: "Please speak more slowly." },
      { text: "しずかに してください。", reading: "shizuka ni shite kudasai", meaning: "Please be quiet." },
    ],
    practice: [
      { prompt: "Say 'Please speak slowly' using おそく", answer: "おそく はなしてください", reading: "osoku hanashite kudasai" },
    ],
  },
  {
    day: 55,
    title: "もっと & comparatives, deeper",
    grammar: { name: "もっと / 〜くなる", explain: "もっと = 'more': もっと べんきょうします = I'll study more. Adjective + なる = 'become': たかくなる = become expensive, しずかになる = become quiet." },
    vocab: [
      { text: "もっと", reading: "motto", meaning: "more" },
      { text: "なる", reading: "naru", meaning: "to become" },
      { text: "さいきん", reading: "saikin", meaning: "recently" },
      { text: "じょうず", reading: "jōzu", meaning: "skilled" },
    ],
    examples: [
      { text: "さいきん にほんごが じょうずに なりました。", reading: "saikin nihongo ga jōzu ni narimashita", meaning: "Recently my Japanese has gotten better." },
    ],
    practice: [
      { prompt: "Say 'It got cold' (さむい→)", answer: "さむく なりました", reading: "samuku narimashita" },
    ],
    note: "い-adj: drop い + く + なる. な-adj / noun: + に + なる.",
  },
  {
    day: 56,
    title: "Month 2 review — talk about what you can do",
    grammar: { name: "Put Weeks 5–8 together", explain: "Two months in: te-form grammar, casual speech, wants, reasons, and ability. Today: talk about what you can and can't do yet, and what you want to improve." },
    vocab: [
      { text: "だんだん", reading: "dandan", meaning: "gradually" },
      { text: "これから", reading: "kore kara", meaning: "from now on" },
    ],
    examples: [
      { text: "にほんごが すこし はなせますけど、かんじは まだ よめません。これから もっと べんきょうしたいです。", reading: "nihongo ga sukoshi hanasemasu kedo, kanji wa mada yomemasen. kore kara motto benkyō shitai desu", meaning: "I can speak a little Japanese, but I can't read kanji yet. From now on I want to study more." },
    ],
    practice: [
      { prompt: "Say what you can do, can't do yet, and want to improve — out loud, then type", answer: "___が できますけど、___は まだ できません。もっと ___たいです。", reading: "___ga dekimasu kedo, ___wa mada dekimasen. motto ___tai desu" },
    ],
    note: "まだ + negative = 'not yet'. Halfway there — your sentences are getting genuinely complex.",
  },
  {
    day: 57,
    title: "〜たり〜たり — among other things",
    grammar: { name: "〜たり〜たり", explain: "List a few representative actions (not exhaustive): plain-past + り. たべたり のんだり しました = I did things like eat and drink. Ends with する." },
    vocab: [
      { text: "たべたり", reading: "tabetari", meaning: "eat, and such" },
      { text: "よんだり", reading: "yondari", meaning: "read, and such" },
      { text: "かいものする", reading: "kaimono suru", meaning: "to shop" },
      { text: "さんぽする", reading: "sanpo suru", meaning: "to take a walk" },
    ],
    examples: [
      { text: "しゅうまつは ほんを よんだり、さんぽしたり します。", reading: "shūmatsu wa hon o yondari, sanpo shitari shimasu", meaning: "On weekends I do things like read and take walks." },
    ],
    practice: [
      { prompt: "Say 'I did things like watch a movie and cook'", answer: "えいがを みたり、りょうりしたり しました", reading: "eiga o mitari, ryōri shitari shimashita" },
    ],
  },
  {
    day: 58,
    title: "〜たことがあります — have done before",
    grammar: { name: "〜たことがあります", explain: "Plain-past + ことがあります = 'have done ___ before' (experience). にほんへ いったことが あります = I've been to Japan." },
    vocab: [
      { text: "こと", reading: "koto", meaning: "experience / thing" },
      { text: "すし", reading: "sushi", meaning: "sushi" },
      { text: "のぼる", reading: "noboru", meaning: "to climb" },
      { text: "ふじさん", reading: "Fujisan", meaning: "Mt. Fuji" },
    ],
    examples: [
      { text: "すしを たべたことが ありますか。", reading: "sushi o tabeta koto ga arimasu ka", meaning: "Have you ever eaten sushi?" },
      { text: "いいえ、いちども ありません。", reading: "iie, ichido mo arimasen", meaning: "No, not even once." },
    ],
    practice: [
      { prompt: "Ask 'Have you been to Japan?'", answer: "にほんへ いったことが ありますか", reading: "Nihon e itta koto ga arimasu ka" },
    ],
    note: "いちども + negative = 'not even once'.",
  },
  {
    day: 59,
    title: "Conditional と — natural results",
    grammar: { name: "〜と (whenever / if)", explain: "Plain verb + と = an automatic or habitual result: 'whenever/if A, then B (always) happens'. ボタンを おすと、ドアが あきます = If you press the button, the door opens." },
    vocab: [
      { text: "おす", reading: "osu", meaning: "to push / press" },
      { text: "ボタン", reading: "botan", meaning: "button" },
      { text: "あく", reading: "aku", meaning: "to open (intransitive)" },
      { text: "みぎ", reading: "migi", meaning: "right" },
      { text: "ひだり", reading: "hidari", meaning: "left" },
    ],
    examples: [
      { text: "まっすぐ いくと、えきが あります。", reading: "massugu iku to, eki ga arimasu", meaning: "If you go straight, there's the station." },
    ],
    practice: [
      { prompt: "Say 'If you turn right, there's a convenience store' (まがる=turn)", answer: "みぎに まがると、コンビニが あります", reading: "migi ni magaru to, konbini ga arimasu" },
    ],
    note: "と is for guaranteed/automatic results — great for directions and instructions.",
  },
  {
    day: 60,
    title: "Conditional たら — if / when",
    grammar: { name: "〜たら (if / when)", explain: "Plain-past + ら = 'if/when A, then B'. The most flexible conditional. あめが ふったら、いきません = If it rains, I won't go." },
    vocab: [
      { text: "ふる", reading: "furu", meaning: "to fall (rain/snow)" },
      { text: "あめ", reading: "ame", meaning: "rain" },
      { text: "つく", reading: "tsuku", meaning: "to arrive" },
      { text: "でんわする", reading: "denwa suru", meaning: "to call" },
    ],
    examples: [
      { text: "うちに ついたら、でんわします。", reading: "uchi ni tsuitara, denwa shimasu", meaning: "When I get home, I'll call you." },
    ],
    practice: [
      { prompt: "Say 'If it's cheap, I'll buy it'", answer: "やすかったら、かいます", reading: "yasukattara, kaimasu" },
    ],
    note: "たら handles both 'if' (uncertain) and 'when' (certain future) — your everyday conditional.",
  },
  {
    day: 61,
    title: "あげます — giving (outward)",
    grammar: { name: "あげます", explain: "'give' when it moves away from you (I/we → someone, or someone → someone else). わたしは ともだちに プレゼントを あげます = I give my friend a present. に marks the receiver." },
    vocab: [
      { text: "あげる", reading: "ageru", meaning: "to give (outward)" },
      { text: "プレゼント", reading: "purezento", meaning: "present / gift" },
      { text: "はな", reading: "hana", meaning: "flower" },
      { text: "てがみ", reading: "tegami", meaning: "letter" },
    ],
    examples: [
      { text: "たなかさんに はなを あげました。", reading: "Tanaka-san ni hana o agemashita", meaning: "I gave Tanaka flowers." },
    ],
    practice: [
      { prompt: "Say 'I'll give my friend a letter'", answer: "ともだちに てがみを あげます", reading: "tomodachi ni tegami o agemasu" },
    ],
  },
  {
    day: 62,
    title: "くれます & もらいます",
    grammar: { name: "くれます / もらいます", explain: "くれます = someone gives TO ME (inward): ともだちが プレゼントを くれた. もらいます = I RECEIVE (from someone, marked に or から): ともだちに プレゼントを もらった." },
    vocab: [
      { text: "くれる", reading: "kureru", meaning: "to give (to me)" },
      { text: "もらう", reading: "morau", meaning: "to receive" },
      { text: "たんじょうび", reading: "tanjōbi", meaning: "birthday" },
      { text: "ほん", reading: "hon", meaning: "book" },
    ],
    examples: [
      { text: "あねが ほんを くれました。", reading: "ane ga hon o kuremashita", meaning: "My older sister gave me a book." },
      { text: "あねに ほんを もらいました。", reading: "ane ni hon o moraimashita", meaning: "I received a book from my older sister." },
    ],
    practice: [
      { prompt: "Say 'A friend gave me flowers' (to me)", answer: "ともだちが はなを くれました", reading: "tomodachi ga hana o kuremashita" },
    ],
    note: "Same event, two viewpoints: くれる focuses on the giver, もらう on the receiver (you).",
  },
  {
    day: 63,
    title: "Week 9 review — narrate a past weekend",
    grammar: { name: "Put Week 9 together", explain: "You can list activities (たり), talk about experience (たことがある), use conditionals (と/たら), and describe giving/receiving. Narrate a past event." },
    vocab: [
      { text: "せんしゅう", reading: "senshū", meaning: "last week" },
      { text: "たのしい", reading: "tanoshii", meaning: "fun" },
    ],
    examples: [
      { text: "せんしゅう ともだちに あって、えいがを みたり、ごはんを たべたり しました。ともだちが プレゼントを くれました。たのしかったです。", reading: "senshū tomodachi ni atte, eiga o mitari, gohan o tabetari shimashita. tomodachi ga purezento o kuremashita. tanoshikatta desu", meaning: "Last week I met a friend and did things like watch a movie and eat. My friend gave me a present. It was fun." },
    ],
    practice: [
      { prompt: "Narrate something you did recently in 3+ sentences — out loud, then type", answer: "___", reading: "___" },
    ],
  },
  {
    day: 64,
    title: "〜と おもいます — I think that",
    grammar: { name: "〜と おもいます", explain: "Plain form + と おもいます = 'I think that ___'. あした あめが ふると おもいます = I think it'll rain tomorrow. The quoted thought stays plain, even when polite." },
    vocab: [
      { text: "おもう", reading: "omou", meaning: "to think" },
      { text: "たぶん", reading: "tabun", meaning: "probably" },
      { text: "むずかしい", reading: "muzukashii", meaning: "difficult" },
      { text: "かんたん", reading: "kantan", meaning: "easy / simple" },
    ],
    examples: [
      { text: "にほんごは むずかしいと おもいます。", reading: "nihongo wa muzukashii to omoimasu", meaning: "I think Japanese is difficult." },
      { text: "たぶん こないと おもいます。", reading: "tabun konai to omoimasu", meaning: "I don't think (he) will come." },
    ],
    practice: [
      { prompt: "Say 'I think it's easy'", answer: "かんたんだと おもいます", reading: "kantan da to omoimasu" },
    ],
    note: "Before と, な-adjectives and nouns need だ: かんたん だ と おもいます.",
  },
  {
    day: 65,
    title: "〜と いいます — quoting speech",
    grammar: { name: "〜と いいます", explain: "Plain clause + と いいます = 'say that ___'. たなかさんは いくと いいました = Tanaka said he'll go. と marks the quote (like English quotation marks)." },
    vocab: [
      { text: "いう", reading: "iu", meaning: "to say" },
      { text: "なまえ", reading: "namae", meaning: "name" },
      { text: "なんと", reading: "nan to", meaning: "what (is it called)" },
      { text: "これ", reading: "kore", meaning: "this" },
    ],
    examples: [
      { text: "これは にほんごで なんと いいますか。", reading: "kore wa nihongo de nan to iimasu ka", meaning: "What is this called in Japanese?" },
    ],
    practice: [
      { prompt: "Ask 'What do you say in Japanese?' for something", answer: "にほんごで なんと いいますか", reading: "nihongo de nan to iimasu ka" },
    ],
    note: "にほんごで なんと いいますか is the single most useful phrase for learning new words in the wild.",
  },
  {
    day: 66,
    title: "〜でしょう / たぶん — probably",
    grammar: { name: "〜でしょう", explain: "Plain form + でしょう = 'probably / I suppose'. あした さむいでしょう = It'll probably be cold tomorrow. Softer, less certain than a plain statement." },
    vocab: [
      { text: "でしょう", reading: "deshō", meaning: "probably / right?" },
      { text: "たぶん", reading: "tabun", meaning: "probably" },
      { text: "あめ", reading: "ame", meaning: "rain" },
      { text: "はれ", reading: "hare", meaning: "clear weather" },
    ],
    examples: [
      { text: "あした あめが ふるでしょう。", reading: "ashita ame ga furu deshō", meaning: "It'll probably rain tomorrow." },
    ],
    practice: [
      { prompt: "Say 'It'll probably be hot tomorrow'", answer: "あした あついでしょう", reading: "ashita atsui deshō" },
    ],
    note: "With rising intonation, でしょう? also means 'right?' seeking agreement.",
  },
  {
    day: 67,
    title: "Transitive vs intransitive pairs",
    grammar: { name: "Paired verbs", explain: "Many verbs come in pairs: one you DO to something (transitive, を), one that just HAPPENS (intransitive, が). ドアを あけます (I open the door) vs ドアが あきます (the door opens)." },
    vocab: [
      { text: "あける", reading: "akeru", meaning: "to open (something)" },
      { text: "あく", reading: "aku", meaning: "to open (by itself)" },
      { text: "しめる", reading: "shimeru", meaning: "to close (something)" },
      { text: "しまる", reading: "shimaru", meaning: "to close (by itself)" },
      { text: "つける", reading: "tsukeru", meaning: "to turn on" },
    ],
    examples: [
      { text: "でんきを つけます。", reading: "denki o tsukemasu", meaning: "I turn on the light." },
      { text: "でんきが つきました。", reading: "denki ga tsukimashita", meaning: "The light came on." },
    ],
    practice: [
      { prompt: "Say 'I close the window' (transitive)", answer: "まどを しめます", reading: "mado o shimemasu" },
      { prompt: "Say 'The window closed' (intransitive)", answer: "まどが しまりました", reading: "mado ga shimarimashita" },
    ],
  },
  {
    day: 68,
    title: "Conditional ば",
    grammar: { name: "〜ば (if)", explain: "Another 'if': u-verbs final u→e+ば (いく→いけば), る-verbs drop る+れば (たべる→たべれば). い-adj: い→ければ (やすい→やすければ). Focuses on the condition." },
    vocab: [
      { text: "いけば", reading: "ikeba", meaning: "if (one) goes" },
      { text: "あれば", reading: "areba", meaning: "if there is" },
      { text: "やすければ", reading: "yasukereba", meaning: "if cheap" },
      { text: "べんきょうすれば", reading: "benkyō sureba", meaning: "if (one) studies" },
    ],
    examples: [
      { text: "べんきょうすれば、できます。", reading: "benkyō sureba, dekimasu", meaning: "If you study, you'll be able to do it." },
    ],
    practice: [
      { prompt: "Say 'If it's cheap, I'll buy it' using ば", answer: "やすければ、かいます", reading: "yasukereba, kaimasu" },
    ],
    note: "と, たら, ば, なら all mean 'if' with shades of nuance — たら is the safe everyday default.",
  },
  {
    day: 69,
    title: "〜なら — 'if that's the case'",
    grammar: { name: "〜なら", explain: "Noun/plain + なら = 'if it's the case that / speaking of'. にほんへ いくなら、きょうとが いいです = If you're going to Japan, Kyoto is good. Responds to context." },
    vocab: [
      { text: "なら", reading: "nara", meaning: "if / speaking of" },
      { text: "きょうと", reading: "Kyōto", meaning: "Kyoto" },
      { text: "おすすめ", reading: "osusume", meaning: "recommendation" },
      { text: "さかな", reading: "sakana", meaning: "fish" },
    ],
    examples: [
      { text: "さかななら、この みせが いちばんです。", reading: "sakana nara, kono mise ga ichiban desu", meaning: "If it's fish (you want), this shop is the best." },
    ],
    practice: [
      { prompt: "Say 'If it's coffee, that café is good'", answer: "コーヒーなら、あの カフェが いいです", reading: "kōhī nara, ano kafe ga ii desu" },
    ],
  },
  {
    day: 70,
    title: "Week 10 review — opinions & guesses",
    grammar: { name: "Put Week 10 together", explain: "You can state opinions (と思う), quote (と言う), guess (でしょう), handle transitive/intransitive pairs, and use more conditionals. Give a reasoned opinion." },
    vocab: [
      { text: "いけん", reading: "iken", meaning: "opinion" },
      { text: "りゆう", reading: "riyū", meaning: "reason" },
    ],
    examples: [
      { text: "にほんごは むずかしいと おもいますけど、べんきょうすれば はなせるように なると おもいます。", reading: "nihongo wa muzukashii to omoimasu kedo, benkyō sureba hanaseru yō ni naru to omoimasu", meaning: "I think Japanese is hard, but if you study, I think you'll become able to speak it." },
    ],
    practice: [
      { prompt: "Give an opinion with a reason using と思います and から/ば — out loud, then type", answer: "___と おもいます。___から。", reading: "___to omoimasu. ___kara" },
    ],
  },
  {
    day: 71,
    title: "Sentence-ending ね & よ",
    grammar: { name: "ね / よ", explain: "ね = seeking agreement/shared feeling ('right?/isn't it'): いい てんきですね. よ = informing, emphasis ('you know'): あそこですよ. They make speech sound natural, not robotic." },
    vocab: [
      { text: "ね", reading: "ne", meaning: "right? / isn't it" },
      { text: "よ", reading: "yo", meaning: "(emphasis) you know" },
      { text: "あそこ", reading: "asoko", meaning: "over there" },
      { text: "てんき", reading: "tenki", meaning: "weather" },
    ],
    examples: [
      { text: "いい てんきですね。", reading: "ii tenki desu ne", meaning: "Nice weather, isn't it." },
      { text: "でんしゃが きましたよ。", reading: "densha ga kimashita yo", meaning: "The train's here, you know." },
    ],
    practice: [
      { prompt: "Agree-seek: 'This is delicious, isn't it'", answer: "おいしいですね", reading: "oishii desu ne" },
    ],
    note: "Overusing よ can sound pushy; ね is the safer, friendlier default.",
  },
  {
    day: 72,
    title: "Casual questions",
    grammar: { name: "Dropping か", explain: "In casual speech, drop か and raise your tone: いく? = going? For nouns/な-adjectives, drop だ: すき? = you like it? Add の for a softer, curious question: どこ いくの?" },
    vocab: [
      { text: "の", reading: "no", meaning: "(soft question ending)" },
      { text: "ほんとう", reading: "hontō", meaning: "really / true" },
      { text: "だれ", reading: "dare", meaning: "who" },
      { text: "いつ", reading: "itsu", meaning: "when" },
    ],
    examples: [
      { text: "どこ いくの?", reading: "doko iku no", meaning: "Where are you going?" },
      { text: "ほんとう?", reading: "hontō", meaning: "Really?" },
    ],
    practice: [
      { prompt: "Ask a friend 'What are you eating?' (casual, with の)", answer: "なに たべてるの?", reading: "nani taberu no" },
    ],
    note: "の-questions sound gentle and curious; women use them freely, men often use plain plain-form or んだ.",
  },
  {
    day: 73,
    title: "〜んです — the explanatory tone",
    grammar: { name: "〜んです", explain: "Plain form + んです adds a nuance of explanation, reason, or shared context: おなかが いたいんです = (the thing is,) my stomach hurts. Softens statements and questions." },
    vocab: [
      { text: "いたい", reading: "itai", meaning: "painful / hurts" },
      { text: "おなか", reading: "onaka", meaning: "stomach" },
      { text: "どうして", reading: "dōshite", meaning: "why" },
      { text: "びょうき", reading: "byōki", meaning: "illness / sick" },
    ],
    examples: [
      { text: "どうして こなかったんですか。", reading: "dōshite konakatta n desu ka", meaning: "Why didn't you come? (I'm curious about the reason)" },
      { text: "びょうきだったんです。", reading: "byōki datta n desu", meaning: "(It's that) I was sick." },
    ],
    practice: [
      { prompt: "Explain 'It's that my stomach hurts'", answer: "おなかが いたいんです", reading: "onaka ga itai n desu" },
    ],
    note: "んです is everywhere in real conversation — it frames what you say as connected to the situation.",
  },
  {
    day: 74,
    title: "Quoting casually with って",
    grammar: { name: "〜って", explain: "Casual quote marker, replacing と いう / と: たなかさんは こないって = Tanaka says he's not coming. Also 'X means/is called Y': これ、なんて いうの?" },
    vocab: [
      { text: "って", reading: "tte", meaning: "(casual quote/topic)" },
      { text: "いみ", reading: "imi", meaning: "meaning" },
      { text: "なんて", reading: "nante", meaning: "what / how" },
      { text: "しってる", reading: "shitteru", meaning: "(I) know" },
    ],
    examples: [
      { text: "あした やすみだって。", reading: "ashita yasumi datte", meaning: "(I heard) tomorrow's a day off." },
    ],
    practice: [
      { prompt: "Say casually 'Tanaka said it's fun'", answer: "たなかさん、たのしいって", reading: "Tanaka-san, tanoshii tte" },
    ],
  },
  {
    day: 75,
    title: "Aizuchi — backchannels",
    grammar: { name: "Reacting naturally", explain: "Japanese conversation expects frequent short reactions (aizuchi) that show you're listening: うん, そうですね, なるほど, ほんとう?, すごい. Silence feels cold; sprinkle these in." },
    vocab: [
      { text: "そうですね", reading: "sō desu ne", meaning: "that's right / I see" },
      { text: "なるほど", reading: "naruhodo", meaning: "I see / makes sense" },
      { text: "すごい", reading: "sugoi", meaning: "wow / amazing" },
      { text: "たしかに", reading: "tashika ni", meaning: "indeed / true" },
      { text: "へえ", reading: "hē", meaning: "oh really / huh" },
    ],
    examples: [
      { text: "A: にほんへ いきました。 B: へえ、いいですね!", reading: "A: Nihon e ikimashita. B: hē, ii desu ne", meaning: "A: I went to Japan. B: Oh, nice!" },
    ],
    practice: [
      { prompt: "React to good news with two backchannels", answer: "へえ、いいですね!", reading: "hē, ii desu ne" },
    ],
    note: "Good aizuchi is the difference between 'correct Japanese' and 'natural conversation'.",
  },
  {
    day: 76,
    title: "Casual suggestions — 〜ない? / 〜よう",
    grammar: { name: "Casual invites", explain: "Invite casually with negative + rising tone: たべない? = wanna eat? The casual 'let's' (volitional): う-verbs final u→ō (のむ→のもう), る-verbs drop る+よう (たべる→たべよう). する→しよう, くる→こよう." },
    vocab: [
      { text: "いこう", reading: "ikō", meaning: "let's go (casual)" },
      { text: "たべよう", reading: "tabeyō", meaning: "let's eat (casual)" },
      { text: "のもう", reading: "nomō", meaning: "let's drink (casual)" },
      { text: "あそぶ", reading: "asobu", meaning: "to hang out / play" },
    ],
    examples: [
      { text: "こんばん のみに いかない?", reading: "konban nomi ni ikanai", meaning: "Wanna go for a drink tonight?" },
      { text: "うん、いこう!", reading: "un, ikō", meaning: "Yeah, let's go!" },
    ],
    practice: [
      { prompt: "Invite a friend casually 'Wanna eat?' then 'let's eat!'", answer: "たべない? — たべよう!", reading: "tabenai? — tabeyō" },
    ],
  },
  {
    day: 77,
    title: "Week 11 review — a casual chat",
    grammar: { name: "Put Week 11 together", explain: "You have ね/よ, casual questions, んです, って, aizuchi, and casual invites. Have a natural back-and-forth instead of stiff textbook lines." },
    vocab: [
      { text: "こんど", reading: "kondo", meaning: "next time / soon" },
      { text: "ぜひ", reading: "zehi", meaning: "by all means" },
    ],
    examples: [
      { text: "A: しゅうまつ ひま? B: うん、ひまだよ。 A: じゃあ、えいが みに いかない? B: いいね、いこう!", reading: "A: shūmatsu hima? B: un, hima da yo. A: jā, eiga mi ni ikanai? B: ii ne, ikō", meaning: "A: Free this weekend? B: Yeah, I'm free. A: Then wanna go see a movie? B: Nice, let's go!" },
    ],
    practice: [
      { prompt: "Have a 4-line casual exchange inviting a friend somewhere — out loud, then type", answer: "___", reading: "___" },
    ],
  },
  {
    day: 78,
    title: "Polite requests — 〜ていただけますか",
    grammar: { name: "〜ていただけますか", explain: "The polite way to ask a favor: te-form + いただけますか = 'could you please ___?'. まっていただけますか = could you please wait? More deferential than てください." },
    vocab: [
      { text: "いただけますか", reading: "itadakemasu ka", meaning: "could you please...?" },
      { text: "もういちど", reading: "mō ichido", meaning: "once more" },
      { text: "おしえる", reading: "oshieru", meaning: "to teach / tell" },
      { text: "かく", reading: "kaku", meaning: "to write" },
    ],
    examples: [
      { text: "もういちど いっていただけますか。", reading: "mō ichido itte itadakemasu ka", meaning: "Could you please say that once more?" },
    ],
    practice: [
      { prompt: "Ask politely 'Could you please teach/tell me?'", answer: "おしえていただけますか", reading: "oshiete itadakemasu ka" },
    ],
    note: "Use this with strangers, staff, and superiors — it's the workhorse polite request.",
  },
  {
    day: 79,
    title: "Keigo basics — honorific (respect others)",
    grammar: { name: "Honorific (尊敬語) basics", explain: "To respect the listener's actions, some verbs have special honorific forms: いる/いく/くる→いらっしゃる, たべる/のむ→めしあがる, いう→おっしゃる, みる→ごらんになる." },
    vocab: [
      { text: "いらっしゃる", reading: "irassharu", meaning: "(hon.) be / go / come" },
      { text: "めしあがる", reading: "meshiagaru", meaning: "(hon.) eat / drink" },
      { text: "おっしゃる", reading: "ossharu", meaning: "(hon.) say" },
      { text: "ごらんになる", reading: "goran ni naru", meaning: "(hon.) look / see" },
    ],
    examples: [
      { text: "なにを めしあがりますか。", reading: "nani o meshiagarimasu ka", meaning: "What will you have (to eat)? (respectful)" },
    ],
    practice: [
      { prompt: "Ask a guest respectfully 'Will you have coffee?'", answer: "コーヒーを めしあがりますか", reading: "kōhī o meshiagarimasu ka" },
    ],
    note: "Honorific = elevate the OTHER person. You'll mostly RECOGNIZE these; staff use them toward you constantly.",
  },
  {
    day: 80,
    title: "Keigo basics — humble (lower yourself)",
    grammar: { name: "Humble (謙譲語) basics", explain: "To be humble about YOUR own actions: する→いたす, いく/くる→まいる, いう→もうす, たべる/もらう→いただく, みる→はいけんする. お/ご + stem + する also humbles." },
    vocab: [
      { text: "いたす", reading: "itasu", meaning: "(humble) do" },
      { text: "まいる", reading: "mairu", meaning: "(humble) go / come" },
      { text: "もうす", reading: "mōsu", meaning: "(humble) say / be called" },
      { text: "いただく", reading: "itadaku", meaning: "(humble) receive / eat" },
    ],
    examples: [
      { text: "たなかと もうします。", reading: "Tanaka to mōshimasu", meaning: "My name is Tanaka. (humble self-intro)" },
      { text: "あした まいります。", reading: "ashita mairimasu", meaning: "I'll come tomorrow. (humble)" },
    ],
    practice: [
      { prompt: "Introduce yourself humbly: 'I'm called ___'", answer: "___と もうします", reading: "___ to mōshimasu" },
    ],
    note: "Humble = lower YOURSELF. Pair: you まいる, they いらっしゃる — same event, opposite politeness.",
  },
  {
    day: 81,
    title: "At a restaurant",
    grammar: { name: "Restaurant Japanese", explain: "Real phrases you'll use: ordering with を おねがいします / に します, asking おすすめは? (what's recommended?), and the bill おかいけい おねがいします." },
    vocab: [
      { text: "おねがいします", reading: "onegai shimasu", meaning: "please (I'd like)" },
      { text: "メニュー", reading: "menyū", meaning: "menu" },
      { text: "おすすめ", reading: "osusume", meaning: "recommendation" },
      { text: "おかいけい", reading: "okaikei", meaning: "the bill / check" },
      { text: "にします", reading: "ni shimasu", meaning: "I'll go with / decide on" },
    ],
    examples: [
      { text: "すみません、メニューを おねがいします。", reading: "sumimasen, menyū o onegai shimasu", meaning: "Excuse me, the menu please." },
      { text: "この ラーメンに します。", reading: "kono rāmen ni shimasu", meaning: "I'll go with this ramen." },
    ],
    practice: [
      { prompt: "Order: 'I'll have the coffee, please'", answer: "コーヒーを おねがいします", reading: "kōhī o onegai shimasu" },
      { prompt: "Ask for the check", answer: "おかいけい おねがいします", reading: "okaikei onegai shimasu" },
    ],
  },
  {
    day: 82,
    title: "Shopping",
    grammar: { name: "Shopping Japanese", explain: "Browsing and buying: ありますか (do you have?), みてもいいですか (may I look?), これ ください (I'll take this), クレジットカードは つかえますか (can I use a card?)." },
    vocab: [
      { text: "ください", reading: "kudasai", meaning: "please give me" },
      { text: "ありますか", reading: "arimasu ka", meaning: "do you have?" },
      { text: "つかえる", reading: "tsukaeru", meaning: "can use" },
      { text: "ふくろ", reading: "fukuro", meaning: "bag" },
      { text: "サイズ", reading: "saizu", meaning: "size" },
    ],
    examples: [
      { text: "これを ください。カードは つかえますか。", reading: "kore o kudasai. kādo wa tsukaemasu ka", meaning: "I'll take this. Can I use a card?" },
    ],
    practice: [
      { prompt: "Ask 'Do you have a bigger size?' (おおきい)", answer: "もっと おおきい サイズは ありますか", reading: "motto ōkii saizu wa arimasu ka" },
    ],
  },
  {
    day: 83,
    title: "On the phone / making a reservation",
    grammar: { name: "Phone & reservations", explain: "もしもし (hello on phone), よやくを おねがいします (I'd like to reserve), name + と もうします. Numbers of people: ひとり, ふたり, さんにん." },
    vocab: [
      { text: "もしもし", reading: "moshi moshi", meaning: "hello (phone)" },
      { text: "よやく", reading: "yoyaku", meaning: "reservation" },
      { text: "ふたり", reading: "futari", meaning: "two people" },
      { text: "なんじ", reading: "nanji", meaning: "what time" },
      { text: "なまえ", reading: "namae", meaning: "name" },
    ],
    examples: [
      { text: "こんばん しちじに ふたりで よやくを おねがいします。", reading: "konban shichiji ni futari de yoyaku o onegai shimasu", meaning: "I'd like a reservation for two at 7 tonight." },
    ],
    practice: [
      { prompt: "Reserve for two people at 6:00", answer: "ろくじに ふたりで よやくを おねがいします", reading: "rokuji ni futari de yoyaku o onegai shimasu" },
    ],
    note: "Counting people: ひとり(1), ふたり(2), then number+にん — さんにん(3), よにん(4).",
  },
  {
    day: 84,
    title: "Week 12 review — handle a real situation",
    grammar: { name: "Put Week 12 together", explain: "You can make polite requests, recognize keigo, and handle a restaurant, shop, and phone call. Role-play a full service interaction start to finish." },
    vocab: [
      { text: "しつれいします", reading: "shitsurei shimasu", meaning: "excuse me (formal) / goodbye" },
      { text: "ありがとうございました", reading: "arigatō gozaimashita", meaning: "thank you (for what was done)" },
    ],
    examples: [
      { text: "すみません、これを ふたつ ください。カードで おねがいします。ありがとうございました。", reading: "sumimasen, kore o futatsu kudasai. kādo de onegai shimasu. arigatō gozaimashita", meaning: "Excuse me, two of these please. By card, please. Thank you." },
    ],
    practice: [
      { prompt: "Role-play ordering, paying, and thanking at a café — out loud, then type", answer: "___", reading: "___" },
    ],
  },
  {
    day: 85,
    title: "Telling a story in the past",
    grammar: { name: "Narrating past events", explain: "String past actions with て / それから / そのあと, and add feeling with たのしかった / よかった. This is the backbone of casual storytelling." },
    vocab: [
      { text: "そのあと", reading: "sono ato", meaning: "after that" },
      { text: "さいしょに", reading: "saisho ni", meaning: "at first" },
      { text: "さいごに", reading: "saigo ni", meaning: "at the end / finally" },
      { text: "びっくりする", reading: "bikkuri suru", meaning: "to be surprised" },
    ],
    examples: [
      { text: "さいしょに ともだちに あって、いっしょに ごはんを たべて、そのあと えいがを みました。とても たのしかったです。", reading: "saisho ni tomodachi ni atte, issho ni gohan o tabete, sono ato eiga o mimashita. totemo tanoshikatta desu", meaning: "First I met a friend, we ate together, and after that watched a movie. It was really fun." },
    ],
    practice: [
      { prompt: "Tell a 4+ sentence story about a recent day out — out loud, then type", answer: "___", reading: "___" },
    ],
  },
  {
    day: 86,
    title: "Giving opinions with reasons",
    grammar: { name: "Opinions at length", explain: "Combine 〜と思います with から / し (and what's more) to argue a point: A is good. Because B. And also C. し stacks reasons casually." },
    vocab: [
      { text: "し", reading: "shi", meaning: "and (listing reasons)" },
      { text: "べんり", reading: "benri", meaning: "convenient" },
      { text: "ちかい", reading: "chikai", meaning: "close / near" },
      { text: "それに", reading: "sore ni", meaning: "moreover" },
    ],
    examples: [
      { text: "この アパートが いいと おもいます。えきに ちかいし、やすいですから。", reading: "kono apāto ga ii to omoimasu. eki ni chikai shi, yasui desu kara", meaning: "I think this apartment is good. It's near the station, and it's cheap." },
    ],
    practice: [
      { prompt: "Argue a preference with two reasons using し and から — out loud, then type", answer: "___が いいと おもいます。___し、___から。", reading: "___ga ii to omoimasu. ___shi, ___kara" },
    ],
  },
  {
    day: 87,
    title: "Asking for & giving directions",
    grammar: { name: "Directions", explain: "Ask どこですか / どうやって いきますか. Give with と (Day 59): まっすぐ いくと…, みぎに まがると…. Landmarks with に あります." },
    vocab: [
      { text: "どうやって", reading: "dō yatte", meaning: "how / by what means" },
      { text: "まっすぐ", reading: "massugu", meaning: "straight" },
      { text: "かど", reading: "kado", meaning: "corner" },
      { text: "しんごう", reading: "shingō", meaning: "traffic light" },
      { text: "えき", reading: "eki", meaning: "station" },
    ],
    examples: [
      { text: "えきは どこですか。 — まっすぐ いって、つぎの かどを みぎに まがると、あります。", reading: "eki wa doko desu ka. — massugu itte, tsugi no kado o migi ni magaru to, arimasu", meaning: "Where's the station? — Go straight, turn right at the next corner, and it's there." },
    ],
    practice: [
      { prompt: "Ask 'How do I get to the station?'", answer: "えきまで どうやって いきますか", reading: "eki made dō yatte ikimasu ka" },
    ],
  },
  {
    day: 88,
    title: "Talking about plans & the future",
    grammar: { name: "Plans — つもり / 〜たいと思っています", explain: "Plain verb + つもりです = 'I intend to'. 〜たいと おもっています = 'I've been wanting/hoping to'. For firmer future intentions than plain たい." },
    vocab: [
      { text: "つもり", reading: "tsumori", meaning: "intention / plan" },
      { text: "しょうらい", reading: "shōrai", meaning: "the future" },
      { text: "りゅうがく", reading: "ryūgaku", meaning: "study abroad" },
      { text: "はたらく", reading: "hataraku", meaning: "to work" },
    ],
    examples: [
      { text: "しょうらい にほんで はたらきたいと おもっています。", reading: "shōrai Nihon de hatarakitai to omotte imasu", meaning: "In the future, I'm hoping to work in Japan." },
      { text: "らいねん にほんへ いくつもりです。", reading: "rainen Nihon e iku tsumori desu", meaning: "I plan to go to Japan next year." },
    ],
    practice: [
      { prompt: "Say 'I intend to study Japanese next year'", answer: "らいねん にほんごを べんきょうする つもりです", reading: "rainen nihongo o benkyō suru tsumori desu" },
    ],
  },
  {
    day: 89,
    title: "Mock conversation day",
    grammar: { name: "Full conversation practice", explain: "No new grammar. Today, run whole conversations end to end in the Sensei tab: self-intro, small talk, a plan, a service interaction. Use everything from all 12 weeks." },
    vocab: [
      { text: "じつは", reading: "jitsu wa", meaning: "actually / to tell the truth" },
      { text: "たとえば", reading: "tatoeba", meaning: "for example" },
    ],
    examples: [
      { text: "はじめまして。ジョンと もうします。アメリカから きました。しゅみは りょうりで、しょうらい にほんで はたらきたいと おもっています。どうぞ よろしく おねがいします。", reading: "hajimemashite. Jon to mōshimasu. Amerika kara kimashita. shumi wa ryōri de, shōrai Nihon de hatarakitai to omotte imasu. dōzo yoroshiku onegai shimasu", meaning: "Nice to meet you. My name is John. I'm from America. My hobby is cooking, and I hope to work in Japan in the future. Pleased to meet you." },
    ],
    practice: [
      { prompt: "Give a full 5+ sentence self-introduction, then chat with Sensei — out loud first", answer: "___", reading: "___" },
    ],
    note: "Do this one in the Sensei tab — have a real back-and-forth, not just isolated sentences.",
  },
  {
    day: 90,
    title: "Final review — your 10-minute conversation",
    grammar: { name: "You made it — 90 days", explain: "No new grammar. Today is the finish line: hold a 10-minute conversation with Sensei across past, present, opinions, and plans. Then record yourself and compare to Day 1." },
    vocab: [
      { text: "おかげさまで", reading: "okagesama de", meaning: "thanks to you / I'm doing well" },
      { text: "これからも", reading: "kore kara mo", meaning: "from now on too" },
    ],
    examples: [
      { text: "さんかげつ にほんごを べんきょうしました。さいしょは ぜんぜん はなせませんでしたけど、いまは かんたんな かいわが できます。これからも つづけたいと おもいます。", reading: "sankagetsu nihongo o benkyō shimashita. saisho wa zenzen hanasemasen deshita kedo, ima wa kantan na kaiwa ga dekimasu. kore kara mo tsuzuketai to omoimasu", meaning: "I studied Japanese for three months. At first I couldn't speak at all, but now I can hold a simple conversation. I want to keep going from here." },
    ],
    practice: [
      { prompt: "Hold a 10-minute conversation with Sensei, then record yourself and play it next to your Day-1 recording", answer: "___", reading: "___" },
    ],
    note: "おつかれさまでした — well done. 90 days ago you knew nothing. Listen back to Day 1 and hear how far you've come.",
  },
];

/* ---------- languages ---------- */
export const LANGUAGES: Record<string, Language> = {
  ja: {
    code: "ja", name: "Japanese", nativeName: "日本語", ttsLang: "ja-JP",
    hasScript: true, kana: HIRAGANA, katakana: KATAKANA, weeks: JA_WEEKS, lessons: JA_LESSONS, ready: true,
  },
  es: {
    code: "es", name: "Spanish", nativeName: "Español", ttsLang: "es-ES",
    hasScript: false, kana: null, katakana: null, weeks: [], lessons: [], ready: false,
  },
  ko: {
    code: "ko", name: "Korean", nativeName: "한국어", ttsLang: "ko-KR",
    hasScript: false, kana: null, katakana: null, weeks: [], lessons: [], ready: false,
  },
};

export const DEFAULT_LANG = "ja";
