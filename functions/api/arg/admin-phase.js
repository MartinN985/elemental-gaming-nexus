import { GLOBAL_PHASES, adminAuthorized, json } from "../../_lib/arg.js";

export async function onRequestPost(context) {
  if (!adminAuthorized(context)) return json({ error: "Unauthorized." }, 401);
  const db = context.env.ARG_DB;
  if (!db) return json({ error: "The incursion registry is not connected." }, 503);

  let body;
  try { body = await context.request.json(); }
  catch { return json({ error: "Invalid control request." }, 400); }

  const requested = body.phase;
  if (requested === null || requested === "" || requested === "automatic") {
    await db.prepare(
      `INSERT INTO arg_settings (setting_key, setting_value, updated_at)
       VALUES ('global_phase_override', NULL, CURRENT_TIMESTAMP)
       ON CONFLICT(setting_key) DO UPDATE SET setting_value = NULL, updated_at = CURRENT_TIMESTAMP`
    ).run();
    return json({ accepted: true, override: null });
  }

  const phase = Number(requested);
  if (!Number.isInteger(phase) || phase < 0 || phase >= GLOBAL_PHASES.length) {
    return json({ error: "Unknown phase." }, 400);
  }

  await db.prepare(
    `INSERT INTO arg_settings (setting_key, setting_value, updated_at)
     VALUES ('global_phase_override', ?1, CURRENT_TIMESTAMP)
     ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP`
  ).bind(String(phase)).run();

  return json({ accepted: true, override: phase, name: GLOBAL_PHASES[phase].name });
}
