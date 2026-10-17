/* ==========================================================
   SITE CONFIG — the only file you edit to go live.
   See SETUP.md for the 10-minute Supabase setup.
   ========================================================== */
window.SITE_CONFIG = {
  // 1) Supabase (makes admin edits LIVE for every visitor).
  //    Leave empty to run in "local mode" (edits stay in the admin's
  //    browser until exported — see SETUP.md).
  supabaseUrl: "",
  supabaseAnonKey: "",

  // 2) The admin account you create in Supabase → Authentication → Users.
  //    The admin types only the password (ghazia4321) on the website.
  adminEmail: "admin@gazia-portfolio.com",

  // 3) Optional: Formspree form ID (e.g. "xyzabcd") so contact messages
  //    arrive in Gazia's inbox. Empty = form opens the visitor's email app.
  formspreeId: ""
};
