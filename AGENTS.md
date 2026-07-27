# AGENTS.md

## Project

Elemental Gaming Nexus is an independent actual-play podcast network.

Current public show:
- That’s Redacted
- A Delta Green actual-play podcast
- Hosted on Spreaker

Primary contact:
- dakota@elementalgamingnexus.com

Production domain:
- elementalgamingnexus.com

## Current scope

This repository contains the public podcast-network website only.

Do not add the Yellow Sign ARG, ribbon tracking, hidden number logic, or secret pages unless the user explicitly begins the ARG phase.

## Design rules

- Public site should look like a professional media network.
- Use a dark, clean, restrained investigative style.
- Do not make the network homepage look like a fake government terminal.
- Do not copy official Delta Green logos or proprietary visual assets.
- Keep copy short and direct.
- Do not introduce marketing filler such as “immersive,” “epic,” or “unforgettable.”
- Maintain strong mobile accessibility and keyboard navigation.
- Avoid dead navigation links.
- The supplied EGN logo and EGN banner are approved artist-made brand assets. Preserve them and use them prominently.
- Use the EGN logo in the site header and footer.
- Use the EGN banner as the network homepage hero artwork.
- Use the supplied That’s Redacted cover as a contained square image, not a full-screen background.
- Preserve the existing color system and component structure unless the user approves a redesign.

## Technical rules

- Static HTML, CSS, and small vanilla JavaScript only.
- No frontend framework unless the user explicitly approves one.
- No private tokens, passwords, or account identifiers in source files.
- Keep all shared styling in `assets/css/style.css`.
- Keep shared behavior in `assets/js/site.js`.
- Use root-relative URLs so nested pages work on Cloudflare Pages.
- Preserve the Spreaker embed unless replacing it with another verified integration.
- Ask before deploying or changing DNS.
