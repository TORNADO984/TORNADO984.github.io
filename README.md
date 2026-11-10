# Ayoub Elouardi — Portfolio

A responsive, accessible personal portfolio built with plain HTML, CSS, and JavaScript. No dependencies or build step. All content, navigation, and expandable project descriptions work without JavaScript. JavaScript adds the current year and motion-aware reveal animations.

## Preview locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000.

## Deploy to GitHub Pages

1. Put `index.html`, `styles.css`, `script.js`, and `assets/` at the root of your GitHub repository and push to `main`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select **main** and **/ (root)**, then **Save**.
5. GitHub displays the published URL when deployment completes. Relative asset paths support both `username.github.io` and project repositories.

`og:image` in `index.html` uses the absolute published URL `https://tornado984.github.io/assets/og-image.png` (1200×630), with `og:url` and a canonical link to `https://tornado984.github.io/`. This lets social crawlers reliably resolve the title card.

## Customize

- Colors, spacing, and responsive styles: `styles.css`.
- Copy, projects, navigation, and contact links: `index.html`.
- Contact links for Upwork, GitHub, LinkedIn, and email (`mailto:ciferlu4@gmail.com`) are in `index.html`.
- Project images are original SVG architecture illustrations, not screenshots or measured results.
- `assets/og-image.svg` is the editable title card source; `assets/og-image.png` is its social-sharing version.
- The original supplied `penai-scanner-home.png` is retained, but the cards use consistent SVG illustrations.

The design uses system fonts, no external scripts, and honors `prefers-reduced-motion`. A full-page `assets/preview.png` capture was attempted, but the environment blocked headless Chrome with socket permission errors. Browser rendering and mobile overflow remain unverified. To capture locally with Playwright: `npx playwright screenshot --browser chromium --viewport-size="1440,1000" --full-page http://localhost:8000 assets/preview.png`.
