/* Loosecopy finder — "Tell me what you need" (2026-11-10).
   Type what you want in your own words (English or Korean) and get the 1-3 pages that do it.
   Plain matching rules, no AI, nothing sent anywhere — except a tool request, and only when you press the button. */
(function () {
  'use strict';
  if (window.__lcFinder) return;
  window.__lcFinder = true;

  var FORM = 'https://formspree.io/f/xdeoqjkw';
  var T = 'Tool', C = 'Check', G = 'Guide';
  // u: link · t: title · d: one plain line · c: kind · k: what people type (symptoms, Korean, typos)
  var PAGES = [
    { u: '/app', c: T, t: 'Check my post — all 21 checks at once', d: 'Paste a post and see what to fix before you publish. No AI, instant.',
      k: ['check my post', 'check my draft', 'check before posting', 'proofread', 'review my post', 'pre publish check', 'all checks', 'is my post ok', '글 검사', '초안 검사', '게시 전 점검', '포스트 점검', '글 점검', '맞춤법', '올리기 전에', '링크드인 글 점검', '트윗 점검'] },
    { u: '/app', c: T, t: 'Turn notes into an X thread and a LinkedIn post', d: 'Paste notes or a blog post; get two drafts to edit. This one uses AI.',
      k: ['repurpose', 'blog to thread', 'turn blog into thread', 'linkedin post from notes', 'write a post for me', 'generate post', 'ai draft', 'make a thread', '블로그를 스레드로', '스레드 만들기', '링크드인 글 만들기', '글 생성', '초안 만들기', '재가공', '글 써줘'] },
    { u: '/app', c: T, t: 'Split a long post into an X thread', d: 'Paste it, press “Just check it”, then “Copy for X” — it becomes a numbered thread that fits.',
      k: ['tweet too long', 'too long for twitter', 'too long for x', 'split into thread', 'thread splitter', 'character limit', '280 characters', 'over the limit', '트윗 너무 길어', '글자수 초과', '글자 수 초과', '스레드 나누기', '스레드로 나누기', '트위터 글자수', '280자', '글자수 세기'] },
    { u: '/app#voiceBox', c: T, t: 'Teach the drafter your voice', d: 'Paste one post you wrote yourself, once, and AI drafts follow your tone.',
      k: ['sound like me', 'my voice', 'my writing style', 'voice profile', 'match my tone', '내 말투', '말투 기억', '내 문체', '나답게', '내 스타일'] },
    { u: '/hidden-character-checker', c: C, t: 'Remove hidden characters (U+202F, zero-width)', d: 'Finds and cleans invisible characters that AI tools leave in text. Keeps emoji intact.',
      k: ['hidden characters', 'invisible characters', 'weird spaces', 'strange spaces', 'weird spaces from chatgpt', 'chatgpt spaces', 'u+202f', '202f', 'zero width', 'zero-width space', 'narrow no-break space', 'hashtag broken', '이상한 공백', '숨은 문자', '보이지 않는 문자', '특수 공백', '공백 문자', '챗gpt 공백', '띄어쓰기 이상'] },
    { u: '/chatgpt-hidden-characters', c: G, t: 'ChatGPT hidden characters: watermark or not?', d: 'What those odd spaces are, which models add them, and how to remove them.',
      k: ['chatgpt watermark', 'is chatgpt watermarking text', 'hidden watermark', 'ai watermark', '워터마크', '챗gpt 워터마크'] },
    { u: '/ai-authenticity-checker', c: C, t: 'Does this sound like AI?', d: 'Flags the phrases readers associate with AI writing, so you can say them your way.',
      k: ['sounds like ai', 'sound like ai', 'ai phrases', 'ai sounding', 'robotic', 'chatgpt sounding', 'ai tells', 'delve', 'game changer', 'ai 같은', 'ai처럼', 'ai 말투', '챗gpt 같은 표현', '기계 같은'] },
    { u: '/got-flagged-as-ai', c: G, t: 'Flagged as AI-written? What to do next', d: 'Someone said your post was written by AI. How to respond and what to change.',
      k: ['flagged as ai', 'accused of ai', 'called ai', 'they said ai wrote it', 'ai accusation', 'ai로 오해', 'ai라고 의심', 'ai 판정', 'ai가 썼다고'] },
    { u: '/ai-detectors-explained', c: G, t: 'Why AI detectors flag human writing', d: 'Why detectors misfire — especially on second-language English.',
      k: ['ai detector', 'gptzero', 'turnitin', 'false positive', 'detector wrong', 'ai 탐지기', '탐지기 오탐'] },
    { u: '/reads-like-a-translation', c: C, t: 'Does it sound translated? (stiff, formal tone)', d: 'Finds stiff, overly formal phrasing that reads like a translation.',
      k: ['sounds translated', 'too formal', 'stiff', 'awkward english', 'unnatural english', 'non native', 'translation', '번역투', '딱딱한 영어', '어색한 영어', '번역한 것 같은', '자연스러운 영어'] },
    { u: '/passive-voice-checker', c: C, t: 'Passive voice checker', d: 'Finds sentences that hide who did the action.',
      k: ['passive voice', 'passive', 'active voice', 'was done by', '수동태', '능동태'] },
    { u: '/jargon-checker', c: C, t: 'Jargon & acronym checker', d: 'Finds jargon and unexplained acronyms your readers may not know.',
      k: ['jargon', 'acronym', 'acronyms', 'buzzword', 'buzzwords', 'technical terms', 'plain english', '전문용어', '약어', '어려운 단어', '업계 용어'] },
    { u: '/readability-score', c: C, t: 'Readability score (Flesch-Kincaid)', d: 'How easy your post is to read, and which sentences to shorten.',
      k: ['readability', 'reading level', 'grade level', 'flesch', 'hard to read', 'long sentences', '가독성', '읽기 쉬운지', '문장이 길어', '문장 길이'] },
    { u: '/wall-of-text-checker', c: C, t: 'Wall of text checker', d: 'Finds paragraphs too long to read on a phone.',
      k: ['wall of text', 'long paragraph', 'paragraph length', 'line breaks', 'too dense', '문단 길이', '줄바꿈', '긴 문단', '문단 나누기'] },
    { u: '/hook-checker', c: C, t: 'Hook checker: test your opening line', d: 'Is the first line strong enough to stop the scroll?',
      k: ['hook', 'opening line', 'first line', 'headline', 'grab attention', 'see more', '첫 문장', '후킹', '도입부', '첫줄', '첫 줄'] },
    { u: '/sounds-generic', c: C, t: 'Generic writing checker', d: 'Finds vague lines and suggests adding a number, a name or a date.',
      k: ['generic', 'vague', 'bland', 'boring', 'not specific', 'add specifics', '뻔한', '구체적', '밋밋한', '평범한'] },
    { u: '/emoji-checker', c: C, t: 'Emoji checker', d: 'Too many emoji, or ones that read differently across platforms.',
      k: ['emoji', 'emojis', 'too many emoji', 'emoticon', '이모지', '이모티콘'] },
    { u: '/hashtag-checker', c: C, t: 'Hashtag checker', d: 'How many hashtags, and whether they are readable and not broken.',
      k: ['hashtag', 'hashtags', 'how many hashtags', '#', '해시태그'] },
    { u: '/link-placement-checker', c: C, t: 'LinkedIn link: post or first comment?', d: 'Checks where your link sits and what it may do to reach.',
      k: ['link in comments', 'link placement', 'linkedin link', 'first comment', 'link reach', 'external link', '링크 위치', '링크 댓글', '링크드인 링크', '링크 넣어도'] },
    { u: '/linkedin-link-in-comments', c: G, t: 'Should LinkedIn links go in the comments?', d: 'What the 2026 data says about links and reach on LinkedIn.',
      k: ['does linkedin penalize links', 'linkedin algorithm links', 'links reduce reach', '링크드인 알고리즘', '링크 넣으면 노출'] },
    { u: '/markdown-cleanup-checker', c: C, t: 'Remove markdown before posting', d: 'Finds ** and ### marks that show up as symbols on LinkedIn and X.',
      k: ['markdown', 'asterisks', '**', 'stars in my post', 'bold not working', 'formatting symbols', '###', 'placeholder', '마크다운', '별표', '굵게 안됨', '별표가 보여', '서식 기호'] },
    { u: '/number-unit-checker', c: C, t: 'Lakh & crore to million, plus 만/億', d: 'Converts big numbers to the way English readers say them.',
      k: ['lakh', 'crore', 'lakh to million', 'million', 'billion', 'convert numbers', 'big numbers', 'currency', '억', '천만', '백만', '만원', '만 명', '조 단위', '억 영어로', '숫자 영어로', '万', '億', '원 달러'] },
    { u: '/privacy-leak-checker', c: C, t: 'Privacy leak checker', d: 'Finds emails, phone numbers, API keys and card numbers before you post.',
      k: ['privacy', 'personal info', 'email in post', 'phone number', 'api key', 'password', 'secret key', 'token', '개인정보', '전화번호', '이메일 노출', 'api 키', '비밀번호', '카드번호'] },
    { u: '/structural-ai-tell-checker', c: C, t: 'AI writing patterns: em dashes & rhythm', d: 'Spots the sentence patterns that make text feel machine-made.',
      k: ['em dash', 'em dashes', 'rhythm', 'rule of three', 'sentence pattern', 'not x but y', '엠대시', '대시', '문장 리듬'] },
    { u: '/unattributed-stat-checker', c: C, t: 'Unsourced statistic checker', d: 'Finds numbers and percentages with no source attached.',
      k: ['statistic', 'statistics', 'stats', 'source', 'citation', 'percent', 'data source', '통계', '출처', '퍼센트', '근거'] },
    { u: '/date-format-checker', c: C, t: 'Ambiguous date checker', d: 'Is 03/04 March 4 or April 3? Finds dates readers can misread.',
      k: ['date format', '03/04', 'mm/dd', 'dd/mm', 'date confusion', 'american date', '날짜 형식', '날짜 표기'] },
    { u: '/time-ambiguity-checker', c: C, t: 'Missing time zone checker', d: 'Finds times like 9 AM with no time zone, and words like “tomorrow”.',
      k: ['time zone', 'timezone', 'pst', 'est', 'webinar time', 'what time', '시간대', '시차', '몇 시'] },
    { u: '/absolute-claims-checker', c: C, t: 'Overconfident claims checker', d: 'Finds “always”, “never”, “guaranteed” and other too-sure wording.',
      k: ['always', 'never', 'guaranteed', 'overclaim', 'absolute claims', 'too confident', '과장', '단정', '확실하다고'] },
    { u: '/rhetorical-question-checker', c: C, t: 'Rhetorical question checker', d: 'Finds filler questions like “Ever wondered why…?”.',
      k: ['rhetorical question', 'too many questions', 'ever wondered', '수사 의문문', '질문이 많'] },
    { u: '/ai-disclosure-helper', c: T, t: 'AI disclosure statement generator', d: 'Writes a short, honest line about how you used AI.',
      k: ['ai disclosure', 'disclose ai', 'made with ai', 'ai label', 'ai 사용 표시', 'ai 고지', 'ai 사용 밝히기'] },
    { u: '/disclosure-decision-tool', c: T, t: 'Do I need to disclose AI use?', d: 'Answer a few questions and see whether a disclosure makes sense.',
      k: ['need to disclose', 'should i disclose', 'must i say i used ai', 'ai 사용 공개해야', '밝혀야 하나'] },
    { u: '/ai-disclosure-policies', c: G, t: 'AI disclosure rules: X, LinkedIn, Meta & Google', d: 'What each platform actually requires.',
      k: ['platform rules', 'linkedin ai policy', 'meta ai label', 'youtube ai label', 'google ai policy', '플랫폼 정책', 'ai 규정'] },
    { u: '/does-disclosure-help', c: G, t: 'Does disclosing AI use help or hurt trust?', d: 'What studies say about readers and AI disclosure.',
      k: ['does disclosure hurt', 'trust and ai', 'disclosure trust', '신뢰', '공개하면 손해'] },
    { u: '/ai-glossary', c: G, t: 'AI content glossary', d: 'Plain-English meanings of the AI terms you keep seeing.',
      k: ['glossary', 'what does it mean', 'ai terms', 'definition', '용어', '용어 사전', '뜻'] },
    { u: '/before-you-paste', c: G, t: 'Before you paste notes into an AI drafter', d: '5 minutes of prep so you edit less afterwards.',
      k: ['prompt tips', 'before using ai', 'prepare notes', 'better ai drafts', '준비', 'ai에 넣기 전', '프롬프트'] },
    { u: '/fact-check-ai-draft', c: G, t: 'Fact-check an AI draft in 5 minutes', d: 'A quick routine for catching made-up facts.',
      k: ['fact check', 'fact-check', 'hallucination', 'made up facts', 'verify', '팩트체크', '사실 확인', '환각'] },
    { u: '/make-it-sound-like-you', c: G, t: 'Make AI writing sound like you', d: 'Practical edits that put your voice back into a draft.',
      k: ['sound more human', 'humanize', 'personal tone', 'make it human', '사람처럼', '자연스럽게'] },
    { u: '/why-platforms-differ', c: G, t: 'X thread vs LinkedIn post: why they differ', d: 'Why the same idea needs a different shape on each platform.',
      k: ['twitter vs linkedin', 'x vs linkedin', 'platform differences', '플랫폼 차이'] },
    { u: '/pre-publish-checklist', c: G, t: 'Pre-publish checklist', d: 'A short list to run through before you post.',
      k: ['checklist', 'before posting checklist', '체크리스트', '게시 전 체크'] },
    { u: '/post-journal', c: T, t: 'Post journal: track what you publish', d: 'A private log of what you posted and how it did. Stays in your browser.',
      k: ['journal', 'log my posts', 'track posts', 'what worked', 'post results', '기록', '포스트 기록', '성과 기록', '일지'] },
    { u: '/report-an-issue', c: T, t: 'Report a problem or ask for a tool', d: 'Something broken or missing? Tell us.',
      k: ['bug', 'problem', 'broken', 'not working', 'feedback', 'contact', 'feature request', '문의', '버그', '오류', '안돼요', '요청'] },
    { u: '/data-handling', c: G, t: 'Where your text actually goes', d: 'What stays in your browser and what (rarely) leaves it.',
      k: ['is my text sent', 'is it safe', 'data', 'privacy of my text', 'stored', '데이터', '내 글 저장', '안전한지'] },
    { u: '/trust', c: G, t: 'What we’ll never build', d: 'The promises behind Loosecopy.',
      k: ['promise', 'trust', 'ethics', '약속'] },
    { u: '/about', c: G, t: 'About Loosecopy', d: 'Who makes it and why.',
      k: ['about', 'who made this', 'who makes loosecopy', '만든 사람', '소개'] },
    { u: '/changelog', c: G, t: 'What’s new', d: 'Every change, newest first.',
      k: ['new', 'updates', 'changelog', 'what changed', '새 기능', '업데이트', '변경'] },
    { u: '/privacy-policy', c: G, t: 'Privacy policy', d: 'Cookies, ads and what is stored.',
      k: ['privacy policy', 'cookies', 'gdpr', '개인정보처리방침', '쿠키'] }
  ];
  var STOP = { the: 1, a: 1, an: 1, to: 1, my: 1, is: 1, of: 1, in: 1, on: 1, for: 1, how: 1, do: 1, i: 1, it: 1, this: 1, that: 1, what: 1, with: 1, and: 1, or: 1, can: 1, me: 1, your: 1, you: 1, are: 1, be: 1, does: 1,
    '어떻게': 1, '방법': 1, '좀': 1, '너무': 1, '하는': 1, '하고': 1, '싶어요': 1, '싶어': 1 };
  var PARTICLE = /(?:에서는|으로는|에서|으로|하는|하기|해요|해줘|하고|이랑|까지|부터|에게|한테|이나|처럼|보다|은|는|이|가|을|를|에|의|도|로|와|과|요)$/;

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFKC').replace(/[’‘`]/g, "'")
      .replace(/[^\p{L}\p{N}#%+'\/:.\- ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  }
  function tokens(s) {
    return norm(s).split(' ').map(function (t) {
      if (t.length > 1 && /[가-힣]$/.test(t)) { var b = t.replace(PARTICLE, ''); return b || t; }
      return t;
    }).filter(function (t) { return t && !STOP[t]; });
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  var IDX = PAGES.map(function (p) {
    var phrases = [p.t].concat(p.k).map(norm);
    var toks = {};
    phrases.forEach(function (ph) { ph.split(' ').forEach(function (t) { if (t && !STOP[t]) toks[t] = 1; }); });
    return { p: p, phrases: phrases, toks: Object.keys(toks) };
  });
  function score(e, qn, qt) {
    var s = 0;
    e.phrases.forEach(function (ph) {
      if (!ph) return;
      if (ph === qn) s = Math.max(s, 100);
      else if (ph.length >= 2 && (' ' + qn + ' ').indexOf(' ' + ph + ' ') >= 0) s = Math.max(s, 70 + Math.min(ph.length, 20));
      else if (ph.length >= 1 && /[^\x00-\x7f]/.test(ph) && qn.indexOf(ph) >= 0) s = Math.max(s, 66 + Math.min(ph.length, 20));   // Korean: "억을" still means 억
      else if (qn.length >= 3 && ph.indexOf(qn) === 0) s = Math.max(s, 55 + Math.min(qn.length, 20));
      else if (qn.length >= 4 && ph.indexOf(qn) > 0) s = Math.max(s, 45 + Math.min(qn.length, 20));
    });
    var t = 0, words = 0, covered = 0;
    qt.forEach(function (q) {
      if (q.length < 2) return;
      words++;
      var best = 0;
      for (var i = 0; i < e.toks.length; i++) {
        var w = e.toks[i];
        if (w === q) { best = 12; break; }
        if (q.length >= 3 && w.indexOf(q) === 0) best = Math.max(best, 8);
        else if (q.length >= 4 && lev(q, w) <= (q.length >= 7 ? 2 : 1)) best = Math.max(best, 7);   // typos: "pasive", "linkdin"
      }
      t += best;
      if (best >= 7) covered++;
    });
    if (words && covered === words) t += 10;   // every word you typed matched (allowing a typo) — trust it more
    return s + t;
  }
  function search(q) {
    var qn = norm(q), qt = tokens(q);
    if (!qn) return [];
    return IDX.map(function (e) { return { e: e, s: score(e, qn, qt) }; })
      .filter(function (x) { return x.s >= 20; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 3).map(function (x) { return x.e.p; });
  }
  function looksLikeDraft(q) { return q.length > 140 || /\n/.test(q.trim()) || (q.match(/[.!?。！？](\s|$)/g) || []).length >= 3; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function markUsed() { try { localStorage.setItem('lc_finder_used', String(Date.now())); } catch (e) {} }
  var onApp = /^\/app\/?$/.test(location.pathname);

  var css = '' +
    '.lcf-open{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border:1px solid var(--border);background:var(--paper-card);color:var(--ink);border-radius:var(--radius-sm,10px);font:600 0.85rem Inter,sans-serif;cursor:pointer;white-space:nowrap}' +
    '.lcf-open:hover{border-color:var(--accent);color:var(--accent)}' +
    '.lcf-kbd{font:0.72rem "Space Mono",monospace;color:var(--ink-soft);border:1px solid var(--border);border-radius:5px;padding:0 5px;background:var(--paper)}' +
    '@media (max-width:640px){.lcf-open-text,.lcf-kbd{display:none}.lcf-open{width:34px;padding:0;justify-content:center}}' +
    '.lcf{position:relative;text-align:left}' +
    '.lcf-label{display:block;font-weight:600;font-size:0.92rem;margin:0 0 6px;color:var(--ink)}' +
    '.lcf-field{display:flex;align-items:center;gap:8px;background:var(--paper-card);border:1px solid var(--border);border-radius:var(--radius-sm,10px);padding:0 12px}' +
    '.lcf-field:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-wash)}' +
    '.lcf-field input{flex:1;min-width:0;border:none;background:transparent;color:var(--ink);font:1rem Inter,sans-serif;padding:12px 0;outline:none}' +
    '.lcf-field input::placeholder{color:var(--ink-soft);opacity:1}' +
    '.lcf-field input::-webkit-search-cancel-button{cursor:pointer}' +
    '.lcf-icon{color:var(--ink-soft);flex-shrink:0}' +
    '.lcf-list{list-style:none;margin:6px 0 0;padding:4px;background:var(--paper-card);border:1px solid var(--border);border-radius:var(--radius-sm,10px);box-shadow:var(--shadow-md,0 8px 24px rgba(0,0,0,.12))}' +
    '.lcf-list[hidden],.lcf-extra[hidden]{display:none}' +
    '.lcf-inline .lcf-list{position:absolute;left:0;right:0;z-index:30}' +
    '.lcf-opt{display:flex;flex-direction:column;gap:2px;padding:9px 10px;border-radius:8px;cursor:pointer}' +
    '.lcf-opt[aria-selected="true"],.lcf-opt:hover{background:var(--accent-wash)}' +
    '.lcf-opt-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    '.lcf-opt-title{font-weight:600;color:var(--ink);font-size:0.94rem}' +
    '.lcf-kind{font:700 0.68rem "Space Mono",monospace;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);border:1px solid var(--border);border-radius:999px;padding:0 6px}' +
    '.lcf-opt-desc{font-size:0.84rem;color:var(--ink-soft)}' +
    '.lcf-opt[aria-selected="true"] .lcf-opt-desc,.lcf-opt:hover .lcf-opt-desc,.lcf-opt[aria-selected="true"] .lcf-kind,.lcf-opt:hover .lcf-kind{color:var(--ink)}' +
    '.lcf-extra{margin-top:8px;font-size:0.9rem;color:var(--ink);background:var(--paper-card);border:1px solid var(--border);border-radius:var(--radius-sm,10px);padding:10px 12px}' +
    '.lcf-extra p{margin:0 0 8px}.lcf-extra p:last-child{margin:0}' +
    '.lcf-extra .lcf-go{background:var(--accent);color:var(--paper-card);border:none;border-radius:var(--radius-sm,10px);padding:8px 14px;font:600 0.9rem Inter,sans-serif;cursor:pointer;min-height:40px}' +
    '.lcf-note{font-size:0.8rem;color:var(--ink-soft)}' +
    '.lcf-chips{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:0.82rem;color:var(--ink-soft)}' +
    '.lcf-chips button{background:var(--paper-card);border:1px solid var(--border);color:var(--ink);border-radius:999px;padding:4px 10px;font:0.82rem Inter,sans-serif;cursor:pointer;min-height:32px}' +
    '.lcf-chips button:hover{border-color:var(--accent);color:var(--accent)}' +
    '.lcf-overlay{position:fixed;inset:0;z-index:100;background:rgba(10,12,20,.5);display:flex;align-items:flex-start;justify-content:center;padding:10vh 16px 16px}' +
    '.lcf-overlay[hidden]{display:none}' +
    '.lcf-dialog{width:min(560px,100%);max-height:80vh;overflow:auto;background:var(--paper);border:1px solid var(--border);border-radius:var(--radius-md,16px);box-shadow:0 20px 50px rgba(0,0,0,.25);padding:14px 16px 16px}' +
    '.lcf-dialog-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}' +
    '.lcf-dialog-head h2{font:700 1.05rem Sora,sans-serif;margin:0;color:var(--ink)}' +
    '.lcf-close{background:none;border:none;color:var(--ink-soft);font-size:1.4rem;cursor:pointer;width:40px;height:40px;border-radius:8px}' +
    '.lcf-close:hover{background:var(--paper-card);color:var(--ink)}' +
    '.lcf-hint{font-size:0.8rem;color:var(--ink-soft);margin:10px 0 0}' +
    '.lcf-inline-wrap{margin-top:18px;max-width:520px}' +
    '@media (pointer:coarse){.lcf-field input{font-size:max(16px,1rem)}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var ICON = '<svg class="lcf-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var uid = 0;

  function mount(root, mode) {
    var n = ++uid;
    var inline = mode === 'inline';
    root.classList.add('lcf');
    if (inline) root.classList.add('lcf-inline');
    root.innerHTML =
      '<label class="lcf-label" for="lcf-in-' + n + '">' + (inline ? 'Tell me what you need — I’ll find the right tool' : 'What do you need?') + '</label>' +
      '<div class="lcf-field">' + ICON + '<input id="lcf-in-' + n + '" type="search" role="combobox" aria-expanded="false" aria-controls="lcf-list-' + n + '" aria-autocomplete="list" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" placeholder="e.g. tweet too long · weird spaces from ChatGPT · 억 영어로"></div>' +
      '<ul class="lcf-list" id="lcf-list-' + n + '" role="listbox" aria-label="Matching tools" hidden></ul>' +
      '<div class="lcf-extra" aria-live="polite" hidden></div>' +
      (inline ? '<div class="lcf-chips"><span>Try:</span><button type="button">weird spaces from ChatGPT</button><button type="button">does this sound like AI</button><button type="button">lakh to million</button></div>' : '');
    var inp = root.querySelector('input'), list = root.querySelector('.lcf-list'), extra = root.querySelector('.lcf-extra');
    var results = [], active = -1, lastQ = '';

    function setActive(i) {
      active = i;
      [].forEach.call(list.children, function (li, j) { li.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      if (i >= 0 && list.children[i]) inp.setAttribute('aria-activedescendant', list.children[i].id);
      else inp.removeAttribute('aria-activedescendant');
    }
    function hideAll() { list.hidden = true; list.innerHTML = ''; extra.hidden = true; inp.setAttribute('aria-expanded', 'false'); results = []; setActive(-1); }
    function render() {
      var q = inp.value;
      lastQ = q;
      if (!q.trim()) { hideAll(); return; }
      if (looksLikeDraft(q)) {
        list.hidden = true; list.innerHTML = ''; inp.setAttribute('aria-expanded', 'false'); results = []; setActive(-1);
        extra.innerHTML = '<p>That looks like a post, not a search.</p><p><button type="button" class="lcf-go" data-draft>Check this post now</button></p>';
        extra.hidden = false;
        extra.querySelector('[data-draft]').addEventListener('click', function () { checkDraft(q); });
        return;
      }
      results = search(q);
      if (results.length) {
        extra.hidden = true;
        list.innerHTML = results.map(function (p, i) {
          return '<li class="lcf-opt" role="option" id="lcf-' + n + '-' + i + '" aria-selected="false" data-i="' + i + '"><span class="lcf-opt-top"><span class="lcf-opt-title">' + esc(p.t) + '</span><span class="lcf-kind">' + p.c + '</span></span><span class="lcf-opt-desc">' + esc(p.d) + '</span></li>';
        }).join('');
        list.hidden = false;
        inp.setAttribute('aria-expanded', 'true');
        setActive(0);
        [].forEach.call(list.children, function (li) {
          li.addEventListener('mousedown', function (e) { e.preventDefault(); });   // keep focus in the box
          li.addEventListener('click', function () { go(results[+li.dataset.i]); });
        });
      } else {
        list.hidden = true; list.innerHTML = ''; inp.setAttribute('aria-expanded', 'false'); setActive(-1);
        extra.innerHTML = '<p>No tool for that yet.</p><p><button type="button" class="lcf-go" data-ask>Ask us to build it</button> <span class="lcf-note">Sends only the words you typed above.</span></p>';
        extra.hidden = false;
        extra.querySelector('[data-ask]').addEventListener('click', function (e) { ask(q, e.currentTarget); });
      }
    }
    function ask(q, btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
      var fd = new FormData();
      fd.append('message', 'Tool request from the finder: "' + q.slice(0, 500) + '"');
      fd.append('_subject', 'Loosecopy tool request');
      fd.append('page', location.pathname);
      fetch(FORM, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); extra.innerHTML = '<p><strong>Thanks — request sent.</strong> We read every one; popular requests get built first.</p>'; })
        .catch(function () { extra.innerHTML = '<p>Couldn’t send that right now. You can also use <a href="/report-an-issue">Report a problem</a>.</p>'; });
    }
    inp.addEventListener('input', render);
    inp.addEventListener('compositionend', render);
    inp.addEventListener('keydown', function (e) {
      if (e.isComposing || e.keyCode === 229) return;   // Korean/Japanese input: Enter here only finishes the syllable
      if (e.key === 'ArrowDown' && results.length) { e.preventDefault(); setActive((active + 1) % results.length); }
      else if (e.key === 'ArrowUp' && results.length) { e.preventDefault(); setActive((active - 1 + results.length) % results.length); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (inp.value !== lastQ) render();
        if (results.length) go(results[Math.max(0, active)]);
        else if (looksLikeDraft(inp.value)) checkDraft(inp.value);
      } else if (e.key === 'Escape') {
        if (inp.value) { e.preventDefault(); e.stopPropagation(); inp.value = ''; hideAll(); }
      }
    });
    if (inline) {
      inp.addEventListener('blur', function () { setTimeout(function () { if (!root.contains(document.activeElement)) { list.hidden = true; inp.setAttribute('aria-expanded', 'false'); } }, 150); });
      inp.addEventListener('focus', function () { if (results.length) { list.hidden = false; inp.setAttribute('aria-expanded', 'true'); } });
      [].forEach.call(root.querySelectorAll('.lcf-chips button'), function (b) {
        b.addEventListener('click', function () { inp.value = b.textContent; render(); inp.focus(); });
      });
    }
    return { input: inp, reset: function () { inp.value = ''; hideAll(); } };
  }

  function go(p) {
    if (!p) return;
    markUsed();
    var path = p.u.split('#')[0], hash = p.u.split('#')[1];
    if (onApp && path === '/app') {
      closeOverlay();
      var el = hash ? document.getElementById(hash) : document.getElementById('input');
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: hash ? 'start' : 'center' }); if (!hash) el.focus({ preventScroll: true }); }
      return;
    }
    location.href = p.u;
  }
  function checkDraft(text) {
    markUsed();
    if (onApp && window.lcFinderCheck) { closeOverlay(); window.lcFinderCheck(text); return; }
    try { localStorage.setItem('lc_handoff', JSON.stringify({ text: text, t: Date.now() })); } catch (e) {}
    location.href = '/app';
  }

  // ----- header button + overlay (Ctrl/⌘+K, or "/") -----
  var overlay = null, overlayFinder = null, opener = null;
  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lcf-overlay';
    overlay.hidden = true;
    overlay.innerHTML = '<div class="lcf-dialog" role="dialog" aria-modal="true" aria-labelledby="lcf-title"><div class="lcf-dialog-head"><h2 id="lcf-title">Find a tool</h2><button type="button" class="lcf-close" aria-label="Close">&times;</button></div><div class="lcf-body"></div><p class="lcf-hint">Describe it in your own words — English or Korean. Enter opens the first match. Esc closes.</p></div>';
    document.body.appendChild(overlay);
    overlayFinder = mount(overlay.querySelector('.lcf-body'), 'overlay');
    overlay.querySelector('.lcf-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeOverlay(); });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); return; }
      if (e.key !== 'Tab') return;
      var f = [].filter.call(overlay.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"])'), function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }
  function openOverlay() {
    if (!overlay) buildOverlay();
    if (!overlay.hidden) { overlayFinder.input.focus(); return; }
    opener = document.activeElement;
    overlay.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    overlayFinder.reset();
    overlayFinder.input.focus();
  }
  function closeOverlay() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.style.overflow = '';
    if (opener && opener.focus && document.contains(opener)) opener.focus({ preventScroll: true });
  }
  window.lcFinderOpen = openOverlay;
  window.lcFinderSearch = function (q) { var qn = norm(q), qt = tokens(q); return IDX.map(function (e) { return { t: e.p.t, s: score(e, qn, qt) }; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 5); };

  function isTyping(el) { return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)); }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openOverlay(); return; }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) { e.preventDefault(); openOverlay(); }
  });

  function init() {
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
    [].forEach.call(document.querySelectorAll('[data-lc-finder-slot]'), function (slot) {
      slot.innerHTML = '<button type="button" class="lcf-open" aria-haspopup="dialog" aria-label="Find a tool" title="Find a tool (' + (mac ? '⌘K' : 'Ctrl+K') + ')">' + ICON + '<span class="lcf-open-text">Find a tool</span><kbd class="lcf-kbd">' + (mac ? '⌘K' : 'Ctrl K') + '</kbd></button>';
      slot.querySelector('button').addEventListener('click', openOverlay);
    });
    [].forEach.call(document.querySelectorAll('[data-lc-finder="inline"]'), function (el) { mount(el, 'inline'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
