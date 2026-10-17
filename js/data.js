/* ==========================================================
   Default portfolio content — extracted from the original site
   (ghazias-portfolio-m97k.vercel.app). The admin panel edits
   a copy of this; this file is the fallback / starting point.
   ========================================================== */
const OLD = "images/"; // put the 7 original images in /images (see SETUP.md)

window.DEFAULT_CONTENT = {
  sections: { about: true, education: true, skills: true, experience: true, certificates: true, feedback: true, contact: true },

  hero: {
    greeting: "Hello, I'm",
    firstName: "Gazia",
    lastName: "Hussain",
    title: "Biomedical Science Student",
    tagline: "Aspiring Pharmacist | Passion for Science | Lifelong Learner",
    intro: "Biomedical Science student from Luton — driven by curiosity, teamwork and continuous personal growth.",
    location: "Luton, England",
    cvUrl: "",
    photo: "",
    highlights: [
      { icon: "flask", text: "Biomedical Science" },
      { icon: "pill", text: "Aspiring Pharmacy" },
      { icon: "heart", text: "Healthcare Focus" },
      { icon: "users", text: "Teamwork & Leadership" }
    ],
    stats: [
      { value: "5+", label: "Certificates" },
      { value: "7+", label: "Years Learning" },
      { value: "2", label: "Leadership Years" }
    ]
  },

  about: {
    heading: "A student who loves learning & growing.",
    points: [
      { lead: "Who I am", text: "A 19-year-old student from Luton, England who enjoys learning new things, improving her skills and taking on challenges." },
      { lead: "Growth mindset", text: "Every challenge is a chance to grow — both personally and professionally." },
      { lead: "School", text: "Challney High School for Girls, Luton, Bedfordshire (2018 – 2023)." },
      { lead: "College", text: "Luton Sixth Form College (2023 – 2025) — Biomedical Applied Science." },
      { lead: "Results", text: "Achieved all Distinctions (DDD / D1)." },
      { lead: "Strengths", text: "Communication, organisation, research, time management, collaboration and teamwork." },
      { lead: "Digital tools", text: "Confident with Canva, Microsoft Office, digital marketing tools, Edexcel systems and other digital platforms." },
      { lead: "Always learning", text: "Ready to learn more and adapt to new tools and environments." }
    ],
    facts: [
      { label: "Location", value: "Luton, England" },
      { label: "Age", value: "19" },
      { label: "Focus", value: "Biomedical Science · Pharmacy" },
      { label: "Studied", value: "Challney HS · Luton Sixth Form" }
    ],
    languages: ["Urdu", "English", "Pahari", "Pahari-Pothwari"],
    hobbies: ["Cycling", "Going for walks", "Playing sports", "Travelling", "Photography"]
  },

  achievements: [
    { title: "World Class School Recognition", text: "Recognised at a World Class School — a proud milestone." },
    { title: "Reading Assistant", text: "Classroom-based Reading Assistant, 2022 – 2023." },
    { title: "Form Captain", text: "Form Captain during 2022 – 2023." },
    { title: "Sports Leader", text: "Served as a Sports Leader for one year." },
    { title: "Quizzes & Presentations", text: "Led school quizzes and delivered presentations confidently." },
    { title: "Leader & Supporter", text: "Aspire to be a leader and supporter who helps serve community and humanity." },
    { title: "Charity & Fundraising", text: "Contributed to charities, raised money and joined fundraising in high school." },
    { title: "Sports Clubs & Activities", text: "Active participant in sports clubs and school activities." }
  ],

  education: [
    {
      period: "2018 – 2023",
      school: "Challney High School for Girls",
      place: "Luton, Bedfordshire",
      points: ["Form Captain (Year 10 & 11)", "Charity fundraising", "Sports clubs", "Leadership activities"]
    },
    {
      period: "September 2023 – July 2025",
      school: "Luton Sixth Form College",
      place: "Luton, Bedfordshire",
      points: [
        "Biomedical Applied Science (Equivalent to 3 A Levels) — Grade D1",
        "Achieved all Distinctions (DDD / D1)",
        "Strong research, analytical & scientific skills",
        "Practical investigations, data handling & report writing"
      ]
    }
  ],

  scienceFocus: [
    "Biomedical Science Student", "Science Enthusiast", "Practical Lab Experience",
    "Passion for Healthcare", "Research & Innovation", "Growing with the Science Community"
  ],

  skillCards: [
    { icon: "flask", title: "Biomedical Science", text: "Applied science, lab practicals, data handling and scientific report writing.", level: 95 },
    { icon: "search", title: "Research & Analysis", text: "Internet research, investigations, analytical thinking and problem solving.", level: 90 },
    { icon: "chat", title: "Communication", text: "Presentations, quizzes, active listening and interpretation (English ↔ Urdu).", level: 92 },
    { icon: "heart", title: "Patient & Customer Care", text: "Patient support, customer service and confidentiality in healthcare settings.", level: 85 },
    { icon: "users", title: "Teamwork & Leadership", text: "Form Captain, Sports Leader, Reading Assistant and team projects.", level: 90 },
    { icon: "calendar", title: "Organisation", text: "Planning, time management, punctuality and attention to detail.", level: 88 },
    { icon: "laptop", title: "IT & Digital", text: "Canva, Microsoft Office, digital marketing, Edexcel systems, data entry.", level: 85 }
  ],

  professionalSkills: [
    "Communication", "Organisation & Planning", "Research", "Time Management", "Punctuality",
    "Teamwork", "Problem Solving", "Adaptability", "Attention to Detail", "Customer Service"
  ],

  itSkills: [
    "Canva", "Digital Marketing", "Microsoft Office", "Edexcel Systems", "Internet Research",
    "Email Communication", "Digital Productivity", "Online Learning", "Data Entry & Files"
  ],

  experience: [
    {
      role: "Capital Electrical Wholesalers",
      type: "Work Experience Placement",
      place: "Luton, Bedfordshire",
      period: "February 2022 – March 2022",
      points: [
        "Assisted with stock management, shelf replenishment, deliveries and purchase orders.",
        "Prepared and checked customer orders and maintained accurate inventory records.",
        "Used barcode scanners and Microsoft systems for stock tracking and data entry.",
        "Supported telephone handling and daily business operations.",
        "Created sales promotions for social media using Canva.",
        "Worked effectively as part of a team with strong attention to detail."
      ],
      tags: ["Stock Management", "Data Entry", "Canva", "Customer Service", "Teamwork"]
    },
    {
      role: "Reading Assistant – Challney High School for Girls",
      type: "Work Experience Placement",
      place: "Luton",
      period: "January 2020 – October 2022",
      points: [
        "Provided one-to-one support to students to improve reading, literacy and communication skills.",
        "Created personalised reading activities and provided constructive feedback.",
        "Monitored student progress and prepared reports for teaching staff.",
        "Built positive relationships with students and staff while supporting classroom and reading activities.",
        "Helped improve students’ confidence, reading fluency and comprehension."
      ],
      tags: ["Mentoring", "Literacy Support", "Communication", "Report Writing"]
    },
    {
      role: "Futures for All – Careers in Teaching",
      type: "Work Experience",
      place: "Remote",
      period: "21–22 July 2026",
      points: [
        "Worked in teams to create and present a lesson.",
        "Developed communication, teamwork, creativity and problem-solving skills.",
        "Participated in discussions, activities and group projects while confidently sharing ideas."
      ],
      tags: ["Lesson Planning", "Presentation", "Teamwork", "Creativity"]
    },
    {
      role: "Futures for All – Science Sector / STEM Ambassadors",
      type: "Work Experience",
      place: "Remote",
      period: "7–8 July 2026",
      points: [
        "Worked as part of a team to develop an eco-innovation project addressing global environmental challenges.",
        "Created and delivered presentations and received professional feedback.",
        "Developed problem-solving, creativity, teamwork and presentation skills.",
        "Explored STEM careers and gained industry-related knowledge through practical activities."
      ],
      tags: ["STEM", "Eco-Innovation", "Research", "Presentation"]
    },
    {
      role: "NHS L&D – Luton and Dunstable Hospital",
      type: "Work Experience",
      place: "Bedfordshire",
      period: "10–14 August 2026",
      points: [
        "Observed doctors and nurses across different hospital departments, including A&E, wards, X-ray, ultrasound, MRI/CT and paediatrics.",
        "Developed an understanding of patient care, communication, teamwork and confidentiality.",
        "Supported patients by providing directions, general assistance and language interpretation between English and Urdu.",
        "Observed healthcare professionals using computer systems and carrying out daily clinical duties.",
        "Gained valuable insight into NHS services and the skills required for healthcare careers."
      ],
      tags: ["Healthcare", "Patient Support", "Confidentiality", "Interpretation"]
    }
  ],

  gallery: {
    title: "Capital Electrical Wholesalers — Promotions",
    items: [
      { image: OLD + "work-1.jpg", caption: "Capital Electrical Wholesalers – switched sockets promotion" },
      { image: OLD + "work-2.jpg", caption: "Capital Electrical Wholesalers – door entry system offer" }
    ]
  },

  keySkills: [
    "Communication and active listening",
    "Teamwork and collaboration",
    "Time management and organisation",
    "Problem-solving and creativity",
    "Customer service and patient support",
    "Data entry and inventory management",
    "Presentation and interpersonal skills",
    "Professionalism, punctuality and attention to detail",
    "Ability to work with people from different backgrounds"
  ],

  certificates: [
    { image: OLD + "cert-reading.jpg", title: "Reading Together Programme", text: "Successfully worked as a classroom-based Reading Assistant, supporting younger pupils and gaining valuable knowledge." },
    { image: OLD + "cert-ocr.jpg", title: "OCR Cambridge National — Child Development", text: "Awarded Merit at Level 2 for dedication, learning and successful completion." },
    { image: OLD + "cert-sports.jpg", title: "SLQ Level 1 in Sports Leadership", text: "Demonstrates commitment to continuous learning and personal development through practical training." },
    { image: OLD + "cert-futures1.jpg", title: "Futures For All — Remote Work Experience", text: "Recognises skills achieved through practical learning with the STEM Ambassador Network." },
    { image: OLD + "cert-futures2.jpg", title: "Futures For All — Work Experience Certificate", text: "Successfully completed educational and professional development activities." }
  ],

  // Feedback: visitors submit from the website; the admin approves them.
  // "items" are published feedback entries the admin manages directly.
  feedback: {
    heading: "Kind words & feedback",
    text: "Visited my portfolio? I'd love to hear what you think. Your feedback helps me grow.",
    items: []
  },

  contact: {
    heading: "Let's Work Together",
    text: "Open to opportunities, collaborations and learning experiences. Feel free to reach out.",
    email: "gaziahussain2006@gmail.com",
    phone: "",
    location: "Luton, England",
    linkedin: "",
    instagram: "",
    motto: "Pharmacy builds a healthier tomorrow"
  },

  footer: { note: "Designed with care · Luton, England" }
};
