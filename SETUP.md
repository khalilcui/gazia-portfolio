# Gazia Hussain Portfolio — Setup Guide

A single-page portfolio in plain HTML, CSS and JavaScript (no build step).
Three.js and the Supabase client are bundled in `/vendor`, so nothing else needs installing.

## What's inside

| Feature | Where |
|---|---|
| 14 colour themes (palette button, top right) | `js/themes.js` |
| 3D moving background: capsules, tablets, DNA, molecules + mouse/scroll parallax | `js/three-scene.js` |
| 3D hero: glass medicine bottle with orbiting medicines | `js/three-scene.js` |
| Snake cursor in theme colours (desktop only) | `js/app.js` → `initSnake` |
| 3D skills coverflow with progress bars | `js/app.js` → `buildCoverflow` |
| Auto-rotating 3D certificate ring + click-to-zoom lightbox | `js/app.js` → `buildCertRing` |
| Admin panel (key icon, bottom-left; key: `ghazia4321`) | `js/admin.js`, `js/store.js` |
| All original content | `js/data.js` |

```
index.html     css/style.css     config.js     SETUP.md
js/  app.js  admin.js  store.js  three-scene.js  data.js  themes.js  icons.js
vendor/  three.min.js  supabase.js
images/  (put the original 7 images here — step 1)
```

---

## Step 1 — Copy the original images (2 minutes)

Before replacing the old site, download these 7 files from the old portfolio.
Open each link, save it, and put it in the `images/` folder with the same name:

- https://ghazias-portfolio-m97k.vercel.app/images/cert-reading.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/cert-ocr.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/cert-sports.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/cert-futures1.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/cert-futures2.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/work-1.jpg
- https://ghazias-portfolio-m97k.vercel.app/images/work-2.jpg

Until they're there, the site automatically loads them from the old URL. That fallback stops working once the old deployment is replaced.

## Step 2 — Deploy to Vercel

1. Push this folder to a GitHub repo (or drag the folder into vercel.com → **Add New → Project**).
2. Framework preset: **Other**. No build command, output directory `.`.
3. Deploy. To keep the same link, deploy it to the client's existing Vercel project.

At this point the site works fully. The admin panel runs in **local mode** (see below).

---

## Admin panel — two modes

### Local mode (default, no setup)
- The admin clicks the 🔑 key (bottom-left) → enters `ghazia4321` → the edit panel opens.
- They can edit, add, delete and reorder every section, and upload photos and certificates.
- **Limitation:** changes are saved only in that browser. To publish them for all visitors:
  click **Export** → it downloads `data.js` → replace `js/data.js` with it → redeploy.
- The admin key is stored only as a SHA-256 hash, never in plain text. A static site
  can't fully protect a password, though, so use **Live mode** for real security.

### Live mode — recommended (Supabase, free, ~10 minutes)
Edits publish instantly for everyone, uploads go to cloud storage, and the key is checked on the server.

1. Create a free project at https://supabase.com.
2. **SQL Editor** → run:

```sql
create table portfolio (
  id int primary key,
  content jsonb not null,
  updated_at timestamptz default now()
);
alter table portfolio enable row level security;
create policy "Anyone can read"   on portfolio for select using (true);
create policy "Admin can insert"  on portfolio for insert to authenticated with check (true);
create policy "Admin can update"  on portfolio for update to authenticated using (true);

insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);
create policy "Anyone can view files" on storage.objects for select using (bucket_id = 'portfolio');
create policy "Admin can upload"      on storage.objects for insert to authenticated with check (bucket_id = 'portfolio');
```

3. **Authentication → Users → Add user**
   - Email: `admin@gazia-portfolio.com` (or any email; it must match `adminEmail` in `config.js`)
   - Password: `ghazia4321`
   - Tick **Auto Confirm User**
4. **Authentication → Sign In / Providers → Email** → turn **OFF "Allow new users to sign up"**.
   ⚠️ This is important: it stops anyone else from creating an account that could edit the site.
5. **Project Settings → API** → copy the **Project URL** and **anon public key** into `config.js`:

```js
supabaseUrl: "https://xxxx.supabase.co",
supabaseAnonKey: "eyJhbGci...",
adminEmail: "admin@gazia-portfolio.com",
```

6. Redeploy. Log in with the key → **Save & publish** once. From then on, every visitor sees the live content.

**Changing the admin key later:** in Supabase → Authentication → Users → the admin user → reset the password.
(In local mode, the hash in `js/store.js` would need updating instead.)

---

## Contact form

- **Default:** clicking "Send Message" opens the visitor's email app, pre-filled to Gazia's email.
- **Optional (messages straight to the inbox):** create a free form at https://formspree.io,
  then put its ID (the part after `/f/`) in `config.js` → `formspreeId`.

## What the admin can edit

Home (name, title, tagline, intro, photo, CV upload, highlights, stats) · About bullet points ·
Quick facts · Languages · Hobbies · Achievements · Education · Science focus · 3D skill cards
(icon, text, level %) · Professional & IT skills · Experience (bullets, tags) · Work gallery ·
Key skills · Certificates · Contact details · Footer · show/hide whole sections.

## Notes

- The skill-card percentages (95%, 90%…) are starting values. Ask the client to confirm or adjust them in the admin panel.
- Adding a phone number or LinkedIn in Admin → Contact makes them appear automatically.
- The theme a visitor picks is remembered on their device.
- The snake cursor and 3D tilt are off on phones/tablets and for visitors with "reduce motion" enabled.
