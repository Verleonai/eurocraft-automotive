---
name: EuroCraft Index
description: Static marketing site for EuroCraft Automotive — European auto repair shop in Orlando, FL
type: index
project: eurocraft
last_updated: 2026-05-18
---

# EuroCraft Automotive — Project Index

European auto repair, diagnostics, and performance shop (Porsche, BMW, Mercedes-Benz, Audi, VW). Orlando, FL.

**Stack:** Static HTML/CSS/JS · Vercel-deployed (`prj_zerRV0UWjMWvKJK6ix4dXdTIxVk1`) · HubSpot for booking + forms
**Repo:** `~/.openclaw/workspace/eurocraft/` (git-tracked)

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, services overview, social proof |
| `about.html` | Shop story, team, credentials |
| `services.html` | Service catalog (diagnostics, programming, performance) |
| `gallery.html` | Photo gallery of shop + completed work |
| `booking.html` | HubSpot Meetings embed for appointments |
| `contact.html` | Contact form (HubSpot) + location/hours |
| `404.html` | Custom not-found page |

## Code

| Path | Purpose |
|---|---|
| `css/style.css` | Site styles (single sheet) |
| `js/app.js`, `js/main.js` | Interactivity, scroll effects, nav |
| `scripts/screenshot.js` | Playwright/Puppeteer screenshot capture |
| `scripts/map-check.js` | Verifies map embed |
| `scripts/real_check.js` | Site verification script |
| `scripts/verify-light.js` | Light/dark theme verification |

## Assets

- `assets/` — ~200 design/audit/iteration images (logos, hero variants, slice/depth/fin sequences)
- `images/` — 26 gallery + content images
- `assets/logo.svg`, `ec-logo-*.png` — brand marks
- `assets/og-image.png`, `favicon.svg` — social/browser identity

## SEO + Indexing

| File | Purpose |
|---|---|
| `sitemap.xml` | Submitted URLs |
| `robots.txt` | Crawler directives |

## Deployment

- **Vercel project:** `eurocraft` (org `team_yzXbhN2l11eFHmZxhOhSEcuZ`)
- **HubSpot:** Forms + Meetings booking embedded (commit `1f52396` / `a4b0fae`)

## Recent history

- `a4b0fae` — Added booking.html with HubSpot Meetings embed; rewired CTAs internal
- `1f52396` — HubSpot tracking script + form embeds + inquiry section
- `ef2dc47` — Lossless JPG optimization (-971KB)
- `f14d3c9` — Perf + SEO pass (lazy loading, async fonts, schema)
- `a331898` — Fixed lag (removed CSS bloat, `background-attachment:fixed`)

## Open questions / pending

- HubSpot Portal ID was awaiting at `1f52396` — verify it's been wired in
- CRM/SMS decision (Antonio 2026-05-18: evaluating Shop Monkey vs alternatives)
