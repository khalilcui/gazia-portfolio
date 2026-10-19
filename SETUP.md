# Gazia Hussain Portfolio — Setup Guide

A single-page portfolio in plain HTML, CSS and JavaScript (no build step).
Three.js and the Supabase client are bundled in `/vendor`, so nothing else needs installing.

## What's inside

| Feature | Where |
|---|---|
| 28 colour themes in 3 groups: Signature, Blues, Turquoise (palette button, top right) | `js/themes.js` |
| 3D moving background: capsules, tablets, DNA, molecules + mouse/scroll parallax | `js/three-scene.js` |
| 3D hero: glass medicine bottle with orbiting medicines | `js/three-scene.js` |
| Snake cursor in theme colours (desktop only) | `js/app.js` → `initSnake` |
| 3D skills coverflow with progress bars | `js/app.js` → `buildCoverflow` |
| Auto-rotating 3D certificate ring + click-to-zoom lightbox | `js/app.js` → `buildCertRing` |
| Feedback section: star ratings, review wall, admin approval | `js/app.js` → `renderFeedback`, `js/store.js`, `api/feedback.js` |
| English / German language switch | `js/i18n.js` |
| Admin panel (**Admin** button, top-right of the navbar; key: `ghazia4321`) | `js/admin.js`, `js/store.js` |
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
- The admin clicks **Admin** (top-right of the navbar) → enters `ghazia4321` → the edit panel opens.
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

-- Visitor feedback: anyone can send, only approved feedback is public, admin manages all
create table feedback (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 60),
  role text default '' check (char_length(role) <= 60),
  rating int not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 3 and 800),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table feedback enable row level security;
create policy "Visitors can send feedback" on feedback for insert to anon, authenticated with check (approved = false);
create policy "Anyone can read approved"   on feedback for select using (approved = true);
create policy "Admin reads all"            on feedback for select to authenticated using (true);
create policy "Admin updates"              on feedback for update to authenticated using (true);
create policy "Admin deletes"              on feedback for delete to authenticated using (true);
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

## Feedback section

Visitors rate the portfolio (1–5 stars) and leave a message. **New feedback shows on the website straight away**, with an average rating and a scrolling review wall.
The admin manages it in Admin → **Feedback** tab: **Hide** (take it off the site), **Approve** (show a hidden one again) or **Delete**.
That tab also says whether feedback storage is connected, and if not, what to fix.

Prefer to check every review before it goes live? In Vercel → Settings → Environment Variables add
`FEEDBACK_REQUIRE_APPROVAL` = `1` and redeploy. New feedback then stays hidden until approved, and the Admin button shows how many are waiting.

### ⚠️ Required once: connect feedback storage in Vercel (2 minutes)

Feedback is saved by the site's own server function (`api/feedback.js`) in **Vercel Blob** storage.
No new account is needed. Until this is done, feedback only stays in the visitor's own browser and never reaches the admin.

1. Open https://vercel.com/dashboard → project **gazia-portfolio**.
2. Click the **Storage** tab → **Create** → **Blob** → name it `gazia-feedback` → **Create**.
3. When asked, **connect it to the gazia-portfolio project** (all environments). This adds `BLOB_READ_WRITE_TOKEN` automatically.
4. Go to **Deployments** → the newest deployment → **⋯** → **Redeploy**.

To check it worked, open `https://<your-site>/api/feedback`. It should show `{"enabled":true,...}`.
If it shows `"enabled":false`, the storage isn't connected or the site wasn't redeployed after connecting it.
If the page says 404, the latest code from GitHub isn't deployed yet.

The server checks the admin key itself (only its SHA-256 hash is stored). To change the key later, add an environment variable
`ADMIN_KEY_SHA256` with the SHA-256 hash of the new key, and update `ADMIN_HASH` in `js/store.js` to match.

If Supabase is configured instead (see Live mode above), feedback uses the Supabase `feedback` table.
Add a Formspree ID (below) to also get each new piece of feedback by email.

## Language switch (English / Deutsch)

The **EN | DE** switch in the navbar translates the whole site, including the 3D labels. Visitors whose browser is set to German see German automatically; the choice is remembered.

All translations live in `js/i18n.js` as `"English text": "German text"` pairs. The admin edits content in English.
If the admin adds **new** text, it shows in English on the German page until a matching line is added to `js/i18n.js`.
Visitor feedback is never translated.

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
