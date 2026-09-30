// Cloudflare Pages Function — /api/publish
// Secure proxy to the Roblox Open Cloud Place Publishing API

// ── CONFIG ──────────────────────────────────────────────────────────
// Replace with your actual Cloudflare Pages domain after first deploy.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',        // Vite dev server
  'http://localhost:4173',        // Vite preview
  // 'https://your-project.pages.dev',  // ← uncomment & replace after deploy
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  // Reflect the origin back only if it's in the allow-list
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// ── OPTIONS (CORS preflight) ────────────────────────────────────────
export async function onRequestOptions(context) {
  const cors = getCorsHeaders(context.request);
  return new Response(null, { status: 204, headers: cors });
}

// ── POST (publish .rbxlx to Roblox) ────────────────────────────────
export async function onRequestPost(context) {
  const { request } = context;
  const cors = getCorsHeaders(request);

  // ── Origin gate ───────────────────────────────────────────────────
  const origin = request.headers.get('Origin') || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return jsonResponse(403, { error: `Forbidden origin: ${origin}` }, cors);
  }

  try {
    // ── Extract FormData fields ─────────────────────────────────────
    const formData   = await request.formData();
    const rbxlx      = formData.get('rbxlx');        // the .rbxlx XML string
    const robloxKey  = formData.get('roblox_key');    // Roblox Open Cloud API key
    const universeId = formData.get('universe_id');   // numeric Universe ID
    const placeId    = formData.get('place_id');      // numeric Place ID

    if (!rbxlx || !robloxKey || !universeId || !placeId) {
      return jsonResponse(400, {
        error: 'Missing required fields',
        expected: ['rbxlx', 'roblox_key', 'universe_id', 'place_id'],
      }, cors);
    }

    // ── Forward to Roblox Open Cloud API ────────────────────────────
    const robloxUrl =
      `https://apis.roblox.com/universes/v1/${universeId}/places/${placeId}/versions?versionType=Published`;

    const robloxRes = await fetch(robloxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'x-api-key': robloxKey,
      },
      body: rbxlx,
    });

    // ── Parse Roblox response ───────────────────────────────────────
    const rawText = await robloxRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    if (!robloxRes.ok) {
      return jsonResponse(robloxRes.status, {
        error: 'Roblox API error',
        status: robloxRes.status,
        details: data,
      }, cors);
    }

    return jsonResponse(200, data, cors);

  } catch (err) {
    return jsonResponse(500, {
      error: 'Internal server error',
      message: err.message,
    }, cors);
  }
}

// ── Helper ──────────────────────────────────────────────────────────
function jsonResponse(status, body, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
