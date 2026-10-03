# Elemental Gaming Nexus website

Static Cloudflare Pages site for Elemental Gaming Nexus.

This version contains the public network website only. It intentionally does **not** include the Yellow Sign ARG.

## Pages

- `/` — network homepage
- `/listen/` — listening hub (Spotify, Apple, Amazon, Spreaker, Ko-fi)
- `/listen/purity-bay/` — Purity Bay listen page (shareable)
- `/listen/dungeon-crawler-degenerates/` — Dungeon Crawler Degenerates listen page (shareable)
- `/listen/thats-redacted/` — alias that forwards to `/listen/`, so all three shows share the same URL pattern
- `/connect/` — Discord, socials, Ko-fi, and contact (`connect/index.html`)
- `/go` — short redirect to `/listen/`
- `/shows/thats-redacted/` — That’s Redacted show page
- `/shows/purity-bay/` — That’s Redacted: Purity Bay show page
- `/shows/dungeon-crawler-degenerates/` — Dungeon Crawler Degenerates show page
- `/404.html` — custom not-found page

## Local preview in Cursor

Open this folder in Cursor, then run:

```bash
python -m http.server 8000
```

Open:

- http://localhost:8000/
- http://localhost:8000/shows/thats-redacted/

The Spreaker player needs an internet connection and may not load when browser privacy extensions block third-party scripts.

## Deploy with Cursor and Cloudflare

Ask Cursor:

```text
Review README.md and AGENTS.md. Preview this static site locally. Do not change the design or deploy anything until I approve the preview.
```

After approval:

```text
Push to the GitHub repo connected to Cloudflare Pages. Do not change DNS without showing me the proposed change first.
```

### Cloudflare Workers / Pages settings (Git)

Use these build settings:

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Root directory: `/`

The build copies only the public static files into `dist/`. Wrangler then deploys that folder, not `node_modules`.

After the first Git deploy succeeds, custom domains can be attached in the project settings. Ask before changing DNS.

## Editing

- Homepage: `index.html`
- Show page: `shows/thats-redacted/index.html`
- Shared design: `assets/css/style.css`
- Mobile navigation: `assets/js/site.js`
- EGN logo: `assets/images/egn-logo.png`
- EGN banner: `assets/images/egn-banner.png`
- That’s Redacted cover: `assets/images/thats-redacted-cover.png`
- Dungeon Crawler Degenerates cover: `assets/images/dungeon-crawler-degenerates-cover.jpg` (+ `.webp`)
- Purity Bay map: `assets/images/purity-bay-map.svg`, shown in the `#map` section of `shows/purity-bay/index.html`. It is the Illustrator export with a sans-serif fallback added to its `font-family` (Myriad Pro isn’t installed on most visitors’ devices). Re-apply that fallback if you re-export the map.
- Purity Bay cover: not supplied yet. When it arrives, save it as `assets/images/purity-bay-cover.jpg` / `.webp` and replace the `.cover-placeholder` blocks in `index.html` and `shows/purity-bay/index.html` with a `<picture>`, and point the Purity Bay page’s `og:image` at it.

## Adding listening platforms later

The public design currently shows only Spreaker because no verified Apple Podcasts or Spotify URLs were supplied. Add those links only after you have the final public URLs.

## Spreaker player

Purity Bay and Dungeon Crawler Degenerates had no published episodes at launch, and the Spreaker widget shows “This podcast is unavailable” for an empty show. Their pages keep the player markup (`data-resource="show_id=…"`) but have the `widgets.js` script tag commented out, so visitors see a “first episode coming soon” panel linking to Spreaker. After each show’s first episode is live, uncomment that script tag at the bottom of its page to turn on the real player.

The That’s Redacted player embed is based on the code supplied by Spreaker. It currently references episode ID `66424703` while displaying the show playlist. Regenerate the show embed in Spreaker if you want a different default episode or player configuration.
