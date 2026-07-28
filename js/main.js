/* ============================================================
   Sreehari — portfolio interactions
   GSAP + ScrollTrigger for motion, Lenis for smooth scrolling.
   ============================================================ */

(() => {
  "use strict";

  const CFG = Object.assign(
    {
      githubUsername: "YOUR_USERNAME",
      linkedinUrl: "#",
      email: "",
      roles: ["Aspiring Software Engineer"],
      statsTheme: "tokyonight"
    },
    window.PORTFOLIO_CONFIG || {}
  );

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ══════════════════════════════════════════════════════════
     1. Config → DOM
     ══════════════════════════════════════════════════════════ */
  function applyConfig() {
    const user = CFG.githubUsername;
    const theme = CFG.statsTheme;
    const base = "https://github-readme-stats.vercel.app/api";

    const sources = {
      overview: `${base}?username=${user}&show_icons=true&theme=${theme}&hide_border=true&bg_color=00000000`,
      langs: `${base}/top-langs/?username=${user}&layout=compact&theme=${theme}&hide_border=true&bg_color=00000000`,
      streak: `https://streak-stats.demolab.com?user=${user}&theme=${theme}&hide_border=true&background=00000000`,
      graph: `https://github-readme-activity-graph.vercel.app/graph?username=${user}&theme=tokyo-night&bg_color=00000000&hide_border=true`
    };

    const placeholder = (v) => !v || /^YOUR[_-]/.test(v) || v.includes("YOUR-LINKEDIN");

    if (placeholder(user)) {
      const stats = $("#stats");
      if (stats) stats.classList.add("is-unconfigured");
    } else {
      $$("[data-stat]").forEach((img) => {
        const src = sources[img.dataset.stat];
        if (src) img.src = src;
      });
    }

    const links = {
      email: placeholder(CFG.email) ? null : `mailto:${CFG.email}`,
      linkedin: placeholder(CFG.linkedinUrl) ? null : CFG.linkedinUrl,
      github: placeholder(user) ? null : `https://github.com/${user}`
    };
    $$("[data-link]").forEach((a) => {
      const href = links[a.dataset.link];
      if (href) {
        a.href = href;
      } else {
        a.setAttribute("aria-disabled", "true");
        a.title = "Add your details in js/config.js";
      }
    });

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ══════════════════════════════════════════════════════════
     2. Text splitting helpers
     ══════════════════════════════════════════════════════════ */
  const escapeHTML = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function splitChars(el) {
    if (el._origHTML === undefined) el._origHTML = el.innerHTML;
    const nodes = Array.from(el.childNodes);
    const chars = [];
    el.innerHTML = "";

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s+/g, " ").trim();
        Array.from(text).forEach((ch) => {
          if (ch === " ") {
            el.appendChild(document.createTextNode(" "));
            return;
          }
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          el.appendChild(span);
          chars.push(span);
        });
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });
    return chars;
  }

  function splitWords(el) {
    if (el._origText === undefined) el._origText = el.textContent.trim();
    const words = el._origText.split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="word">${escapeHTML(w)}</span>`)
      .join(" ");
    return $$(".word", el);
  }

  /* Groups words into visual lines, then masks each line. */
  function splitLines(el) {
    if (el._origText === undefined) el._origText = el.textContent.trim();

    el.innerHTML = "";
    const probes = el._origText.split(/\s+/).map((w) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.style.display = "inline-block";
      el.appendChild(span);
      el.appendChild(document.createTextNode(" "));
      return span;
    });

    const lines = [];
    let current = null;
    let lastTop = null;
    probes.forEach((span) => {
      const top = span.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) {
        current = [];
        lines.push(current);
        lastTop = top;
      }
      current.push(span.textContent);
    });

    el.innerHTML = lines
      .map((words) => `<span class="split-line"><i>${escapeHTML(words.join(" "))}</i></span>`)
      .join("");
    return $$(".split-line > i", el);
  }

  /* ══════════════════════════════════════════════════════════
     3. Fallback for no-GSAP / reduced motion
     ══════════════════════════════════════════════════════════ */
  function revealEverything() {
    document.body.classList.remove("is-loading");
    const pre = $("#preloader");
    if (pre) pre.remove();
    $$("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    const rotator = $("#rotator");
    if (rotator) rotator.textContent = CFG.roles[0];
  }

  if (!hasGsap) {
    applyConfig();
    revealEverything();
    initAnchors(null);
    initMenu(null);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });

  /* ══════════════════════════════════════════════════════════
     4. Lenis smooth scroll
     ══════════════════════════════════════════════════════════ */
  let lenis = null;

  function initLenis() {
    if (REDUCED || typeof window.Lenis === "undefined") return null;

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /* ══════════════════════════════════════════════════════════
     5. Anchor links + menu
     ══════════════════════════════════════════════════════════ */
  function initAnchors(l) {
    $$("[data-scroll-to]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = $(link.dataset.scrollTo);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        if (l) l.scrollTo(target, { offset: target.id === "home" ? 0 : -70, duration: 1.3 });
        else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      });
    });
  }

  let menuOpen = false;
  let menuTl = null;

  function closeMenu() {
    if (!menuOpen) return;
    toggleMenu(false);
  }

  function toggleMenu(force) {
    const menu = $("#menu");
    const burger = $("#burger");
    if (!menu || !burger) return;

    menuOpen = typeof force === "boolean" ? force : !menuOpen;
    burger.setAttribute("aria-expanded", String(menuOpen));
    menu.setAttribute("aria-hidden", String(!menuOpen));
    document.body.classList.toggle("menu-open", menuOpen);

    if (lenis) menuOpen ? lenis.stop() : lenis.start();

    if (!hasGsap) {
      menu.classList.toggle("is-open", menuOpen);
      menu.style.clipPath = menuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)";
      return;
    }

    if (menuTl) menuTl.kill();
    const items = $$(".menu__inner a", menu);

    if (menuOpen) {
      menu.classList.add("is-open");
      menuTl = gsap
        .timeline()
        .to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" })
        .fromTo(
          items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          "-=0.35"
        );
    } else {
      menuTl = gsap.timeline({
        onComplete: () => menu.classList.remove("is-open")
      });
      menuTl
        .to(items, { y: 20, opacity: 0, duration: 0.25, stagger: 0.03 })
        .to(menu, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "power4.inOut" }, "-=0.1");
    }
  }

  function initMenu() {
    const burger = $("#burger");
    if (burger) burger.addEventListener("click", () => toggleMenu());
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ══════════════════════════════════════════════════════════
     6. Preloader
     ══════════════════════════════════════════════════════════ */
  function runPreloader() {
    return new Promise((resolve) => {
      const pre = $("#preloader");
      if (!pre || REDUCED) {
        if (pre) pre.remove();
        document.body.classList.remove("is-loading");
        resolve();
        return;
      }

      const counter = { v: 0 };
      const out = $("#preloaderCount");

      gsap
        .timeline({
          onComplete: () => {
            document.body.classList.remove("is-loading");
            pre.remove();
            resolve();
          }
        })
        .to(".preloader__bar i", { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 1.35,
            ease: "power2.inOut",
            onUpdate: () => {
              if (out) out.textContent = Math.round(counter.v);
            }
          },
          0
        )
        .to(".preloader__inner", { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.15")
        .to(pre, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.25");
    });
  }

  /* ══════════════════════════════════════════════════════════
     7. Hero
     ══════════════════════════════════════════════════════════ */
  let heroChars = [];

  /* Hide the hero straight away so nothing flashes behind the preloader. */
  /* Each character paints its own slice of the title gradient. */
  function alignTitleGradient() {
    const title = $(".hero__title");
    if (!title || !heroChars.length) return;
    const box = title.getBoundingClientRect();
    heroChars.forEach((char) => {
      const r = char.getBoundingClientRect();
      char.style.setProperty("--grad-w", `${box.width}px`);
      char.style.setProperty("--grad-x", `${-(r.left - box.left)}px`);
    });
  }

  function prepareHero() {
    if (REDUCED) return;
    const title = $(".hero__title");
    heroChars = title ? splitChars(title) : [];
    alignTitleGradient();
    gsap.set(heroChars, { yPercent: 115, opacity: 0 });
    gsap.set([".hero__hi", ".hero__blurb", ".hero__actions"], { y: 26, opacity: 0 });
    gsap.set([".hero__roles", ".hero__scroll"], { opacity: 0 });
    gsap.set(".nav", { y: -70, opacity: 0 });
    gsap.set(".hero__stage", { opacity: 0, scale: 0.86, rotationY: -22, z: -180 });
  }

  function heroIntro() {
    if (REDUCED) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".nav", { y: 0, opacity: 1, duration: 0.9 }, 0)
      .to(".hero__hi", { y: 0, opacity: 1, duration: 0.8 }, 0.15)
      .to(
        heroChars,
        { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.045, ease: "power4.out" },
        0.25
      )
      .to(".hero__roles", { opacity: 1, duration: 0.7 }, 0.75)
      .to(".hero__blurb", { y: 0, opacity: 1, duration: 0.9 }, 0.85)
      .to(".hero__actions", { y: 0, opacity: 1, duration: 0.9 }, 0.95)
      .to(".hero__scroll", { opacity: 1, duration: 0.8 }, 1.1)
      .to(
        ".hero__stage",
        { opacity: 1, scale: 1, rotationY: 0, z: 0, duration: 1.5, ease: "power3.out" },
        0.35
      );

    /* waving hand */
    gsap.to(".wave", {
      rotate: 16,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      transformOrigin: "70% 70%"
    });

    /* blinking caret */
    gsap.to(".hero__caret", { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });

    /* hero parallax on scroll */
    gsap.to(".hero__inner", {
      y: 110,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
    gsap.to(".hero__glow", {
      y: 180,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* typewriter for the rotating role line */
  function initRotator() {
    const el = $("#rotator");
    if (!el) return;
    const roles = CFG.roles.length ? CFG.roles : ["Aspiring Software Engineer"];

    if (REDUCED) {
      el.textContent = roles[0];
      return;
    }

    let i = 0;
    let char = 0;
    let deleting = false;

    const tick = () => {
      const word = roles[i % roles.length];
      char += deleting ? -1 : 1;
      el.textContent = word.slice(0, char);

      let delay = deleting ? 35 : 65;
      if (!deleting && char === word.length) {
        delay = 1700;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        i++;
        delay = 320;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 600);
  }

  /* ══════════════════════════════════════════════════════════
     7b. Mascot — a stylised avatar of Sreehari that blinks,
         breathes, follows the pointer and tilts in 3D.
     ══════════════════════════════════════════════════════════ */
  function initMascot() {
    const mascot = $("#mascot");
    if (!mascot) return;

    const tilt = $("#mascotTilt");
    const head = $("#avHead");
    const figure = $("#avFigure");
    const lids = $$(".mascot .lid");
    const eyeballs = $$(".mascot .eyeball");
    const bits = $$(".mascot__bits .bit");
    const brows = [$("#browL"), $("#browR")].filter(Boolean);

    /* the SVG is scaled by CSS, so animate in the SVG's own user units */
    gsap.set(lids, { y: -19 });

    if (REDUCED) return;

    /* breathing: the body drifts, the head drifts a touch more */
    gsap.to(figure, { y: 5, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(head, { y: -4, rotation: 0.7, transformOrigin: "160px 250px", duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });

    /* floating code bits, each on its own rhythm */
    bits.forEach((bit, i) => {
      gsap.to(bit, {
        y: i % 2 ? 14 : -14,
        x: i === 1 ? -8 : 6,
        duration: 3 + i * 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.4
      });
    });

    /* blinking — irregular, occasionally a double blink */
    const blink = () => {
      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(gsap.utils.random(2.4, 6.5), blink)
      });
      tl.to(lids, { y: 0, duration: 0.07, ease: "power2.in" })
        .to(lids, { y: -19, duration: 0.11, ease: "power2.out" });

      if (Math.random() < 0.28) {
        tl.to(lids, { y: 0, duration: 0.07, ease: "power2.in" }, "+=0.1")
          .to(lids, { y: -19, duration: 0.11, ease: "power2.out" });
      }
    };
    gsap.delayedCall(1.6, blink);

    /* pointer tracking: eyes, 3D head tilt, and parallax on the bits */
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const eyeX = gsap.quickTo(eyeballs, "x", { duration: 0.7, ease: "power3" });
    const eyeY = gsap.quickTo(eyeballs, "y", { duration: 0.7, ease: "power3" });
    const rotY = gsap.quickTo(tilt, "rotationY", { duration: 1, ease: "power3" });
    const rotX = gsap.quickTo(tilt, "rotationX", { duration: 1, ease: "power3" });

    window.addEventListener(
      "mousemove",
      (e) => {
        const box = mascot.getBoundingClientRect();
        if (!box.width) return;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height * 0.42;

        /* -1 … 1 either side of the mascot */
        const dx = gsap.utils.clamp(-1, 1, (e.clientX - cx) / (window.innerWidth / 2));
        const dy = gsap.utils.clamp(-1, 1, (e.clientY - cy) / (window.innerHeight / 2));

        eyeX(dx * 4.5);
        eyeY(dy * 3);
        rotY(dx * 13);
        rotX(-dy * 9);
      },
      { passive: true }
    );

    /* he perks up when you point at him */
    mascot.addEventListener("mouseenter", () => {
      gsap.to("#avMouth", { attr: { d: "M142 214q18 17 36 0" }, duration: 0.35, ease: "back.out(2)" });
      gsap.to(brows, { y: -3, duration: 0.35, ease: "back.out(2)" });
      gsap.to(tilt, { scale: 1.03, duration: 0.5, ease: "power3.out" });
    });
    mascot.addEventListener("mouseleave", () => {
      gsap.to("#avMouth", { attr: { d: "M144 216q16 12 32 0" }, duration: 0.4 });
      gsap.to(brows, { y: 0, duration: 0.4 });
      gsap.to(tilt, { scale: 1, duration: 0.5, ease: "power3.out" });
    });
  }

  /* ══════════════════════════════════════════════════════════
     7c. 3D — rotating cube, card tilt, depth on scroll
     ══════════════════════════════════════════════════════════ */
  function init3D() {
    /* ── the tech cube keeps turning, and scroll spins it faster ── */
    const cube = $("#cube");
    if (cube) {
      gsap.set(cube, { rotationX: -22, rotationY: 32 });

      if (!REDUCED) {
        const spin = gsap.to(cube, {
          rotationY: "+=360",
          duration: 16,
          repeat: -1,
          ease: "none"
        });
        gsap.to(cube, {
          rotationX: 18,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        ScrollTrigger.create({
          trigger: "#stack",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            spin.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 420, 6));
          }
        });
      }
    }

    if (REDUCED) return;

    /* ── stack cards tilt toward the pointer, contents float above ── */
    if (window.matchMedia("(pointer: fine)").matches) {
      $$(".card").forEach((card) => {
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
        const rz = gsap.quickTo(card, "z", { duration: 0.6, ease: "power3" });

        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx(-py * 16);
          ry(px * 16);
          rz(30);
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
        card.addEventListener("mouseleave", () => {
          rx(0);
          ry(0);
          rz(0);
        });
      });

      /* ── the terminal card gets the same treatment ── */
      $$(".tilt-3d").forEach((el) => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
        });
        el.addEventListener("mouseleave", () => {
          rx(0);
          ry(0);
        });
      });
    }

    /* ── goal cards swing in on a hinge ── */
    $$("[data-tl]").forEach((item) => {
      gsap.from(item, {
        rotationX: -55,
        y: 40,
        opacity: 0,
        transformOrigin: "top center",
        duration: 1,
        ease: "power3.out",
        immediateRender: true,
        scrollTrigger: { trigger: item, start: "top 88%", once: true }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     8. Generic scroll reveals
     ══════════════════════════════════════════════════════════ */
  function initReveals() {
    if (REDUCED) {
      $$("[data-reveal]").forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    /* the hero runs its own intro timeline */
    $$("[data-reveal]")
      .filter((el) => !el.closest(".hero"))
      .forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
      });

    $$('[data-split="lines"]').forEach((el) => {
      const lines = splitLines(el);
      gsap.from(lines, {
        yPercent: 115,
        duration: 1.05,
        stagger: 0.08,
        ease: "power4.out",
        immediateRender: true,
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    $$('[data-split="words"]').forEach((el) => {
      const words = splitWords(el);
      gsap.from(words, {
        opacity: 0.08,
        y: 8,
        stagger: 0.05,
        ease: "none",
        immediateRender: true,
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.6 }
      });
    });

    /* contact headline gets a character reveal */
    const contactTitle = $(".contact__title");
    if (contactTitle) {
      const chars = splitChars(contactTitle);
      gsap.from(chars, {
        yPercent: 110,
        rotationX: -80,
        z: -140,
        opacity: 0,
        duration: 1.1,
        stagger: 0.03,
        ease: "power4.out",
        transformOrigin: "50% 100%",
        immediateRender: true,
        scrollTrigger: { trigger: contactTitle, start: "top 85%", once: true }
      });
    }

    /* stack cards */
    gsap.from("[data-card]", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      immediateRender: true,
      scrollTrigger: { trigger: "#stackCards", start: "top 85%", once: true }
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. Marquee — loops forever, reacts to scroll velocity
     ══════════════════════════════════════════════════════════ */
  function initMarquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const group = $(".marquee__group", track);
    if (!group) return;

    const loop = gsap.to(track, {
      x: () => -group.offsetWidth,
      duration: 26,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${gsap.utils.wrap(-group.offsetWidth, 0, parseFloat(x))}px`
      }
    });

    if (REDUCED) {
      loop.pause();
      return;
    }

    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const dir = self.direction;
        gsap.to(loop, { timeScale: dir === -1 ? -1.6 : 1.6, duration: 0.4, overwrite: true });
        gsap.to(track, { skewX: gsap.utils.clamp(-12, 12, self.getVelocity() / -320), duration: 0.4, overwrite: true });
      },
      onLeave: () => gsap.to(track, { skewX: 0, duration: 0.5 }),
      onLeaveBack: () => gsap.to(track, { skewX: 0, duration: 0.5 })
    });

    /* settle back to a gentle drift once scrolling stops */
    let idle;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          gsap.to(loop, { timeScale: 1, duration: 0.8 });
          gsap.to(track, { skewX: 0, duration: 0.6 });
        }, 220);
      },
      { passive: true }
    );
  }

  /* ══════════════════════════════════════════════════════════
     10. Horizontal "currently learning" section
     ══════════════════════════════════════════════════════════ */
  function initHorizontal() {
    const wrapEl = $("#hscroll");
    const track = $("#hscrollTrack");
    if (!wrapEl || !track) return;

    if (REDUCED) {
      wrapEl.classList.add("is-native");
      return;
    }

    const mm = gsap.matchMedia();

    const section = $("#learning");

    mm.add("(min-width: 821px)", () => {
      /* pin the whole section so the heading stays put while the cards travel */
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);

      /* cards turn away from centre as they travel — a real 3D carousel */
      const panels = $$(".panel", track);
      const turnPanels = () => {
        const mid = window.innerWidth / 2;
        panels.forEach((panel) => {
          const r = panel.getBoundingClientRect();
          const offset = gsap.utils.clamp(-1, 1, (r.left + r.width / 2 - mid) / mid);
          gsap.set(panel, {
            rotationY: offset * -22,
            z: -Math.abs(offset) * 90,
            opacity: 1 - Math.abs(offset) * 0.25
          });
        });
      };

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: section,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: REDUCED ? undefined : turnPanels,
          onRefresh: REDUCED ? undefined : turnPanels
        }
      });

      gsap.from(".panel", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.08,
        immediateRender: true,
        scrollTrigger: { trigger: section, start: "top 70%", once: true }
      });

      return () => tween.scrollTrigger && tween.scrollTrigger.kill();
    });

    mm.add("(max-width: 820px)", () => {
      wrapEl.classList.add("is-native");
      gsap.from(".panel", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: wrapEl, start: "top 82%", once: true }
      });
      return () => wrapEl.classList.remove("is-native");
    });
  }

  /* ══════════════════════════════════════════════════════════
     11. Goals timeline
     ══════════════════════════════════════════════════════════ */
  function initTimeline() {
    const list = $("#timeline");
    if (!list) return;

    if (REDUCED) {
      gsap.set(".timeline__line i", { scaleY: 1 });
      return;
    }

    gsap.to(".timeline__line i", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 75%", scrub: 0.5 }
    });

    /* the entrance animation for each goal lives in init3D (hinge swing) */
    $$("[data-tl]").forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 72%",
        end: "bottom 40%",
        onToggle: (self) => item.classList.toggle("is-live", self.isActive)
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     12. Nav state, scroll progress
     ══════════════════════════════════════════════════════════ */
  function initNav() {
    const nav = $("#nav");
    if (!nav) return;

    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        nav.classList.toggle("is-stuck", self.scroll() > 80);
        nav.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 400 && !menuOpen);
      }
    });

    gsap.to(".scroll-progress i", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });

    /* active link highlighting */
    $$("section[id]").forEach((section) => {
      const link = $(`.nav__links a[data-scroll-to="#${section.id}"]`);
      if (!link) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => link.classList.toggle("is-active", self.isActive)
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     13. Cursor + magnetic buttons + card spotlight
     ══════════════════════════════════════════════════════════ */
  function initPointer() {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine || REDUCED) return;

    const ring = $(".cursor");
    const dot = $(".cursor-dot");
    if (!ring || !dot) return;

    let shown = false;
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!shown) {
          shown = true;
          gsap.set([ring, dot], { x: e.clientX, y: e.clientY });
          gsap.to([ring, dot], { opacity: 1, duration: 0.3 });
        }
        ringX(e.clientX);
        ringY(e.clientY);
        dotX(e.clientX);
        dotY(e.clientY);
      },
      { passive: true }
    );

    $$("a, button, .card, .panel").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-active");
        gsap.to(ring, { scale: 1.7, duration: 0.35 });
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-active");
        gsap.to(ring, { scale: 1, duration: 0.35 });
      });
    });

    /* magnetic pull */
    $$(".magnetic").forEach((el) => {
      const strength = 0.32;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });

  }

  /* ══════════════════════════════════════════════════════════
     14. Hero neural-network canvas
     ══════════════════════════════════════════════════════════ */
  function initCanvas() {
    const canvas = $("#neuralCanvas");
    if (!canvas || REDUCED) return;

    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = null;
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.round((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.7
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const dxp = n.x - pointer.x;
        const dyp = n.y - pointer.y;
        const dp = Math.hypot(dxp, dyp);
        if (dp < 140) {
          n.x += (dxp / dp) * 0.5;
          n.y += (dyp / dp) * 0.5;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 194, 255, 0.55)";
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 128) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(122, 134, 182, ${0.22 * (1 - d / 128)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", () => {
      clearTimeout(canvas._t);
      canvas._t = setTimeout(resize, 200);
    });
    window.addEventListener(
      "mousemove",
      (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      },
      { passive: true }
    );

    /* stop painting when the hero is off-screen */
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive && !raf) draw();
        else if (!self.isActive && raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     15. Boot
     ══════════════════════════════════════════════════════════ */
  function boot() {
    applyConfig();
    initLenis();
    if (lenis) lenis.stop();

    prepareHero();
    initAnchors(lenis);
    initMenu();
    initNav();
    initReveals();
    initMarquee();
    initHorizontal();
    initTimeline();
    initPointer();
    initCanvas();
    initMascot();
    init3D();

    runPreloader().then(() => {
      if (lenis) {
        lenis.resize();
        lenis.start();
      }
      ScrollTrigger.refresh();
      heroIntro();
      initRotator();
    });

    /* re-split masked headlines when the layout changes */
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        alignTitleGradient();
        ScrollTrigger.refresh();
      }, 250);
    });

    /* stat cards can arrive late — refresh once they're in */
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
