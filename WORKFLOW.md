# Tazzina Website — Your Workflow

This is your step-by-step guide. The actual instructions for Claude Code are in `CLAUDE_CODE_BRIEF.md` — you'll just paste that whole file as a single message.

---

## Step 1 — Set up the project folder on your computer

1. Make a new folder somewhere convenient, e.g. `~/Desktop/tazzina-site`.
2. Inside it, make a subfolder called `images`.
3. Drop your photos into `images/` and **rename them exactly** as listed below. Filenames matter — Claude Code is being told to expect these specific names.

| Save as | Use this photo |
|---|---|
| `logo.jpg` | Tazzina.jpg (the steam-curls logo) |
| `storefront.jpg` | The sunset photo with the lit-up TAZZINA sign and the pizza in front (best hero) |
| `oven.jpg` | The wood-fired oven with flames and glowing coals |
| `pizza.jpg` | The zucchini & basil pizza |
| `interior.jpg` | The banquette/brick wall with framed posters |
| `mural.jpg` | The full doodle mural (the Pisa/Colosseum/gondola one) |
| `favicon.ico` | (Claude Code will generate this from logo, or skip it for now) |

## Step 2 — Open VS Code and start Claude Code

1. Open VS Code.
2. Open the `tazzina-site` folder you just made (File → Open Folder).
3. Open the integrated terminal (Ctrl+` or Cmd+`).
4. Run `claude` in the terminal to start Claude Code. (If you haven't installed it yet, see [docs.claude.com](https://docs.claude.com) for setup — `npm install -g @anthropic-ai/claude-code`.)

## Step 3 — Hand over the brief

1. Open `CLAUDE_CODE_BRIEF.md` (the other file in this download).
2. Copy the **entire contents** of that file.
3. Paste it as your first message to Claude Code, with one short instruction at the top:

   > Build me this website. Create all files in the current folder. Don't skip anything in the brief.

4. Let it work. It'll generate `index.html`, `menu.html`, `about.html`, `style.css`, `script.js`, and `README.md`. It may ask clarifying questions — answer them.

## Step 4 — Preview locally

1. From the terminal in your project folder, run:
   ```
   python3 -m http.server 8000
   ```
   (or just double-click `index.html` to open it in a browser, but the server is closer to how the live site will behave).
2. Open http://localhost:8000 in your browser.
3. Click around all three pages. Resize the browser narrow to check mobile layout.

## Step 5 — Iterate if needed

If anything looks off, just tell Claude Code what to fix. Examples:
- "The pizza image on the home page is stretching weirdly — make it `object-fit: cover`."
- "The menu page tabs are too small on mobile — bump them up."
- "Replace the founder bios with this new text: ..."

## Step 6 — Deploy to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in (free account).
2. Workers & Pages → **Create** → **Pages** → **Upload assets**.
3. Project name: `tazzina` (this becomes `tazzina.pages.dev`).
4. Drag your entire `tazzina-site` folder onto the upload area.
5. Click Deploy. Within ~30 seconds you have a live `https://tazzina.pages.dev` URL.

That's it. Free forever, HTTPS included, fast globally.

## Step 7 — Custom domain (optional, later)

If you buy a domain (e.g. `tazzina.com.au` from Namecheap, Google Domains, etc.):
1. In the Cloudflare Pages dashboard for your project, go to Custom domains → Set up a custom domain.
2. Follow Cloudflare's DNS instructions.
3. SSL is automatic.

---

## When you want to update the site later

- **Change menu prices or items?** Edit `menu.html` directly. Find the item, change the text. Save. Re-upload the file (or the whole folder) to Cloudflare Pages.
- **Change hours?** Edit the footer block in all three HTML files (it's the same in each), and the visit panel on `about.html`. Also update the `schedule` object at the top of `script.js` — that's what drives the "Open today" card on the homepage.
- **One-off closure (public holiday, private event)?** Add a line to the `holidays` object in `script.js`, e.g. `'2026-12-25': ['Closed – Christmas Day']`.
- **New photos?** Drop into `images/` with the same filenames to replace, or use new names and update the `<img src="...">` lines.
- **Bigger changes?** Re-open Claude Code in the project folder and describe what you want.
