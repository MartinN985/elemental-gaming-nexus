import {
  adminAuthorized,
  getEffectiveGlobalPhase,
  getPhaseOverride,
  json,
  phaseForCount
} from "../../_lib/arg.js";

export async function onRequestGet(context) {
  if (!adminAuthorized(context)) return json({ error: "Unauthorized." }, 401);
  const db = context.env.ARG_DB;
  if (!db) return json({ error: "The incursion registry is not connected." }, 503);

  const [visitors, encounters, scans, ribbons, specials, recent] = await db.batch([
    db.prepare(`SELECT COUNT(DISTINCT visitor_id) AS count FROM arg_encounters`),
    db.prepare(`SELECT COUNT(*) AS count FROM arg_encounters`),
    db.prepare(`SELECT COALESCE(SUM(scan_count),0) AS count FROM arg_encounters`),
    db.prepare(`SELECT COUNT(DISTINCT ribbon_no) AS count FROM arg_encounters`),
    db.prepare(
      `SELECT ribbon_no, COUNT(*) AS unique_browsers, SUM(scan_count) AS raw_scans
       FROM arg_encounters
       WHERE ribbon_no IN (1,2,3,4,5,404,616,2500)
       GROUP BY ribbon_no ORDER BY ribbon_no`
    ),
    db.prepare(
      `SELECT ribbon_no, COUNT(*) AS unique_browsers, SUM(scan_count) AS raw_scans,
              MAX(last_seen) AS last_seen
       FROM arg_encounters
       GROUP BY ribbon_no
       ORDER BY last_seen DESC LIMIT 25`
    )
  ]);

  const globalConfirmedCount = Number(encounters.results?.[0]?.count || 0);
  const phase = await getEffectiveGlobalPhase(db, globalConfirmedCount);
  const override = await getPhaseOverride(db);
  const automatic = phaseForCount(globalConfirmedCount);

  return json({
    uniqueBrowsers: Number(visitors.results?.[0]?.count || 0),
    globalConfirmedCount,
    totalRawScans: Number(scans.results?.[0]?.count || 0),
    ribbonsEncountered: Number(ribbons.results?.[0]?.count || 0),
    specialRibbons: specials.results || [],
    recentRibbons: recent.results || [],
    globalPhase: {
      effective: phase.id,
      automatic: automatic.id,
      override,
      name: phase.name
    }
  });
}
