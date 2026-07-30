# ARG Preview Setup

This document is specific to the current Elemental Gaming Nexus repository.

Wrangler version verified while writing this file: **4.114.0**

Production must remain untouched. Use only the `egn-arg-test` database and Preview secrets/bindings.

---

## Inspection report (current repository)

### 1. Framework and build command

- Stack: static HTML/CSS/JS site plus a Cloudflare Worker entry (`src/worker.js`)
- Local preview script: `npm run preview` → `python -m http.server 8000`
- Build: `npm run build` → `node scripts/build.mjs` (copies public files into `dist/`)
- Deploy script: `npm run deploy` → `npx wrangler deploy`
- No React/Next/Astro/etc.

### 2. Cloudflare Pages / Workers configuration

Git-connected Workers build currently expected:

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Output consumed by Wrangler: `./dist` via `wrangler.jsonc` `assets.directory`

Important architectural note:

- ARG dynamic routes live under `functions/` as **Cloudflare Pages Functions** (`onRequest` / `onRequestPost`)
- The current deploy path publishes a **Worker + static assets**, and `src/worker.js` only handles apex→www and `/go` redirects, then serves assets
- Therefore `/api/arg/*`, `/i/*`, `/y/special/*`, `/y/file/*`, and `/y/global/*` will **not** execute until Pages Functions (or an equivalent Worker router) are wired with `ARG_DB`

Static ARG pages under `/y/` are already part of the static build and can deploy without D1.

### 3. Existing Pages Functions directories

```text
functions/
  _lib/arg.js
  api/arg/admin-phase.js
  api/arg/claim.js
  api/arg/code.js
  api/arg/state.js
  api/arg/stats.js
  i/[token].js
  y/file/[slug].js
  y/global/[slug].js
  y/special/[number].js
```

### 4. Existing `_routes.json`

```json
{
  "version": 1,
  "include": [
    "/i/*",
    "/api/arg/*",
    "/y/special/*",
    "/y/file/*",
    "/y/global/*"
  ]
}
```

### 5. Existing `_headers`

Public site defaults on `/*`, plus ARG noindex/no-store rules for:

- `/y/*`
- `/i/*`
- `/api/arg/*`

### 6. Existing Wrangler configuration

File: `wrangler.jsonc`

- Worker name: `elemental-gaming-nexus`
- `main`: `src/worker.js`
- Assets binding: `ASSETS` → `./dist`
- `run_worker_first`: true
- No D1 binding currently configured
- No secrets declared in source

Example preview binding file (do not commit real IDs/secrets into public docs beyond placeholders):

- `wrangler.arg-preview.example.jsonc`

### 7. Existing D1 bindings

- None in `wrangler.jsonc`
- Code expects `context.env.ARG_DB`
- Admin/auth also expects `context.env.ARG_ADMIN_KEY`

### 8. Existing ARG migrations (exact filenames)

Apply in lexicographic order:

1. `migrations/0003_unique_incursions.sql`
2. `migrations/0004_seed_incursion_tokens.sql`
3. `migrations/0005_global_progression.sql`

There are no `0001` / `0002` files in this repository.

### 9. Existing ARG database tables and columns

From `0003_unique_incursions.sql` + `0005_global_progression.sql`:

**arg_tokens**

- `ribbon_no INTEGER PRIMARY KEY` (1–2500)
- `token_hash TEXT NOT NULL UNIQUE`
- `special_slug TEXT`
- `active INTEGER NOT NULL DEFAULT 1`
- `created_at TEXT`

**arg_visitors**

- `visitor_id TEXT PRIMARY KEY`
- `first_seen TEXT`
- `last_seen TEXT`

**arg_encounters**

- `visitor_id TEXT NOT NULL`
- `ribbon_no INTEGER NOT NULL`
- `first_seen TEXT`
- `last_seen TEXT`
- `scan_count INTEGER NOT NULL DEFAULT 1`
- `PRIMARY KEY (visitor_id, ribbon_no)`

**arg_code_unlocks**

- `visitor_id TEXT NOT NULL`
- `file_slug TEXT NOT NULL`
- `entered_code TEXT NOT NULL`
- `unlocked_at TEXT`
- `PRIMARY KEY (visitor_id, file_slug)`

**arg_invalid_attempts**

- `fingerprint TEXT PRIMARY KEY`
- `window_start INTEGER NOT NULL`
- `attempts INTEGER NOT NULL DEFAULT 1`

**arg_settings** (from `0005`)

- `setting_key TEXT PRIMARY KEY`
- `setting_value TEXT`
- `updated_at TEXT`

Indexes:

- `idx_arg_encounters_ribbon`
- `idx_arg_encounters_last_seen`
- `idx_arg_unlocks_visitor`

### 10. Existing ARG cookie name

`egn_arg_visitor_v3`

Set as HttpOnly, Secure, SameSite=Lax, Path=/

### 11. Existing admin route and authentication method

- UI: `/y/admin/`
- Stats API: `GET /api/arg/stats` with `Authorization: Bearer <ARG_ADMIN_KEY>`
- Phase API: `POST /api/arg/admin-phase` with the same Bearer header
- Auth helper: `adminAuthorized()` compares Bearer token to `env.ARG_ADMIN_KEY`

### 12. Existing reset or test utilities

- No ARG reset API endpoint exists
- Safe SQL reset script added for preview only: `scripts/reset-arg-preview.sql`
- Unrelated terminal query param `?reset=handler` exists under `/terminal/` and is not an ARG DB reset

### 13. Issues found

1. **Blocking for ARG APIs:** Pages Functions are present, but deploy currently uses Worker+assets. Dynamic ARG endpoints will 404 until Functions are actually served with `ARG_DB` bound.
2. **No D1 binding yet** in Wrangler or documented production DB.
3. **No preview/production split configured yet** for `ARG_DB` / `ARG_ADMIN_KEY`.
4. **Migrations start at 0003** (fine), but operators must not invent older files.
5. Static ARG assets referenced by `/y/*` pages are present; no missing ARG asset files detected in-repo.
6. JS syntax checks for core ARG modules passed.

### Counting model confirmation

Implemented in `functions/_lib/arg.js` + `functions/api/arg/claim.js`:

- **Personal count:** `COUNT(*)` of `arg_encounters` rows for the current `visitor_id`  
  (= unique ribbon numbers encountered by that anonymous browser)
- **Global confirmed count:** `COUNT(*)` of all `arg_encounters` rows  
  (= unique `(visitor_id, ribbon_no)` combinations)
- Repeat scans of the same ribbon by the same browser use `INSERT OR IGNORE`, then increment `scan_count` only; unique counts do not increase again

Special ribbon numbers present in seed as integers:

- 1, 2, 3, 4, 5, 404, 616, 2500  
  (UI/routes display them as 0001–0005, 0404, 0616, 2500)

Seed verification:

- `0004_seed_incursion_tokens.sql` contains **2500** `VALUES` inserts
- Hashes are 64-char hex; no plaintext URLs found in seed
- No duplicate hashes detected

---

## Preview database setup (`egn-arg-test`)

### How this repo distinguishes Preview vs Production today

This repository currently deploys with **Wrangler Worker environments**, not a committed Pages `wrangler.toml` with dashboard-only preview bindings.

Correct approach for this repo:

1. Keep **no production D1 binding** in `wrangler.jsonc` until you intentionally create a production ARG database.
2. Create `egn-arg-test` as a separate D1 database.
3. Bind it only under a **preview** Wrangler environment / Cloudflare Preview binding as `ARG_DB`.
4. Put `ARG_ADMIN_KEY` only in Preview secrets (dashboard or `wrangler pages secret` / Worker secret for the preview env).
5. Never put database IDs or admin keys into public HTML/JS.

If/when you move ARG Functions onto Cloudflare Pages properly, use the Pages project’s **Settings → Bindings** and set different Production vs Preview values there. Until then, do not assume Git preview deploys automatically get `functions/` execution.

### 1. Create `egn-arg-test`

```bash
npx wrangler d1 create egn-arg-test
```

Copy the printed `database_id`. Do not commit secrets; you may store the ID in local Wrangler config only.

### 2. Bind it to Preview as `ARG_DB`

Option A — local Wrangler preview env example:

1. Copy `wrangler.arg-preview.example.jsonc`
2. Replace `PASTE_EGN_ARG_TEST_DATABASE_ID_HERE` with the real ID
3. Merge that `env.preview.d1_databases` block into your local `wrangler.jsonc` when ready
4. Keep production root config free of `ARG_DB` until production cutover

Option B — Cloudflare dashboard (recommended if using Pages bindings UI):

1. Open the project in Cloudflare
2. Settings → Bindings / D1
3. Add Preview binding:
   - Variable name: `ARG_DB`
   - Database: `egn-arg-test`
4. Leave Production unbound (or bound only to a future production DB, never to `egn-arg-test`)

### 3. Add `ARG_ADMIN_KEY` as a Preview secret

Choose a long random key locally. Do not commit it.

If using a Pages project secret UI/CLI:

```bash
npx wrangler pages secret put ARG_ADMIN_KEY --project-name elemental-gaming-nexus
```

In the Cloudflare UI, ensure the secret is applied to **Preview** (and not accidentally only Production, or vice versa).

If using Worker secrets with environments:

```bash
npx wrangler secret put ARG_ADMIN_KEY --env preview
```

### 4. Apply the actual ARG migrations in order

Remote test DB:

```bash
npx wrangler d1 migrations apply egn-arg-test --remote
```

Wrangler applies files from `migrations/` in filename order:

1. `0003_unique_incursions.sql`
2. `0004_seed_incursion_tokens.sql`
3. `0005_global_progression.sql`

Confirm:

```bash
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS tokens FROM arg_tokens;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT ribbon_no, special_slug FROM arg_tokens WHERE ribbon_no IN (1,2,3,4,5,404,616,2500) ORDER BY ribbon_no;"
```

Expected:

- `tokens = 2500`
- special ribbons present

### 5. Deploy a preview build

ARG handlers are wired through `src/arg-router.js` into the Worker (Pages `functions/` alone do not run under `wrangler deploy`). Preview binds `ARG_DB` to `egn-arg-test`; production root config has no D1 binding.

```bash
npm run build
npx wrangler deploy --env preview
npx wrangler secret put ARG_ADMIN_KEY --env preview
```

Current preview Worker URL:

`https://elemental-gaming-nexus-preview.dakota-46f.workers.dev`

Do **not** run plain `npx wrangler deploy` (no `--env preview`) unless you intend to update production.

### 6. Confirm Production remains untouched

Checks:

- Production Wrangler/root config has no `egn-arg-test` binding
- Production D1 list shows no writes intended for test
- Production custom domains still serve the public site
- Run count queries only against `egn-arg-test`, never against a production DB name

```bash
npx wrangler d1 list
```

### 7. Retrieve the preview URL

- Cloudflare Dashboard → Workers & Pages → project → Deployments / Versions
- Open the latest Preview deployment URL
- Or use the URL printed by `wrangler pages deploy` / Git preview deployment

### 8. Open the D1 console

Dashboard:

1. Workers & Pages → D1
2. Open `egn-arg-test`
3. Use Console / Explore to run SQL

CLI equivalent:

```bash
npx wrangler d1 execute egn-arg-test --remote --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
```

### 9. Inspect visitor, encounter, token, unlock, and settings records

```bash
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS tokens FROM arg_tokens;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS visitors FROM arg_visitors;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS encounters FROM arg_encounters;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS unlocks FROM arg_code_unlocks;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT setting_key, setting_value FROM arg_settings;"
npx wrangler d1 execute egn-arg-test --remote --command "SELECT visitor_id, ribbon_no, scan_count, first_seen, last_seen FROM arg_encounters ORDER BY last_seen DESC LIMIT 20;"
```

### 10. Safely reset all test data while preserving the 2,500 tokens

```bash
npx wrangler d1 execute egn-arg-test --remote --file scripts/reset-arg-preview.sql
```

Then verify tokens remain:

```bash
npx wrangler d1 execute egn-arg-test --remote --command "SELECT COUNT(*) AS tokens FROM arg_tokens;"
```

Expected: `2500`

---

## Recommended next engineering step (non-destructive)

To make Preview ARG APIs actually run without touching production DNS:

1. Keep the current production Worker serving the public site as-is
2. Stand up / use a Preview Pages deployment that includes `functions/` + Preview `ARG_DB`
3. Test `/i/{token}`, `/api/arg/claim`, `/api/arg/state`, and `/y/admin/` there
4. Only after Preview validation, plan a production D1 + Functions cutover

Do not point production custom domains at an unfinished Functions migration.
