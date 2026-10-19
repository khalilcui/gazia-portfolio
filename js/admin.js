/* ==========================================================
   Admin panel — add / edit / delete anything without code.
   Opens only after the admin key is accepted.
   ========================================================== */
(function () {
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };
  const esc = function (s) { return App.esc(s); };

  const S = { t: "text" }, TA = { t: "textarea" };
  const ICONS = ["flask", "pill", "heart", "users", "search", "chat", "calendar", "laptop", "star", "award", "book", "brief", "check", "mail", "phone", "pin", "user"];
  const TABS = [
    { key: "hero", label: "Home", obj: [
      ["greeting", "Greeting", S], ["firstName", "First name", S], ["lastName", "Last name", S], ["title", "Title / role", S],
      ["tagline", "Tagline", S], ["intro", "Intro text", TA], ["location", "Location", S],
      ["photo", "Profile photo (optional)", { t: "image" }], ["cvUrl", "CV file (shows a Download CV button)", { t: "file" }],
      ["highlights", "Highlights under the buttons", { t: "list", item: [["icon", "Icon", { t: "icon" }], ["text", "Text", S]], blank: { icon: "star", text: "New highlight" } }],
      ["stats", "Stats", { t: "list", item: [["value", "Value", S], ["label", "Label", S]], blank: { value: "1+", label: "New stat" } }]
    ] },
    { key: "about", label: "About", obj: [
      ["heading", "Heading", S],
      ["points", "About bullet points", { t: "list", item: [["lead", "Bold lead", S], ["text", "Text", TA]], blank: { lead: "New point", text: "" } }],
      ["facts", "Quick facts", { t: "list", item: [["label", "Label", S], ["value", "Value", S]], blank: { label: "Label", value: "Value" } }],
      ["languages", "Languages", { t: "strings" }], ["hobbies", "Hobbies", { t: "strings" }]
    ] },
    { key: "achievements", label: "Achievements", list: { item: [["title", "Title", S], ["text", "Text", TA]], blank: { title: "New achievement", text: "" } } },
    { key: "education", label: "Education", list: { item: [["period", "Period", S], ["school", "School / college", S], ["place", "Place", S], ["points", "Points", { t: "strings" }]], blank: { period: "", school: "New school", place: "", points: [] } } },
    { key: "scienceFocus", label: "Science focus", strings: true },
    { key: "skillCards", label: "Skill cards (3D)", list: { item: [["icon", "Icon", { t: "icon" }], ["title", "Title", S], ["text", "Description", TA], ["level", "Level %", { t: "number" }]], blank: { icon: "star", title: "New skill", text: "", level: 80 } } },
    { key: "professionalSkills", label: "Professional skills", strings: true },
    { key: "itSkills", label: "IT skills", strings: true },
    { key: "experience", label: "Experience", list: { item: [["role", "Role / organisation", S], ["type", "Type", S], ["place", "Place", S], ["period", "Period", S], ["points", "Bullet points", { t: "strings", long: true }], ["tags", "Tags", { t: "strings" }]], blank: { role: "New placement", type: "Work Experience", place: "", period: "", points: [], tags: [] } } },
    { key: "gallery", label: "Work gallery", obj: [["title", "Gallery title", S], ["items", "Images", { t: "list", item: [["image", "Image", { t: "image" }], ["caption", "Caption", S]], blank: { image: "", caption: "New image" } }]] },
    { key: "keySkills", label: "Key skills", strings: true, long: true },
    { key: "certificates", label: "Certificates", list: { item: [["image", "Certificate image", { t: "image" }], ["title", "Title", S], ["text", "Description", TA]], blank: { image: "", title: "New certificate", text: "" } } },
    { key: "feedback", label: "Feedback", fb: true },
    { key: "contact", label: "Contact", obj: [["heading", "Heading", S], ["text", "Text", TA], ["email", "Email", S], ["phone", "Phone", S], ["location", "Location", S], ["linkedin", "LinkedIn URL", S], ["instagram", "Instagram URL", S], ["motto", "Motto card", S]] },
    { key: "footer", label: "Footer", obj: [["note", "Footer note", S]] },
    { key: "sections", label: "Show / hide sections", toggles: true }
  ];
  const SEC_TAB = { home: "hero", about: "about", education: "education", skills: "skillCards", experience: "experience", certificates: "certificates", feedback: "feedback", contact: "contact" };

  let draft = null, tab = "hero", dirty = false, previewT = null;

  /* ---------- path helpers ---------- */
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, draft); }
  function set(path, val) {
    const ks = path.split("."), last = ks.pop();
    const o = ks.reduce(function (o, k) { return o[k]; }, draft); o[last] = val;
  }
  function changed() {
    dirty = true; $("#apSave").classList.add("pulse");
    clearTimeout(previewT); previewT = setTimeout(function () { App.render(JSON.parse(JSON.stringify(draft))); }, 250);
  }

  /* ---------- field rendering ---------- */
  function field(path, label, d) {
    const v = get(path);
    const lab = '<span class="ap-label">' + esc(label) + "</span>";
    switch (d.t) {
      case "textarea": return '<label class="ap-field">' + lab + '<textarea data-p="' + path + '" rows="3">' + esc(v) + "</textarea></label>";
      case "number": return '<label class="ap-field">' + lab + '<input type="number" min="0" max="100" data-p="' + path + '" data-num="1" value="' + esc(v) + '" /></label>';
      case "icon": return '<label class="ap-field">' + lab + '<select data-p="' + path + '">' + ICONS.map(function (n) { return '<option' + (n === v ? " selected" : "") + ">" + n + "</option>"; }).join("") + "</select></label>";
      case "image": return '<div class="ap-field">' + lab + '<div class="ap-img">' + (v ? '<img src="' + esc(v) + '" alt="" />' : '<span class="ap-noimg">No image</span>') +
        '<div><input data-p="' + path + '" placeholder="Paste an image link…" value="' + esc(v && v.indexOf("data:") === 0 ? "(uploaded image)" : v) + '" ' + (v && v.indexOf("data:") === 0 ? "readonly" : "") + ' /><label class="ap-btn">' + icon("upload") + 'Upload<input type="file" accept="image/*" data-up="' + path + '" hidden /></label>' + (v ? '<button class="ap-btn ghost" data-clear="' + path + '">' + icon("x") + "Remove</button>" : "") + "</div></div></div>";
      case "file": return '<div class="ap-field">' + lab + '<div class="ap-row"><input data-p="' + path + '" placeholder="Paste a link to the PDF…" value="' + esc(v && v.indexOf("data:") === 0 ? "(uploaded file)" : v) + '" /><label class="ap-btn">' + icon("upload") + 'Upload<input type="file" accept=".pdf,.doc,.docx" data-upf="' + path + '" hidden /></label>' + (v ? '<button class="ap-btn ghost" data-clear="' + path + '">' + icon("x") + "</button>" : "") + "</div></div>";
      case "strings": return strings(path, label, d.long);
      case "list": return list(path, label, d.item, d.blank);
      default: return '<label class="ap-field">' + lab + '<input data-p="' + path + '" value="' + esc(v) + '" /></label>';
    }
  }
  function itemBar(path, i, n) {
    return '<div class="ap-itembar"><span>#' + (i + 1) + "</span><div>" +
      '<button class="ap-mini" data-mv="' + path + "|" + i + '|-1" ' + (i === 0 ? "disabled" : "") + ' aria-label="Move up">' + icon("up") + "</button>" +
      '<button class="ap-mini" data-mv="' + path + "|" + i + '|1" ' + (i === n - 1 ? "disabled" : "") + ' aria-label="Move down">' + icon("down") + "</button>" +
      '<button class="ap-mini danger" data-del="' + path + "|" + i + '" aria-label="Delete">' + icon("trash") + "</button></div></div>";
  }
  function strings(path, label, long) {
    const arr = get(path) || [];
    return '<div class="ap-group"><div class="ap-ghead"><span class="ap-label">' + esc(label) + " (" + arr.length + ')</span></div><div class="ap-strings">' +
      arr.map(function (s, i) {
        return '<div class="ap-str">' + (long ? '<textarea rows="2" data-p="' + path + "." + i + '">' + esc(s) + "</textarea>" : '<input data-p="' + path + "." + i + '" value="' + esc(s) + '" />') +
          '<button class="ap-mini" data-mv="' + path + "|" + i + '|-1" ' + (i === 0 ? "disabled" : "") + ' aria-label="Move up">' + icon("up") + '</button><button class="ap-mini danger" data-del="' + path + "|" + i + '" aria-label="Delete">' + icon("trash") + "</button></div>";
      }).join("") + '</div><button class="ap-add" data-adds="' + path + '">' + icon("plus") + "Add item</button></div>";
  }
  function list(path, label, item, blank) {
    const arr = get(path) || [];
    return '<div class="ap-group"><div class="ap-ghead"><span class="ap-label">' + esc(label) + " (" + arr.length + ")</span></div>" +
      arr.map(function (_, i) {
        return '<div class="ap-item">' + itemBar(path, i, arr.length) + item.map(function (f) { return field(path + "." + i + "." + f[0], f[1], f[2]); }).join("") + "</div>";
      }).join("") + '<button class="ap-add" data-addl="' + path + "\" data-blank='" + esc(JSON.stringify(blank)) + "'>" + icon("plus") + "Add new</button></div>";
  }
  function tabBody(t) {
    if (t.obj) return t.obj.map(function (f) { return field(t.key + "." + f[0], f[1], f[2]); }).join("");
    if (t.list) return list(t.key, t.label, t.list.item, t.list.blank);
    if (t.strings) return strings(t.key, t.label, t.long);
    if (t.fb) return field("feedback.heading", "Section heading", S) + field("feedback.text", "Intro text", TA) +
      '<div class="ap-group"><div class="ap-ghead"><span class="ap-label">Feedback inbox — visitors\' submissions</span></div><div id="apInbox"><p class="ap-hint">Loading…</p></div>' +
      '<button class="ap-btn ghost" id="apInboxRefresh">' + icon("refresh") + "Refresh</button></div>" +
      list("feedback.items", "Published feedback you added yourself", [["name", "Name", S], ["role", "Who they are", S], ["rating", "Stars (1–5)", { t: "number" }], ["message", "Message", TA]], { name: "", role: "", rating: 5, message: "" });
    if (t.toggles) return '<p class="ap-hint">Hidden sections disappear from the page and the menu.</p>' + Object.keys(draft.sections).map(function (k) {
      return '<label class="ap-toggle"><input type="checkbox" data-tog="' + k + '" ' + (draft.sections[k] !== false ? "checked" : "") + " /><span></span>" + k.charAt(0).toUpperCase() + k.slice(1) + "</label>";
    }).join("");
    return "";
  }

  /* ---------- feedback inbox ---------- */
  function stars5(n) { n = Math.max(0, Math.min(5, Math.round(+n || 0))); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  async function loadInbox() {
    const box = $("#apInbox"); if (!box) return;
    const r = $("#apInboxRefresh"); if (r) r.onclick = loadInbox;
    let rows;
    try { rows = await Store.feedback.listAll(); }
    catch (e) { box.innerHTML = '<p class="ap-hint">Couldn\'t load feedback: ' + esc(e.message) + "</p>"; return; }
    const fm = await Store.feedback.mode(), st = await Store.feedback.status();
    const statusHtml = st.problem
      ? '<p class="ap-fb-note err">' + icon("x") + "<span><strong>Feedback storage is not working.</strong> " + esc(st.problem) + " Until this is fixed, visitors can't send feedback.</span></p>"
      : (fm === "server" ? '<p class="ap-fb-note ok">' + icon("check") + "<span><strong>Feedback storage connected.</strong> New feedback appears on the website straight away. Use <b>Hide</b> or <b>Delete</b> for anything you don't want shown.</span></p>" : "");
    if (!rows.length) { box.innerHTML = statusHtml + '<p class="ap-hint">No feedback submitted yet.</p>'; return; }
    const waiting = rows.filter(function (x) { return !x.approved; }).length;
    updateBadge();
    box.innerHTML = statusHtml + (waiting ? '<p class="ap-fb-note">' + icon("bell") + "<span><strong>" + waiting + " hidden.</strong> Click <b>Approve</b> to show it on the website.</span></p>" : "") + rows.map(function (x) {
      const live = !!x.approved;
      return '<div class="ap-fb ' + (live ? "" : "pending") + '"><div class="ap-fb-head"><strong>' + esc(x.name) + (x.role ? " · " + esc(x.role) : "") + '</strong><span class="ap-badge ' + (live ? "live" : "wait") + '">' + (live ? "Live" : "Hidden") + '</span></div><div style="color:#fbbf24;letter-spacing:2px">' + stars5(x.rating) + "</div><p>" + esc(x.message) + '</p><div class="ap-fb-actions">' +
        (live ? '<button class="ap-btn ghost" data-fbhide="' + esc(x.id) + '">' + icon("eye") + "Hide</button>" : '<button class="ap-btn" data-fbok="' + esc(x.id) + '">' + icon("check") + "Approve</button>") +
        '<button class="ap-btn ghost" data-fbdel="' + esc(x.id) + '">' + icon("trash") + "Delete</button></div></div>";
    }).join("");
    const byId = {}; rows.forEach(function (x) { byId[String(x.id)] = x; });
    $$("[data-fbok]", box).forEach(function (b) {
      b.onclick = async function () {
        const x = byId[b.dataset.fbok]; b.disabled = true;
        try {
          if (fm === "local") {
            draft.feedback.items.unshift({ name: x.name, role: x.role || "", rating: x.rating, message: x.message, date: x.created_at });
            await Store.feedback.remove(x.id); changed(); drawPanel(); App.toast("Approved — save to keep it", "ok");
          } else { await Store.feedback.setApproved(x.id, true); App.reloadFeedback(); loadInbox(); App.toast("Approved — now live", "ok"); }
        } catch (e) { App.toast("Couldn't approve: " + e.message, "err"); b.disabled = false; }
      };
    });
    $$("[data-fbhide]", box).forEach(function (b) {
      b.onclick = async function () {
        try { await Store.feedback.setApproved(b.dataset.fbhide, false); App.reloadFeedback(); loadInbox(); App.toast("Hidden from the website"); }
        catch (e) { App.toast("Couldn't hide: " + e.message, "err"); }
      };
    });
    $$("[data-fbdel]", box).forEach(function (b) {
      b.onclick = async function () {
        if (!(await App.ask("This feedback will be deleted permanently.", "Delete"))) return;
        try { await Store.feedback.remove(b.dataset.fbdel); App.reloadFeedback(); loadInbox(); App.toast("Feedback deleted"); }
        catch (e) { App.toast("Couldn't delete: " + e.message, "err"); }
      };
    });
  }

  /* ---------- panel ---------- */
  function drawPanel() {
    const p = $("#adminPanel"); const t = TABS.find(function (x) { return x.key === tab; });
    const scroll = $(".ap-body", p) ? $(".ap-body", p).scrollTop : 0;
    const local = Store.mode === "local";
    p.innerHTML =
      '<div class="ap-head"><div><h3>' + icon("edit") + 'Edit portfolio</h3><span class="ap-mode ' + (local ? "warn" : "ok") + '">' + (local ? "Local mode — edits stay in this browser" : "Live mode — saves publish for everyone") + "</span></div>" +
      '<button class="icon-btn" id="apClose" aria-label="Close panel">' + icon("x") + "</button></div>" +
      '<nav class="ap-tabs">' + TABS.map(function (x) { return '<button class="' + (x.key === tab ? "on" : "") + '" data-tab="' + x.key + '">' + x.label + "</button>"; }).join("") + "</nav>" +
      '<div class="ap-body"><h4 class="ap-title">' + esc(t.label) + "</h4>" + tabBody(t) + "</div>" +
      '<div class="ap-foot"><button class="btn btn-primary" id="apSave">' + icon("save") + (local ? "Save" : "Save &amp; publish") + "</button>" +
      (local ? '<button class="btn btn-outline" id="apExport" title="Download data.js to replace js/data.js and redeploy">' + icon("download") + "Export</button>" : "") +
      '<button class="btn btn-outline" id="apLogout">' + icon("logout") + "Log out</button>" +
      (local ? '<button class="ap-link" id="apReset">Reset to original content</button>' : "") + "</div>";
    if (dirty) $("#apSave").classList.add("pulse");
    if (tab === "feedback") loadInbox();
    $(".ap-body", p).scrollTop = scroll;
    bindPanel();
  }

  function bindPanel() {
    const p = $("#adminPanel");
    $("#apClose").onclick = closePanel;
    $$("[data-tab]", p).forEach(function (b) { b.onclick = function () { tab = b.dataset.tab; drawPanel(); $(".ap-body").scrollTop = 0; }; });
    $$("[data-p]", p).forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.readOnly) return;
        set(el.dataset.p, el.dataset.num ? Math.max(0, Math.min(100, +el.value || 0)) : el.value); changed();
      });
    });
    $$("[data-tog]", p).forEach(function (el) { el.onchange = function () { draft.sections[el.dataset.tog] = el.checked; changed(); }; });
    $$("[data-del]", p).forEach(function (b) {
      b.onclick = async function () {
        const parts = b.dataset.del.split("|"); const arr = get(parts[0]);
        if (!(await App.ask("This item will be removed from the portfolio once you save.", "Delete"))) return;
        arr.splice(+parts[1], 1); changed(); drawPanel();
      };
    });
    $$("[data-mv]", p).forEach(function (b) {
      b.onclick = function () {
        const parts = b.dataset.mv.split("|"); const arr = get(parts[0]); const i = +parts[1], j = i + +parts[2];
        if (j < 0 || j >= arr.length) return; const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; changed(); drawPanel();
      };
    });
    $$("[data-adds]", p).forEach(function (b) { b.onclick = function () { get(b.dataset.adds).push(""); changed(); drawPanel(); const ins = $$('[data-p^="' + b.dataset.adds + '."]'); if (ins.length) ins[ins.length - 1].focus(); }; });
    $$("[data-addl]", p).forEach(function (b) { b.onclick = function () { get(b.dataset.addl).push(JSON.parse(b.dataset.blank)); changed(); drawPanel(); const items = $$(".ap-item"); if (items.length) items[items.length - 1].scrollIntoView({ block: "center" }); }; });
    $$("[data-clear]", p).forEach(function (b) { b.onclick = function () { set(b.dataset.clear, ""); changed(); drawPanel(); }; });
    $$("[data-up]", p).forEach(function (inp) {
      inp.onchange = async function () {
        const f = inp.files[0]; if (!f) return;
        App.toast("Uploading image…");
        try { set(inp.dataset.up, await Store.uploadImage(f)); changed(); drawPanel(); App.toast("Image added — remember to save", "ok"); }
        catch (e) { App.toast(e.message || "Upload failed", "err"); }
      };
    });
    $$("[data-upf]", p).forEach(function (inp) {
      inp.onchange = async function () {
        const f = inp.files[0]; if (!f) return;
        App.toast("Uploading file…");
        try { set(inp.dataset.upf, await Store.uploadFile(f)); changed(); drawPanel(); App.toast("File added — remember to save", "ok"); }
        catch (e) { App.toast(e.message || "Upload failed", "err"); }
      };
    });
    $("#apSave").onclick = async function () {
      const btn = this; btn.disabled = true;
      try { const m = await Store.save(JSON.parse(JSON.stringify(draft))); dirty = false; btn.classList.remove("pulse"); App.toast(m, "ok"); }
      catch (e) { App.toast("Couldn't save: " + e.message, "err"); }
      btn.disabled = false;
    };
    const ex = $("#apExport"); if (ex) ex.onclick = function () { Store.exportDataJs(draft); App.toast("data.js downloaded — replace js/data.js and redeploy", "ok"); };
    const rs = $("#apReset"); if (rs) rs.onclick = async function () {
      if (!(await App.ask("Discard all edits made in this browser and go back to the original content?", "Reset"))) return;
      Store.resetLocal(); draft = JSON.parse(JSON.stringify(window.DEFAULT_CONTENT)); dirty = false; App.render(JSON.parse(JSON.stringify(draft))); drawPanel();
    };
    $("#apLogout").onclick = async function () {
      if (dirty && !(await App.ask("You have unsaved changes. Log out anyway?", "Log out"))) return;
      await Store.logout(); document.body.classList.remove("admin-on"); closePanel(); dirty = false;
      App.render(Store.mode === "local" ? Store.initial() : (await Store.remote()) || Store.initial());
      App.toast("Logged out");
    };
  }

  function openPanel(t) {
    if (t) tab = t;
    if (!draft) draft = JSON.parse(JSON.stringify(App.get()));
    drawPanel();
    const p = $("#adminPanel"); p.classList.add("open"); p.setAttribute("aria-hidden", "false");
    document.body.classList.add("panel-open");
  }
  function closePanel() { const p = $("#adminPanel"); p.classList.remove("open"); p.setAttribute("aria-hidden", "true"); document.body.classList.remove("panel-open"); }

  function enterAdmin() {
    document.body.classList.add("admin-on");
    draft = JSON.parse(JSON.stringify(App.get()));
    addSectionButtons();
    openPanel();
    updateBadge();
  }
  // Number of feedback items waiting for approval, shown on the Admin button.
  async function updateBadge() {
    const btn = $("#adminNav"); if (!btn) return;
    let n = 0;
    try { const rows = await Store.feedback.listAll(); if (Store.feedback.needsApproval()) n = rows.filter(function (x) { return !x.approved; }).length; } catch (e) {}
    let dot = $(".fb-dot", btn);
    if (!n) { if (dot) dot.remove(); return; }
    if (!dot) { dot = document.createElement("span"); dot.className = "fb-dot"; btn.appendChild(dot); }
    dot.textContent = n; btn.title = n + " feedback waiting for approval";
  }
  function addSectionButtons() {
    Object.keys(SEC_TAB).forEach(function (id) {
      const sec = document.getElementById(id); if (!sec || $(".sec-edit", sec)) return;
      const b = document.createElement("button"); b.className = "sec-edit"; b.innerHTML = icon("edit") + "Edit section";
      b.onclick = function () { openPanel(SEC_TAB[id]); }; sec.appendChild(b);
    });
  }

  /* ---------- login ---------- */
  document.addEventListener("DOMContentLoaded", async function () {
    const key = $("#adminNav"), modal = $("#loginModal"), form = $("#loginForm"), pass = $("#adminPass"), msg = $("#loginMsg");
    key.innerHTML = icon("key") + "<span>Admin</span>";
    function openLogin() { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); msg.textContent = ""; pass.value = ""; setTimeout(function () { pass.focus(); }, 50); }
    function closeLogin() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
    key.onclick = async function () { if (document.body.classList.contains("admin-on")) openPanel(); else openLogin(); };
    $("#loginCancel").onclick = closeLogin;
    modal.addEventListener("click", function (e) { if (e.target === modal) closeLogin(); });
    pass.addEventListener("input", function () { msg.textContent = ""; });
    form.addEventListener("submit", async function (e) {
      e.preventDefault(); msg.className = "form-msg"; msg.textContent = "Checking…";
      const r = await Store.login(pass.value.trim());
      if (!r.ok) { msg.className = "form-msg err"; msg.textContent = r.msg; form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake"); return; }
      closeLogin(); enterAdmin(); App.toast("Welcome, admin", "ok");
    });
    window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
    if (await Store.isLoggedIn()) { document.body.classList.add("admin-on"); addSectionButtons(); updateBadge(); }
  });
})();
