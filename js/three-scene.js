/* ==========================================================
   3D scenes (Three.js)
   - Background: capsules, tablets, DNA helices, molecules and
     particles drifting randomly; the scene follows the mouse
     and scroll (moveable background).
   - Hero: glass medicine bottle with orbiting capsules.
   Every accent colour follows the selected theme.
   ========================================================== */
(function () {
  if (!window.THREE) return;
  const T = window.THREE;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.innerWidth < 760;
  const DPR = Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6);
  const UP = new T.Vector3(0, 1, 0);

  // Theme-tracked materials
  const mats = { a1: [], a2: [], a3: [] };
  function themed(slot, opts) {
    const o = Object.assign({ roughness: 0.28, metalness: 0.15 }, opts || {});
    const glow = o.glow || 0.35; delete o.glow;
    const m = new T.MeshStandardMaterial(o);
    m.userData.slot = slot; m.userData.glow = glow;
    mats[slot].push(m); return m;
  }
  const white = new T.MeshStandardMaterial({ color: 0xf4f7ff, roughness: 0.22, metalness: 0.05 });
  const whiteSoft = new T.MeshStandardMaterial({ color: 0xe8edf7, roughness: 0.5 });

  function bond(a, b, r, mat) {
    const dir = new T.Vector3().subVectors(b, a); const len = dir.length();
    const m = new T.Mesh(new T.CylinderGeometry(r, r, len, 10), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, dir.normalize());
    return m;
  }

  function capsule(r, len, matTop, matBottom) {
    const g = new T.Group();
    const half = len / 2;
    const c1 = new T.Mesh(new T.CylinderGeometry(r, r, half, 28), matTop); c1.position.y = half / 2;
    const c2 = new T.Mesh(new T.CylinderGeometry(r, r, half, 28), matBottom); c2.position.y = -half / 2;
    const s1 = new T.Mesh(new T.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), matTop); s1.position.y = half;
    const s2 = new T.Mesh(new T.SphereGeometry(r, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), matBottom); s2.position.y = -half; s2.rotation.x = Math.PI;
    g.add(c1, c2, s1, s2); return g;
  }

  function tablet(r, mat) {
    const g = new T.Group();
    const body = new T.Mesh(new T.CylinderGeometry(r, r, r * 0.42, 36), mat);
    const domeGeo = new T.SphereGeometry(r, 36, 8, 0, Math.PI * 2, 0, 0.42);
    const top = new T.Mesh(domeGeo, mat); top.scale.y = 0.35; top.position.y = r * 0.21 - r * 0.32;
    const bot = top.clone(); bot.rotation.x = Math.PI; bot.position.y = -top.position.y;
    const score = new T.Mesh(new T.BoxGeometry(r * 1.7, r * 0.06, r * 0.08), whiteSoft); score.position.y = r * 0.27;
    g.add(body, top, bot, score); return g;
  }

  function dna(turns, mA, mB, mR) {
    const g = new T.Group(); const R = 0.9, steps = turns * 10;
    for (let i = 0; i < steps; i++) {
      const a = i * (Math.PI * 2 / 10), y = i * 0.32 - steps * 0.16;
      const p1 = new T.Vector3(Math.cos(a) * R, y, Math.sin(a) * R);
      const p2 = new T.Vector3(-Math.cos(a) * R, y, -Math.sin(a) * R);
      const b1 = new T.Mesh(new T.SphereGeometry(0.16, 14, 10), mA); b1.position.copy(p1);
      const b2 = new T.Mesh(new T.SphereGeometry(0.16, 14, 10), mB); b2.position.copy(p2);
      g.add(b1, b2, bond(p1, p2, 0.04, mR));
    }
    return g;
  }

  function molecule(mC, mS, mB) {
    const g = new T.Group();
    const c = new T.Mesh(new T.SphereGeometry(0.34, 20, 16), mC); g.add(c);
    const n = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const v = new T.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(1);
      const s = new T.Mesh(new T.SphereGeometry(0.2, 16, 12), mS); s.position.copy(v);
      g.add(s, bond(new T.Vector3(), v, 0.05, mB));
    }
    return g;
  }

  function lights(scene) {
    const amb = new T.AmbientLight(0xffffff, 0.55);
    const key = new T.DirectionalLight(0xffffff, 0.9); key.position.set(4, 6, 8);
    const p1 = new T.PointLight(0x3b82f6, 2.2, 40); p1.position.set(-8, 4, 6);
    const p2 = new T.PointLight(0x38bdf8, 1.6, 40); p2.position.set(8, -5, 4);
    scene.add(amb, key, p1, p2); return [p1, p2];
  }

  /* ---------------- Background scene ---------------- */
  const bgCanvas = document.getElementById("bg3d");
  const bg = { renderer: null, scene: new T.Scene(), camera: null, items: [], lights: [], points: null };
  if (bgCanvas) {
    bg.renderer = new T.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: !small });
    bg.renderer.setPixelRatio(DPR);
    bg.camera = new T.PerspectiveCamera(55, 1, 0.1, 100); bg.camera.position.z = 16;
    bg.lights = lights(bg.scene);

    const mA1 = themed("a1", { glow: 0.45 }), mA2 = themed("a2", { glow: 0.4 }), mA3 = themed("a3", { glow: 0.2, transparent: true, opacity: 0.7 });
    const N = small ? 14 : 26;
    for (let i = 0; i < N; i++) {
      const kind = i % 5; let obj;
      if (kind === 0 || kind === 1) obj = capsule(0.32, 1.1, i % 2 ? mA1 : mA2, white);
      else if (kind === 2) obj = tablet(0.42, i % 3 ? white : mA3);
      else if (kind === 3) obj = molecule(mA1, white, mA3);
      else obj = capsule(0.26, 0.9, white, mA1);
      const s = 0.6 + Math.random() * 0.7; obj.scale.setScalar(s);
      obj.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 22, -3 - Math.random() * 9);
      obj.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      obj.userData = {
        v: new T.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.006),
        r: new T.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.014, (Math.random() - 0.5) * 0.01),
        phase: Math.random() * 6.28
      };
      bg.scene.add(obj); bg.items.push(obj);
    }
    // DNA helices on both sides
    const d1 = dna(small ? 2 : 3, mA1, mA2, mA3); d1.position.set(-15, 0, -8); d1.rotation.z = 0.5;
    const d2 = dna(small ? 2 : 3, mA2, mA1, mA3); d2.position.set(15.5, 1, -9); d2.rotation.z = -0.45;
    d1.userData = { spin: 0.004 }; d2.userData = { spin: -0.004 };
    bg.scene.add(d1, d2); bg.dnas = [d1, d2];

    // Sparkle particles
    const P = small ? 260 : 600, pos = new Float32Array(P * 3);
    for (let i = 0; i < P * 3; i++) pos[i] = (Math.random() - 0.5) * (i % 3 === 2 ? 20 : 40);
    const pg = new T.BufferGeometry(); pg.setAttribute("position", new T.BufferAttribute(pos, 3));
    bg.points = new T.Points(pg, new T.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.75, depthWrite: false }));
    bg.scene.add(bg.points);
  }

  /* ---------------- Hero scene ---------------- */
  const heroCanvas = document.getElementById("hero3d");
  const hero = { renderer: null, scene: new T.Scene(), camera: null, bottle: null, orbit: [], lights: [], labelCtx: null, labelTex: null };

  function drawLabel(theme) {
    const c = hero.labelCtx; if (!c) return;
    const W = 1024, H = 512; c.clearRect(0, 0, W, H);
    c.fillStyle = "#f7f9ff"; c.fillRect(0, 0, W, H);
    c.fillStyle = theme.a1; c.fillRect(0, 0, W, 26); c.fillRect(0, H - 26, W, 26);
    c.textAlign = "center"; c.fillStyle = "#0b1736";
    c.font = "800 92px Sora, Arial, sans-serif"; c.fillText("Pharmacy", W / 2, 205);
    c.fillStyle = theme.light ? theme.a1 : theme.a1;
    c.font = "600 44px Manrope, Arial, sans-serif"; c.fillText("Better Medicines", W / 2, 285);
    c.fillText("Healthier Tomorrow", W / 2, 340);
    // medical cross
    c.fillStyle = theme.a1; const cx = W / 2, cy = 420;
    c.fillRect(cx - 14, cy - 44, 28, 88); c.fillRect(cx - 44, cy - 14, 88, 28);
    if (hero.labelTex) hero.labelTex.needsUpdate = true;
  }

  if (heroCanvas) {
    hero.renderer = new T.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
    hero.renderer.setPixelRatio(DPR);
    hero.camera = new T.PerspectiveCamera(38, 1, 0.1, 100); hero.camera.position.set(0, 0.6, 11);
    hero.lights = lights(hero.scene);

    const glass = new T.MeshPhysicalMaterial({ color: 0xdbeafe, transparent: true, opacity: 0.42, roughness: 0.04, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
    glass.userData.tint = true;
    const b = new T.Group();
    const body = new T.Mesh(new T.CylinderGeometry(1.25, 1.25, 3, 64), glass);
    const shoulder = new T.Mesh(new T.SphereGeometry(1.25, 64, 20, 0, Math.PI * 2, 0, Math.PI / 2), glass); shoulder.position.y = 1.5; shoulder.scale.y = 0.35;
    const neck = new T.Mesh(new T.CylinderGeometry(0.62, 0.62, 0.45, 48), glass); neck.position.y = 1.95;
    const capMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const cap = new T.Mesh(new T.CylinderGeometry(0.78, 0.78, 0.7, 48), capMat); cap.position.y = 2.45;
    for (let i = 0; i < 24; i++) {
      const rid = new T.Mesh(new T.BoxGeometry(0.05, 0.6, 0.06), whiteSoft);
      const a = (i / 24) * Math.PI * 2; rid.position.set(Math.cos(a) * 0.79, 2.45, Math.sin(a) * 0.79); rid.rotation.y = -a;
      b.add(rid);
    }
    const lc = document.createElement("canvas"); lc.width = 1024; lc.height = 512;
    hero.labelCtx = lc.getContext("2d");
    hero.labelTex = new T.CanvasTexture(lc);
    const label = new T.Mesh(new T.CylinderGeometry(1.27, 1.27, 1.7, 64, 1, true, -Math.PI * 0.62, Math.PI * 1.24),
      new T.MeshStandardMaterial({ map: hero.labelTex, roughness: 0.6, side: T.DoubleSide }));
    label.position.y = -0.1;
    // Pills inside the bottle
    const inner = themed("a1", { glow: 0.3 });
    for (let i = 0; i < 9; i++) {
      const p = capsule(0.14, 0.42, i % 2 ? inner : white, white);
      p.position.set((Math.random() - 0.5) * 1.6, -1.2 + Math.random() * 0.5, (Math.random() - 0.5) * 1.6);
      p.rotation.set(Math.random() * 3, Math.random() * 3, Math.PI / 2);
      b.add(p);
    }
    b.add(body, shoulder, neck, cap, label);
    b.position.y = -0.3; b.rotation.z = -0.12;
    hero.scene.add(b); hero.bottle = b;

    // Orbiting medicines
    const oA = themed("a1", { glow: 0.45 }), oB = themed("a2", { glow: 0.4 });
    const count = small ? 7 : 11;
    for (let i = 0; i < count; i++) {
      const o = i % 3 === 2 ? tablet(0.32, white) : capsule(0.22, 0.8, i % 2 ? oA : oB, white);
      o.userData = { R: 2.6 + Math.random() * 1.6, a: (i / count) * Math.PI * 2, s: 0.25 + Math.random() * 0.25, y: (Math.random() - 0.5) * 3.6, bob: Math.random() * 6, spin: 0.01 + Math.random() * 0.02 };
      hero.scene.add(o); hero.orbit.push(o);
    }
    const hd = dna(1, oA, oB, themed("a3", { glow: 0.2, transparent: true, opacity: 0.7 }));
    hd.scale.setScalar(0.85); hd.position.set(-3.6, 0.6, -1.5); hd.rotation.z = 0.25;
    hero.scene.add(hd); hero.dna = hd;
  }

  /* ---------------- Theme ---------------- */
  function setTheme(t) {
    ["a1", "a2", "a3"].forEach(function (slot) {
      const col = new T.Color(t[slot]);
      mats[slot].forEach(function (m) { m.color.copy(col); m.emissive = col.clone().multiplyScalar(m.userData.glow); });
    });
    [bg.lights, hero.lights].forEach(function (ls) { if (ls && ls.length) { ls[0].color.set(t.a1); ls[1].color.set(t.a2); } });
    if (bg.points) bg.points.material.color.set(t.light ? t.a1 : t.a3);
    hero.scene.traverse(function (o) { if (o.material && o.material.userData && o.material.userData.tint) o.material.color.set(t.light ? "#dbeafe" : t.a3); });
    drawLabel(t);
  }

  /* ---------------- Interaction & loop ---------------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", function (e) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    if (bg.renderer) { bg.renderer.setSize(window.innerWidth, window.innerHeight, false); bg.camera.aspect = window.innerWidth / window.innerHeight; bg.camera.updateProjectionMatrix(); }
    if (hero.renderer) {
      const w = heroCanvas.clientWidth || 400, h = heroCanvas.clientHeight || 400;
      hero.renderer.setSize(w, h, false); hero.camera.aspect = w / h;
      hero.camera.position.z = 11 * Math.max(1, 1.1 / hero.camera.aspect); hero.camera.updateProjectionMatrix();
    }
  }
  window.addEventListener("resize", resize);
  resize();

  let running = true, t0 = performance.now();
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) loop(); });

  function loop() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
    const sy = window.scrollY / Math.max(1, window.innerHeight);

    if (bg.renderer) {
      if (!reduce) {
        bg.items.forEach(function (o) {
          const u = o.userData;
          o.position.add(u.v); o.position.y += Math.sin(t * 0.8 + u.phase) * 0.004;
          o.rotation.x += u.r.x; o.rotation.y += u.r.y; o.rotation.z += u.r.z;
          if (o.position.x > 16) o.position.x = -16; if (o.position.x < -16) o.position.x = 16;
          if (o.position.y > 11) o.position.y = -11; if (o.position.y < -11) o.position.y = 11;
          if (o.position.z > -2) u.v.z = -Math.abs(u.v.z); if (o.position.z < -12) u.v.z = Math.abs(u.v.z);
        });
        bg.dnas.forEach(function (d) { d.rotation.y += d.userData.spin; });
        bg.points.rotation.y = t * 0.02;
      }
      bg.camera.position.x = mouse.x * 2.2;
      bg.camera.position.y = -mouse.y * 1.6 - sy * 1.4;
      bg.camera.lookAt(0, -sy * 1.4, 0);
      bg.renderer.render(bg.scene, bg.camera);
    }

    if (hero.renderer && window.scrollY < window.innerHeight * 1.2) {
      if (!reduce) {
        hero.bottle.rotation.y = Math.sin(t * 0.45) * 0.45 + mouse.x * 0.35;
        hero.bottle.position.y = -0.3 + Math.sin(t * 1.2) * 0.12;
        hero.orbit.forEach(function (o) {
          const u = o.userData; u.a += u.s * 0.012;
          o.position.set(Math.cos(u.a) * u.R, u.y + Math.sin(t + u.bob) * 0.25, Math.sin(u.a) * u.R * 0.7);
          o.rotation.x += u.spin; o.rotation.z += u.spin * 0.7;
        });
        hero.dna.rotation.y += 0.008;
      }
      hero.scene.rotation.x = mouse.y * 0.12;
      hero.scene.rotation.y = mouse.x * 0.18;
      hero.renderer.render(hero.scene, hero.camera);
    }
    requestAnimationFrame(loop);
  }

  window.Scene3D = { setTheme: setTheme, resize: resize, start: function () { loop(); } };
})();
