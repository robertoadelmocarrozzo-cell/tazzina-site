# Tazzina — Greensborough

Three-page static website for Tazzina, an Italian kitchen and pizzeria in Greensborough, Victoria. Pages: **Home**, **Menu**, **About**. Built with vanilla HTML, CSS, and a small bit of JS — no build step, no framework, no dependencies.

---

## File map

```
tazzina-site/
├── index.html      Home
├── menu.html       Menu
├── about.html      About
├── style.css       all styles
├── script.js       mobile nav toggle + menu tab filter
├── images/         photography + logo (referenced from HTML)
└── README.md
```

---

## Local preview

Two options:

1. **Just open it.** Double-click `index.html` and it opens in your browser. Everything works locally — including the menu filter and mobile nav.

2. **Run a tiny local server** (lets you reload between pages cleanly and matches deployment behaviour). From the project folder, in a terminal:

   ```bash
   python3 -m http.server 8000
   ```

   Then open <http://localhost:8000> in your browser.

To check the mobile layout, resize the browser to ~375px wide, or use the device toolbar in Chrome DevTools (Ctrl+Shift+M).

---

## Deploy to Cloudflare Pages

1. Sign in at <https://dash.cloudflare.com>.
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Give the project a name (for example, `tazzina`).
4. Drag the **entire `tazzina-site` folder** into the upload area (or zip it first and upload the zip).
5. Cloudflare will deploy in ~30 seconds and give you a URL like `tazzina.pages.dev`.

To attach a custom domain (e.g. `tazzina.com.au`), go to the project's **Custom domains** tab and follow the DNS prompts.

To push an updated version: same flow — re-upload the folder and Cloudflare swaps it in. Old deployments are kept on the dashboard, so you can roll back from the **Deployments** tab if needed.

---

## How to update content

| What | Where |
|---|---|
| Menu items and prices | `menu.html` — search for the relevant `<section class="menu-section" data-category="…">` block and edit the `<div class="menu-item">` rows. The price layout is name on the left, price on the right. |
| Wine list | `menu.html`, inside `data-category="wine"`. Each row uses `.wine-row` with three columns: name, glass price, bottle price. Use `<span class="price empty">&mdash;</span>` for "no glass price". |
| Hours and contact | Footer block on each of `index.html`, `menu.html`, `about.html` (search for `<footer class="site-footer">`), plus the **Visit** panel in `about.html`. Edit all three for consistency. The homepage **Open today** card is driven by the `schedule` object in `script.js` — update it there. |
| Public-holiday closures | `script.js`, the `holidays` object — add a line like `'2026-12-25': ['Closed – Christmas Day']`. |
| Founder bios | `about.html`, in the `<div class="founders">` block. |
| Hero image, dish photos | Replace files inside `images/` using the same filenames (`storefront.jpg`, `oven.jpg`, `pizza.jpg`, `pasta.jpg`, `mural.jpg`, `interior.jpg`, `logo.png`). The HTML doesn't need to change. |
| Brand colours / fonts | `style.css` — the `:root` block at the top defines every colour and font stack. Change once, applies everywhere. |

---

## Adding a new menu category

1. In `menu.html`, add a button to the `.menu-tabs` block:
   ```html
   <button class="menu-tab" data-filter="my-category">My Category</button>
   ```
2. Add a matching section further down:
   ```html
   <section class="menu-section" data-category="my-category">
     <h3>My Category</h3><hr class="divider-sm">
     <div class="menu-item"><span class="name">Item</span><span class="price">$10</span></div>
   </section>
   ```

The slug in `data-filter` and `data-category` must match exactly. No JS changes needed — `script.js` handles filtering generically.

---

## Menu sync (Google Sheet → live site)

The menu on the live site is generated from a Google Sheet. The pipeline:

1. Edit the sheet (categories, names, prices, glass/bottle).
2. A Google Apps Script bound to the sheet detects the change and POSTs a `repository_dispatch` event to GitHub.
3. The **Sync menu from Google Sheet** workflow reads the sheet via the Sheets API, rewrites the marked regions of `menu.html`, commits, and triggers a deploy.
4. **Deploy to Cloudflare Pages** publishes the new HTML.

End-to-end: ~1–2 minutes from edit to live.

**If validation fails** (missing Category/Name, non-numeric Price, etc.) the workflow opens a GitHub issue with the offending rows and leaves the live menu untouched. Fix the sheet and the next sync clears the issue.

**Manual fallback.** If automation is broken, go to **Actions → Sync menu from Google Sheet → Run workflow** and dispatch it by hand.

**Hourly safety-net cron.** A cron also fires at the top of every hour as backup against Apps Script quota issues, expired tokens, or Google outages.

### Annual maintenance: rotate the GitHub token

The fine-grained Personal Access Token used by Apps Script expires once a year. To rotate:

1. Generate a new fine-grained PAT at <https://github.com/settings/personal-access-tokens/new> with: Resource owner = your account, Repository access = only `tazzina-site`, Permissions = `Actions: Read and write` (and `Metadata: Read`, auto-required), Expiration = 1 year.
2. Open the sheet → **Extensions → Apps Script → Project Settings → Script Properties** → edit `GITHUB_PAT`, paste the new token, save.
3. Test by editing one cell of the sheet. Within ~30s a new run should appear in **Actions** with event type `repository_dispatch`.

Set a calendar reminder for ~11 months out so the rotation never lapses.

---

## Notes

- The site has zero runtime API calls and works offline once a page is loaded.
- Google Fonts are pulled at page load via `<link>` — first load needs internet, after that they're cached by the browser.
- Image filenames are case-sensitive on Cloudflare Pages (Linux). Keep the `images/` folder lowercase.
