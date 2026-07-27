# Elemental Gaming Nexus website

Static Cloudflare Pages site for Elemental Gaming Nexus.

This version contains the public network website only. It intentionally does **not** include the Yellow Sign ARG.

## Pages

- `/` — network homepage
- `/shows/thats-redacted/` — That’s Redacted show page
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
Deploy this static site to Cloudflare Pages. Use the existing Cloudflare account and do not change DNS without showing me the proposed change first.
```

### Cloudflare Pages settings

- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Root directory: `/`

You can also deploy from the terminal:

```bash
npm install
npm run deploy
```

Wrangler will ask you to log in and select or create a Pages project.

## Editing

- Homepage: `index.html`
- Show page: `shows/thats-redacted/index.html`
- Shared design: `assets/css/style.css`
- Mobile navigation: `assets/js/site.js`
- EGN logo: `assets/images/egn-logo.png`
- EGN banner: `assets/images/egn-banner.png`
- That’s Redacted cover: `assets/images/thats-redacted-cover.png`

## Adding listening platforms later

The public design currently shows only Spreaker because no verified Apple Podcasts or Spotify URLs were supplied. Add those links only after you have the final public URLs.

## Spreaker player

The player embed is based on the code supplied by Spreaker. It currently references episode ID `66424703` while displaying the show playlist. Regenerate the show embed in Spreaker if you want a different default episode or player configuration.
