/* ==========================================================
   /api/feedback — visitor feedback stored in Vercel Blob.

   Needs one thing in Vercel: Storage → Create → Blob, connected
   to this project (adds BLOB_READ_WRITE_TOKEN automatically).

   GET    /api/feedback                → approved feedback (public)
   GET    /api/feedback?all=1          → everything (admin)
   POST   /api/feedback                → new feedback, live at once (or pending, see REQUIRE_APPROVAL)
   PATCH  /api/feedback  {id, approved}→ approve / hide (admin)
   DELETE /api/feedback?id=…           → delete (admin)

   Admin requests send the admin key in the "x-admin-key" header;
   only its SHA-256 hash is stored here.
   ========================================================== */
const crypto = require("crypto");

const API = process.env.VERCEL_BLOB_API_URL || "https://blob.vercel-storage.com";
const API_VERSION = "9";
const ADMIN_HASH = process.env.ADMIN_KEY_SHA256 || "d638a8e769d532b698c567d8e470f3e4a82e00dba355e2c8bc99f49343f3965b";
// New feedback goes live straight away; the admin can hide or delete it.
// Set the env var FEEDBACK_REQUIRE_APPROVAL=1 in Vercel to hold new feedback for approval instead.
const REQUIRE_APPROVAL = process.env.FEEDBACK_REQUIRE_APPROVAL === "1";
const PENDING = "feedback/pending/";
const APPROVED = "feedback/approved/";

function token() { return process.env.BLOB_READ_WRITE_TOKEN || ""; }

async function blob(path, init) {
  const res = await fetch(API + path, {
    ...init,
    headers: { authorization: "Bearer " + token(), "x-api-version": API_VERSION, ...(init && init.headers) }
  });
  const text = await res.text();
  if (!res.ok) throw new Error("Blob " + res.status + ": " + text.slice(0, 200));
  return text ? JSON.parse(text) : {};
}

async function listAll(prefix) {
  let out = [], cursor = "";
  do {
    const q = new URLSearchParams({ prefix: prefix, limit: "1000" });
    if (cursor) q.set("cursor", cursor);
    const r = await blob("?" + q.toString(), { method: "GET" });
    out = out.concat(r.blobs || []);
    cursor = r.hasMore ? r.cursor : "";
  } while (cursor);
  return out;
}

async function putJson(pathname, data) {
  return blob("/?" + new URLSearchParams({ pathname: pathname }).toString(), {
    method: "PUT",
    headers: { "x-add-random-suffix": "0", "x-content-type": "application/json", "x-cache-control-max-age": "60" },
    body: JSON.stringify(data)
  });
}

async function copy(fromUrl, toPathname) {
  return blob("/?" + new URLSearchParams({ pathname: toPathname, fromUrl: fromUrl }).toString(), {
    method: "PUT",
    headers: { "x-add-random-suffix": "0", "x-content-type": "application/json", "x-cache-control-max-age": "60" }
  });
}

async function del(urls) {
  if (!urls.length) return;
  await blob("/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ urls: urls }) });
}

async function readItems(blobs, approved) {
  const items = await Promise.all(blobs.map(async function (b) {
    try {
      const r = await fetch(b.url, { cache: "no-store" });
      if (!r.ok) return null;
      const x = await r.json();
      return { id: x.id, name: x.name, role: x.role || "", rating: x.rating, message: x.message, created_at: x.created_at, approved: approved };
    } catch (e) { return null; }
  }));
  return items.filter(Boolean);
}

function isAdmin(req) {
  const key = String(req.headers["x-admin-key"] || "");
  if (!key) return false;
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(ADMIN_HASH));
}

function clean(s, max) { return String(s == null ? "" : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max); }
function validId(id) { return /^[a-z0-9-]{6,40}$/.test(String(id || "")); }
function send(res, code, body, cache) {
  res.statusCode = code;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", cache || "no-store");
  res.end(JSON.stringify(body));
}
function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") { try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); } }
  return new Promise(function (resolve) {
    let d = ""; req.on("data", function (c) { d += c; if (d.length > 20000) req.destroy(); });
    req.on("end", function () { try { resolve(JSON.parse(d || "{}")); } catch (e) { resolve({}); } });
  });
}
function sortNewest(a) { return a.sort(function (x, y) { return String(y.created_at).localeCompare(String(x.created_at)); }); }

module.exports = async function handler(req, res) {
  if (!token()) return send(res, 503, { enabled: false, error: "Feedback storage is not connected yet." });
  const url = new URL(req.url, "http://x");

  try {
    if (req.method === "GET") {
      if (url.searchParams.get("all")) {
        if (!isAdmin(req)) return send(res, 401, { error: "Wrong admin key." });
        const [p, a] = await Promise.all([listAll(PENDING), listAll(APPROVED)]);
        const items = (await readItems(p, false)).concat(await readItems(a, true));
        return send(res, 200, { enabled: true, requireApproval: REQUIRE_APPROVAL, items: sortNewest(items) });
      }
      const items = await readItems(await listAll(APPROVED), true);
      return send(res, 200, { enabled: true, requireApproval: REQUIRE_APPROVAL, items: sortNewest(items).slice(0, 100) });
    }

    if (req.method === "POST") {
      const b = await readBody(req);
      if (b.website) return send(res, 200, { ok: true }); // honeypot
      const name = clean(b.name, 60), role = clean(b.role, 60), message = clean(b.message, 800);
      const rating = Math.max(1, Math.min(5, parseInt(b.rating, 10) || 0));
      if (!name || message.length < 3 || !parseInt(b.rating, 10)) return send(res, 400, { error: "Name, rating and a message are required." });
      const id = Date.now().toString(36) + "-" + crypto.randomBytes(5).toString("hex");
      await putJson((REQUIRE_APPROVAL ? PENDING : APPROVED) + id + ".json", { id: id, name: name, role: role, rating: rating, message: message, created_at: new Date().toISOString() });
      return send(res, 201, { ok: true, approved: !REQUIRE_APPROVAL });
    }

    if (req.method === "PATCH") {
      if (!isAdmin(req)) return send(res, 401, { error: "Wrong admin key." });
      const b = await readBody(req);
      if (!validId(b.id)) return send(res, 400, { error: "Unknown feedback." });
      const from = b.approved ? PENDING : APPROVED, to = b.approved ? APPROVED : PENDING;
      const found = (await listAll(from + b.id + ".json"))[0];
      if (!found) return send(res, 404, { error: "That feedback no longer exists." });
      await copy(found.url, to + b.id + ".json");
      await del([found.url]);
      return send(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      if (!isAdmin(req)) return send(res, 401, { error: "Wrong admin key." });
      const id = url.searchParams.get("id");
      if (!validId(id)) return send(res, 400, { error: "Unknown feedback." });
      const [p, a] = await Promise.all([listAll(PENDING + id + ".json"), listAll(APPROVED + id + ".json")]);
      await del(p.concat(a).map(function (x) { return x.url; }));
      return send(res, 200, { ok: true });
    }

    res.setHeader("allow", "GET, POST, PATCH, DELETE");
    return send(res, 405, { error: "Method not allowed." });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: "Feedback storage error. Try again in a moment." });
  }
};
