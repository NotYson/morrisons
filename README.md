# Cannes Nightlife — static site (HTML + CSS + Bootstrap 5.3.3)

No build step, no framework. Upload the folder as-is to any static host. Links are
root-relative (`/assets/...`), so the site must sit at the root of the domain.

## Preview locally
Double-clicking the HTML files will NOT work (clean URLs need a server).
- VS Code: "Live Server" extension → Open with Live Server
- or terminal in this folder: `python3 -m http.server 8000` → http://localhost:8000

## Pages (17)
| FR | EN |
|---|---|
| `/` | `/en/` |
| `/morrisons-pub-cannes/` | `/en/morrisons-pub-cannes/` |
| `/the-lounge-cannes/` | `/en/the-lounge-cannes/` |
| `/bar-a-vin-cannes/` | `/en/bar-a-vin-cannes/` |
| `/the-quays-cannes/` | `/en/the-quays-cannes/` |
| `/frensh-restaurant-cannes/` | `/en/frensh-restaurant-cannes/` |
| `/mentions-legales/` `/confidentialite/` (noindex) | `/en/legal-notice/` `/en/privacy/` (noindex) |

Plus `404.html`, `robots.txt`, `sitemap.xml`, `_redirects`, `.htaccess`.

## ⚠️ 1. Redirects — do this or lose your current Google ranking
cannes-nightlife.com is already live with URLs like `/morrisons-fr`, `/the-lounge-fr`,
`/bar-a-vin-fr`, `/the-quays-fr`. Those URLs have years of ranking and backlinks
(tourist office, TripAdvisor, Wanderlog... link to them). If they 404 after the switch,
that value is gone.
- `_redirects` → Netlify / Cloudflare Pages. `.htaccess` → Apache hosts (OVH, o2switch, Hostinger).
- I could only confirm the `-fr` URLs and `/the-quays`. The `-en` and FREnSH ones are guesses.
  **Before launch:** Google Search Console → Pages → export every indexed URL of the old site and
  make sure each one has a redirect line.
- After launch: submit `sitemap.xml` in Search Console and Bing Webmaster Tools.

## 2. Facts to verify (from public sources, may be out of date)
| Venue | What's on the site | Source | Confidence |
|---|---|---|---|
| Morrison's Pub | Since 1997, first pub in Cannes. Live music Tue/Wed/Thu/Sun. Happy hour 17–20h. Football & rugby on screens. Hours Mon–Fri 17:00–02:30, Sat–Sun 13:00–02:30 | Cannes tourist office (Jan 2026), Privateaser, Google | Hours: medium |
| The Lounge | Since 2005, next to Morrison's. Quiz Mon, karaoke Wed, DJ Fri & Sat (electro/hip-hop/R&B). Daily 17:00–02:00. Terrace | Tourist office (May 2025), Privateaser, Culture Trip | Medium |
| Le Bar à Vin | Since 1998. All French regions + foreign wines, bruschetta, cheese, club armchairs, mezzanine, pool table, terrace, EN spoken. Mon–Sat 17:00–00:30, closed Sun | Tourist office (Oct 2026) | High |
| The Quay's | Since 2000, Old Port. Sport (football, rugby, hurling), terrace. Daily 13:00–02:30. **Live music Thu & Sat comes from a single review** | Tourist office (2023 — old), Wanderlog | **Low for event days** |
| FREnSH | Dishes (tartare, croque-madame, burger, rum baba, poke bowls…), terrace, happy hour. **Hours 9:00–23:00: sources disagree (some say 22:00)** | Wanderlog, Sluurpy, Google reviews | **Low for hours** |

Hours live in 4 places per venue: the `HORAIRES` quick-info bar, the hours table, the JSON-LD
`openingHoursSpecification`, and the `data-hours` attribute on the open/closed badges
(on the venue page, the home card and the "other venues" cards on the 4 other pages, FR + EN).
Change them all together, and make them **identical to Google Business Profile**.

## 3. Content I did not invent (left out or marked "TODO" in the HTML)
- **Prices**: none on the site. No reliable public source. Add them; "prix pinte Cannes" type
  searches and menu pages are what people actually look for.
- **Event start times**: shown as "En soirée / Evening" where unknown.
- **Group email**: none found. Contact section lists the 5 phone numbers.
- **Facebook links**: real ones for Morrison's, The Lounge, Le Bar à Vin. Missing for The Quay's and FREnSH (add to page + `sameAs` in JSON-LD).
- **Instagram**: none found.
- **GPS coordinates**: only The Lounge has `geo` in JSON-LD. Add the others.
- **Legal notice**: company name, SIRET, publication director, host — required by French law.

## 4. Photos — still stock
All photos are Unsplash placeholders, hotlinked, and the 4 bars share the same 6 pictures.
Real photos of each venue are the single biggest quality upgrade left. Save them in
`assets/img/`, WebP, ~1600px wide max, and write alt text describing what's actually in each photo.

## 5. Logos
`assets/img/logos/*.avif` are displayed on the site (small, sharp). `*.png` versions (512px)
are used for JSON-LD `logo` and could be used for social sharing. Favicon generated from the
Cannes Nightlife logo.

## Off-site (bigger impact than the site itself)
- One Google Business Profile per venue, name/address/phone written EXACTLY as on the site,
  each linked to its own venue page (not the home page).
- Morrison's alone has ~1,400 Google reviews at 4.4. Keep collecting and replying.
- Same name/address/phone on TripAdvisor, Facebook, PagesJaunes, and ask the Cannes tourist
  office (SEMEC) to update the listings with the new URLs and correct hours.

## Analytics / cookies
The site sets no cookies, so no consent banner is needed. Adding Google Analytics or a Meta
pixel requires a CNIL-compliant consent banner first. Plausible or Matomo (configured for
exemption) avoid that.

## Maintenance warning (plain HTML)
Header and footer are copied into all 17 pages. Changing a phone number means editing every
page (use your editor's "find in files"). If events and menus change weekly, that gets tedious
fast — at that point move to a static generator or a small CMS.
