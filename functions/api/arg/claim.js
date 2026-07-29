import {
  SPECIAL_REDIRECTS,
  ensureVisitor,
  getCounts,
  getVisitor,
  json,
  normalizeToken,
  registerInvalidAttempt,
  sha256Hex,
  visitorCookie
} from "../../_lib/arg.js";

export async function onRequestPost(context) {
  const db = context.env.ARG_DB;
  if (!db) return json({ error: "The incursion registry is not connected." }, 503);

  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid signal packet." }, 400); }

  const token = normalizeToken(body.token);
  if (!token) return json({ error: "The signal identifier is malformed." }, 400);

  const tokenHash = await sha256Hex(token);
  const tokenRow = await db.prepare(
    `SELECT ribbon_no, active FROM arg_tokens WHERE token_hash = ?1`
  ).bind(tokenHash).first();

  if (!tokenRow || Number(tokenRow.active) !== 1) {
    const rate = await registerInvalidAttempt(db, context.request);
    if (rate.blocked) {
      return json({ error: "Too many fabricated signals. Try again later." }, 429, { "Retry-After": "900" });
    }
    return json({ error: "Incursion point not recognized." }, 404);
  }

  const visitor = getVisitor(context.request);
  const ribbonNo = Number(tokenRow.ribbon_no);
  await ensureVisitor(db, visitor.id);

  const insert = await db.prepare(
    `INSERT OR IGNORE INTO arg_encounters (visitor_id, ribbon_no)
     VALUES (?1, ?2)`
  ).bind(visitor.id, ribbonNo).run();

  const newEncounter = Number(insert.meta?.changes || 0) > 0;
  if (!newEncounter) {
    await db.prepare(
      `UPDATE arg_encounters
       SET scan_count = scan_count + 1, last_seen = CURRENT_TIMESTAMP
       WHERE visitor_id = ?1 AND ribbon_no = ?2`
    ).bind(visitor.id, ribbonNo).run();
  }

  const counts = await getCounts(db, visitor.id);
  const redirect = SPECIAL_REDIRECTS.get(ribbonNo) || "/y/";
  const headers = visitor.isNew ? { "Set-Cookie": visitorCookie(visitor.id) } : {};

  return json({
    ribbonNumber: ribbonNo,
    newEncounter,
    personalCount: counts.personal,
    globalConfirmedCount: counts.global,
    redirect
  }, 200, headers);
}
