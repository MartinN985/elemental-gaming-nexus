export const VISITOR_COOKIE = "egn_arg_visitor_v3";
export const TOKEN_PATTERN = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}$/;
export const MAX_AGE = 60 * 60 * 24 * 365 * 2;

export const SPECIAL_REDIRECTS = new Map([
  [1, "/y/special/0001"],
  [2, "/y/special/0002"],
  [3, "/y/special/0003"],
  [4, "/y/special/0004"],
  [5, "/y/special/0005"],
  [404, "/y/special/0404"],
  [616, "/y/616/"],
  [2500, "/y/special/2500"]
]);

export const MILESTONE_CODES = [
  { threshold: 5, code: "WITNESS", slug: "warning", title: "Initial warning" },
  { threshold: 10, code: "LOSTREEL", slug: "lost-reel", title: "Lost reel report" },
  { threshold: 25, code: "VECTOR", slug: "restricted-vector", title: "Restricted vector file" },
  { threshold: 50, code: "TWINMOON", slug: "two-moons", title: "Astronomical evidence" }
];

export const EXTRA_CODES = [
  { threshold: 5, code: "THEPLAY", slug: "program", title: "Recovered program" }
];

export const FILE_REQUIREMENTS = {
  "warning": { type: "code", threshold: 5 },
  "lost-reel": { type: "code", threshold: 10 },
  "restricted-vector": { type: "code", threshold: 25 },
  "two-moons": { type: "code", threshold: 50 },
  "program": { type: "code", threshold: 5 },
  "carcosa": { type: "count", threshold: 100 }
};

export const GLOBAL_PHASES = [
  {
    id: 0,
    threshold: 0,
    name: "INITIAL DETECTION",
    status: "ACTIVE",
    vector: "UNKNOWN",
    bulletin: [],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "SIGNAL CLASSIFICATION // UNRESOLVED"
  },
  {
    id: 1,
    threshold: 25,
    name: "ANOMALOUS SIGNAL EVENT",
    status: "ACTIVE",
    vector: "UNKNOWN",
    bulletin: [
      "MULTIPLE INDEPENDENT OBSERVERS CONFIRMED.",
      "INCIDENT CLASSIFICATION UPDATED: ANOMALOUS SIGNAL EVENT."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "SIGNAL CLASSIFICATION // ANOMALOUS"
  },
  {
    id: 2,
    threshold: 50,
    name: "ACTIVE SPREAD",
    status: "SPREADING",
    vector: "UNKNOWN",
    bulletin: [
      "INCIDENT IS SPREADING.",
      "TRANSMISSION VECTOR: UNKNOWN.",
      "INITIAL RESPONSE TEAM: EN ROUTE."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "RESPONSE STATUS // TEAM EN ROUTE"
  },
  {
    id: 3,
    threshold: 100,
    name: "VECTOR CONFIRMED",
    status: "ACTIVE",
    vector: "IMAGE",
    bulletin: [
      "SINGLE CONFIRMATION OF THE VECTOR RECEIVED.",
      "AN IMAGE APPEARS TO BE INFECTING THE MINDS OF THOSE WHO SEE IT."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "VECTOR CLASSIFICATION // IMAGE"
  },
  {
    id: 4,
    threshold: 250,
    name: "UNSTABLE CONTAINMENT",
    status: "ACTIVE",
    vector: "IMAGE",
    bulletin: [
      "INCURSION STATUS: ACTIVE.",
      "CONTAINMENT STATUS: UNSTABLE."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "CONTAINMENT STATUS // UNSTABLE"
  },
  {
    id: 5,
    threshold: 500,
    name: "SECONDARY VECTORS",
    status: "COMPROMISED",
    vector: "OBSERVATION",
    bulletin: [
      "SECONDARY VECTORS CONFIRMED.",
      "CONTAINMENT PERIMETER: COMPROMISED."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "CONTAINMENT STATUS // COMPROMISED"
  },
  {
    id: 6,
    threshold: 1000,
    name: "NETWORK PROPAGATION",
    status: "FAILED",
    vector: "OBSERVATION",
    bulletin: [
      "VECTOR HAS APPEARED ON THE INTERNET.",
      "LOCAL CONTAINMENT HAS FAILED.",
      "RECOGNITION CASCADE IN PROGRESS."
    ],
    question: "WHAT COULD THIS BE REFERRING TO?",
    footer: "CONTAINMENT STATUS // FAILED"
  },
  {
    id: 7,
    threshold: 2500,
    name: "UNCONTAINED SPREAD",
    status: "UNCONTAINED",
    vector: "OBSERVATION",
    bulletin: [
      "UNCONTAINED SPREAD.",
      "LOCAL RESPONSE HAS FAILED.",
      "ALL OBSERVERS MUST BE CONSIDERED POTENTIAL TRANSMISSION VECTORS."
    ],
    question: "YOU ALREADY KNOW WHAT THIS REFERS TO.",
    footer: "GLOBAL RISK LEVEL // HIGH"
  }
];

export const GLOBAL_FILES = [
  { slug: "situation-report-01", title: "Situation Report 01", phase: 1 },
  { slug: "situation-report-02", title: "Situation Report 02", phase: 2 },
  { slug: "situation-report-03", title: "Situation Report 03", phase: 3 },
  { slug: "field-notice", title: "Field Notice", phase: 4 },
  { slug: "vector-analysis", title: "Vector Analysis", phase: 5 },
  { slug: "network-propagation", title: "Network Propagation Report", phase: 6 },
  { slug: "containment-failure", title: "Containment Failure Notice", phase: 6 },
  { slug: "static-protocols", title: "Static Protocols", phase: 7 }
];

export const htmlHeaders = {
  "Content-Type": "text/html; charset=UTF-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "same-origin",
  "X-Content-Type-Options": "nosniff"
};

export const jsonHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff"
};

export function json(value, status = 200, extraHeaders = {}) {
  return Response.json(value, {
    status,
    headers: { ...jsonHeaders, ...extraHeaders }
  });
}

export function html(value, status = 200, extraHeaders = {}) {
  return new Response(value, {
    status,
    headers: { ...htmlHeaders, ...extraHeaders }
  });
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function parseCookies(request) {
  const output = {};
  const raw = request.headers.get("Cookie") || "";
  raw.split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index < 1) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    try { output[key] = decodeURIComponent(value); }
    catch { output[key] = value; }
  });
  return output;
}

export function getVisitor(request) {
  const cookies = parseCookies(request);
  const existing = cookies[VISITOR_COOKIE];
  if (existing && /^[a-f0-9-]{36}$/i.test(existing)) {
    return { id: existing, isNew: false };
  }
  return { id: crypto.randomUUID(), isNew: true };
}

export function visitorCookie(visitorId) {
  return `${VISITOR_COOKIE}=${encodeURIComponent(visitorId)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

export async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeToken(value) {
  const token = String(value || "").trim().toUpperCase();
  return TOKEN_PATTERN.test(token) ? token : "";
}

export function normalizeCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 40);
}

export async function ensureVisitor(db, visitorId) {
  await db.prepare(
    `INSERT INTO arg_visitors (visitor_id)
     VALUES (?1)
     ON CONFLICT(visitor_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`
  ).bind(visitorId).run();
}

export async function getCounts(db, visitorId) {
  const [personalRow, globalRow, rawRow] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS count FROM arg_encounters WHERE visitor_id = ?1`).bind(visitorId),
    db.prepare(`SELECT COUNT(*) AS count FROM arg_encounters`),
    db.prepare(`SELECT COALESCE(SUM(scan_count), 0) AS count FROM arg_encounters`)
  ]);

  return {
    personal: Number(personalRow.results?.[0]?.count || 0),
    global: Number(globalRow.results?.[0]?.count || 0),
    rawScans: Number(rawRow.results?.[0]?.count || 0)
  };
}

export function nextThreshold(personal) {
  return [5, 10, 25, 50, 100].find((value) => personal < value) || null;
}

export function phaseForCount(globalCount) {
  const count = Math.max(0, Number(globalCount) || 0);
  return [...GLOBAL_PHASES].reverse().find((phase) => count >= phase.threshold) || GLOBAL_PHASES[0];
}

export async function getPhaseOverride(db) {
  try {
    const row = await db.prepare(
      `SELECT setting_value FROM arg_settings WHERE setting_key = 'global_phase_override'`
    ).first();
    if (!row || row.setting_value === null || row.setting_value === "") return null;
    const value = Number(row.setting_value);
    return Number.isInteger(value) && value >= 0 && value < GLOBAL_PHASES.length ? value : null;
  } catch {
    // The site remains usable before migration 0005 is applied.
    return null;
  }
}

export async function getEffectiveGlobalPhase(db, globalCount) {
  const automatic = phaseForCount(globalCount);
  const override = await getPhaseOverride(db);
  if (override === null) return { ...automatic, automaticId: automatic.id, overridden: false };
  return { ...GLOBAL_PHASES[override], automaticId: automatic.id, overridden: true };
}

export function globalFilesForPhase(phaseId) {
  const id = Math.max(0, Number(phaseId) || 0);
  return GLOBAL_FILES.filter((file) => file.phase <= id);
}

export function pageShell({ title, eyebrow = "INCIDENT ARCHIVE", body, bodyClass = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="robots" content="noindex, nofollow, noarchive">
  <meta name="theme-color" content="#d6b936">
  <link rel="stylesheet" href="/assets/css/yellow-sign-v3.css?v=2">
</head>
<body class="${escapeHtml(bodyClass)}">
  <main class="arg-shell">
    <section class="arg-panel file-panel">
      <a class="micro-return" href="/y/">RETURN TO INCIDENT</a>
      <p class="arg-kicker">${escapeHtml(eyebrow)}</p>
      ${body}
    </section>
  </main>
</body>
</html>`;
}

export function deniedPage() {
  return pageShell({
    title: "Record unavailable",
    eyebrow: "ACCESS FAILURE",
    body: `
      <h1 class="file-title">Record unavailable</h1>
      <p class="file-copy">This browser has not encountered the required incursion point.</p>
      <div class="terminal-rule"></div>
      <p class="terminal-line">NO CORROBORATING SIGNATURE FOUND.</p>`
  });
}

export async function requireEncounter(db, visitorId, ribbonNo) {
  const row = await db.prepare(
    `SELECT 1 AS found FROM arg_encounters
     WHERE visitor_id = ?1 AND ribbon_no = ?2`
  ).bind(visitorId, ribbonNo).first();
  return Boolean(row);
}

export function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "unknown";
}

export async function registerInvalidAttempt(db, request) {
  const fingerprint = await sha256Hex(`${clientIp(request)}|${request.headers.get("User-Agent") || ""}`);
  const now = Math.floor(Date.now() / 1000);
  const windowSeconds = 15 * 60;
  const row = await db.prepare(
    `SELECT window_start, attempts FROM arg_invalid_attempts WHERE fingerprint = ?1`
  ).bind(fingerprint).first();

  if (!row || now - Number(row.window_start) >= windowSeconds) {
    await db.prepare(
      `INSERT INTO arg_invalid_attempts (fingerprint, window_start, attempts)
       VALUES (?1, ?2, 1)
       ON CONFLICT(fingerprint) DO UPDATE SET window_start = excluded.window_start, attempts = 1`
    ).bind(fingerprint, now).run();
    return { blocked: false, attempts: 1 };
  }

  const attempts = Number(row.attempts) + 1;
  await db.prepare(
    `UPDATE arg_invalid_attempts SET attempts = ?2 WHERE fingerprint = ?1`
  ).bind(fingerprint, attempts).run();

  return { blocked: attempts > 20, attempts };
}

export function adminAuthorized(context) {
  const expected = context.env.ARG_ADMIN_KEY;
  const supplied = (context.request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  return Boolean(expected && supplied === expected);
}
