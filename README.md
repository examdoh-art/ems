# Paramedic MCQ Practice Website

This is a free static website. It does not need a database or paid server.

## What Is Included

- `index.html`: the website page
- `assets/styles.css`: the design
- `assets/app.js`: quiz behavior
- `assets/questions.js`: 180 MCQs loaded into the site

## Free Hosting Options

### GitHub Pages

1. Create a free GitHub account.
2. Create a new repository, for example `paramedic-mcq-practice`.
3. Upload everything inside this folder.
4. Open repository settings.
5. Go to Pages.
6. Select deploy from branch.
7. Choose `main` and root folder.
8. Save.

GitHub will give you a free website link.

### Netlify

1. Create a free Netlify account.
2. Drag and drop this whole folder into Netlify Deploys.
3. Netlify will publish it and give you a free link.

## Editing Questions

Questions are stored in `assets/questions.js`.

Each question has:

- `bank`
- `question`
- `options`
- `answer`
- `rationale`

Keep the answer as `A`, `B`, `C`, or `D`.
