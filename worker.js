export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/generate' && request.method === 'POST') {
      return handleGenerate(request, env);
    }

    if (url.pathname === '/api/track-copy' && request.method === 'POST') {
      return handleTrackCopy(request, env);
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      return handleStats(env);
    }

    // Everything else falls through to the static site (index.html, app.html, images, etc.)
    return env.ASSETS.fetch(request);
  }
};

async function handleGenerate(request, env) {
  const cors = { 'Content-Type': 'application/json' };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400, headers: cors });
  }

  const content = (body.content || '').trim();
  if (content.length < 50) {
    return new Response(JSON.stringify({ error: 'Paste at least a few sentences of real content.' }), { status: 400, headers: cors });
  }
  if (content.length > 8000) {
    return new Response(JSON.stringify({ error: 'That\u2019s a lot of text \u2014 trim it to under 8,000 characters.' }), { status: 400, headers: cors });
  }

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server is not configured yet (missing API key).' }), { status: 500, headers: cors });
  }

  const systemPrompt = `You repurpose a piece of writing into platform-native drafts that sound like the original author, not a generic AI. Never use corporate buzzwords ("leverage", "in today's fast-paced world", "unlock", "seamless"). Write like a person talking to people who already know the topic.

Return ONLY raw JSON, no markdown code fences, no commentary, in exactly this shape:
{"twitter": "1/ first tweet\\n2/ second tweet\\n3/ third tweet", "linkedin": "single linkedin post as one string with \\n\\n between paragraphs"}

Twitter thread: 4 to 6 numbered tweets ("1/", "2/", ...), each under 280 characters, hook first, one idea per tweet.
LinkedIn post: 100 to 200 words, natural paragraph breaks, no hashtag spam, ends with one genuine question or takeaway \u2014 not "thoughts?".`;

  try {
    const apiRes = await callClaudeWithRetry(env, systemPrompt, content);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return new Response(JSON.stringify({ error: 'Upstream ' + apiRes.status + ': ' + errText.slice(0, 400) }), { status: 502, headers: cors });
    }

    const data = await apiRes.json();
    const raw = data.content?.[0]?.text || '';

    let drafts;
    try {
      drafts = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('no json in response');
      drafts = JSON.parse(match[0]);
    }

    return new Response(JSON.stringify(drafts), { headers: cors });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), { status: 500, headers: cors });
  }
}

// 초안 수정률 추적: 원문을 저장하지 않고, "복사 시점에 수정됐는지" boolean만
// 플랫폼별로 카운트한다 (Phase 2 스펙 — 프라이버시 부담을 최소화하는 쪽으로 설계).
// KV read-then-write라 완전히 원자적이진 않음 — 동시 요청이 아주 많아지면
// Durable Objects나 D1로 옮기는 게 정확하지만, 지금 트래픽 수준에선 이 정도로 충분함.
async function handleTrackCopy(request, env) {
  const cors = { 'Content-Type': 'application/json' };

  if (!env.STATS_KV) {
    // KV 네임스페이스를 아직 안 붙였어도 복사 기능 자체는 절대 막으면 안 되므로 조용히 무시.
    return new Response(JSON.stringify({ ok: false, reason: 'KV not bound yet' }), { headers: cors });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 400, headers: cors });
  }

  const platform = body.platform === 'linkedin' ? 'linkedin' : 'twitter';
  const key = `stats:${platform}:${body.edited ? 'edited' : 'unedited'}`;

  const current = parseInt(await env.STATS_KV.get(key)) || 0;
  await env.STATS_KV.put(key, String(current + 1));

  return new Response(JSON.stringify({ ok: true }), { headers: cors });
}

async function handleStats(env) {
  const cors = { 'Content-Type': 'application/json' };

  if (!env.STATS_KV) {
    return new Response(JSON.stringify({ error: 'KV not bound yet' }), { headers: cors });
  }

  const result = {};
  for (const platform of ['twitter', 'linkedin']) {
    const edited = parseInt(await env.STATS_KV.get(`stats:${platform}:edited`)) || 0;
    const unedited = parseInt(await env.STATS_KV.get(`stats:${platform}:unedited`)) || 0;
    const total = edited + unedited;
    result[platform] = {
      edited,
      unedited,
      total,
      editedPct: total ? Math.round((edited / total) * 100) : null
    };
  }

  return new Response(JSON.stringify(result), { headers: cors });
}

async function callClaudeWithRetry(env, systemPrompt, content, attempt = 1) {
  const apiRes = await fetch('https://gateway.ai.cloudflare.com/v1/00ef26b84c4145eeb5224b57252e6273/loosecopy/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content }]
    })
  });

  if (!apiRes.ok && attempt < 2) {
    await new Promise(r => setTimeout(r, 3000));
    return callClaudeWithRetry(env, systemPrompt, content, attempt + 1);
  }

  return apiRes;
}
