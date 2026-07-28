# Sreehari — Portfolio

A responsive single-page portfolio built with **GSAP** (+ ScrollTrigger) for motion
and **Lenis** for smooth scrolling, with a hand-drawn SVG mascot and real CSS 3D
throughout. Dark, terminal-flavoured, and tuned to the vibe of a CSE student who's
into Python, AI and machine learning.

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

## Color palette

A four-step ink scale for surfaces, a three-step scale for text, and three
accents. Every value is a CSS custom property defined at the top of
`css/style.css` — change them there and the whole site follows.

### Surfaces

| Token | Hex | Used for |
| --- | --- | --- |
| `--ink-900` | `#070a12` | Page background |
| `--ink-800` | `#0b0f1a` | Alternating bands — marquee, mobile menu |
| `--ink-700` | `#111726` | Cards, terminal chrome, stat panels |
| `--ink-600` | `#1a2133` | Raised surfaces, card gradient top |
| `--line` | `#232c42` | Borders, dividers, timeline rail |

### Text

| Token | Hex | Used for |
| --- | --- | --- |
| `--text-1` | `#eef2ff` | Headings and emphasis |
| `--text-2` | `#b6c0e0` | Body copy |
| `--text-3` | `#7c88ab` | Muted copy, captions, eyebrows |

### Accents

| Token | Hex | Role | Used for |
| --- | --- | --- | --- |
| `--accent` | `#00c2ff` | Primary | Links, focus rings, active nav, rim light, cube edges |
| `--accent-2` | `#a78bfa` | Secondary | Gradient partner, keywords, panel hover |
| `--accent-3` | `#4ade80` | Tertiary | Terminal strings, prompt caret, success notes |
| `--warn` | `#fbbf24` | Semantic | Terminal numerics, window control |
| `--danger` | `#fb7185` | Semantic | Window control |

Body text (`--text-2` on `--ink-900`) sits at roughly **12:1** contrast and
headings at **17:1**, both comfortably past WCAG AA for body copy.

## Typography

Three families, each with one job.

| Role | Family | Weights | Used for |
| --- | --- | --- | --- |
| Display | **Sora** | 600–800 | `h1`–`h3`, nav brand, marquee, quote, menu |
| Body | **Inter** | 400–600 | Paragraphs, lists, buttons, labels |
| Mono | **JetBrains Mono** | 400–700 | Terminal, eyebrow numbers, tags, cube faces, code |

Set as `--font-display`, `--font-body` and `--font-mono`. Headings scale with
`clamp()` so they resize fluidly instead of jumping at breakpoints.

---

## What's in here

```
index.html        markup, including the inline SVG mascot
css/style.css     tokens, layout, 3D, responsive rules, reduced-motion fallbacks
js/config.js      ← the only file you need to edit
js/main.js        Lenis setup, mascot rig, and every GSAP animation
```

## The mascot

A stylised avatar of Sreehari, drawn as inline SVG (no image files, scales to
any size). It's rigged rather than static:

- **Blinks** on an irregular 2.5–6.5 s rhythm, with an occasional double blink.
- **Breathes** — the shoulders drift on one cycle, the head on a slower one.
- **Watches your cursor**: pupils track the pointer inside clipped eye sockets.
- **Turns in 3D** toward the pointer, with floating code chips parallaxing on a
  nearer Z plane.
- **Reacts to hover** — the smile widens and the eyebrows lift.

To swap in a different character, replace the `<svg class="mascot__svg">` block.
Keep the ids `avHead`, `avFigure`, `avMouth`, the `.eyeball` and `.lid` classes,
and the rig keeps working.

## The animations

| Section | What happens |
| --- | --- |
| Preloader | Counter to 100 %, then the panel slides away |
| Hero | Name reveals character by character, roles type themselves out, the mascot swings in on a 3D hinge, an interactive neural-network canvas drifts behind |
| Marquee | Loops forever, speeds up and skews with your scroll velocity |
| About | Sticky Python REPL card that tilts in 3D under the cursor, beside masked line-by-line text reveals |
| Stack | A 3D cube of six tech faces spins continuously and accelerates with scroll; cards tilt toward the pointer with their contents lifted on the Z axis |
| Currently learning | Section pins and the cards travel sideways, rotating in 3D as they cross the centre (swipeable carousel on mobile) |
| Quote | Words brighten one by one, tied to scroll position |
| 2026 Goals | A gradient line draws down the timeline, each goal swinging in on a hinge as you reach it |
| Contact | Headline characters flip up out of 3D space |
| Everywhere | Custom cursor, magnetic buttons, scroll progress bar, auto-hiding nav |

## Responsive

Verified at 320, 390, 768, 1024, 1440 and 1920 px — no horizontal overflow at
any width.

| Breakpoint | What changes |
| --- | --- |
| ≥ 1600 px | Content column widens to 1360 px |
| ≤ 1180 px | Hero columns rebalance, mascot and cube scale down |
| ≤ 1024 px | About and stack headers stack to one column; the terminal stops being sticky |
| ≤ 900 px | Hero goes single-column — mascot above, copy centred below |
| ≤ 820 px | Burger menu replaces nav links, stats go one-up, custom cursor off, horizontal rail becomes a native swipe carousel |
| ≤ 560 px | Full-width buttons, tighter timeline, smaller cube and mascot |
| ≤ 380 px | Floating code chips hidden, tighter card padding |
| Short landscape | Full-height hero and pinned section relax to auto height |

## Notes

- GSAP 3.13 and Lenis 1.1 load from a CDN — no `npm install` needed.
- `prefers-reduced-motion` is respected: smooth scrolling, the canvas, the
  pinning, the mascot rig and every reveal are all skipped, and the content
  renders plainly.
- Without JavaScript the page still renders in full (there's a `<noscript>`
  fallback), it just doesn't animate.
- Everything is keyboard navigable and focus rings stay visible.

---

Built with [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).
