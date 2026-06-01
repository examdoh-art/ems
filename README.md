# UAE Paramedic Ready Website

This is a free static multi-page website for UAE paramedic licensure exam preparation.

## Pages

- `index.html`: public promotion page with EMS careers, EMT/Paramedic/Advanced Care Paramedic categories, UAE opportunities, and exam-prep overview
- `login.html`: demo login page
- `dashboard.html`: student dashboard after login
- `practice.html`: system-based MCQ practice mode
- `exam.html`: randomized 100-question exam mode

## Login

This version uses demo browser login only.

Use any email and any password with at least 4 characters.

For real students with secure email/password accounts, connect the site to a backend such as Firebase, Supabase, or a custom server.

## Question Bank

The website currently includes 180 MCQs:

- Scenario Practice
- Simulation & Critical Care Transport
- Pharmacology

Questions are stored in:

`assets/questions.js`

## System Categories

Practice mode classifies questions into systems such as:

- EMS Operations
- Airway & Ventilation
- Cardiology
- Respiratory
- Pharmacology
- Trauma
- Neurology
- Medical
- Obstetrics
- Pediatrics
- Toxicology
- Critical Care Transport

## Important Disclaimer

The public page is worded as an independent exam-preparation site.

Do not use official logos or claim official support from Pearson VUE, DOH Abu Dhabi, or any UAE health authority unless you have written permission.

## Free Hosting

### GitHub Pages

1. Create a free GitHub account.
2. Create a repository, for example `uae-paramedic-ready`.
3. Upload all files from this folder.
4. Open repository Settings.
5. Go to Pages.
6. Deploy from the `main` branch root.

### Netlify

1. Create a free Netlify account.
2. Drag this folder into Netlify Deploys.
3. Netlify gives you a free website link.
