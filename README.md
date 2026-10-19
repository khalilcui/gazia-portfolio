# Gazia Hussain — Portfolio

Personal portfolio for **Gazia Hussain**, Biomedical Science student from Luton and aspiring pharmacist.

Built with plain HTML, CSS and JavaScript (no build step) and Three.js.

## Features
- **28 colour themes** (Signature, 7 Blues, 7 Turquoise). The visitor picks one and the whole site, 3D scene and cursor recolour.
- **3D moving background.** Capsules, tablets, DNA helices and molecules drift quickly and travel with the page as you scroll.
- **3D hero.** A glass "Pharmacy" bottle with orbiting medicines.
- **Snake cursor** in the theme's colours (desktop only).
- **3D skills coverflow** with progress bars.
- **Auto-rotating 3D certificate ring.** Click a certificate to zoom in.
- **Feedback section.** Star ratings, average score and a review wall. New reviews appear after admin approval. Stored with Vercel Blob through `api/feedback.js` (setup in SETUP.md).
- **English / German** language switch, with automatic German for German-language browsers.
- **Admin panel** (**Admin** button in the navbar). Add, edit, delete and reorder every section, and upload photos, certificates and a CV, all without touching code.
- Responsive, with reduced-motion support.

## Run locally
Open `index.html`, or serve the folder with `python3 -m http.server`.

## Deploy
Import the repo into Vercel with the **Other** preset, no build command, output directory `.`.

See **[SETUP.md](SETUP.md)** for the images step, live admin mode (Supabase) and the contact form.
