import {
  EXTRA_CODES,
  MILESTONE_CODES,
  getCounts,
  getVisitor,
  json,
  normalizeCode
} from "../../_lib/arg.js";

const CODE_MAP = new Map(
  [...MILESTONE_CODES, ...EXTRA_CODES].map((item) => [normalizeCode(item.code), item])
);

export async function onRequestPost(context) {
  const db = context.env.ARG_DB;
  if (!db) return json({ error: "The archive is not connected." }, 503);

  const visitor = getVisitor(context.request);
  if (visitor.isNew) return json({ error: "No encounter record exists for this browser." }, 403);

  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid access request." }, 400); }

  const code = normalizeCode(body.code);
  const record = CODE_MAP.get(code);
  if (!record) return json({ error: "ACCESS STRING REJECTED" }, 404);

  const counts = await getCounts(db, visitor.id);
  if (counts.personal < record.threshold) {
    return json({ error: `CORROBORATION THRESHOLD NOT MET // ${record.threshold} REQUIRED` }, 403);
  }

  await db.prepare(
    `INSERT OR IGNORE INTO arg_code_unlocks (visitor_id, file_slug, entered_code)
     VALUES (?1, ?2, ?3)`
  ).bind(visitor.id, record.slug, code).run();

  return json({
    accepted: true,
    title: record.title,
    redirect: `/y/file/${record.slug}`
  });
}
