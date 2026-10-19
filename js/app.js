/* ==========================================================
   Portfolio app — rendering, themes, snake cursor, carousels
   ========================================================== */
(function () {
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };
  const esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ACH_ICONS = ["award", "book", "star", "users", "chat", "heart", "check", "flask"];

  let C = null; // current content

  /* ---------------- Themes ---------------- */
  function hexRgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(","); }
  let theme = null;
  function applyTheme(id) {
    theme = window.THEMES.find(function (t) { return t.id === id; }) || window.THEMES[0];
    const r = document.documentElement.style;
    ["a1", "a2", "a3", "bg", "bg2"].forEach(function (k) { r.setProperty("--" + k, theme[k]); r.setProperty("--" + k + "-rgb", hexRgb(theme[k])); });
    document.body.classList.toggle("light", !!theme.light);
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = theme.bg;
    $$(".swatch").forEach(function (s) { s.classList.toggle("on", s.dataset.id === theme.id); });
    if (window.Scene3D) window.Scene3D.setTheme(theme);
    try { localStorage.setItem("gh_theme", theme.id); } catch (e) {}
  }
  function buildThemePicker() {
    let html = "";
    window.THEMES.forEach(function (t) {
      if (t.group) html += '<p class="theme-group">' + t.group + "</p>";
      html += '<button class="swatch" data-id="' + t.id + '" title="' + t.name + '"><span style="background:linear-gradient(135deg,' + t.a1 + "," + t.a2 + ')"></span>' + t.name + "</button>";
    });
    $("#themeGrid").innerHTML = html;
    $$(".swatch").forEach(function (b) { b.onclick = function () { applyTheme(b.dataset.id); }; });
    $("#themeBtn").innerHTML = icon("palette");
    $("#themeClose").innerHTML = icon("x");
    $("#themeBtn").onclick = function (e) { e.stopPropagation(); $("#themePanel").classList.toggle("open"); };
    $("#themeClose").onclick = function () { $("#themePanel").classList.remove("open"); };
    document.addEventListener("click", function (e) { if (!e.target.closest("#themePanel,#themeBtn")) $("#themePanel").classList.remove("open"); });
  }

  /* ---------------- Rendering ---------------- */
  function chips(list) { return (list || []).map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join(""); }

  function render(content) {
    C = content;
    const h = C.hero;
    const full = (h.firstName + " " + h.lastName).trim();
    document.title = full + " — Professional Portfolio";
    $("#brandName").textContent = full; $("#footName").textContent = full;
    $("#brandRole").textContent = h.title;
    const ini = (h.firstName[0] || "") + (h.lastName[0] || "");
    $("#brandMark").textContent = ini.toUpperCase();
    $("#heroGreeting").textContent = h.greeting;
    $("#heroFirst").textContent = h.firstName; $("#heroLast").textContent = h.lastName;
    $("#heroTitle").textContent = h.title;
    $("#heroTagline").textContent = h.tagline;
    $("#heroIntro").textContent = h.intro;
    $("#heroHighlights").innerHTML = (h.highlights || []).map(function (x) { return "<li>" + icon(x.icon) + "<span>" + esc(x.text) + "</span></li>"; }).join("");
    $("#heroStats").innerHTML = (h.stats || []).map(function (s) { return '<div class="stat"><strong>' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></div>"; }).join("");
    $("#heroPhoto").innerHTML = h.photo ? '<img src="' + esc(h.photo) + '" alt="' + esc(full) + '" />' : "";
    $("#heroPhoto").classList.toggle("has", !!h.photo);
    const cv = $("#cvBtn");
    if (h.cvUrl) { cv.style.display = ""; cv.href = h.cvUrl; cv.setAttribute("download", ""); cv.setAttribute("target", "_blank"); cv.innerHTML = icon("download") + "<span>Download CV</span>"; }
    else { cv.style.display = "none"; }

    // About
    const a = C.about;
    $("#aboutHeading").innerHTML = esc(a.heading).replace(/(learning[^.]*)/i, '<span class="grad">$1</span>');
    $("#aboutPoints").innerHTML = (a.points || []).map(function (p) { return '<li><span class="dot">' + icon("check") + "</span><div><strong>" + esc(p.lead) + "</strong><p>" + esc(p.text) + "</p></div></li>"; }).join("");
    $("#aboutFacts").innerHTML = (a.facts || []).map(function (f) { return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>"; }).join("");
    $("#aboutLangs").innerHTML = chips(a.languages);
    $("#aboutHobbies").innerHTML = chips(a.hobbies);
    $("#achievements").innerHTML = (C.achievements || []).map(function (x, i) {
      return '<article class="glass ach tilt reveal"><span class="ach-ico">' + icon(ACH_ICONS[i % ACH_ICONS.length]) + "</span><h4>" + esc(x.title) + "</h4><p>" + esc(x.text) + "</p></article>";
    }).join("");

    // Education
    $("#eduTimeline").innerHTML = (C.education || []).map(function (e) {
      return '<article class="tl-item reveal"><span class="tl-dot">' + icon("book") + '</span><div class="glass tl-card tilt"><span class="period">' + esc(e.period) + "</span><h3>" + esc(e.school) + '</h3><p class="place">' + icon("pin") + esc(e.place) + '</p><ul class="bullets compact">' +
        (e.points || []).map(function (p) { return '<li><span class="dot">' + icon("check") + "</span><div><p>" + esc(p) + "</p></div></li>"; }).join("") + "</ul></div></article>";
    }).join("");
    $("#scienceFocus").innerHTML = chips(C.scienceFocus);

    // Skills
    buildCoverflow(C.skillCards || []);
    $("#proSkills").innerHTML = chips(C.professionalSkills);
    $("#itSkills").innerHTML = chips(C.itSkills);

    // Experience
    $("#expList").innerHTML = (C.experience || []).map(function (x) {
      return '<article class="glass exp reveal"><div class="exp-head"><span class="exp-ico">' + icon("brief") + "</span><div><h3>" + esc(x.role) + '</h3><p class="exp-type">' + esc(x.type) + '</p></div><div class="exp-meta"><span>' + icon("pin") + esc(x.place) + "</span><span>" + icon("calendar") + esc(x.period) + '</span></div></div><ul class="bullets compact">' +
        (x.points || []).map(function (p) { return '<li><span class="dot">' + icon("check") + "</span><div><p>" + esc(p) + "</p></div></li>"; }).join("") +
        '</ul><div class="chips">' + chips(x.tags) + "</div></article>";
    }).join("");
    const g = C.gallery || { items: [] };
    $("#galleryTitle").textContent = g.title || "";
    $("#galleryTitle").style.display = g.items && g.items.length ? "" : "none";
    $("#gallery").innerHTML = (g.items || []).map(function (it) {
      return '<figure class="glass gal tilt reveal" data-img="' + esc(it.image) + '" data-cap="' + esc(it.caption) + '"><img src="' + esc(it.image) + '" alt="' + esc(it.caption) + '" loading="lazy" /><figcaption>' + esc(it.caption) + "</figcaption></figure>";
    }).join("");
    $$("#gallery .gal").forEach(function (f) { f.onclick = function () { openLightbox(f.querySelector('img').src, f.dataset.cap); }; });
    $("#keySkills").innerHTML = (C.keySkills || []).map(function (p) { return '<li><span class="dot">' + icon("check") + "</span><div><p>" + esc(p) + "</p></div></li>"; }).join("");

    // Certificates
    buildCertRing(C.certificates || []);

    // Contact
    const ct = C.contact;
    $("#contactHeading").innerHTML = esc(ct.heading).replace(/(\S+)$/, '<span class="grad">$1</span>');
    $("#contactText").textContent = ct.text;
    const rows = [];
    if (ct.email) rows.push(['mail', "Email", '<a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a><button class="copy" data-copy="' + esc(ct.email) + '" aria-label="Copy email">' + icon("copy") + "</button>"]);
    if (ct.phone) rows.push(["phone", "Phone", '<a href="tel:' + esc(ct.phone.replace(/\s/g, "")) + '">' + esc(ct.phone) + "</a>"]);
    if (ct.location) rows.push(["pin", "Location", esc(ct.location)]);
    if (ct.linkedin) rows.push(["linkedin", "LinkedIn", '<a href="' + esc(ct.linkedin) + '" target="_blank" rel="noopener">' + esc(ct.linkedin.replace(/^https?:\/\/(www\.)?/, "")) + "</a>"]);
    if (ct.instagram) rows.push(["instagram", "Instagram", '<a href="' + esc(ct.instagram) + '" target="_blank" rel="noopener">' + esc(ct.instagram.replace(/^https?:\/\/(www\.)?/, "")) + "</a>"]);
    $("#contactList").innerHTML = rows.map(function (r) { return '<li><span class="c-ico">' + icon(r[0]) + "</span><div><small>" + r[1] + "</small><span>" + r[2] + "</span></div></li>"; }).join("");
    $$(".copy").forEach(function (b) { b.onclick = function () { navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy); toast("Email copied"); }; });
    $("#contactMotto").innerHTML = icon("heart") + "<p>" + esc(ct.motto) + "</p>";
    $("#footNote").textContent = (C.footer && C.footer.note) || "";

    renderFeedback();

    // Section visibility
    const vis = C.sections || {};
    Object.keys(vis).forEach(function (k) {
      const sec = document.getElementById(k); if (sec) sec.style.display = vis[k] === false ? "none" : "";
      const link = $('#navLinks a[data-sec="' + k + '"]'); if (link) link.style.display = vis[k] === false ? "none" : "";
    });

    hydrateIcons();
    observeReveal();
    bindTilt();
  }

  /* ---------------- Skills coverflow ---------------- */
  let flow = { i: 0, n: 0, timer: null };
  function buildCoverflow(cards) {
    const stage = $("#skillStage");
    flow.n = cards.length; if (flow.i >= flow.n) flow.i = 0;
    stage.innerHTML = cards.map(function (s, i) {
      const lvl = Math.max(0, Math.min(100, +s.level || 0));
      return '<article class="flow-card glass" data-i="' + i + '"><span class="flow-ico">' + icon(s.icon) + "</span><h3>" + esc(s.title) + "</h3><p>" + esc(s.text) + '</p><div class="bar"><span style="--w:' + lvl + '%"></span></div><b>' + lvl + "%</b></article>";
    }).join("");
    $$(".flow-card", stage).forEach(function (c) { c.onclick = function () { flow.i = +c.dataset.i; layoutFlow(); restartFlow(); }; });
    layoutFlow(); restartFlow();
  }
  function layoutFlow() {
    const w = window.innerWidth, gap = w < 640 ? 150 : w < 1000 ? 200 : 240;
    $$(".flow-card").forEach(function (c, i) {
      let d = i - flow.i;
      if (d > flow.n / 2) d -= flow.n; if (d < -flow.n / 2) d += flow.n;
      const ad = Math.abs(d);
      c.style.transform = "translate(-50%,-50%) translateX(" + d * gap + "px) translateZ(" + -ad * 170 + "px) rotateY(" + -d * 32 + "deg) scale(" + (d === 0 ? 1.08 : 1 - ad * 0.06) + ")";
      c.style.zIndex = 20 - ad; c.style.opacity = ad > 3 ? 0 : 1 - ad * 0.18;
      c.style.pointerEvents = ad > 3 ? "none" : "";
      c.classList.toggle("active", d === 0);
    });
  }
  function stepFlow(dir) { flow.i = (flow.i + dir + flow.n) % flow.n; layoutFlow(); }
  function restartFlow() { clearInterval(flow.timer); if (!reduce) flow.timer = setInterval(function () { stepFlow(1); }, 3500); }
  function initFlowControls() {
    $("#skillPrev").innerHTML = icon("left"); $("#skillNext").innerHTML = icon("right");
    $("#skillPrev").onclick = function () { stepFlow(-1); restartFlow(); };
    $("#skillNext").onclick = function () { stepFlow(1); restartFlow(); };
    const el = $("#skillFlow"); let sx = null;
    el.addEventListener("mouseenter", function () { clearInterval(flow.timer); });
    el.addEventListener("mouseleave", restartFlow);
    el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener("touchend", function (e) { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { stepFlow(dx < 0 ? 1 : -1); restartFlow(); } sx = null; });
    window.addEventListener("resize", layoutFlow);
  }

  /* ---------------- Certificates 3D ring ---------------- */
  const ring = { rot: 0, speed: 0.12, paused: false, hover: false, n: 0, step: 0, target: null, drag: null, moved: false };
  function buildCertRing(certs) {
    const el = $("#certRing"); ring.n = certs.length; ring.step = ring.n ? 360 / ring.n : 0;
    el.innerHTML = certs.map(function (c, i) {
      return '<figure class="cert" data-i="' + i + '"><div class="cert-img"><img src="' + esc(c.image) + '" alt="' + esc(c.title) + '" loading="lazy" draggable="false" /></div><figcaption>' + esc(c.title) + "</figcaption></figure>";
    }).join("");
    $$(".cert", el).forEach(function (f) {
      f.addEventListener("click", function () {
        if (ring.moved) return;
        const c = certs[+f.dataset.i]; openLightbox(f.querySelector('img').src, "<strong>" + esc(c.title) + "</strong><span>" + esc(c.text) + "</span>", true);
      });
    });
    ring.certs = certs;
    sizeRing();
  }
  function sizeRing() {
    const w = window.innerWidth;
    const cw = w < 640 ? 210 : w < 1000 ? 260 : 320;
    document.documentElement.style.setProperty("--cert-w", cw + "px");
    ring.radius = ring.n > 1 ? Math.max(cw * 0.95, (cw / 2) / Math.tan(Math.PI / Math.max(ring.n, 3)) + (w < 640 ? 30 : 70)) : 0;
    if (w < 640) ring.radius = Math.min(ring.radius, 260);
  }
  function ringFrame() {
    if (ring.n) {
      if (ring.target != null) {
        const diff = ring.target - ring.rot; ring.rot += diff * 0.08;
        if (Math.abs(diff) < 0.1) ring.target = null;
      } else if (!ring.paused && !ring.hover && !ring.drag && !reduce) ring.rot += ring.speed;
      let front = 0, best = -2;
      $$(".cert").forEach(function (f, i) {
        const ang = i * ring.step + ring.rot;
        const cos = Math.cos(ang * Math.PI / 180);
        f.style.transform = "rotateY(" + ang + "deg) translateZ(" + ring.radius + "px)";
        f.style.opacity = (0.35 + 0.65 * (cos + 1) / 2).toFixed(3);
        f.style.filter = "brightness(" + (0.55 + 0.45 * (cos + 1) / 2).toFixed(3) + ")";
        f.style.zIndex = Math.round(cos * 100) + 100;
        if (cos > best) { best = cos; front = i; }
      });
      if (ring.front !== front && ring.certs && ring.certs[front]) {
        ring.front = front;
        $$(".cert").forEach(function (f, i) { f.classList.toggle("front", i === front); });
        $("#certCaption").innerHTML = "<strong>" + esc(ring.certs[front].title) + "</strong>" + esc(ring.certs[front].text);
      }
    }
    requestAnimationFrame(ringFrame);
  }
  function initRingControls() {
    $("#certPrev").innerHTML = icon("left"); $("#certNext").innerHTML = icon("right"); $("#certPause").innerHTML = icon("pause");
    function snap(dir) { const base = ring.target != null ? ring.target : ring.rot; ring.target = Math.round(base / ring.step) * ring.step + dir * ring.step; }
    $("#certPrev").onclick = function () { snap(-1); };
    $("#certNext").onclick = function () { snap(1); };
    $("#certPause").onclick = function () { ring.paused = !ring.paused; $("#certPause").innerHTML = icon(ring.paused ? "play" : "pause"); $("#certPause").setAttribute("aria-label", ring.paused ? "Play rotation" : "Pause rotation"); };
    const scene = $("#certScene");
    scene.addEventListener("mouseenter", function () { ring.hover = true; });
    scene.addEventListener("mouseleave", function () { ring.hover = false; });
    scene.addEventListener("pointerdown", function (e) { ring.drag = { x: e.clientX, r: ring.rot }; ring.moved = false; ring.target = null; });
    window.addEventListener("pointermove", function (e) { if (!ring.drag) return; const dx = e.clientX - ring.drag.x; if (Math.abs(dx) > 6) ring.moved = true; ring.rot = ring.drag.r + dx * 0.3; });
    window.addEventListener("pointerup", function () { if (ring.drag) { ring.drag = null; setTimeout(function () { ring.moved = false; }, 50); } });
    window.addEventListener("resize", sizeRing);
    requestAnimationFrame(ringFrame);
  }

  /* ---------------- Lightbox ---------------- */
  function openLightbox(src, cap, html) {
    const lb = $("#lightbox"), img = $("#lbImg");
    img.src = src; img.alt = ""; img.classList.remove("zoom2");
    $("#lbCap").innerHTML = html ? cap : esc(cap);
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("noscroll");
  }
  function closeLightbox() { $("#lightbox").classList.remove("open"); $("#lightbox").setAttribute("aria-hidden", "true"); document.body.classList.remove("noscroll"); }
  function initLightbox() {
    $("#lbClose").innerHTML = icon("x");
    $("#lbClose").onclick = closeLightbox;
    $("#lightbox").addEventListener("click", function (e) { if (e.target.id === "lightbox") closeLightbox(); });
    $("#lbImg").addEventListener("click", function () { this.classList.toggle("zoom2"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------------- Snake cursor ---------------- */
  function initSnake() {
    const cv = $("#snake");
    if (!fine || reduce) { cv.remove(); return; }
    document.documentElement.classList.add("snake-on");
    const cx = cv.getContext("2d"); const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function rs() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    rs(); addEventListener("resize", rs);
    const N = 20, pts = []; const m = { x: innerWidth / 2, y: innerHeight / 2 };
    for (let i = 0; i < N; i++) pts.push({ x: m.x, y: m.y });
    let hot = false, visible = false, down = false;
    addEventListener("pointermove", function (e) { m.x = e.clientX; m.y = e.clientY; visible = true; hot = !!e.target.closest("a,button,.stars-input,.cert,.flow-card,.gal,input,textarea,select,label"); }, { passive: true });
    addEventListener("pointerdown", function () { down = true; }); addEventListener("pointerup", function () { down = false; });
    document.addEventListener("mouseleave", function () { visible = false; });
    function hex(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
    function mix(a, b, k) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }); }
    (function loop() {
      pts[0].x += (m.x - pts[0].x) * 0.55; pts[0].y += (m.y - pts[0].y) * 0.55;
      for (let i = 1; i < N; i++) { pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42; pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42; }
      cx.clearRect(0, 0, innerWidth, innerHeight);
      if (visible && theme) {
        const head = hex(theme.light ? theme.a1 : theme.a3), mid = hex(theme.a2), tail = hex(theme.a1);
        for (let i = N - 1; i >= 0; i--) {
          const k = i / (N - 1); const c = k < 0.5 ? mix(head, mid, k * 2) : mix(mid, tail, (k - 0.5) * 2);
          let r = 7.5 - k * 5.2; if (i === 0) r = hot ? 13 : down ? 5 : 8;
          cx.beginPath(); cx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2);
          cx.fillStyle = "rgba(" + c.join(",") + "," + (i === 0 && hot ? 0.35 : 1 - k * 0.7) + ")"; cx.fill();
          if (i === 0) { cx.lineWidth = 1.5; cx.strokeStyle = "rgba(" + mid.join(",") + ",0.9)"; cx.stroke(); }
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Feedback ---------------- */
  const STAR = '<svg viewBox="0 0 24 24" class="star" aria-hidden="true"><path d="M12 2.8l2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z"/></svg>';
  const RATE_TEXT = ["Tap a star", "Poor", "Fair", "Good", "Very good", "Excellent"];
  let remoteFb = [], fbRating = 0;
  function starRow(n) { let h = ""; for (let i = 1; i <= 5; i++) h += '<span class="' + (i <= Math.round(n) ? "on" : "") + '">' + STAR + "</span>"; return '<span class="stars" aria-label="' + n + ' out of 5">' + h + "</span>"; }
  function fbDate(d) { if (!d) return ""; const x = new Date(d); return isNaN(x) ? "" : x.toLocaleDateString(undefined, { month: "short", year: "numeric" }); }
  function renderFeedback() {
    if (!C) return;
    const f = C.feedback || { items: [] };
    $("#fbHeading").innerHTML = esc(f.heading || "").replace(/(\S+)$/, '<span class="grad">$1</span>');
    $("#fbText").textContent = f.text || "";
    const items = (f.items || []).concat(remoteFb).filter(function (x) { return x && x.message; });
    const n = items.length;
    if (n) {
      const avg = items.reduce(function (a, x) { return a + (+x.rating || 0); }, 0) / n;
      const bars = [5, 4, 3, 2, 1].map(function (k) {
        const c = items.filter(function (x) { return Math.round(+x.rating) === k; }).length;
        return '<div class="fb-bar"><span>' + k + '</span>' + STAR + '<div class="track"><i style="--w:' + Math.round(c / n * 100) + '%"></i></div><b>' + c + "</b></div>";
      }).join("");
      $("#fbSummary").innerHTML = '<p class="fb-avg">' + avg.toFixed(1) + '<small>/5</small></p>' + starRow(avg) + '<p class="fb-total">Based on ' + n + " review" + (n > 1 ? "s" : "") + '</p><div class="fb-bars">' + bars + "</div>";
    } else {
      $("#fbSummary").innerHTML = '<div class="fb-empty-ico">' + icon("star") + '</div><p class="fb-avg small">No reviews yet</p>' + starRow(0) + '<p class="fb-total">Be the first to share what you think of this portfolio.</p>';
    }
    const card = function (x) {
      const ini = esc((x.name || "?").trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase());
      return '<article class="glass fb-card"><span class="fb-quote">&ldquo;</span>' + starRow(+x.rating || 0) + '<p class="fb-text">' + esc(x.message) + '</p><div class="fb-who"><span class="fb-av">' + ini + "</span><div><strong>" + esc(x.name) + "</strong><small>" + esc([x.role, fbDate(x.created_at || x.date)].filter(Boolean).join(" · ")) + "</small></div></div></article>";
    };
    const wall = $("#fbWall");
    if (!n) { wall.innerHTML = ""; wall.className = "fb-wall"; return; }
    if (n >= 3 && !reduce) {
      const cards = items.map(card).join("");
      wall.className = "fb-wall marquee";
      wall.innerHTML = '<div class="fb-track" style="--dur:' + Math.max(25, n * 8) + 's">' + cards + cards + "</div>";
    } else { wall.className = "fb-wall static"; wall.innerHTML = items.map(card).join(""); }
  }
  async function loadRemoteFeedback() { remoteFb = await Store.feedback.listPublic(); renderFeedback(); }
  function initFeedbackForm() {
    const box = $("#starsInput"), txt = $("#rateText"), form = $("#fbForm"), out = $("#fbMsgOut"), msg = $("#fbMsg");
    box.innerHTML = [1, 2, 3, 4, 5].map(function (i) { return '<button type="button" role="radio" aria-checked="false" aria-label="' + i + " star" + (i > 1 ? "s" : "") + " — " + RATE_TEXT[i] + '" data-v="' + i + '">' + STAR + "</button>"; }).join("");
    const btns = $$("button", box);
    function paint(v) { btns.forEach(function (b) { b.classList.toggle("on", +b.dataset.v <= v); }); txt.textContent = RATE_TEXT[v] || RATE_TEXT[0]; }
    btns.forEach(function (b) {
      b.addEventListener("mouseenter", function () { paint(+b.dataset.v); });
      b.addEventListener("click", function () { fbRating = +b.dataset.v; btns.forEach(function (x) { x.setAttribute("aria-checked", String(+x.dataset.v === fbRating)); }); paint(fbRating); b.classList.add("pop"); setTimeout(function () { b.classList.remove("pop"); }, 400); out.textContent = ""; out.className = "form-msg"; });
    });
    box.addEventListener("mouseleave", function () { paint(fbRating); });
    msg.addEventListener("input", function () { $("#fbCount").textContent = msg.value.length + " / 800"; });
    form.addEventListener("input", function () { if (out.classList.contains("err")) { out.textContent = ""; out.className = "form-msg"; } });
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if ($("#fbHp").value) return;
      const name = $("#fbName").value.trim(), role = $("#fbRole").value.trim(), message = msg.value.trim();
      if (!fbRating) { out.textContent = "Choose a star rating first."; out.className = "form-msg err"; return; }
      if (!name) { out.textContent = "Add your name."; out.className = "form-msg err"; $("#fbName").focus(); return; }
      if (message.length < 3) { out.textContent = "Write a short message (at least 3 characters)."; out.className = "form-msg err"; msg.focus(); return; }
      let last = 0; try { last = +localStorage.getItem("gh_fb_last") || 0; } catch (err) {}
      if (Date.now() - last < 60000) { out.textContent = "Thanks! Please wait a minute before sending more feedback."; out.className = "form-msg err"; return; }
      const btn = $("button[type=submit]", form); btn.disabled = true; out.textContent = "Sending…"; out.className = "form-msg";
      try {
        const res = await Store.feedback.submit({ name: name, role: role, rating: fbRating, message: message, website: $("#fbHp").value });
        try { localStorage.setItem("gh_fb_last", String(Date.now())); } catch (err) {}
        form.reset(); fbRating = 0; paint(0); $("#fbCount").textContent = "0 / 800";
        if (res && res.approved) { out.textContent = "Thank you! Your feedback is now live on this page."; loadRemoteFeedback(); }
        else out.textContent = "Thank you! Your feedback was sent and will appear here once it's approved.";
        out.className = "form-msg ok";
        form.classList.add("sent"); setTimeout(function () { form.classList.remove("sent"); }, 1200);
      } catch (err) {
        out.textContent = err && err.code === "not-connected" ? "Feedback isn't available right now. Please try again later." : "Couldn't send your feedback. Check your connection and try again.";
        out.className = "form-msg err";
      }
      btn.disabled = false;
    });
  }

  /* ---------------- Nav, reveal, tilt, form ---------------- */
  let io = null;
  function observeReveal() {
    if (!("IntersectionObserver" in window) || reduce) { $$(".reveal").forEach(function (e) { e.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    $$(".reveal:not(.in)").forEach(function (e) { io.observe(e); });
  }
  function bindTilt() {
    if (!fine || reduce) return;
    $$(".tilt").forEach(function (el) {
      if (el.dataset.tb) return; el.dataset.tb = 1;
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(800px) rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 10) + "deg) translateZ(6px)";
        el.style.setProperty("--mx", (x + 0.5) * 100 + "%"); el.style.setProperty("--my", (y + 0.5) * 100 + "%");
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }
  function initNav() {
    const nav = $("#nav"), links = $$("#navLinks a");
    $("#menuBtn").onclick = function () { document.body.classList.toggle("menu-open"); };
    links.forEach(function (l) { l.addEventListener("click", function () { document.body.classList.remove("menu-open"); }); });
    function onScroll() {
      nav.classList.toggle("scrolled", scrollY > 20);
      let cur = "home";
      $$("main section").forEach(function (s) { if (s.style.display !== "none" && s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
      links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + cur); });
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }
  function initForm() {
    const f = $("#contactForm"), msg = $("#formMsg");
    f.addEventListener("input", function () { msg.textContent = ""; msg.className = "form-msg"; });
    f.addEventListener("submit", async function (e) {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(f));
      if (!d.name.trim() || !d.message.trim() || !/^\S+@\S+\.\S+$/.test(d.email)) { msg.textContent = "Add your name, a valid email and a message."; msg.className = "form-msg err"; return; }
      const cfg = window.SITE_CONFIG || {};
      if (cfg.formspreeId) {
        msg.textContent = "Sending…"; msg.className = "form-msg";
        try {
          const r = await fetch("https://formspree.io/f/" + cfg.formspreeId, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(d) });
          if (!r.ok) throw 0; f.reset(); msg.textContent = "Message sent. Thank you!"; msg.className = "form-msg ok";
        } catch (err) { msg.textContent = "Couldn't send right now. Email me directly instead."; msg.className = "form-msg err"; }
      } else {
        const body = encodeURIComponent(d.message + "\n\n— " + d.name + " (" + d.email + ")");
        location.href = "mailto:" + C.contact.email + "?subject=" + encodeURIComponent("Portfolio enquiry from " + d.name) + "&body=" + body;
        msg.textContent = "Opening your email app…"; msg.className = "form-msg ok";
      }
    });
  }

  function ask(text, okLabel) {
    return new Promise(function (res) {
      const m = document.createElement("div"); m.className = "modal open"; m.setAttribute("role", "dialog");
      m.innerHTML = '<div class="glass modal-box"><h3>' + icon("trash") + esc(okLabel || "Confirm") + '</h3><p class="muted">' + esc(text) + '</p><div class="modal-actions"><button class="btn btn-outline" data-a="0">Cancel</button><button class="btn btn-primary" data-a="1">' + esc(okLabel || "Confirm") + "</button></div></div>";
      document.body.appendChild(m);
      function done(v) { m.remove(); res(v); }
      m.addEventListener("click", function (e) { const b = e.target.closest("[data-a]"); if (b) done(b.dataset.a === "1"); else if (e.target === m) done(false); });
      m.querySelector('[data-a="1"]').focus();
    });
  }

  let tt = null;
  function toast(t, kind) { const el = $("#toast"); el.textContent = t; el.className = "toast show " + (kind || ""); clearTimeout(tt); tt = setTimeout(function () { el.className = "toast"; }, 2800); }

  /* If a local /images file is missing, load the copy from the original site. */
  const OLD_SITE = "https://ghazias-portfolio-m97k.vercel.app/images/";
  document.addEventListener("error", function (e) {
    const el = e.target;
    if (el.tagName !== "IMG" || el.dataset.fb) return;
    const m = (el.getAttribute("src") || "").match(/^images\/([\w.-]+)$/);
    if (m) { el.dataset.fb = 1; el.src = OLD_SITE + m[1]; return; }
    el.dataset.fb = 2; el.src = placeholder(el.getAttribute("alt") || "Image");
  }, true);
  function placeholder(label) {
    const t = theme || window.THEMES[0];
    const words = String(label).split(/\s+/); const lines = []; let cur = "";
    words.forEach(function (w) { if ((cur + " " + w).trim().length > 26) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
    if (cur.trim()) lines.push(cur.trim());
    const tx = lines.slice(0, 3).map(function (l, i) { return '<text x="400" y="' + (300 + i * 46) + '" font-family="Georgia,serif" font-size="34" fill="#1f2a44" text-anchor="middle">' + esc(l) + "</text>"; }).join("");
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560"><rect width="800" height="560" fill="#fdfbf5"/><rect x="24" y="24" width="752" height="512" fill="none" stroke="' + t.a1 + '" stroke-width="6"/><rect x="40" y="40" width="720" height="480" fill="none" stroke="' + t.a2 + '" stroke-width="1.5"/><text x="400" y="190" font-family="Georgia,serif" font-size="58" fill="' + t.a1 + '" text-anchor="middle" letter-spacing="4">CERTIFICATE</text>' + tx + '<circle cx="400" cy="470" r="30" fill="' + t.a2 + '" opacity=".8"/></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener("DOMContentLoaded", async function () {
    $("#year").textContent = new Date().getFullYear();
    buildThemePicker();
    let saved = null; try { saved = localStorage.getItem("gh_theme"); } catch (e) {}
    applyTheme(saved || "electric");
    initFlowControls(); initRingControls(); initLightbox(); initNav(); initForm(); initFeedbackForm(); initSnake();
    render(Store.initial());
    hydrateIcons();
    if (window.Scene3D) { window.Scene3D.resize(); window.Scene3D.start(); }
    setTimeout(function () { $("#loader").classList.add("done"); }, 500);
    const live = await Store.remote();
    if (live) render(live);
    loadRemoteFeedback();
  });

  window.App = { ask: ask, reloadFeedback: loadRemoteFeedback, render: render, get: function () { return C; }, toast: toast, esc: esc, theme: function () { return theme; } };
})();
