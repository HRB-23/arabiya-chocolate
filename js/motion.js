/* ============================================================
   MOTION — the site reacting to the visitor's movement.
   Works on every page; each effect only runs if its elements exist.
   Everything is switched off for users with "reduce motion" enabled.
   ============================================================ */
(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- Scroll progress bar ---------- */
  const bar = document.querySelector(".scroll-progress");
  function updateProgress() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (reduceMotion) return;

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  function reveal(selector) {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (el.classList.contains("reveal")) return;
      el.classList.add("reveal");
      el.style.setProperty("--d", `${(i % 6) * 90}ms`);
      io.observe(el);
    });
  }
  [".section-head", ".story-media", ".story-copy > *", ".timeline li", ".g-item", ".value",
   ".filters", ".steps li", ".channel", ".selected", ".visit > *", ".cta-inner > *",
   ".center", ".page-hero .container > *"].forEach(reveal);
  const revealCards = () => reveal(".grid .card");
  revealCards();
  document.addEventListener("productsrendered", revealCards);

  /* ---------- Hero title: words rise in one by one ---------- */
  const title = document.querySelector(".hero h1");
  function splitTitle() {
    if (!title) return;
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = "";
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--i", i);
      span.textContent = w;
      title.append(span, i < words.length - 1 ? " " : "");
    });
    title.classList.remove("words-in");
    void title.offsetWidth;
    title.classList.add("words-in");
  }
  splitTitle();
  document.addEventListener("langchange", splitTitle);

  /* ---------- Pointer + phone tilt ---------- */
  let px = -9999, py = -9999, nx = 0, ny = 0, tilt = false;
  window.addEventListener("pointermove", (e) => {
    px = e.clientX; py = e.clientY;
    if (!tilt) { nx = (px / innerWidth - 0.5) * 2; ny = (py / innerHeight - 0.5) * 2; }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { px = py = -9999; });

  window.addEventListener("deviceorientation", (e) => {
    if (e.gamma == null) return;
    tilt = true;
    nx = clamp(e.gamma / 25, -1, 1);
    ny = clamp((e.beta - 45) / 25, -1, 1);
  });

  const hero = document.querySelector(".hero");
  const art = document.querySelector(".hero-art");
  const heroCopy = document.querySelector(".hero-copy");
  if (hero && typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    hero.addEventListener("touchend", function ask() {
      DeviceOrientationEvent.requestPermission().catch(() => {});
      hero.removeEventListener("touchend", ask);
    });
  }

  const bonbons = art ? [...art.querySelectorAll(".bonbon")].map((el) => ({
    el, depth: parseFloat(el.dataset.depth) || 1, x: 0, y: 0, r: 0,
  })) : [];
  const decos = [...document.querySelectorAll(".page-hero-deco span")].map((el, i) => ({ el, depth: 0.6 + i * 0.5, x: 0, y: 0 }));
  let hx = 0, hy = 0;

  /* ---------- Cursor ring ---------- */
  const ring = document.querySelector(".cursor-ring");
  let rx = innerWidth / 2, ry = innerHeight / 2;
  if (finePointer) {
    document.addEventListener("pointerover", (e) => {
      ring.classList.add("is-visible");
      ring.classList.toggle("is-hover", !!e.target.closest("a, button, .card, .g-item"));
    });
    document.documentElement.addEventListener("pointerleave", () => ring.classList.remove("is-visible"));
    document.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    document.addEventListener("pointerup", () => ring.classList.remove("is-down"));
  }

  function frame() {
    // Home hero chocolates: parallax + dodge cursor + scroll drift
    if (hero && art) {
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        const scrolled = Math.max(0, -heroRect.top);
        bonbons.forEach((b) => {
          let tx = -nx * 22 * b.depth;
          let ty = -ny * 22 * b.depth - scrolled * 0.22 * b.depth;
          const r = b.el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - b.x;
          const cy = r.top + r.height / 2 - b.y;
          const dx = cx - px, dy = cy - py;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = r.width * 0.75 + 70;
          if (dist < radius) {
            const force = (1 - dist / radius) * 55;
            tx += (dx / dist) * force;
            ty += (dy / dist) * force;
          }
          b.x = lerp(b.x, tx, 0.08);
          b.y = lerp(b.y, ty, 0.08);
          b.r = lerp(b.r, nx * 12 * b.depth, 0.06);
          b.el.style.translate = `${b.x.toFixed(2)}px ${b.y.toFixed(2)}px`;
          b.el.style.rotate = `${b.r.toFixed(2)}deg`;
        });
        hx = lerp(hx, -nx * 8, 0.08);
        hy = lerp(hy, -ny * 8, 0.08);
        art.style.setProperty("--hx", `${hx.toFixed(2)}px`);
        art.style.setProperty("--hy", `${hy.toFixed(2)}px`);
        if (heroCopy) {
          heroCopy.style.translate = `0 ${(scrolled * 0.18).toFixed(1)}px`;
          heroCopy.style.opacity = clamp(1 - scrolled / 520, 0, 1);
        }
      }
    }

    // Inner-page banner decorations
    decos.forEach((d) => {
      d.x = lerp(d.x, -nx * 20 * d.depth, 0.06);
      d.y = lerp(d.y, -ny * 14 * d.depth + scrollY * 0.15 * d.depth, 0.06);
      d.el.style.translate = `${d.x.toFixed(2)}px ${d.y.toFixed(2)}px`;
    });

    if (finePointer && px > -9999) {
      rx = lerp(rx, px, 0.2);
      ry = lerp(ry, py, 0.2);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Cursor spotlights ---------- */
  document.querySelectorAll(".hero, .section-dark, .page-hero").forEach((sec) => {
    sec.addEventListener("pointermove", (e) => {
      const r = sec.getBoundingClientRect();
      sec.style.setProperty("--sx", `${e.clientX - r.left}px`);
      sec.style.setProperty("--sy", `${e.clientY - r.top}px`);
    });
  });

  if (finePointer) {
    /* ---------- 3D tilt + light reflection on cards, gallery photos, channels ---------- */
    const TILT = ".card, .g-item, .channel, .value";
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest(TILT);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const strength = el.classList.contains("g-item") ? 6 : 12;
      el.classList.add("is-tilting");
      el.style.setProperty("--rx", `${((0.5 - y) * strength).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * strength * 1.2).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--mx", `${((x - 0.5) * 18).toFixed(1)}px`);
      el.style.setProperty("--my", `${((y - 0.5) * 18).toFixed(1)}px`);
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const el = e.target.closest && e.target.closest(TILT);
      if (!el || el.contains(e.relatedTarget)) return;
      el.classList.remove("is-tilting");
      ["--rx", "--ry", "--mx", "--my"].forEach((p) => el.style.removeProperty(p));
    });

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll(".btn:not(.btn-small), .lang-toggle").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${(e.clientX - (r.left + r.width / 2)) * 0.25}px ${(e.clientY - (r.top + r.height / 2)) * 0.35}px`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.translate = ""; });
    });
  }

  /* ---------- Click burst ---------- */
  const COLORS = ["#c8a165", "#e8cf9c", "#5a3a2c", "#2b1a14", "#a3c47a"];
  function burst(x, y) {
    for (let i = 0; i < 12; i++) {
      const s = document.createElement("span");
      s.className = "particle";
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.background = COLORS[i % COLORS.length];
      const size = 4 + Math.random() * 6;
      s.style.width = s.style.height = `${size}px`;
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2;
      const d = 40 + Math.random() * 60;
      s.animate(
        [
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 20}px)) scale(0)`, opacity: 0 },
        ],
        { duration: 650 + Math.random() * 350, easing: "cubic-bezier(.2,.8,.2,1)" }
      ).onfinish = () => s.remove();
    }
  }
  document.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hero, .page-hero, .btn, .card")) burst(e.clientX, e.clientY);
  });

  /* ---------- Header hides on scroll down ---------- */
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("nav");
  let lastY = scrollY;
  window.addEventListener("scroll", () => {
    const y = scrollY;
    header.classList.toggle("is-hidden", y > lastY && y > 300 && !nav.classList.contains("is-open"));
    lastY = y;
  }, { passive: true });
})();
