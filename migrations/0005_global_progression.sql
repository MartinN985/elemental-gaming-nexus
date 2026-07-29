CREATE TABLE IF NOT EXISTS arg_settings (
  setting_key TEXT PRIMARY KEY,
  setting_value TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO arg_settings (setting_key, setting_value)
VALUES ('global_phase_override', NULL);

UPDATE arg_tokens
SET special_slug = 'atlanta-assessment'
WHERE ribbon_no = 2500;
