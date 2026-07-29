import {
  MILESTONE_CODES,
  ensureVisitor,
  getCounts,
  getEffectiveGlobalPhase,
  getVisitor,
  globalFilesForPhase,
  json,
  nextThreshold,
  visitorCookie
} from "../../_lib/arg.js";

export async function onRequestGet(context) {
  const db = context.env.ARG_DB;
  if (!db) return json({ error: "The incursion registry is not connected." }, 503);

  const visitor = getVisitor(context.request);
  await ensureVisitor(db, visitor.id);
  const counts = await getCounts(db, visitor.id);
  const globalPhase = await getEffectiveGlobalPhase(db, counts.global);

  const [specialResult, unlockResult] = await db.batch([
    db.prepare(
      `SELECT ribbon_no FROM arg_encounters
       WHERE visitor_id = ?1 AND ribbon_no IN (1,2,3,4,5,404,616,2500)
       ORDER BY ribbon_no`
    ).bind(visitor.id),
    db.prepare(
      `SELECT file_slug FROM arg_code_unlocks
       WHERE visitor_id = ?1 ORDER BY unlocked_at`
    ).bind(visitor.id)
  ]);

  const encounteredSpecials = (specialResult.results || []).map((row) => Number(row.ribbon_no));
  const unlockedFiles = (unlockResult.results || []).map((row) => String(row.file_slug));
  if (counts.personal >= 100 && !unlockedFiles.includes("carcosa")) unlockedFiles.push("carcosa");

  const issuedCodes = MILESTONE_CODES
    .filter((item) => counts.personal >= item.threshold)
    .map(({ threshold, code, title }) => ({ threshold, code, title }));

  const unlockedGlobalFiles = globalFilesForPhase(globalPhase.id)
    .map(({ slug, title, phase }) => ({ slug, title, phase }));

  const headers = visitor.isNew ? { "Set-Cookie": visitorCookie(visitor.id) } : {};
  return json({
    personalCount: counts.personal,
    globalConfirmedCount: counts.global,
    totalRawScans: counts.rawScans,
    nextThreshold: nextThreshold(counts.personal),
    accessConsoleUnlocked: counts.personal >= 5,
    issuedCodes,
    encounteredSpecials,
    unlockedFiles,
    unlockedGlobalFiles,
    globalPhase: {
      id: globalPhase.id,
      threshold: globalPhase.threshold,
      name: globalPhase.name,
      status: globalPhase.status,
      vector: globalPhase.vector,
      bulletin: globalPhase.bulletin,
      question: globalPhase.question,
      footer: globalPhase.footer
    }
  }, 200, headers);
}
