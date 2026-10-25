/* ============================================================
   App logic shared by all pages:
   language switch, header/menu, product cards, contact page.
   ============================================================ */
(function () {
  const LANG_KEY = "arabiya-lang";
  let lang = loadLang();
  let activeCategory = "all";
  const page = document.body.dataset.page;

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.ar[key] || key;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function loadLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "ar" || saved === "he") return saved;
    } catch (e) { /* storage blocked */ }
    return CONFIG.defaultLang;
  }
  function saveLang(v) { try { localStorage.setItem(LANG_KEY, v); } catch (e) { /* ignore */ } }

  const waLink = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const formatPrice = (p) => (p == null ? t("product.onRequest") : `${p} ${CONFIG.currency}`);
  const productArt = (p) => {
    const i = PRODUCTS.indexOf(p);
    return p.image
      ? `<img src="${p.image}" alt="${p.name[lang]}" loading="lazy" />`
      : `<div class="placeholder-art v${(i % 4) + 1}" aria-hidden="true"><span></span></div>`;
  };

  /* ---------- Language ---------- */
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = "rtl";
    document.body.classList.toggle("lang-he", lang === "he");

    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $("#langToggle").textContent = t("langSwitch");
    $$(".js-wa-general").forEach((a) => setExternal(a, waLink(t("wa.general"))));

    if ($("#filters")) renderFilters();
    if ($("#productGrid")) renderProducts($("#productGrid"),
      PRODUCTS.filter((p) => activeCategory === "all" || p.category === activeCategory));
    if ($("#featuredGrid")) renderProducts($("#featuredGrid"), PRODUCTS.filter((p) => p.featured));
    if (page === "contact") renderSelected();

    document.dispatchEvent(new CustomEvent("langchange"));
  }

  function setExternal(a, href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }

  /* ---------- Products ---------- */
  function renderFilters() {
    const wrap = $("#filters");
    wrap.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter" + (cat.id === activeCategory ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.id === activeCategory);
      btn.textContent = cat[lang];
      btn.addEventListener("click", () => {
        activeCategory = cat.id;
        renderFilters();
        renderProducts($("#productGrid"),
          PRODUCTS.filter((p) => activeCategory === "all" || p.category === activeCategory));
      });
      wrap.appendChild(btn);
    });
  }

  function renderProducts(grid, list) {
    grid.innerHTML = "";
    list.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-media">${productArt(p)}</div>
        <div class="card-body">
          <h3>${p.name[lang]}</h3>
          <p>${p.desc[lang]}</p>
          <div class="card-foot">
            <span class="price">${formatPrice(p.price)}</span>
            <a class="btn btn-small" href="contact.html?product=${encodeURIComponent(p.id)}">${t("product.order")}</a>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    document.dispatchEvent(new CustomEvent("productsrendered"));
  }

  /* ---------- Contact page: product chosen on the products page ---------- */
  function renderSelected() {
    const id = new URLSearchParams(location.search).get("product");
    const p = PRODUCTS.find((x) => x.id === id);
    const box = $("#selectedProduct");
    if (!p) { box.hidden = true; return; }
    box.hidden = false;
    $("#selMedia").innerHTML = productArt(p);
    $("#selName").textContent = p.name[lang];
    $("#selPrice").textContent = formatPrice(p.price);
    $("#selSend").href = waLink(t("wa.product").replace("{name}", p.name[lang]));
  }

  /* ---------- Static bits ---------- */
  function initStatic() {
    $$(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });

    $$(".js-phone-link").forEach((a) => { a.href = `tel:+${CONFIG.whatsapp}`; });
    $$(".js-phone-text").forEach((el) => { el.textContent = CONFIG.phoneDisplay; });
    $$(".js-instagram-link").forEach((a) => { a.href = `https://instagram.com/${CONFIG.instagram}`; });
    $$(".js-instagram-text").forEach((el) => { el.textContent = "@" + CONFIG.instagram; });

    $("#langToggle").addEventListener("click", () => {
      lang = lang === "ar" ? "he" : "ar";
      saveLang(lang);
      applyLanguage();
    });

    const nav = $("#nav");
    const menuBtn = $("#menuToggle");
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));

    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  initStatic();
  applyLanguage();
})();
