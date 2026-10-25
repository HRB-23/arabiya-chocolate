# العربية للشكولاطة — website

Static site (HTML/CSS/JS, no build step). Arabic default, Hebrew toggle, orders via WhatsApp.

## Structure
```
index.html        home — hero, story, timeline, photo gallery, values, featured products
products.html     all products with filters; "order" opens contact.html?product=<id>
contact.html      contact channels; shows the chosen product + prefilled WhatsApp button
css/styles.css    all styling — brand colors/fonts in :root at the top
js/config.js      WhatsApp number, phone, Instagram, currency  ← edit first
js/products.js    product list + categories                    ← edit second
js/i18n.js        all Arabic/Hebrew texts
js/main.js        language switch, product rendering, contact page logic
js/motion.js      cursor/scroll/tilt effects
assets/           favicon; put photos in assets/photos/ and assets/products/
```

## To fill in before launch
- [ ] `config.js`: real WhatsApp number (format `9725XXXXXXXX`), phone, Instagram
- [ ] `products.js`: real products, prices, photos (`image: "assets/products/x.jpg"`)
- [ ] `i18n.js`: address, opening hours, About text
- [ ] Story text, founder name, timeline years in `i18n.js` (anything in [brackets])
- [ ] Photos: replace each `<div class="photo">` in index.html with `<img class="photo" src="assets/photos/..." alt="...">`
- [ ] Replace `.map-placeholder` in index.html with a Google Maps embed iframe
- [ ] Logo (currently a CSS placeholder mark)

## Run locally
Open `index.html` in a browser, or `python3 -m http.server` in this folder.

## Deploy (free)
GitHub Pages: push the folder to a repo → Settings → Pages → branch `main`, root.
Or drag the folder into Netlify Drop.
