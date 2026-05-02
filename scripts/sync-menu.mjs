#!/usr/bin/env node
// Pulls the menu from the published Google Sheet CSV at $MENU_CSV_URL and
// rewrites the marked regions of menu.html. Exit codes:
//   0 = success (file written, or no change)
//   1 = infrastructure error (no URL, fetch failed, missing markers)
//   2 = validation error in the sheet (workflow opens an issue, file untouched)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const MENU_HTML = path.join(ROOT, 'menu.html');

const MARK = {
  tabsStart: '<!-- MENU:TABS:START -->',
  tabsEnd: '<!-- MENU:TABS:END -->',
  sectionsStart: '<!-- MENU:SECTIONS:START -->',
  sectionsEnd: '<!-- MENU:SECTIONS:END -->',
};

const CSV_URL = process.env.MENU_CSV_URL;
if (!CSV_URL) {
  console.error('MENU_CSV_URL env var is not set.');
  process.exit(1);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (ch === '\r') {
      // ignore
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function htmlEscape(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Returns formatted price string ("$5" or "$6.50"), or null for empty / em-dash.
// Throws if non-numeric.
function formatPrice(raw, label) {
  const s = String(raw ?? '').trim();
  if (s === '' || s === '-' || s === '--' || s === '—') return null;
  const stripped = s.replace(/^\$/, '').replace(/,/g, '');
  const n = Number(stripped);
  if (!Number.isFinite(n)) {
    throw new Error(`${label} is not a number: "${raw}"`);
  }
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

async function loadCSV(url) {
  if (url.startsWith('file://')) {
    return fs.readFileSync(fileURLToPath(url), 'utf8');
  }
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function buildHTML(categories) {
  const tabsLines = ['      <button class="menu-tab on" data-filter="all">All</button>'];
  for (const cat of categories) {
    tabsLines.push(`      <button class="menu-tab" data-filter="${htmlEscape(cat.slug)}">${htmlEscape(cat.display)}</button>`);
  }
  const tabsBody = tabsLines.join('\n');

  const sectionLines = [];
  for (const cat of categories) {
    sectionLines.push('');
    sectionLines.push(`      <!-- ${cat.display} -->`);
    sectionLines.push(`      <section class="menu-section" data-category="${htmlEscape(cat.slug)}">`);
    sectionLines.push(`        <h3>${htmlEscape(cat.display)}</h3><hr class="divider-sm">`);

    const hasWine = cat.items.some(it => it.isWine);
    if (hasWine) {
      sectionLines.push('        <div class="wine-head">');
      sectionLines.push('          <span>Variety</span>');
      sectionLines.push('          <span>Glass</span>');
      sectionLines.push('          <span>Bottle</span>');
      sectionLines.push('        </div>');
    }

    for (const it of cat.items) {
      const nameEsc = htmlEscape(it.name);
      if (it.isWine) {
        const glassCell = it.glass === null
          ? '<span class="price empty">&mdash;</span>'
          : `<span class="price">${htmlEscape(it.glass)}</span>`;
        const bottleCell = it.bottle === null
          ? '<span class="price empty">&mdash;</span>'
          : `<span class="price">${htmlEscape(it.bottle)}</span>`;
        sectionLines.push(`        <div class="wine-row"><span class="name">${nameEsc}</span>${glassCell}${bottleCell}</div>`);
      } else {
        sectionLines.push(`        <div class="menu-item"><span class="name">${nameEsc}</span><span class="price">${htmlEscape(it.price ?? '')}</span></div>`);
      }
    }

    sectionLines.push('      </section>');
  }
  const sectionsBody = sectionLines.join('\n');

  return { tabsBody, sectionsBody };
}

function replaceBlock(source, startMark, endMark, body) {
  const startIdx = source.indexOf(startMark);
  const endIdx = source.indexOf(endMark);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Markers not found or out of order: ${startMark} / ${endMark}`);
  }
  const before = source.slice(0, startIdx + startMark.length);
  const after = source.slice(endIdx);
  return `${before}\n${body}\n      ${after}`;
}

async function main() {
  let csvText;
  try {
    csvText = await loadCSV(CSV_URL);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    console.error('CSV has no data rows.');
    process.exit(2);
  }

  const header = rows[0].map(h => h.trim().toLowerCase());
  const required = ['category', 'name', 'price', 'glass', 'bottle'];
  const idx = {};
  for (const col of required) {
    const i = header.indexOf(col);
    if (i === -1) {
      console.error(`Missing required column "${col}". Found: ${header.join(', ')}`);
      process.exit(2);
    }
    idx[col] = i;
  }

  const categories = [];
  const bySlug = new Map();
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const cells = {
      category: (row[idx.category] || '').trim(),
      name: (row[idx.name] || '').trim(),
      price: (row[idx.price] || '').trim(),
      glass: (row[idx.glass] || '').trim(),
      bottle: (row[idx.bottle] || '').trim(),
    };

    if (!cells.category && !cells.name && !cells.price && !cells.glass && !cells.bottle) continue;

    const rowLabel = `Row ${r + 1}`;
    if (!cells.category) { errors.push(`${rowLabel}: missing Category`); continue; }
    if (!cells.name) { errors.push(`${rowLabel} (${cells.category}): missing Name`); continue; }
    if (!cells.price && !cells.glass && !cells.bottle) {
      errors.push(`${rowLabel} (${cells.category} / ${cells.name}): no Price, Glass, or Bottle`);
      continue;
    }

    let priceFmt = null, glassFmt = null, bottleFmt = null;
    try {
      if (cells.price) priceFmt = formatPrice(cells.price, 'Price');
      if (cells.glass) glassFmt = formatPrice(cells.glass, 'Glass');
      else if (cells.bottle) glassFmt = null;
      if (cells.bottle) bottleFmt = formatPrice(cells.bottle, 'Bottle');
      else if (cells.glass) bottleFmt = null;
    } catch (e) {
      errors.push(`${rowLabel} (${cells.name}): ${e.message}`);
      continue;
    }

    const sl = slugify(cells.category);
    if (!bySlug.has(sl)) {
      const cat = { slug: sl, display: cells.category, items: [] };
      categories.push(cat);
      bySlug.set(sl, cat);
    }
    bySlug.get(sl).items.push({
      name: cells.name,
      price: priceFmt,
      glass: glassFmt,
      bottle: bottleFmt,
      isWine: cells.glass !== '' || cells.bottle !== '',
    });
  }

  if (errors.length > 0) {
    console.error('Validation errors:');
    for (const e of errors) console.error('  - ' + e);
    process.exit(2);
  }
  if (categories.length === 0) {
    console.error('No menu items in sheet.');
    process.exit(2);
  }

  const { tabsBody, sectionsBody } = buildHTML(categories);

  let html;
  try {
    html = fs.readFileSync(MENU_HTML, 'utf8');
  } catch (e) {
    console.error(`Cannot read menu.html: ${e.message}`);
    process.exit(1);
  }

  let next;
  try {
    next = replaceBlock(html, MARK.tabsStart, MARK.tabsEnd, tabsBody);
    next = replaceBlock(next, MARK.sectionsStart, MARK.sectionsEnd, sectionsBody);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  if (next === html) {
    console.log('Menu unchanged.');
    return;
  }
  fs.writeFileSync(MENU_HTML, next, 'utf8');
  console.log(`Menu updated (${categories.length} categories, ${categories.reduce((n, c) => n + c.items.length, 0)} items).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
