# العربية للشوكلاطه — website

Static site for a chocolate brand. Plain HTML/CSS/JS, **no build step** — open `index.html`
directly or serve the folder with any static file server.

## Pages

- `index.html` — home: hero, story/timeline, photo gallery, values, featured products teaser
- `products.html` — full product grid with category filters; each "order" link goes to
  `contact.html?product=<id>`
- `contact.html` — contact channels (WhatsApp/phone/Instagram), map placeholder, and — when
  arriving from a product link — a prefilled WhatsApp button for that product

All three pages share the same header/footer markup and load the same script bundle in the
same order (`config.js` → `i18n.js` → `products.js` → `main.js` → `motion.js`).

## Language (i18n)

- Arabic is the default language; Hebrew is a toggle (button in the header). **Both layouts are
  RTL** (`dir="rtl"` on `<html>`) — Hebrew does not switch to LTR, only the text changes.
  (`js-phone-text` and similar fields still force `dir="ltr"` for phone numbers.)
- The chosen language is persisted in `localStorage` (`arabiya-lang`) and falls back to
  `CONFIG.defaultLang`.
- All page text lives in `js/i18n.js` as an `I18N.ar` / `I18N.he` key map. HTML elements mark
  their text with `data-i18n="some.key"`, and `applyLanguage()` in `js/main.js` fills them in on
  load and on every language switch.
- Never hardcode Arabic/Hebrew text in the HTML — add a key to `i18n.js` and reference it with
  `data-i18n` instead.

## Key files

- `js/config.js` — business settings: WhatsApp number, phone display, Instagram handle,
  currency symbol, default language. **Edit this first** before launch.
- `js/products.js` — `CATEGORIES` and `PRODUCTS` arrays: product names/prices/descriptions
  (per language) and the category filter list. `featured: true` makes a product show on the
  home page teaser grid.
- `js/i18n.js` — every piece of UI copy, keyed by `data-i18n` id, one object per language.
- `js/main.js` — shared app logic: language switching, header/menu behavior, rendering product
  cards and filters from `products.js`/`i18n.js`, and the contact-page "selected product" logic
  driven by the `?product=` query string.
- `js/motion.js` — purely cosmetic: cursor ring, scroll progress bar, tilt/parallax effects. Safe
  to disable or simplify without touching layout or content logic.
- `css/styles.css` — all styling; brand colors and fonts are defined as custom properties in
  `:root` at the top of the file.
- `assets/` — static assets (currently just `favicon.svg`); product/story photos go in
  `assets/products/` and `assets/photos/` per the README checklist (not yet added).

## Conventions

- No framework, no bundler, no package.json — just edit the files and reload.
- Product/category data is duplicated per language inline (`{ ar: "...", he: "..." }`) rather
  than using a separate translation lookup — keep that pattern when adding products.
- WhatsApp links are built in `main.js` via `waLink()` from `CONFIG.whatsapp`; don't hardcode
  `wa.me` URLs elsewhere.
