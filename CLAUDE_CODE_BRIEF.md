# Tazzina — Restaurant Website Build Brief

You are building a 3-page static website for **Tazzina**, an Italian pizzeria and café in Greensborough, Victoria, Australia. The site is hosted on **Cloudflare Pages**.

## Goal

Produce a complete, production-ready static website (HTML + CSS + JS, no build step, no frameworks) that I can drag-and-drop onto Cloudflare Pages. Three pages: **Home**, **Menu**, **About**. Mobile-responsive. Brand-consistent with the design spec below.

## Constraints

- Vanilla HTML5, CSS3, and minimal vanilla JS only. No React, no build tools, no npm.
- No external CSS frameworks (no Bootstrap, no Tailwind). Custom CSS only.
- All CSS in a single `style.css` file. All JS in a single `script.js` file.
- Google Fonts via `<link>` is fine.
- Site must work offline once loaded (no runtime API calls).
- Must be mobile-responsive (320px wide and up).
- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Accessibility: alt text on all images, sufficient color contrast, keyboard-navigable.

## File Structure

Create exactly this structure:

```
tazzina-site/
├── index.html          (Home)
├── menu.html           (Menu)
├── about.html          (About)
├── style.css           (shared styles)
├── script.js           (menu tab filter only)
├── images/
│   ├── logo.jpg        (Tazzina logo - I will provide)
│   ├── storefront.jpg  (exterior with motorbike or pizza-in-front - I will provide)
│   ├── oven.jpg        (wood-fired oven with flames - I will provide)
│   ├── pizza.jpg       (zucchini & basil pizza - I will provide)
│   ├── interior.jpg    (banquette + brick wall + framed posters - I will provide)
│   ├── mural.jpg       (the Italian doodle mural - I will provide)
│   └── favicon.ico     (you can generate from logo)
└── README.md           (deployment instructions)
```

I will drop my photos into `images/` using exactly those filenames. Code accordingly.

---

## Design System

### Colors (use as CSS custom properties at `:root`)

```css
--cream: #F5EDE0;        /* page background */
--cream-warm: #EFE5D3;   /* alternate section background */
--brick: #B85C3C;        /* primary accent — buttons, links, dividers */
--brick-deep: #7A2E1F;   /* hover states, headings on cream */
--ember: #D97A2C;        /* secondary accent — sparingly */
--charcoal: #1A1A1A;     /* logo, primary headings, footer background */
--ink: #2A1E14;          /* body text */
--muted: #5a4434;        /* secondary text */
--line: rgba(184, 92, 60, 0.25);  /* dividers, borders */
```

### Typography

Load from Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;1,400;1,500&display=swap" rel="stylesheet">
```

Stacks:
- **Display headings (h1, h2, logo, prices, buttons):** `'Bebas Neue', 'Oswald', sans-serif`. Letter-spacing 0.1–0.18em. Uppercase.
- **Body, paragraphs, navigation, menu item names:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`. Weight 400; 500 for emphasis.
- **Italian phrases, taglines, eyebrows, founder roles:** `'Playfair Display', Georgia, serif`. Italic.

### Sizing

- h1 (hero): `clamp(40px, 8vw, 64px)`, Bebas Neue, letter-spacing 0.18em
- h2 (section headings): `clamp(28px, 5vw, 36px)`, Bebas Neue, letter-spacing 0.1em
- h3 (cards, menu categories): 22–24px Bebas Neue, letter-spacing 0.12em
- Body: 15–16px Inter, line-height 1.7
- Small/labels: 12–13px Inter, letter-spacing 0.1em uppercase for eyebrows

### Spacing

- Section padding: `64px 24px` desktop, `48px 16px` mobile
- Container max-width: `1100px`, centered
- Card padding: `20px`
- Gaps between cards/grid items: `18–24px`

### Reusable elements

- **Eyebrow text** above section headings: Playfair italic, 14px, color `--brick`, centered, e.g. *"Benvenuti"*.
- **Divider line** under section headings: 48px wide × 2px tall, color `--brick`, centered, 24px margin.
- **Buttons**: 13px Inter, uppercase, letter-spacing 0.15em, padding `13px 28px`, border 1.5px solid. Two variants:
  - Filled: bg `--brick`, color `--cream`, border `--brick`. Hover: bg `--brick-deep`.
  - Outline: transparent bg, color `--cream` (on dark hero) or `--brick` (on light bg), 1.5px border same color. Hover: fill in.

### Doodle mural background texture

The mural image (`images/mural.jpg`) is the brand's visual signature. Use it as a **subtle background texture** on certain sections:

```css
.section-with-mural {
  position: relative;
  isolation: isolate;
}
.section-with-mural::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('images/mural.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.06;       /* very subtle — barely there */
  z-index: -1;
  pointer-events: none;
}
```

Apply this class to:
- The "Welcome to Tazzina" section on Home
- The body of the Menu page (behind the menu items)
- The story section on About

Also use the mural at higher opacity (~0.15) as a faded background behind the hero section on the About page, layered behind a brick-orange semi-transparent overlay.

---

## Shared elements (every page)

### Header / Navigation

```html
<header class="site-header">
  <a href="index.html" class="logo-wrap">
    <img src="images/logo.jpg" alt="Tazzina" class="logo-img">
  </a>
  <nav class="site-nav">
    <a href="index.html">Home</a>
    <a href="menu.html">Menu</a>
    <a href="about.html">About</a>
  </nav>
</header>
```

- Logo image height: 32px desktop, 26px mobile.
- Nav links: 13px Inter uppercase, letter-spacing 0.08em, gap 28px.
- Active page link gets bottom border 1.5px `--brick` and color `--brick`. Detect active by URL/page; on each page hardcode the `class="active"` attribute on the relevant nav link.
- Header background: `--cream`, bottom border 1px `--line`, padding `18px 32px`.
- On mobile (<768px): collapse nav links to a hamburger toggle. Simple JS toggle in `script.js`. Menu slides down from below header when open.

### Footer

```html
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <h5>Tazzina</h5>
      <p>Italian kitchen &amp; pizzeria</p>
      <p>19 Greenhill Rd</p>
      <p>Greensborough VIC 3088</p>
      <p><a href="tel:+61394350098">(03) 9435 0098</a></p>
      <p class="small">Outdoor seating · Dogs allowed outside</p>
    </div>
    <div>
      <h5>Hours</h5>
      <p>Monday — Closed</p>
      <p>Tue–Fri 7am–1pm, 5pm–9pm</p>
      <p>Sat–Sun 8am–1pm, 5pm–9pm</p>
    </div>
    <div>
      <h5>Follow</h5>
      <p><a href="https://instagram.com/tazzina_greensborough">@tazzina_greensborough</a></p>
      <p class="small">© 2026 Tazzina · Greensborough</p>
    </div>
  </div>
</footer>
```

- Background: `--charcoal`, color `--cream`.
- Padding: `48px 32px`.
- Grid: 3 columns desktop, 1 column stacked mobile.
- `h5` uses Bebas Neue, color `--ember`, letter-spacing 0.12em, 14px.
- Links color `--cream`, underline on hover.
- `.small` is 11px, color `rgba(245,237,224,0.55)`.

---

## Page 1 — `index.html` (Home)

### Hero section
- Full-width, ~70vh tall (min 480px).
- Background: `images/storefront.jpg` (the Tazzina exterior at dusk with the lit-up sign and pizza in foreground works best). Cover, centered.
- Overlay: `linear-gradient(135deg, rgba(58,36,24,0.65), rgba(122,46,31,0.55))` to ensure text legibility.
- Centered content, color `--cream`:
  - Three vertical bars or wavy lines as a "steam" decoration (CSS, ~24px tall, `letter-spacing: 0.3em`, opacity 0.85). You can use the unicode character `〰` or just three thin CSS pseudo-element bars.
  - **h1**: "TAZZINA"
  - Subline (13px uppercase, letter-spacing 0.18em, semi-transparent): "Wood-fired pizza · Pasta · Wine"
  - Tagline (Playfair italic, 18–20px): "A neighbourhood hidden gem"
  - Two buttons side by side: filled "View menu" → `menu.html`, outline "Find us" → anchor `#visit` or scroll to footer.

### Welcome section (with mural background texture)
- Padding `72px 24px`.
- Eyebrow: *"Benvenuti"*
- h2: "Welcome to Tazzina"
- Divider line.
- Intro paragraph (max-width 540px, centered):

  > Born from the legacy of Clay Oven Pizza, Tazzina is the new vision of three friends — Alessandro, Angus and Simon — bringing genuine Italian hospitality, wood-fired pizza, and traditional pasta to the heart of Greensborough.

- Below the intro, a **3-column feature grid** (1 column mobile):
  1. Image: `images/oven.jpg` · h3: "The Forno" · text: "Hand-painted, brick-built, and burning every service. The soul of the kitchen."
  2. Image: `images/pizza.jpg` · h3: "Pizza Napoletana" · text: "Sicilian-rooted, Naples-trained. Soft crust, charred edges, made by Angus."
  3. Image: `images/pasta.jpg` · h3: "La cucina" · text: "Pasta fresca, Milanese classics, Sicilian arancini — Alessandro's nonna would approve."

  Each card: white background, border `0.5px solid var(--line)`, border-radius 8px. Image height 180px, `object-fit: cover`. Body padding 18px 20px.

### Quick info section (between feature grid and footer)
- Background: `--cream-warm`.
- Padding `48px 24px`.
- 3 cards in a row (1 col mobile), centered. Each card: `--cream` bg, 1px solid `--line`, padding `28px 20px`, text-align center.
  1. **Open today** — "7am – 1pm" / "5pm – 9pm" *(static — show standard weekday hours; do not try to be live)*
  2. **Find us** — "19 Greenhill Rd" / "Greensborough VIC"
  3. **Book a table** — "(03) 9435 0098" / "Walk-ins welcome"
- Each card has an icon at top — use a simple character or CSS shape, color `--brick`, 24px. (Suggestion: `~` for the first, `@` for second, `#` for third — kept text-based to avoid emoji.)
- h4 inside cards: Bebas Neue 16px, letter-spacing 0.1em.

### Footer (shared)

---

## Page 2 — `menu.html` (Menu)

### Page header
- No tall hero. Padding `48px 24px 24px`.
- Eyebrow: *"Il menù"*
- h2: "Our menu"
- Divider line.
- Intro line, centered, max-width 480px: "Made by hand, served with heart. Prices in AUD."

### Tab filter strip
- Sticky-ish bar (not actually sticky on scroll — just visually distinct), background `--cream-warm`, padding 14px, border-radius 8px, border 0.5px solid `--line`. Margin: 0 auto 32px, max-width 920px.
- Display: flex, wrap, gap 6px, centered.
- 16 tabs: **All**, then 15 categories in this order:
  `All · Breakfast · Antipasti · Pizza · Pasta · Mains · Contorni · Dessert · Pastries · Hot Drinks · Cocktails · Spritz · Wine · Beers · Spirits · Soft Drinks`
- Each tab: 11px Inter uppercase, letter-spacing 0.1em, padding `7px 13px`, border-radius 4px, color `--muted`, font-weight 500, cursor pointer.
- Active tab: background `--brick`, color `--cream`.
- Default active: "All".

### Menu sections (one per category)
- For each category, render a `<section data-category="pizza">` (etc.) with:
  - h3 (centered): category name
  - 36px × 2px brick-orange divider line below it
  - A list of menu items.

### Menu item layout (standard categories — not Wine)

```html
<div class="menu-item">
  <span class="name">Margherita</span>
  <span class="dots"></span>  <!-- optional: leader dots, can do with CSS -->
  <span class="price">$24</span>
</div>
```

- Display: flex, justify-content: space-between, align-items: baseline, padding `11px 0`, border-bottom: 1px dotted rgba(184,92,60,0.3). Last item no border.
- `.name`: 15px Inter, weight 500, color `--ink`.
- `.price`: Bebas Neue 16px, color `--brick`, letter-spacing 0.05em.

### Menu item layout (Wine — special)

Wine has glass + bottle pricing. Some items only have bottle.

```html
<div class="wine-head">
  <span>Variety</span>
  <span>Glass</span>
  <span>Bottle</span>
</div>
<div class="wine-row">
  <span class="name">Chardonnay</span>
  <span class="price">$15</span>
  <span class="price">$56</span>
</div>
```

- Grid: `1fr auto auto`, gap 16px.
- Header row: 10px uppercase, letter-spacing 0.15em, color `--brick`, border-bottom 1px solid `rgba(184,92,60,0.4)`.
- Where glass price is missing, show `—` (em dash) in that column.

### Full menu data (use exactly this — categories ordered as in the tab strip)

#### Breakfast
- Banana bread — $6.50
- Big breakfast — $26
- Breakfast burger — $19
- Chilli scramble — $46
- Eggs Benedict — $24
- Eggs Florentine — $22
- Eggs Royale — $24
- Eggs on toast — $12
- French toast — $22
- Smash avocado — $24
- Toast — $8
- Toastie ham &amp; cheese — $8.50

#### Antipasti
- Arancini Bolognese — $12
- Burrata — $16
- Calamari — $14
- Focaccia — $10
- Garlic and mozzarella pizza — $16
- Polpette in sugo — $16
- Chips — $10

#### Pizza
- Margherita — $24
- Sud — $22
- Tropicale — $26
- Capricciosa — $26
- Diavola — $26
- Pepperoni — $28
- Salsiccia e Friarielli — $27
- Salsiccia e Patate — $28
- Funghi — $30
- Gamberi — $30
- Prosciutto — $30
- Pane — $5
- Nutella — $16

#### Pasta
- Spaghetti aglio e olio — $22
- Spaghetti alla gricia — $26
- Spaghetti puttanesca — $26
- Fusilli zucchini pesto — $26
- Gnocchi with butter and sage — $26
- Rigatoni alla norma — $27
- Pappardelle with beef ragù — $28
- Lasagna — $30

#### Mains
- Chicken dish — $30
- Veal cotoletta alla Milanese — $32
- Fish dish — $34
- Ossobuco Milanese — $36

#### Contorni
- Patate fritte — $10
- Insalata mista — $12
- Broccolini — $12
- Rucola salad — $14
- Insalata caprese — $16

#### Dessert
- Cannolo — $6
- Tiramisu — $11
- Nutella pizza — $16

#### Pastries
- Choc fingers — $3.50
- Muesli bars — $3.50
- Biscuit — $4
- Muffin — $5
- Croissant — $6
- Chocolate croissant — $6.50
- Danish — $6.50

#### Hot Drinks
- Babycino — $2
- Espresso — $4
- Short macchiato — $4.50
- Cappuccino — $5
- Flat white — $5
- Latte — $5
- Long black — $5
- Long macchiato — $5
- Chai latte — $5
- Hot chocolate — $5
- Tea — $5
- 1 kg coffee beans — $45

#### Cocktails
- Gin tonic — $15
- Negroni Sbagliato — $16
- Americano — $16
- Negroni — $18

#### Spritz
- Aperol Spritz — $16
- Campari Spritz — $16
- Limoncello Spritz — $18

#### Wine *(use the wine layout with Glass / Bottle columns)*
| Variety | Glass | Bottle |
|---|---|---|
| Prosecco | $12 | $46 |
| Pinot Grigio | $13 | $49 |
| Sauvignon Blanc | $13 | $49 |
| Chardonnay | $15 | $56 |
| Musita Amal | $15 | $56 |
| Pinot Noir | $15 | $56 |
| Chianti | $15 | $56 |
| Valpolicella Classico | $16 | $60 |
| Fiano | — | $57 |
| Governo Toscano | — | $59 |
| Grillo Funaro | — | $64 |
| Nero d'Avola | — | $64 |
| Simon Tolley Estate Syrah | — | $64 |

#### Beers
- Carlton Dry — $9
- Birra Moretti — $10
- Corona — $10
- Peroni Rossa — $10
- Stone &amp; Wood — $11

#### Spirits
- Sambuca — $9
- Amaretto di Saronno — $10
- Limoncello — $11
- Montenegro — $11

#### Soft Drinks
- Coke — $4
- Coke Zero — $4
- Juice — $4
- Lemonade — $4
- Solo — $4
- Aranciata Rossa — $4.50
- Chinotto — $4.50
- Limonata — $4.50
- San Pellegrino (small) — $4.50
- Sanbitter — $4.50
- Lemon-lime bitters — $5.50
- San Pellegrino (large) — $9
- Non-alcoholic beer — $9

### Tab filter behavior (`script.js`)

```js
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('[data-category]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      const filter = tab.dataset.filter; // 'all' or category slug
      sections.forEach(sec => {
        sec.style.display = (filter === 'all' || sec.dataset.category === filter) ? '' : 'none';
      });
    });
  });
});
```

Each tab gets `data-filter="pizza"` (etc.), each section gets `data-category="pizza"`. Slugs: lowercase, single word — `breakfast`, `antipasti`, `pizza`, `pasta`, `mains`, `contorni`, `dessert`, `pastries`, `hot-drinks`, `cocktails`, `spritz`, `wine`, `beers`, `spirits`, `soft-drinks`.

### Footer (shared)

---

## Page 3 — `about.html` (About)

### Hero section
- 320px tall (260px mobile).
- Background: `images/mural.jpg` at opacity 0.18, layered behind `linear-gradient(135deg, rgba(122,46,31,0.85), rgba(184,92,60,0.85))`.
- Centered content, color `--cream`:
  - h1: "OUR STORY"
  - Subline (Playfair italic, 17px): "From Clay Oven Pizza to Tazzina"

### Story section (with mural texture)
- Padding `72px 24px`.
- Eyebrow: *"La nostra storia"*
- h2: "A hidden gem, made by hand"
- Divider line.
- Two paragraphs, max-width 580px, centered, 15px Inter, line-height 1.85:

  > Tazzina rose from the foundations of Clay Oven Pizza — a beloved Greensborough local — and was reimagined by three friends who shared one belief: that genuine Italian food is built on tradition, patience, and people who care.
  >
  > Every dish that leaves our kitchen is shaped by the founders' hands and stories. The wood-fired oven still burns. The pasta is still rolled to order. And the welcome at the door is still meant to feel like home.

### Founders grid
- 3 columns desktop (1 column mobile), gap 16px, max-width 920px, centered.
- Each founder card:
  - White bg, border 0.5px solid `--line`, border-radius 8px, padding 22px 20px, text-align center.
  - **Avatar circle**: 72px diameter, gradient background `linear-gradient(135deg, #B85C3C, #7A2E1F)`, color `--cream`, Bebas Neue 26px, letter-spacing 0.1em. Show first initial. Centered.
  - **h4**: First name only, Bebas Neue 18px, letter-spacing 0.12em.
  - **Role** (Playfair italic, 12px, color `--brick`):
    - Alessandro — *Custode della tradizione*
    - Angus — *Pizzaiolo*
    - Simon — *Padrone di casa*
  - **Bio** (12px Inter, color `--muted`, line-height 1.65):
    - Alessandro: "Italian-born and raised, Alessandro carries the culture and traditions that give Tazzina its soul."
    - Angus: "Sicilian roots and a love for the craft. Angus runs the wood-fired oven and the heart of the kitchen."
    - Simon: "Twenty years of hospitality experience. Simon is the rhythm that keeps the room moving."

### Visit panel
- After founders, a single panel.
- Background `--cream-warm`, border 1px solid `--line`, border-radius 8px, padding 28px, max-width 720px centered, margin-top 40px.
- 2-column grid (stacks on mobile), gap 32px:
  - **Find us**: "19 Greenhill Rd / Greensborough VIC 3088 / (03) 9435 0098" with line breaks. Below in 11px muted: "Outdoor seating · Dogs allowed outside".
  - **Hours**: rows of `day | hours`. Monday is "Closed" and slightly dimmed (color `#888`).
- Both column h5 in Bebas Neue 14px color `--brick`.

### Footer (shared)

---

## Mobile responsive rules

Single breakpoint: `@media (max-width: 768px)` does the heavy lifting.

- Header nav becomes a hamburger toggle. Use a checkbox-hack OR simple JS toggle. Mobile nav appears as a vertical list directly below the header bar when open, full-width, padding 16px, background `--cream`.
- Hero h1 scales via `clamp()`.
- All grids (feature grid, quick-info, footer, founders, visit panel) collapse to single column.
- Section padding reduces from `72px 24px` to `48px 16px`.
- Menu tabs wrap freely.
- Buttons: stack vertically with 8px gap on hero, full-width up to a max of 280px.

## SEO and meta tags

In every `<head>`:

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tazzina · Italian kitchen &amp; pizzeria · Greensborough</title>
<meta name="description" content="Wood-fired pizza, traditional pasta, and Italian hospitality in Greensborough. Open Tuesday to Sunday for breakfast, lunch and dinner.">
<meta property="og:title" content="Tazzina · Italian kitchen &amp; pizzeria">
<meta property="og:description" content="A neighbourhood hidden gem in Greensborough.">
<meta property="og:image" content="images/storefront.jpg">
<meta property="og:type" content="website">
<link rel="icon" href="images/favicon.ico">
<link rel="stylesheet" href="style.css">
```

(Adjust `<title>` and meta description per page — Menu page: "Menu · Tazzina"; About: "Our story · Tazzina".)

## README.md

Generate a brief `README.md` in the project root with:
1. What the site is.
2. Local preview instructions: just open `index.html` in a browser, or run `python3 -m http.server 8000` from the project folder.
3. Deployment instructions for Cloudflare Pages:
   - Go to dash.cloudflare.com → Workers &amp; Pages → Create → Pages → "Upload assets".
   - Drag the entire project folder.
   - Get a `*.pages.dev` URL immediately. Custom domain configurable in dashboard.
4. How to update content: which files contain the menu data, hours, contact info.

---

## Build order (suggested)

1. `style.css` with the design system (custom properties, typography, base styles, reusable components: header, footer, buttons, eyebrow, divider, cards).
2. `index.html` (Home).
3. `about.html` (About).
4. `menu.html` (Menu) — the longest page.
5. `script.js` (mobile nav toggle + menu tab filter).
6. `README.md`.

Test each page by opening it in a browser. Verify:
- Logo and nav appear correctly on all pages.
- Active nav link is highlighted on the right page.
- Footer is consistent across all pages.
- Menu tabs filter correctly.
- Mobile layout (resize browser to 375px width) — everything stacks cleanly.
- All images have alt text (use descriptive alts, e.g. `alt="Wood-fired oven with flames"`).

When done, hand me back a folder I can drag onto Cloudflare Pages.
