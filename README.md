# Sreehari — Portfolio

A responsive single-page portfolio built with **GSAP** (+ ScrollTrigger) for motion
and **Lenis** for smooth scrolling, with real CSS 3D and a custom cursor. Dark,
terminal-flavoured, and tuned to the vibe of a CSE student who's into Python, AI
and machine learning.

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

Built on the **60-30-10 rule** with a single vibrant accent, so the content
carries the page rather than the decoration. Every value is a CSS custom
property at the top of `css/style.css` — change them there and the whole site
follows.

### 60 % — dominant surface

| Token | Hex | Used for |
| --- | --- | --- |
| `--bg` | `#0a0c11` | Page background |
| `--bg-alt` | `#0e1118` | Alternating bands — marquee, mobile menu |

### 30 % — structure and text

| Token | Hex | Used for | Contrast on `--bg` |
| --- | --- | --- | --- |
| `--surface` | `#151922` | Cards, terminal chrome, stat panels | — |
| `--surface-2` | `#1d222e` | Raised surfaces, card gradient top | — |
| `--line` | `#272d3a` | Borders, dividers, timeline rail | — |
| `--text` | `#e6eaf2` | Headings and emphasis | **16.2 : 1** |
| `--text-body` | `#c3cad9` | Body copy | **11.9 : 1** |
| `--text-mute` | `#929cb0` | Captions, eyebrows, meta | **7.1 : 1** |

### 10 % — the accent

| Token | Hex | Used for | Contrast on `--bg` |
| --- | --- | --- | --- |
| `--accent` | `#00c2ff` | Links, focus rings, active nav, buttons, cube, cursor | **9.5 : 1** |
| `--accent-dim` | `#7fb3c9` | Same hue desaturated — code strings, gradient tail | **8.6 : 1** |

Three colours in total: one dark neutral, one light neutral, one accent. Code
syntax highlighting stays inside the accent's hue family rather than
introducing new ones, and the terminal's window dots are neutral greys with a
single accent highlight.

Every text pairing clears WCAG AA (4.5 : 1) with room to spare — the weakest is
muted text on a raised surface at 6.4 : 1. Button labels sit at 9.3 : 1 against
the accent fill.

## Typography

**Two families.** Inter does the headings and the body, separated by weight
rather than by typeface; JetBrains Mono handles anything that is code or reads
like code.

| Role | Family | Weights | Used for |
| --- | --- | --- | --- |
| Headings | **Inter** | 700–800 | `h1`–`h3`, nav brand, marquee, quote, menu |
| Body | **Inter** | 400–600 | Paragraphs, lists, buttons, labels |
| Code | **JetBrains Mono** | 400–700 | Terminal, eyebrow numbers, tags, cube faces, cursor label |

Set as `--font-sans` and `--font-mono`.

- Body text is **16 px minimum**, scaling to 18 px on wide screens.
- Body line height is **1.62**.
- Headings start at **2 rem (32 px)** — at least 2× the body size — and scale
  with `clamp()` so they resize fluidly instead of jumping at breakpoints.

---

## What's in here

```
index.html        markup for every section
css/style.css     tokens, layout, 3D, responsive rules, reduced-motion fallbacks
js/config.js      ← the only file you need to edit
js/main.js        Lenis setup, custom cursor, and every GSAP animation
```

## The animations

| Section | What happens |
| --- | --- |
| Preloader | Counter to 100 %, then the panel slides away |
| Hero | Name reveals character by character, roles type themselves out, an interactive neural-network canvas drifts behind |
| Marquee | Loops forever, speeds up and skews with your scroll velocity |
| About | Sticky Python REPL card that tilts in 3D under the cursor, beside masked line-by-line text reveals |
| Stack | A 3D cube of six tech faces spins continuously and accelerates with scroll; cards tilt toward the pointer with their contents lifted on the Z axis |
| Currently learning | Section pins and the cards travel sideways, rotating in 3D as they cross the centre (swipeable carousel on mobile) |
| Quote | Words brighten one by one, tied to scroll position |
| 2026 Goals | A gradient line draws down the timeline, each goal swinging in on a hinge as you reach it |
| Contact | Headline characters flip up out of 3D space |
| Everywhere | Custom cursor, magnetic buttons, scroll progress bar, auto-hiding nav |

## Icons

There are no emoji anywhere in the UI. Every icon is a line icon in a single
inline `<svg class="sprite">` at the top of `index.html`, referenced with
`<use href="#i-name">` — one definition, reused wherever it appears.

| Symbol | Replaces | Used for |
| --- | --- | --- |
| `#i-wave` | 👋 | Hero greeting |
| `#i-cap` | 🎓 | B.Tech Computer Science & Engineering |
| `#i-code` | 💻 | Aspiring Software Engineer |
| `#i-chip` | 🤖 | Passionate about Artificial Intelligence |
| `#i-terminal` | 🐍 | Learning Python & CS fundamentals |
| `#i-sprout` | 🌱 | Always curious, always building |
| `#i-spark` | ✳ | Marquee separators |
| `#i-arrow-up` | ↑ | Back to top |

All drawn on a 24 px grid with a 1.7 stroke and round caps, so the set reads as
one family. They inherit `currentColor`, so they recolour with their context
and need no separate dark/light variants. The favicon is a drawn `</>` mark
rather than an emoji glyph, so it renders identically on every platform.

## The custom cursor

On pointer-fine devices the native cursor is hidden and replaced with a lagging
ring and a fast dot. The ring is contextual:

| Target | Behaviour |
| --- | --- |
| Any link or button | Ring grows and picks up the accent tint |
| Buttons, contact links, cards, terminal, cube, panels | Ring fills with the accent and shows a one-word label — `go`, `open`, `tilt`, `spin`, `read` — and the dot hides |
| Mouse down | Ring contracts |

`cursor: none` is only applied once the script has confirmed the replacement is
running, so a JS failure can never leave the page without a pointer. Touch
devices and `prefers-reduced-motion` keep the native cursor.

## Responsive

Verified at 320, 390, 768, 1024, 1440 and 1920 px — no horizontal overflow at
any width.

| Breakpoint | What changes |
| --- | --- |
| ≥ 1600 px | Content column widens to 1360 px |
| ≤ 1180 px | Cube scales down |
| ≤ 1024 px | About and stack headers stack to one column; the terminal stops being sticky |
| ≤ 820 px | Burger menu replaces nav links, stats go one-up, custom cursor off, horizontal rail becomes a native swipe carousel |
| ≤ 560 px | Full-width buttons, tighter timeline, smaller cube |
| ≤ 380 px | Tighter card and panel padding |
| Short landscape | Full-height hero and pinned section relax to auto height |

## Notes

- GSAP 3.13 and Lenis 1.1 load from a CDN — no `npm install` needed.
- `prefers-reduced-motion` is respected: smooth scrolling, the canvas, the
  pinning, the custom cursor and every reveal are all skipped, and the content
  renders plainly.
- Without JavaScript the page still renders in full (there's a `<noscript>`
  fallback), it just doesn't animate.
- Everything is keyboard navigable and focus rings stay visible.

---

Built with [GSAP](https://gsap.com) and [Lenis](https://lenis.darkroom.engineering).
