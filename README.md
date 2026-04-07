# Portfolio — Digital Experiences

A premium single-page portfolio with scroll-driven GSAP animations, a custom cursor, and pinned storytelling sections.

## Project Structure

```
portfolio_dev/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles (custom properties, layout, animations)
├── js/
│   └── main.js         ← All GSAP animations & interactive behaviour
└── assets/
    └── videos/
        ├── webdev.mp4      ← (optional) drop your Web Dev background video here
        ├── ecommerce.mp4   ← (optional) drop your E-Commerce background video here
        └── editing.mp4     ← (optional) drop your Video Editing background video here
```

## How to Run

### Option 1 — VS Code Live Server (recommended, zero install)
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Browser opens automatically at `http://127.0.0.1:5500`.

### Option 2 — npx serve (no install needed)
```bash
npx serve .
```
Then open `http://localhost:3000` in your browser.

### Option 3 — Python (if installed)
```bash
# Python 3
python -m http.server 8080
```
Then open `http://localhost:8080`.

> ⚠️ **Do NOT open `index.html` directly as a `file://` URL** — GSAP ScrollTrigger can behave incorrectly without an HTTP server.

## Adding Your Videos

In `index.html`, find the three `<!-- TO USE YOUR OWN VIDEO -->` comments and replace each `.vid-placeholder` div with:

```html
<video autoplay muted loop playsinline src="assets/videos/webdev.mp4"></video>
```

## Customisation Checklist

| Item | Where to edit |
|------|--------------|
| Your name | `index.html` → `.nav-logo` and `<footer>` |
| Email address | `index.html` → `href="mailto:..."` on the CTA button |
| Social links | `index.html` → `<footer>` links |
| Accent colour | `css/style.css` → `--teal` variable |
| Section copy | `index.html` → `.story-headline` and `.story-body` in each section |
