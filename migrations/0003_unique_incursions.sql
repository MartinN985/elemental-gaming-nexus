CREATE TABLE IF NOT EXISTS arg_tokens (
  ribbon_no INTEGER PRIMARY KEY CHECK (ribbon_no BETWEEN 1 AND 2500),
  token_hash TEXT NOT NULL UNIQUE,
  special_slug TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arg_visitors (
  visitor_id TEXT PRIMARY KEY,
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arg_encounters (
  visitor_id TEXT NOT NULL,
  ribbon_no INTEGER NOT NULL,
  first_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  scan_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (visitor_id, ribbon_no),
  FOREIGN KEY (visitor_id) REFERENCES arg_visitors(visitor_id),
  FOREIGN KEY (ribbon_no) REFERENCES arg_tokens(ribbon_no)
);

CREATE TABLE IF NOT EXISTS arg_code_unlocks (
  visitor_id TEXT NOT NULL,
  file_slug TEXT NOT NULL,
  entered_code TEXT NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visitor_id, file_slug),
  FOREIGN KEY (visitor_id) REFERENCES arg_visitors(visitor_id)
);

CREATE TABLE IF NOT EXISTS arg_invalid_attempts (
  fingerprint TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_arg_encounters_ribbon ON arg_encounters(ribbon_no);
CREATE INDEX IF NOT EXISTS idx_arg_encounters_last_seen ON arg_encounters(last_seen);
CREATE INDEX IF NOT EXISTS idx_arg_unlocks_visitor ON arg_code_unlocks(visitor_id);
