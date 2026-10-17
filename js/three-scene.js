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
        v: new T.Vector3((Math.random() - 0.5) * 0.032, (Math.random() - 0.5) * 0.032, (Math.random() - 0.5) * 0.012),
        r: new T.Vector3((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.034, (Math.random() - 0.5) * 0.024),
        phase: Math.random() * 6.28
      };
      bg.scene.add(obj); bg.items.push(obj);
    }
    // DNA helices on both sides
    const d1 = dna(small ? 2 : 3, mA1, mA2, mA3); d1.position.set(-15, 0, -8); d1.rotation.z = 0.5;
    const d2 = dna(small ? 2 : 3, mA2, mA1, mA3); d2.position.set(15.5, 1, -9); d2.rotation.z = -0.45;
    d1.userData = { spin: 0.012, par: 0.9 }; d2.userData = { spin: -0.012, par: 1.15 };
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

  /* ---------------- Contact scene: pharmacy desk ---------------- */
  const contactCanvas = document.getElementById("contact3d");
  const desk = { renderer: null, scene: new T.Scene(), camera: null, lights: [], bottleLabels: [], emblem: null, floaters: [], visible: false };

  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const tex = new T.CanvasTexture(c); tex.userData = { ctx: c.getContext("2d"), draw: draw, w: w, h: h };
    return tex;
  }
  function redrawTex(tex, theme) { const u = tex.userData; u.ctx.clearRect(0, 0, u.w, u.h); u.draw(u.ctx, u.w, u.h, theme); tex.needsUpdate = true; }

  // Caduceus emblem for the mortar
  function drawCaduceus(c, W, H, t) {
    c.fillStyle = "rgba(0,0,0,0)"; c.fillRect(0, 0, W, H);
    const col = t.light ? t.a1 : t.a1;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 18; c.lineCap = "round"; c.lineJoin = "round";
    const cx = W / 2;
    c.beginPath(); c.moveTo(cx, 60); c.lineTo(cx, H - 40); c.stroke();             // staff
    c.beginPath(); c.arc(cx, 48, 18, 0, Math.PI * 2); c.fill();                    // knob
    [-1, 1].forEach(function (s) {                                                  // wings
      c.beginPath(); c.moveTo(cx, 80);
      c.quadraticCurveTo(cx + s * 60, 30, cx + s * 124, 52);
      c.quadraticCurveTo(cx + s * 96, 70, cx + s * 112, 84);
      c.quadraticCurveTo(cx + s * 80, 92, cx + s * 92, 106);
      c.quadraticCurveTo(cx + s * 50, 110, cx, 118); c.fill();
    });
    c.lineWidth = 9;                                                                 // two snakes
    [0, Math.PI].forEach(function (ph) {
      c.beginPath();
      for (let y = 120; y <= H - 60; y += 4) { const x = cx + Math.sin((y - 120) / 30 + ph) * 30; if (y === 120) c.moveTo(x, y); else c.lineTo(x, y); }
      c.stroke();
    });
  }
  function drawBottleLabel(c, W, H, t) {
    c.fillStyle = "#f6f8ff"; c.fillRect(0, 0, W, H);
    c.fillStyle = t.a1; c.fillRect(0, 0, W, 18); c.fillRect(0, H - 18, W, 18);
    c.fillStyle = "#0b1736"; c.textAlign = "center";
    c.font = "800 62px Sora, Arial, sans-serif";
    c.fillText("Better", W / 2, 118); c.fillText("Health", W / 2, 188);
    c.fillStyle = t.a1; c.fillText("Brighter", W / 2, 268); c.fillText("Future", W / 2, 338);
    c.fillRect(W / 2 - 10, 372, 20, 56); c.fillRect(W / 2 - 28, 390, 56, 20);
  }

  function medBottle(h, r) {
    const g = new T.Group();
    const glass = themed("a1", { glow: 0.25, transparent: true, opacity: 0.62, roughness: 0.08, metalness: 0.2 });
    const body = new T.Mesh(new T.CylinderGeometry(r, r, h, 48), glass); body.position.y = h / 2;
    const sh = new T.Mesh(new T.SphereGeometry(r, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), glass); sh.position.y = h; sh.scale.y = 0.35;
    const neck = new T.Mesh(new T.CylinderGeometry(r * 0.55, r * 0.55, r * 0.35, 32), glass); neck.position.y = h + r * 0.45;
    const cap = new T.Mesh(new T.CylinderGeometry(r * 0.66, r * 0.66, r * 0.5, 32), white); cap.position.y = h + r * 0.85;
    const tex = canvasTex(512, 460, drawBottleLabel); desk.bottleLabels.push(tex);
    const label = new T.Mesh(new T.CylinderGeometry(r * 1.015, r * 1.015, h * 0.62, 48, 1, true, -Math.PI * 0.55, Math.PI * 1.1), new T.MeshStandardMaterial({ map: tex, roughness: 0.55 }));
    label.position.y = h * 0.5;
    g.add(body, sh, neck, cap, label); return g;
  }

  function mortar() {
    const g = new T.Group();
    const porcelain = new T.MeshStandardMaterial({ color: 0xdfe6f3, roughness: 0.32, metalness: 0.05, side: T.DoubleSide });
    const prof = [[0, 0.32], [0.55, 0.36], [0.92, 0.55], [1.15, 0.85], [1.26, 1.15], [1.24, 1.24], [1.36, 1.26], [1.42, 1.18],
      [1.38, 0.95], [1.22, 0.55], [0.95, 0.22], [0.75, 0.1], [0.78, 0], [0, 0]].map(function (p) { return new T.Vector2(p[0], p[1]); });
    const bowl = new T.Mesh(new T.LatheGeometry(prof.reverse(), 72), porcelain);
    g.add(bowl);
    // emblem on the front
    const tex = canvasTex(256, 360, drawCaduceus); desk.emblem = tex;
    const em = new T.Mesh(new T.CylinderGeometry(1.4, 1.2, 0.85, 48, 1, true, -0.5, 1.0),
      new T.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.4, depthWrite: false }));
    em.position.y = 0.72; g.add(em);
    // pestle resting in the bowl
    const pest = new T.Group();
    const shaft = new T.Mesh(new T.CylinderGeometry(0.13, 0.17, 2.1, 28), porcelain); shaft.position.y = 1.05;
    const head = new T.Mesh(new T.SphereGeometry(0.27, 28, 20), porcelain); head.scale.y = 1.3;
    const top = new T.Mesh(new T.SphereGeometry(0.15, 20, 14), porcelain); top.position.y = 2.1;
    pest.add(shaft, head, top);
    pest.position.set(-0.25, 0.55, 0); pest.rotation.z = -0.72; pest.rotation.y = 0.5;
    g.add(pest);
    return g;
  }

  function microscope() {
    const g = new T.Group();
    const silver = new T.MeshStandardMaterial({ color: 0xdfe6f2, roughness: 0.25, metalness: 0.7 });
    const dark = new T.MeshStandardMaterial({ color: 0x1a2236, roughness: 0.35, metalness: 0.6 });
    const base = new T.Mesh(new T.BoxGeometry(1.5, 0.22, 1.1), white); base.position.y = 0.11;
    const arm = new T.Mesh(new T.BoxGeometry(0.32, 2.1, 0.42), white); arm.position.set(-0.45, 1.15, 0); arm.rotation.z = -0.08;
    const armTop = new T.Mesh(new T.BoxGeometry(0.9, 0.36, 0.42), white); armTop.position.set(-0.12, 2.15, 0); armTop.rotation.z = 0.35;
    const stage = new T.Mesh(new T.BoxGeometry(1.0, 0.08, 0.9), dark); stage.position.set(0.15, 0.95, 0);
    const tube = new T.Mesh(new T.CylinderGeometry(0.17, 0.17, 1.25, 24), silver); tube.position.set(0.32, 2.15, 0); tube.rotation.z = 0.35;
    const eye = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.5, 20), dark); eye.position.set(0.05, 2.85, 0); eye.rotation.z = 0.35;
    const obj = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 0.4, 16), silver); obj.position.set(0.48, 1.32, 0);
    const knob = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.12, 24), dark); knob.rotation.x = Math.PI / 2; knob.position.set(-0.45, 1.25, 0.28);
    g.add(base, arm, armTop, stage, tube, eye, obj, knob); return g;
  }

  function stethoscope() {
    const g = new T.Group();
    const rubber = new T.MeshStandardMaterial({ color: 0x0f1626, roughness: 0.45, metalness: 0.2 });
    const steel = new T.MeshStandardMaterial({ color: 0xd9e2ef, roughness: 0.2, metalness: 0.85 });
    const curve = new T.CatmullRomCurve3([[-1.6, 0, 0.2], [-0.8, 0, 0.9], [0.4, 0, 1.0], [1.3, 0, 0.4], [1.1, 0, -0.5], [0.2, 0, -0.7], [-0.4, 0, -0.2], [0.3, 0, 0.3]].map(function (p) { return new T.Vector3(p[0], p[1] + 0.06, p[2]); }));
    g.add(new T.Mesh(new T.TubeGeometry(curve, 120, 0.06, 10, false), rubber));
    const chest = new T.Mesh(new T.CylinderGeometry(0.32, 0.32, 0.12, 36), steel); chest.position.set(0.3, 0.07, 0.3);
    const ring = new T.Mesh(new T.TorusGeometry(0.32, 0.04, 10, 40), steel); ring.rotation.x = Math.PI / 2; ring.position.set(0.3, 0.13, 0.3);
    const fork = new T.Mesh(new T.TorusGeometry(0.45, 0.035, 8, 30, Math.PI), steel); fork.rotation.x = -Math.PI / 2; fork.position.set(-1.6, 0.05, -0.25);
    g.add(chest, ring, fork); return g;
  }

  if (contactCanvas) {
    desk.renderer = new T.WebGLRenderer({ canvas: contactCanvas, alpha: true, antialias: true });
    desk.renderer.setPixelRatio(DPR);
    desk.camera = new T.PerspectiveCamera(36, 1, 0.1, 100); desk.camera.position.set(0, 3.6, 9);
    desk.lights = lights(desk.scene);
    const spot = new T.SpotLight(0xffffff, 0.55, 30, 0.6, 0.7); spot.position.set(1, 9, 5); desk.scene.add(spot);

    // Glossy desk with a theme-coloured glow
    const fade = document.createElement("canvas"); fade.width = fade.height = 256;
    const fc = fade.getContext("2d"), gr = fc.createRadialGradient(128, 128, 20, 128, 128, 128);
    gr.addColorStop(0, "#fff"); gr.addColorStop(0.55, "#bbb"); gr.addColorStop(1, "#000"); fc.fillStyle = gr; fc.fillRect(0, 0, 256, 256);
    const table = new T.Mesh(new T.CircleGeometry(7.5, 64), new T.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.3, metalness: 0.7, transparent: true, alphaMap: new T.CanvasTexture(fade), depthWrite: false }));
    table.rotation.x = -Math.PI / 2; desk.scene.add(table);
    const glow = new T.Mesh(new T.RingGeometry(1.7, 2.1, 64), themed("a2", { glow: 1.2, transparent: true, opacity: 0.55 }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.01; desk.scene.add(glow); desk.glow = glow;

    const m = mortar(); m.scale.setScalar(1.25); m.position.set(0.2, 0, 0.6); desk.scene.add(m);
    const b1 = medBottle(2.2, 0.62); b1.position.set(2.5, 0, 0.6); b1.rotation.y = -0.35; desk.scene.add(b1);
    const b2 = medBottle(1.5, 0.48); b2.position.set(-2.6, 0, -0.9); b2.rotation.y = 0.4; desk.scene.add(b2);
    const mic = microscope(); mic.scale.setScalar(1.45); mic.position.set(3.0, 0, -2.6); mic.rotation.y = -0.9; desk.scene.add(mic);
    const st = stethoscope(); st.position.set(2.6, 0, 2.3); st.rotation.y = 0.3; desk.scene.add(st);
    const dd = dna(2, themed("a1", { glow: 0.5 }), themed("a2", { glow: 0.45 }), themed("a3", { glow: 0.3, transparent: true, opacity: 0.6 }));
    dd.scale.setScalar(0.7); dd.position.set(-2.9, 3.2, -3.4); dd.rotation.z = 0.15; desk.scene.add(dd); desk.dna = dd;

    // Capsules and tablets spilled on the desk
    const cA = themed("a1", { glow: 0.35 }), cB = themed("a2", { glow: 0.3 });
    [[-1.6, 2.1, 0.4], [-0.9, 2.6, 1.9], [-2.3, 1.4, 2.6], [1.3, 2.9, 0.9], [-1.4, 3.3, -0.3], [0.9, 2.4, 2.2], [-2.6, 1.2, 1.2]].forEach(function (p, i) {
      const c = capsule(0.17, 0.62, i % 2 ? cA : cB, white);
      c.rotation.set(Math.PI / 2, 0, p[2]); c.position.set(p[0], 0.18, p[1]); desk.scene.add(c);
    });
    [[-0.3, 3.2], [1.8, 3.4], [-2.6, 3.0], [-2.9, 0.6]].forEach(function (p) {
      const tb = tablet(0.24, white); tb.position.set(p[0], 0.06, p[1]); desk.scene.add(tb);
    });
    // a few floating above the desk
    for (let i = 0; i < 5; i++) {
      const f = capsule(0.15, 0.55, i % 2 ? cA : cB, white);
      f.position.set(-3 + i * 1.6, 3 + Math.random() * 1.6, -1 - Math.random() * 1.5);
      f.userData = { base: f.position.y, ph: Math.random() * 6, spin: 0.01 + Math.random() * 0.02 };
      desk.scene.add(f); desk.floaters.push(f);
    }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { desk.visible = es[0].isIntersecting; }, { rootMargin: "100px" }).observe(contactCanvas);
    else desk.visible = true;
  }

  /* ---------------- Theme ---------------- */
  function setTheme(t) {
    ["a1", "a2", "a3"].forEach(function (slot) {
      const col = new T.Color(t[slot]);
      mats[slot].forEach(function (m) { m.color.copy(col); m.emissive = col.clone().multiplyScalar(m.userData.glow); });
    });
    desk.bottleLabels.forEach(function (tx) { redrawTex(tx, t); });
    if (desk.emblem) redrawTex(desk.emblem, t);
    [bg.lights, hero.lights, desk.lights].forEach(function (ls) { if (ls && ls.length) { ls[0].color.set(t.a1); ls[1].color.set(t.a2); } });
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
    if (desk.renderer) {
      const w = contactCanvas.clientWidth || 400, h = contactCanvas.clientHeight || 400;
      desk.renderer.setSize(w, h, false); desk.camera.aspect = w / h;
      desk.zoom = Math.max(1, 1.25 / desk.camera.aspect); desk.camera.updateProjectionMatrix();
    }
  }
  window.addEventListener("resize", resize);
  resize();

  let running = true, t0 = performance.now(), lastScroll = window.scrollY, scrollVel = 0;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) loop(); });

  function loop() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05;
    // Scroll speed (px per frame), smoothed, drives the background
    const dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
    scrollVel += (dy - scrollVel) * 0.25;
    const pxToWorld = 26 / Math.max(1, window.innerHeight);
    const boost = Math.min(Math.abs(scrollVel) * 0.02, 1.6);

    if (bg.renderer) {
      if (!reduce) {
        bg.items.forEach(function (o) {
          const u = o.userData, depth = 1.25 + (o.position.z + 12) / 10 * 0.6;
          o.position.add(u.v);
          o.position.y += Math.sin(t * 1.4 + u.phase) * 0.008 + scrollVel * pxToWorld * depth;
          const spin = 1 + boost * 4;
          o.rotation.x += u.r.x * spin; o.rotation.y += u.r.y * spin; o.rotation.z += u.r.z * spin;
          if (o.position.x > 16) o.position.x = -16; if (o.position.x < -16) o.position.x = 16;
          if (o.position.y > 12) o.position.y -= 24; if (o.position.y < -12) o.position.y += 24;
          if (o.position.z > -2) u.v.z = -Math.abs(u.v.z); if (o.position.z < -12) u.v.z = Math.abs(u.v.z);
        });
        bg.dnas.forEach(function (d) {
          d.rotation.y += d.userData.spin * (1 + boost * 5);
          d.position.y += scrollVel * pxToWorld * d.userData.par;
          if (d.position.y > 20) d.position.y -= 40; if (d.position.y < -20) d.position.y += 40;
        });
        bg.points.rotation.y = t * 0.05;
        bg.points.position.y = (bg.points.position.y + scrollVel * pxToWorld * 0.6) % 20;
      }
      bg.camera.position.x = mouse.x * 2.2;
      bg.camera.position.y = -mouse.y * 1.6;
      bg.camera.lookAt(0, 0, 0);
      bg.renderer.render(bg.scene, bg.camera);
    }

    if (hero.renderer && window.scrollY < window.innerHeight * 1.2) {
      if (!reduce) {
        hero.bottle.rotation.y = Math.sin(t * 0.8) * 0.45 + mouse.x * 0.35;
        hero.bottle.position.y = -0.3 + Math.sin(t * 1.8) * 0.14;
        hero.orbit.forEach(function (o) {
          const u = o.userData; u.a += u.s * 0.03;
          o.position.set(Math.cos(u.a) * u.R, u.y + Math.sin(t * 1.6 + u.bob) * 0.3, Math.sin(u.a) * u.R * 0.7);
          o.rotation.x += u.spin * 2; o.rotation.z += u.spin * 1.4;
        });
        hero.dna.rotation.y += 0.022;
      }
      hero.scene.rotation.x = mouse.y * 0.12;
      hero.scene.rotation.y = mouse.x * 0.18;
      hero.renderer.render(hero.scene, hero.camera);
    }

    if (desk.renderer && desk.visible) {
      if (!reduce) {
        desk.dna.rotation.y += 0.015;
        desk.floaters.forEach(function (f) { const u = f.userData; f.position.y = u.base + Math.sin(t * 1.3 + u.ph) * 0.25; f.rotation.x += u.spin; f.rotation.z += u.spin * 0.8; });
        desk.glow.material.opacity = 0.4 + Math.sin(t * 2) * 0.15;
      }
      const z = desk.zoom || 1, ang = mouse.x * 0.22 + Math.sin(t * 0.25) * 0.08;
      desk.camera.position.set(Math.sin(ang) * 9 * z, 3.4 * z - mouse.y * 0.5, Math.cos(ang) * 9 * z);
      desk.camera.lookAt(0.3, 1.25, 0);
      desk.renderer.render(desk.scene, desk.camera);
    }
    requestAnimationFrame(loop);
  }

  window.Scene3D = { setTheme: setTheme, resize: resize, start: function () { loop(); } };
})();
