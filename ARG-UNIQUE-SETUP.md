# Cloudflare setup — Atlanta Incursion ARG

The implementation uses Cloudflare Pages Functions and a D1 database bound as `ARG_DB`.

## 1. Deploy the project

Deploy the project root to the existing Cloudflare Pages project. The `/functions` directory supplies the dynamic scan, state, special-file, global-file, code-entry, and administration routes.

Cloudflare Pages Functions supports file-based dynamic routes, and D1 is exposed to Pages Functions through an environment binding.

## 2. Create or reuse D1

Create one D1 database and bind it to the Pages project with the variable name:

`ARG_DB`

Apply migrations in order:

1. `migrations/0003_unique_incursions.sql`
2. `migrations/0004_seed_incursion_tokens.sql`
3. `migrations/0005_global_progression.sql`

The seed migration contains SHA-256 token hashes only. Raw production tokens remain in the separate private-token package.

## 3. Create the admin secret

Create an encrypted Pages/Workers secret named:

`ARG_ADMIN_KEY`

Use that key on `/y/admin/` to view statistics and set the global phase to automatic or temporarily override it.

## 4. Production tests before printing

1. Open five ordinary production token URLs on a phone.
2. Confirm each new token increases personal and global confirmed counts.
3. Confirm rescanning the same token on the same browser increases raw scans but not personal/global confirmed counts.
4. Confirm another browser scanning the same token increases the global count.
5. Test special ribbons `0001`–`0005`, `0404`, `0616`, and `2500`.
6. Use the admin phase override to inspect phases 0–7 and every global report.
7. Return phase control to `Automatic from count` after testing.
8. Test the 5, 10, 25, 50, and 100 personal gates using a test browser or temporary development records.
9. Test on iPhone Safari, Android Chrome, and at least one second browser.

## 5. Pending assets

See `PENDING-ASSETS.md`.

## 6. Private data

Never place the private token manifest or QR URL CSV inside the deployed Pages project. Anyone with those files can open every QR destination.
