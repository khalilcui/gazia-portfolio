/* ==========================================================
   Content store
   - Supabase mode: content lives in the database, edits go live
     for every visitor, the admin key is checked by Supabase Auth.
   - Local mode (no Supabase configured): edits are kept in this
     browser; "Export" downloads a new js/data.js to redeploy.
   ========================================================== */
(function () {
  const CFG = window.SITE_CONFIG || {};
  const LOCAL_KEY = "gh_portfolio_content_v1";
  // SHA-256 of the admin key — the key itself is never stored in the code.
  const ADMIN_HASH = "d638a8e769d532b698c567d8e470f3e4a82e00dba355e2c8bc99f49343f3965b";
  const TABLE = "portfolio";
  const BUCKET = "portfolio";

  let sb = null;
  const mode = CFG.supabaseUrl && CFG.supabaseAnonKey ? "supabase" : "local";

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // Fill in any keys missing from saved content with the defaults.
  function withDefaults(saved) {
    const base = clone(window.DEFAULT_CONTENT);
    if (!saved || typeof saved !== "object") return base;
    Object.keys(base).forEach(function (k) {
      if (saved[k] === undefined) return;
      if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && typeof saved[k] === "object") {
        base[k] = Object.assign(base[k], saved[k]);
      } else base[k] = saved[k];
    });
    return base;
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  async function client() {
    if (sb) return sb;
    if (!window.supabase) await loadScript("vendor/supabase.js");
    sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    return sb;
  }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  // Shrink uploaded images so they load fast (and fit in local storage).
  function compressImage(file, maxSide, quality) {
    return new Promise(function (res, rej) {
      const reader = new FileReader();
      reader.onerror = rej;
      reader.onload = function () {
        const img = new Image();
        img.onerror = rej;
        img.onload = function () {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          c.toBlob(function (blob) { res(blob); }, "image/jpeg", quality);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function blobToDataURL(blob) {
    return new Promise(function (res) { const r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(blob); });
  }

  const PENDING_KEY = "gh_feedback_pending_v1";
  function readPending() { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]"); } catch (e) { return []; } }
  function writePending(list) { try { localStorage.setItem(PENDING_KEY, JSON.stringify(list)); } catch (e) {} }

  window.Store = {
    mode: mode,

    // Fast first paint from local draft/defaults.
    initial: function () {
      if (mode === "local") {
        try { const raw = localStorage.getItem(LOCAL_KEY); if (raw) return withDefaults(JSON.parse(raw)); } catch (e) {}
      }
      return withDefaults(null);
    },

    // Live content from Supabase (null if unavailable).
    remote: async function () {
      if (mode !== "supabase") return null;
      try {
        const c = await client();
        const { data, error } = await c.from(TABLE).select("content").eq("id", 1).maybeSingle();
        if (error || !data) return null;
        return withDefaults(data.content);
      } catch (e) { console.warn("Supabase load failed", e); return null; }
    },

    login: async function (password) {
      if (!password) return { ok: false, msg: "Enter the admin key." };
      if (mode === "supabase") {
        try {
          const c = await client();
          const { error } = await c.auth.signInWithPassword({ email: CFG.adminEmail, password: password });
          return error ? { ok: false, msg: "Wrong admin key." } : { ok: true };
        } catch (e) { return { ok: false, msg: "Couldn't reach the server. Try again." }; }
      }
      if (!window.crypto || !crypto.subtle) return { ok: false, msg: "Open the site over https to use admin." };
      const ok = (await sha256(password)) === ADMIN_HASH;
      if (ok) try { sessionStorage.setItem("gh_admin", "1"); } catch (e) {}
      return ok ? { ok: true } : { ok: false, msg: "Wrong admin key." };
    },

    isLoggedIn: async function () {
      if (mode === "supabase") {
        try { const c = await client(); const { data } = await c.auth.getSession(); return !!(data && data.session); } catch (e) { return false; }
      }
      try { return sessionStorage.getItem("gh_admin") === "1"; } catch (e) { return false; }
    },

    logout: async function () {
      if (mode === "supabase") { try { const c = await client(); await c.auth.signOut(); } catch (e) {} }
      try { sessionStorage.removeItem("gh_admin"); } catch (e) {}
    },

    save: async function (content) {
      if (mode === "supabase") {
        const c = await client();
        const { error } = await c.from(TABLE).upsert({ id: 1, content: content, updated_at: new Date().toISOString() });
        if (error) throw new Error(error.message);
        return "Published — live for every visitor";
      }
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(content)); }
      catch (e) { throw new Error("This browser's storage is full. Use smaller images or connect Supabase."); }
      return "Saved in this browser — export to publish";
    },

    resetLocal: function () { try { localStorage.removeItem(LOCAL_KEY); } catch (e) {} },

    uploadImage: async function (file) {
      const blob = await compressImage(file, 1600, 0.85);
      if (mode === "supabase") {
        const c = await client();
        const path = "uploads/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
        const { error } = await c.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw new Error(error.message);
        return c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
      return blobToDataURL(await compressImage(file, 1200, 0.78));
    },

    uploadFile: async function (file) {
      if (mode === "supabase") {
        const c = await client();
        const safe = file.name.replace(/[^a-z0-9._-]/gi, "_");
        const path = "files/" + Date.now() + "-" + safe;
        const { error } = await c.storage.from(BUCKET).upload(path, file, { contentType: file.type || "application/octet-stream" });
        if (error) throw new Error(error.message);
        return c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
      if (file.size > 1500000) throw new Error("In local mode files must be under 1.5 MB. Paste a link instead, or connect Supabase.");
      return blobToDataURL(file);
    },

    /* ---------- Visitor feedback ---------- */
    feedback: {
      // Visitor submits feedback. Always lands as "pending" until the admin approves it.
      submit: async function (f) {
        const row = { name: f.name.slice(0, 60), role: (f.role || "").slice(0, 60), rating: Math.max(1, Math.min(5, f.rating | 0)), message: f.message.slice(0, 800) };
        if (CFG.formspreeId) {
          try { await fetch("https://formspree.io/f/" + CFG.formspreeId, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ _subject: "New portfolio feedback (" + row.rating + "/5)" }, row)) }); } catch (e) {}
        }
        if (mode === "supabase") {
          const c = await client();
          const { error } = await c.from("feedback").insert(row);
          if (error) throw new Error(error.message);
          return;
        }
        const list = readPending(); list.unshift(Object.assign({ id: "l" + Date.now(), created_at: new Date().toISOString(), approved: false }, row));
        writePending(list.slice(0, 100));
      },
      // Approved feedback for everyone (Supabase mode).
      listPublic: async function () {
        if (mode !== "supabase") return [];
        try {
          const c = await client();
          const { data, error } = await c.from("feedback").select("id,name,role,rating,message,created_at").eq("approved", true).order("created_at", { ascending: false }).limit(60);
          return error ? [] : data;
        } catch (e) { return []; }
      },
      // Admin inbox: everything submitted.
      listAll: async function () {
        if (mode !== "supabase") return readPending();
        const c = await client();
        const { data, error } = await c.from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
        if (error) throw new Error(error.message);
        return data;
      },
      setApproved: async function (id, val) {
        if (mode !== "supabase") { writePending(readPending().filter(function (r) { return r.id !== id; })); return; }
        const c = await client();
        const { error } = await c.from("feedback").update({ approved: val }).eq("id", id);
        if (error) throw new Error(error.message);
      },
      remove: async function (id) {
        if (mode !== "supabase") { writePending(readPending().filter(function (r) { return r.id !== id; })); return; }
        const c = await client();
        const { error } = await c.from("feedback").delete().eq("id", id);
        if (error) throw new Error(error.message);
      }
    },

    exportDataJs: function (content) {
      const txt = "/* Exported from the admin panel on " + new Date().toLocaleString() + " */\nwindow.DEFAULT_CONTENT = " + JSON.stringify(content, null, 2) + ";\n";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([txt], { type: "text/javascript" }));
      a.download = "data.js";
      document.body.appendChild(a); a.click(); a.remove();
    }
  };
})();
