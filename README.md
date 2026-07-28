# Sreehari — Portfolio

A single-page portfolio built with **GSAP** (+ ScrollTrigger) for motion and
**Lenis** for smooth scrolling. Dark, terminal-flavoured, Tokyo Night palette —
built to match the vibe of a CSE student who's into Python, AI and machine learning.

No build step, no dependencies to install. It's plain HTML, CSS and JavaScript.

---

## Setup

Everything personal lives in one file: **`js/config.js`**.

```js
window.PORTFOLIO_CONFIG = {
  githubUsername: "YOUR_USERNAME",                          // ← your GitHub handle
  linkedinUrl:    "https://www.linkedin.com/in/YOUR-LINKEDIN/",
  email:          "YOUR_EMAIL",
  roles: [ "B.Tech CSE Student", "..." ],                   // typed under your name
  statsTheme: "tokyonight"
};
```

Fill those in and the nav links, contact buttons, GitHub stat cards, streak,
and activity graph all wire themselves up. Until `githubUsername` is set, the
stats section shows a short reminder instead of broken images.

## Running it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch.**
3. Pick the branch and the `/ (root)` folder, then save.

The site is live at `https://<username>.github.io/<repo>/` a minute later.

---

## What's in here

```
index.html        markup for every section
css/style.css     all styling, responsive rules, reduced-motion fallbacks
js/config.js      ← the only file you need to edit
js/main.js        Lenis setup + every GSAP animation
```

## The animations

| Section | What happens |
| --- | --- |
| Preloader | Counter to 100 %, then the panel slides away |
| Hero | Name reveals character by character, roles type themselves out, an interactive neural-network canvas drifts behind it |
| Marquee | Loops forever, speeds up and skews with your scroll velocity |
| About | Sticky Python REPL card next to masked line-by-line text reveals |
| Stack | Cards stagger in; a cyan spotlight follows your cursor across them |
| Currently learning | Section pins and the cards scroll sideways as you scroll down (swipeable on mobile) |
| Quote | Words brighten one by one, tied to scroll position |
| 2026 Goals | A gradient line draws down the timeline and lights up each goal as you reach it |
| Everywhere | Custom cursor, magnetic buttons, scroll progress bar, auto-hiding nav |

## Notes

- GSAP 3.13 and Lenis 1.1 load from a CDN — no `npm install` needed.
- `prefers-reduced-motion` is respected: smooth scrolling, the canvas, the
  pinning and every reveal are all skipped, and the content renders plainly.
- Without JavaScript the page still renders in full (there's a `<noscript>`
  fallback), it just doesn't animate.
- Everything is keyboard navigable and focus rings stay visible.

---

Built with [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).
