/* ==========================================================
   Language switch: English ⇄ German (Deutsch)

   How it works: the site is rendered in English, then every
   visible text, placeholder and label is looked up in the DE
   dictionary below and swapped. Content the admin edits stays
   English in the data; any new text without a German entry
   simply shows in English until a translation is added here.
   ========================================================== */
(function () {
  const DE = {
    /* ---------- Navigation & general ---------- */
    "Home": "Start", "About": "Über mich", "Education": "Ausbildung", "Skills": "Fähigkeiten",
    "Experience": "Erfahrung", "Certificates": "Zertifikate", "Feedback": "Feedback", "Contact": "Kontakt",
    "Admin": "Admin", "Language": "Sprache", "Loading portfolio": "Portfolio wird geladen", "Download CV": "Lebenslauf herunterladen",
    "Change colour theme": "Farbschema ändern", "Open menu": "Menü öffnen", "Admin login": "Admin-Anmeldung",
    "Close": "Schließen", "Scroll down": "Nach unten scrollen", "Copy email": "E-Mail kopieren", "Email copied": "E-Mail kopiert",
    "Professional Portfolio": "Professionelles Portfolio",

    /* ---------- Theme picker ---------- */
    "Choose your colours": "Farben wählen", "Choose a colour theme": "Farbschema wählen",
    "Signature": "Signatur", "Blues": "Blautöne",
    "Electric Blue": "Elektrisches Blau", "Royal Purple": "Königsviolett", "Emerald": "Smaragd", "Rose Gold": "Roségold",
    "Teal Lab": "Petrol-Labor", "Sunset Orange": "Sonnenuntergang", "Crimson": "Karmesinrot", "Cyan Ice": "Cyan-Eis",
    "Lavender": "Lavendel", "Mint": "Minze", "Golden": "Gold", "Magenta": "Magenta", "Midnight Silver": "Mitternachtssilber",
    "Pure Light": "Hell", "Sky Blue": "Himmelblau", "Royal Blue": "Königsblau", "Navy": "Marineblau", "Sapphire": "Saphir",
    "Cobalt": "Kobalt", "Azure": "Azurblau", "Ice Blue": "Eisblau", "Turquoise": "Türkis", "Aqua": "Aqua", "Lagoon": "Lagune",
    "Caribbean": "Karibik", "Tiffany": "Tiffany", "Seafoam": "Meeresschaum", "Deep Turquoise": "Tieftürkis",

    /* ---------- Home ---------- */
    "Hello, I'm": "Hallo, ich bin", "Biomedical Science Student": "Biomedizin-Studentin",
    "Aspiring Pharmacist | Passion for Science | Lifelong Learner": "Angehende Apothekerin | Leidenschaft für die Wissenschaft | Lebenslang lernend",
    "Biomedical Science student from Luton — driven by curiosity, teamwork and continuous personal growth.":
      "Studentin der Biomedizinischen Wissenschaften aus Luton – angetrieben von Neugier, Teamarbeit und stetiger persönlicher Entwicklung.",
    "View Certificates": "Zertifikate ansehen", "Contact Me": "Kontakt aufnehmen",
    "Biomedical Science": "Biomedizinische Wissenschaften", "Aspiring Pharmacy": "Angehende Pharmazeutin",
    "Healthcare Focus": "Fokus Gesundheitswesen", "Teamwork & Leadership": "Teamarbeit & Führung",
    "Years Learning": "Jahre Lernen", "Leadership Years": "Jahre in Führungsrollen",
    "Luton, England": "Luton, England",

    /* ---------- About ---------- */
    "About me": "Über mich", "A student who loves learning & growing.": "Eine Studentin, die gern lernt & wächst.",
    "A student who loves": "Eine Studentin, die gern", "learning & growing": "lernt & wächst",
    "Who I am": "Wer ich bin",
    "A 19-year-old student from Luton, England who enjoys learning new things, improving her skills and taking on challenges.":
      "Eine 19-jährige Studentin aus Luton, England, die gern Neues lernt, ihre Fähigkeiten ausbaut und Herausforderungen annimmt.",
    "Growth mindset": "Wachstumsorientiert",
    "Every challenge is a chance to grow — both personally and professionally.": "Jede Herausforderung ist eine Chance zu wachsen – persönlich wie beruflich.",
    "School": "Schule", "Challney High School for Girls, Luton, Bedfordshire (2018 – 2023).": "Challney High School for Girls, Luton, Bedfordshire (2018 – 2023).",
    "College": "College", "Luton Sixth Form College (2023 – 2025) — Biomedical Applied Science.": "Luton Sixth Form College (2023 – 2025) – Angewandte Biomedizinische Wissenschaften.",
    "Results": "Ergebnisse", "Achieved all Distinctions (DDD / D1).": "Alle Fächer mit Bestnote „Distinction“ abgeschlossen (DDD / D1).",
    "Strengths": "Stärken",
    "Communication, organisation, research, time management, collaboration and teamwork.": "Kommunikation, Organisation, Recherche, Zeitmanagement, Zusammenarbeit und Teamarbeit.",
    "Digital tools": "Digitale Tools",
    "Confident with Canva, Microsoft Office, digital marketing tools, Edexcel systems and other digital platforms.":
      "Sicher im Umgang mit Canva, Microsoft Office, Digital-Marketing-Tools, Edexcel-Systemen und weiteren digitalen Plattformen.",
    "Always learning": "Immer lernbereit", "Ready to learn more and adapt to new tools and environments.": "Bereit, Neues zu lernen und mich an neue Tools und Umgebungen anzupassen.",
    "Quick facts": "Kurz & knapp", "Location": "Wohnort", "Age": "Alter", "Focus": "Schwerpunkt", "Studied": "Ausbildung",
    "Biomedical Science · Pharmacy": "Biomedizin · Pharmazie", "Challney HS · Luton Sixth Form": "Challney HS · Luton Sixth Form",
    "Languages": "Sprachen", "Urdu": "Urdu", "English": "Englisch", "Pahari": "Pahari", "Pahari-Pothwari": "Pahari-Pothwari",
    "Hobbies": "Hobbys", "Cycling": "Radfahren", "Going for walks": "Spazierengehen", "Playing sports": "Sport treiben",
    "Travelling": "Reisen", "Photography": "Fotografie",
    "Achievements & Leadership": "Erfolge & Führung",
    "World Class School Recognition": "Auszeichnung „World Class School“", "Recognised at a World Class School — a proud milestone.": "Anerkennung an einer World Class School – ein stolzer Meilenstein.",
    "Reading Assistant": "Leseassistentin", "Classroom-based Reading Assistant, 2022 – 2023.": "Leseassistentin im Unterricht, 2022 – 2023.",
    "Form Captain": "Klassensprecherin", "Form Captain during 2022 – 2023.": "Klassensprecherin im Schuljahr 2022 – 2023.",
    "Sports Leader": "Sportleiterin", "Served as a Sports Leader for one year.": "Ein Jahr lang als Sportleiterin tätig.",
    "Quizzes & Presentations": "Quiz & Präsentationen", "Led school quizzes and delivered presentations confidently.": "Schulquiz geleitet und Präsentationen souverän gehalten.",
    "Leader & Supporter": "Führung & Unterstützung", "Aspire to be a leader and supporter who helps serve community and humanity.": "Mein Ziel: als Führungskraft und Unterstützerin der Gemeinschaft und den Menschen zu dienen.",
    "Charity & Fundraising": "Wohltätigkeit & Spenden", "Contributed to charities, raised money and joined fundraising in high school.": "An der Schule für wohltätige Zwecke engagiert, Spenden gesammelt und an Spendenaktionen teilgenommen.",
    "Sports Clubs & Activities": "Sportvereine & Aktivitäten", "Active participant in sports clubs and school activities.": "Aktive Teilnehmerin an Sport-AGs und Schulaktivitäten.",

    /* ---------- Education ---------- */
    "A foundation built on": "Ein Fundament aus", "curiosity.": "Neugier.",
    "Form Captain (Year 10 & 11)": "Klassensprecherin (Jahrgang 10 & 11)", "Charity fundraising": "Spendenaktionen für Wohltätigkeit",
    "Sports clubs": "Sport-AGs", "Leadership activities": "Führungsaufgaben", "September 2023 – July 2025": "September 2023 – Juli 2025",
    "Biomedical Applied Science (Equivalent to 3 A Levels) — Grade D1": "Angewandte Biomedizinische Wissenschaften (entspricht 3 A-Levels) – Note D1",
    "Achieved all Distinctions (DDD / D1)": "Alle Fächer mit Bestnote „Distinction“ (DDD / D1)",
    "Strong research, analytical & scientific skills": "Ausgeprägte Recherche-, Analyse- & wissenschaftliche Fähigkeiten",
    "Practical investigations, data handling & report writing": "Praktische Untersuchungen, Datenauswertung & Berichterstellung",
    "Science & Healthcare Focus": "Fokus Wissenschaft & Gesundheit", "Science Enthusiast": "Begeisterung für Wissenschaft",
    "Practical Lab Experience": "Praktische Laborerfahrung", "Passion for Healthcare": "Leidenschaft fürs Gesundheitswesen",
    "Research & Innovation": "Forschung & Innovation", "Growing with the Science Community": "Wachsen mit der wissenschaftlichen Community",

    /* ---------- Skills ---------- */
    "My professional skills": "Meine beruflichen Fähigkeiten", "Skills That Define": "Fähigkeiten, die", "My Journey": "meinen Weg prägen",
    "A blend of science knowledge, people skills and digital abilities that help me grow and create an impact.":
      "Eine Mischung aus naturwissenschaftlichem Wissen, sozialer Kompetenz und digitalen Fähigkeiten, mit denen ich wachse und etwas bewirke.",
    "Applied science, lab practicals, data handling and scientific report writing.": "Angewandte Wissenschaft, Laborpraktika, Datenauswertung und wissenschaftliches Schreiben.",
    "Research & Analysis": "Recherche & Analyse", "Internet research, investigations, analytical thinking and problem solving.": "Internetrecherche, Untersuchungen, analytisches Denken und Problemlösung.",
    "Communication": "Kommunikation", "Presentations, quizzes, active listening and interpretation (English ↔ Urdu).": "Präsentationen, Quiz, aktives Zuhören und Dolmetschen (Englisch ↔ Urdu).",
    "Patient & Customer Care": "Patienten- & Kundenbetreuung", "Patient support, customer service and confidentiality in healthcare settings.": "Patientenunterstützung, Kundenservice und Vertraulichkeit im Gesundheitswesen.",
    "Form Captain, Sports Leader, Reading Assistant and team projects.": "Klassensprecherin, Sportleiterin, Leseassistentin und Teamprojekte.",
    "Organisation": "Organisation", "Planning, time management, punctuality and attention to detail.": "Planung, Zeitmanagement, Pünktlichkeit und Liebe zum Detail.",
    "IT & Digital": "IT & Digitales", "Canva, Microsoft Office, digital marketing, Edexcel systems, data entry.": "Canva, Microsoft Office, Digital Marketing, Edexcel-Systeme, Dateneingabe.",
    "Previous skill": "Vorherige Fähigkeit", "Next skill": "Nächste Fähigkeit",
    "Professional Skills": "Berufliche Kompetenzen", "IT & Digital Skills": "IT- & Digitalkompetenzen",
    "Organisation & Planning": "Organisation & Planung", "Research": "Recherche", "Time Management": "Zeitmanagement",
    "Punctuality": "Pünktlichkeit", "Teamwork": "Teamarbeit", "Problem Solving": "Problemlösung", "Adaptability": "Anpassungsfähigkeit",
    "Attention to Detail": "Liebe zum Detail", "Customer Service": "Kundenservice", "Digital Marketing": "Digital Marketing",
    "Edexcel Systems": "Edexcel-Systeme", "Internet Research": "Internetrecherche", "Email Communication": "E-Mail-Kommunikation",
    "Digital Productivity": "Digitale Produktivität", "Online Learning": "Online-Lernen", "Data Entry & Files": "Dateneingabe & Ablage",

    /* ---------- Experience ---------- */
    "Work experience": "Berufserfahrung", "Real workplace,": "Echter Arbeitsalltag,", "real skills.": "echte Fähigkeiten.",
    "Work Experience Placement": "Berufspraktikum", "Work Experience": "Praktikum", "Remote": "Remote",
    "February 2022 – March 2022": "Februar 2022 – März 2022", "January 2020 – October 2022": "Januar 2020 – Oktober 2022",
    "21–22 July 2026": "21.–22. Juli 2026", "7–8 July 2026": "7.–8. Juli 2026", "10–14 August 2026": "10.–14. August 2026",
    "Assisted with stock management, shelf replenishment, deliveries and purchase orders.": "Unterstützung bei Lagerverwaltung, Regalauffüllung, Lieferungen und Bestellungen.",
    "Prepared and checked customer orders and maintained accurate inventory records.": "Kundenaufträge vorbereitet und geprüft sowie genaue Bestandslisten geführt.",
    "Used barcode scanners and Microsoft systems for stock tracking and data entry.": "Barcodescanner und Microsoft-Systeme für Bestandsverfolgung und Dateneingabe genutzt.",
    "Supported telephone handling and daily business operations.": "Telefonannahme und das Tagesgeschäft unterstützt.",
    "Created sales promotions for social media using Canva.": "Verkaufsaktionen für Social Media mit Canva gestaltet.",
    "Worked effectively as part of a team with strong attention to detail.": "Effektiv im Team gearbeitet, mit großer Sorgfalt im Detail.",
    "Stock Management": "Lagerverwaltung", "Data Entry": "Dateneingabe",
    "Reading Assistant – Challney High School for Girls": "Leseassistentin – Challney High School for Girls",
    "Provided one-to-one support to students to improve reading, literacy and communication skills.": "Einzelbetreuung von Schülerinnen zur Verbesserung von Lese-, Schreib- und Kommunikationsfähigkeiten.",
    "Created personalised reading activities and provided constructive feedback.": "Individuelle Leseübungen erstellt und konstruktives Feedback gegeben.",
    "Monitored student progress and prepared reports for teaching staff.": "Lernfortschritte begleitet und Berichte für Lehrkräfte erstellt.",
    "Built positive relationships with students and staff while supporting classroom and reading activities.": "Positive Beziehungen zu Schülerinnen und Kollegium aufgebaut und Unterrichts- sowie Leseaktivitäten unterstützt.",
    "Helped improve students’ confidence, reading fluency and comprehension.": "Selbstvertrauen, Leseflüssigkeit und Textverständnis der Schülerinnen gestärkt.",
    "Mentoring": "Mentoring", "Literacy Support": "Leseförderung", "Report Writing": "Berichterstellung",
    "Futures for All – Careers in Teaching": "Futures for All – Berufe im Lehramt",
    "Worked in teams to create and present a lesson.": "Im Team eine Unterrichtsstunde entwickelt und präsentiert.",
    "Developed communication, teamwork, creativity and problem-solving skills.": "Kommunikation, Teamarbeit, Kreativität und Problemlösung weiterentwickelt.",
    "Participated in discussions, activities and group projects while confidently sharing ideas.": "An Diskussionen, Aktivitäten und Gruppenprojekten teilgenommen und Ideen selbstbewusst eingebracht.",
    "Lesson Planning": "Unterrichtsplanung", "Presentation": "Präsentation", "Creativity": "Kreativität",
    "Futures for All – Science Sector / STEM Ambassadors": "Futures for All – Wissenschaft / MINT-Botschafter",
    "Worked as part of a team to develop an eco-innovation project addressing global environmental challenges.": "Im Team ein Öko-Innovationsprojekt zu globalen Umweltherausforderungen entwickelt.",
    "Created and delivered presentations and received professional feedback.": "Präsentationen erstellt und gehalten sowie professionelles Feedback erhalten.",
    "Developed problem-solving, creativity, teamwork and presentation skills.": "Problemlösung, Kreativität, Teamarbeit und Präsentationsfähigkeiten weiterentwickelt.",
    "Explored STEM careers and gained industry-related knowledge through practical activities.": "MINT-Berufe erkundet und durch praktische Aufgaben Branchenwissen erworben.",
    "STEM": "MINT", "Eco-Innovation": "Öko-Innovation",
    "NHS L&D – Luton and Dunstable Hospital": "NHS L&D – Luton and Dunstable Hospital",
    "Observed doctors and nurses across different hospital departments, including A&E, wards, X-ray, ultrasound, MRI/CT and paediatrics.":
      "Ärztinnen, Ärzte und Pflegekräfte in verschiedenen Klinikbereichen begleitet, darunter Notaufnahme, Stationen, Röntgen, Ultraschall, MRT/CT und Pädiatrie.",
    "Developed an understanding of patient care, communication, teamwork and confidentiality.": "Verständnis für Patientenversorgung, Kommunikation, Teamarbeit und Schweigepflicht entwickelt.",
    "Supported patients by providing directions, general assistance and language interpretation between English and Urdu.": "Patientinnen und Patienten mit Wegbeschreibungen, allgemeiner Hilfe und Dolmetschen zwischen Englisch und Urdu unterstützt.",
    "Observed healthcare professionals using computer systems and carrying out daily clinical duties.": "Fachkräfte bei der Arbeit mit Computersystemen und bei täglichen klinischen Aufgaben begleitet.",
    "Gained valuable insight into NHS services and the skills required for healthcare careers.": "Wertvolle Einblicke in den NHS und die Anforderungen von Gesundheitsberufen gewonnen.",
    "Healthcare": "Gesundheitswesen", "Patient Support": "Patientenbetreuung", "Confidentiality": "Schweigepflicht", "Interpretation": "Dolmetschen",
    "Capital Electrical Wholesalers — Promotions": "Capital Electrical Wholesalers – Werbeaktionen",
    "Capital Electrical Wholesalers – switched sockets promotion": "Capital Electrical Wholesalers – Aktion für Schalter-Steckdosen",
    "Capital Electrical Wholesalers – door entry system offer": "Capital Electrical Wholesalers – Angebot für Türsprechanlagen",
    "Skills developed through every placement": "In jedem Praktikum entwickelte Fähigkeiten",
    "Communication and active listening": "Kommunikation und aktives Zuhören", "Teamwork and collaboration": "Teamarbeit und Zusammenarbeit",
    "Time management and organisation": "Zeitmanagement und Organisation", "Problem-solving and creativity": "Problemlösung und Kreativität",
    "Customer service and patient support": "Kundenservice und Patientenbetreuung", "Data entry and inventory management": "Dateneingabe und Bestandsverwaltung",
    "Presentation and interpersonal skills": "Präsentations- und zwischenmenschliche Fähigkeiten",
    "Professionalism, punctuality and attention to detail": "Professionalität, Pünktlichkeit und Liebe zum Detail",
    "Ability to work with people from different backgrounds": "Fähigkeit, mit Menschen unterschiedlicher Herkunft zu arbeiten",

    /* ---------- Certificates ---------- */
    "Milestones &": "Meilensteine &", "achievements.": "Erfolge.",
    "Tap any certificate to zoom in · drag to spin it yourself.": "Tippen Sie auf ein Zertifikat zum Vergrößern · ziehen Sie, um es selbst zu drehen.",
    "Previous certificate": "Vorheriges Zertifikat", "Next certificate": "Nächstes Zertifikat", "Pause rotation": "Drehung anhalten", "Play rotation": "Drehung starten",
    "Reading Together Programme": "Programm „Reading Together“",
    "Successfully worked as a classroom-based Reading Assistant, supporting younger pupils and gaining valuable knowledge.": "Erfolgreich als Leseassistentin im Unterricht tätig, jüngere Schülerinnen unterstützt und wertvolles Wissen gewonnen.",
    "OCR Cambridge National — Child Development": "OCR Cambridge National – Kindesentwicklung",
    "Awarded Merit at Level 2 for dedication, learning and successful completion.": "Mit „Merit“ auf Level 2 ausgezeichnet – für Engagement, Lernbereitschaft und erfolgreichen Abschluss.",
    "SLQ Level 1 in Sports Leadership": "SLQ Level 1 in Sportleitung",
    "Demonstrates commitment to continuous learning and personal development through practical training.": "Belegt das Engagement für kontinuierliches Lernen und persönliche Entwicklung durch praktische Ausbildung.",
    "Futures For All — Remote Work Experience": "Futures For All – Remote-Praktikum",
    "Recognises skills achieved through practical learning with the STEM Ambassador Network.": "Würdigt Fähigkeiten, die durch praktisches Lernen mit dem STEM Ambassador Network erworben wurden.",
    "Futures For All — Work Experience Certificate": "Futures For All – Praktikumszertifikat",
    "Successfully completed educational and professional development activities.": "Bildungs- und berufliche Entwicklungsmaßnahmen erfolgreich abgeschlossen.",

    /* ---------- Feedback ---------- */
    "Kind words & feedback": "Freundliche Worte & Feedback", "Kind words &": "Freundliche Worte &", "feedback": "Feedback",
    "Visited my portfolio? I'd love to hear what you think. Your feedback helps me grow.": "Sie haben mein Portfolio besucht? Ich freue mich auf Ihre Meinung. Ihr Feedback hilft mir, mich weiterzuentwickeln.",
    "Leave your feedback": "Feedback hinterlassen", "Your rating": "Ihre Bewertung", "Rating": "Bewertung", "Tap a star": "Stern antippen",
    "Poor": "Schwach", "Fair": "Okay", "Good": "Gut", "Very good": "Sehr gut", "Excellent": "Ausgezeichnet",
    "Your name": "Ihr Name", "Your role (optional)": "Ihre Rolle (optional)", "What did you think of my portfolio?": "Wie hat Ihnen mein Portfolio gefallen?",
    "Send feedback": "Feedback senden", "No reviews yet": "Noch keine Bewertungen",
    "Be the first to share what you think of this portfolio.": "Teilen Sie als Erste/r Ihre Meinung zu diesem Portfolio.",
    "Choose a star rating first.": "Bitte wählen Sie zuerst eine Sternebewertung.", "Add your name.": "Bitte geben Sie Ihren Namen ein.",
    "Write a short message (at least 3 characters).": "Schreiben Sie eine kurze Nachricht (mindestens 3 Zeichen).",
    "Thanks! Please wait a minute before sending more feedback.": "Danke! Bitte warten Sie eine Minute, bevor Sie weiteres Feedback senden.",
    "Sending…": "Wird gesendet …",
    "Thank you! Your feedback was sent and will appear here once it's approved.": "Vielen Dank! Ihr Feedback wurde gesendet und erscheint hier, sobald es freigegeben wurde.",
    "Couldn't send your feedback. Check your connection and try again.": "Ihr Feedback konnte nicht gesendet werden. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",

    /* ---------- Contact ---------- */
    "Get in touch": "Kontakt", "Let's Work Together": "Lassen Sie uns zusammenarbeiten", "Let's Work": "Lassen Sie uns", "Together": "zusammenarbeiten",
    "Open to opportunities, collaborations and learning experiences. Feel free to reach out.": "Offen für Chancen, Kooperationen und neue Lernerfahrungen. Melden Sie sich gern.",
    "Email": "E-Mail", "Phone": "Telefon", "LinkedIn": "LinkedIn", "Instagram": "Instagram",
    "Happy to connect": "Ich freue mich auf Sie", "Send Message": "Nachricht senden",
    "Fill out the form below and I'll get back to you as soon as possible.": "Füllen Sie das Formular aus – ich melde mich so schnell wie möglich bei Ihnen.",
    "Your email": "Ihre E-Mail-Adresse", "Your message": "Ihre Nachricht",
    "Add your name, a valid email and a message.": "Bitte geben Sie Ihren Namen, eine gültige E-Mail-Adresse und eine Nachricht ein.",
    "Message sent. Thank you!": "Nachricht gesendet. Vielen Dank!", "Couldn't send right now. Email me directly instead.": "Senden ist gerade nicht möglich. Schreiben Sie mir bitte direkt eine E-Mail.",
    "Opening your email app…": "Ihr E-Mail-Programm wird geöffnet …",
    "Pharmacy builds a healthier tomorrow": "Pharmazie für eine gesündere Zukunft",
    "Designed with care · Luton, England": "Mit Sorgfalt gestaltet · Luton, England",

    /* ---------- Admin login (visible to visitors) ---------- */
    "Admin access": "Admin-Zugang", "Enter the admin key to edit the portfolio.": "Geben Sie den Admin-Schlüssel ein, um das Portfolio zu bearbeiten.",
    "Admin key": "Admin-Schlüssel", "Cancel": "Abbrechen", "Unlock": "Entsperren", "Checking…": "Wird geprüft …",
    "Wrong admin key.": "Falscher Admin-Schlüssel.", "Enter the admin key.": "Bitte geben Sie den Admin-Schlüssel ein."
  };

  // Texts that contain numbers or names
  const PATTERNS = [
    [/^Based on (\d+) reviews?$/, function (m, n) { return "Basierend auf " + n + (n === "1" ? " Bewertung" : " Bewertungen"); }],
    [/^(\d) stars? — (.+)$/, function (m, n, w) { return n + (n === "1" ? " Stern" : " Sterne") + " – " + (DE[w] || w); }],
    [/^([\d.]+) out of 5$/, function (m, n) { return n.replace(".", ",") + " von 5"; }],
    [/^(.+) — Professional Portfolio$/, function (m, n) { return n + " – Professionelles Portfolio"; }]
  ];

  const SKIP = "script,style,#adminPanel,.fb-text,.fb-who,[data-notr]";
  const ATTRS = ["placeholder", "aria-label", "title"];
  const origText = new WeakMap(), origAttr = new WeakMap(), setText = new WeakMap(), setAttr = new WeakMap();
  let lang = "en";

  function tr(s) {
    const k = s.trim(); if (!k) return null;
    let d = DE[k];
    if (d == null) for (let i = 0; i < PATTERNS.length; i++) { if (PATTERNS[i][0].test(k)) { d = k.replace(PATTERNS[i][0], PATTERNS[i][1]); break; } }
    if (d == null) return null;
    return s.match(/^\s*/)[0] + d + s.match(/\s*$/)[0];
  }
  function skipped(el) { return !el || (el.closest && el.closest(SKIP)); }

  function doText(node) {
    if (skipped(node.parentElement)) return;
    if (lang === "de") {
      const en = origText.has(node) ? origText.get(node) : node.nodeValue;
      const de = tr(en);
      if (de != null) { origText.set(node, en); setText.set(node, de); if (node.nodeValue !== de) node.nodeValue = de; }
    } else if (origText.has(node)) { node.nodeValue = origText.get(node); origText.delete(node); }
  }
  function doAttrs(el) {
    if (skipped(el)) return;
    let saved = origAttr.get(el);
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      if (lang === "de") {
        const en = saved && saved[a] != null ? saved[a] : el.getAttribute(a), de = tr(en);
        if (de != null) { if (!saved) { saved = {}; origAttr.set(el, saved); } saved[a] = en; let sv = setAttr.get(el); if (!sv) { sv = {}; setAttr.set(el, sv); } sv[a] = de; if (el.getAttribute(a) !== de) el.setAttribute(a, de); }
      } else if (saved && saved[a] != null) { el.setAttribute(a, saved[a]); }
    });
    if (lang === "en" && saved) origAttr.delete(el);
  }
  function apply(root) {
    if (!root) return;
    if (root.nodeType === 3) doText(root);
    else if (root.nodeType === 1) {
      doAttrs(root);
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let n; while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
    }
  }

  function setLang(l, save) {
    lang = l === "de" ? "de" : "en";
    document.documentElement.lang = lang;
    if (save) try { localStorage.setItem("gh_lang", lang); } catch (e) {}
    apply(document.body);
    const t = tr(document.title); if (lang === "de" && t) { document.title = t; } else if (lang === "en") document.title = document.title.replace(" – Professionelles Portfolio", " — Professional Portfolio");
    document.querySelectorAll(".lang-switch [data-lang]").forEach(function (b) { const on = b.dataset.lang === lang; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    const th = window.App && App.theme && App.theme();
    if (window.Scene3D && th) window.Scene3D.setTheme(th);
  }

  function initial() {
    let saved = null; try { saved = localStorage.getItem("gh_lang"); } catch (e) {}
    if (saved) return saved;
    const langs = navigator.languages || [navigator.language || ""];
    return String(langs[0] || "").toLowerCase().indexOf("de") === 0 ? "de" : "en";
  }

  window.I18N = { get lang() { return lang; }, set: function (l) { setLang(l, true); }, t: function (s) { return lang === "de" ? (tr(s) || s) : s; } };

  document.addEventListener("DOMContentLoaded", function () {
    // Keep newly rendered content translated
    const obs = new MutationObserver(function (muts) {
      if (lang === "en") return;
      muts.forEach(function (m) {
        if (m.type === "characterData") {
          if (setText.get(m.target) === m.target.nodeValue) return;   // our own change
          origText.delete(m.target); apply(m.target);
        } else if (m.type === "attributes") {
          const sv = setAttr.get(m.target), a = m.attributeName;
          if (sv && sv[a] === m.target.getAttribute(a)) return;        // our own change
          const s = origAttr.get(m.target); if (s) delete s[a]; doAttrs(m.target);
        }
        else m.addedNodes.forEach(function (n) { apply(n); });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    const ttl = document.querySelector("title"); if (ttl) obs.observe(ttl, { childList: true, characterData: true, subtree: true });

    const sw = document.getElementById("langSwitch");
    if (sw) sw.addEventListener("click", function (e) { const b = e.target.closest("[data-lang]"); if (b) setLang(b.dataset.lang, true); });
    const start = initial();
    if (start === "de") setLang("de", false);
    else document.querySelectorAll(".lang-switch [data-lang]").forEach(function (b) { b.classList.toggle("on", b.dataset.lang === "en"); b.setAttribute("aria-pressed", String(b.dataset.lang === "en")); });
  });
})();
