# Christina Carlsen — Author Website

## Original Problem Statement (verbatim)
> Mujhe Author Website bana kr dedo Christina Carlsen Website Brief.docx attach kra hai us pr sub kuch likh hua hai website kaise hogi color theme font-family images content sub likh hua hai docx pr 
> images.zip ke folder pr image hai 
> website modern hogi awwwards type 
> html, css ,js pr bana website 
> bootstrap
> Gsap 
> scrolltrigger
> SplitType
> Lenis 
> yeh use krna website pr 
> koi bhi error na hho animation pr 
> awwwards type animation ho website pr 
> full responsive ho 
> inline css mat use krna 
> senior frontend developer ki trah kam krna 
> jo images na ho woh generate krke lga dena docx pr mention hai images kis type ki use hogi website pr 
> premium ho website 
> pages bhi mention hai kon kon se bane ge

## Architecture
- **Stack**: Pure static HTML / CSS / JS (no React, no backend logic).
- **Served by**: `serve` (npm) at port 3000, supervisor-managed via `yarn start`.
- **Config**: `/app/frontend/serve.json` (cleanUrls: false, rewrites `/` -> `/index.html`).
- **Animation libs (CDN + local)**:
  - GSAP 3.12.5 + ScrollTrigger (jsdelivr CDN)
  - SplitType 0.3.4 (jsdelivr CDN)
  - Lenis 1.1.20 (downloaded locally to `/app/frontend/public/js/lenis.min.js` because remote CDN blocked by ORB in preview env)
  - Bootstrap 5 grid only (jsdelivr CDN)
- **Fonts (Google)**: Playfair Display (headings), Source Serif 4 (body), Caveat (script).

## File layout (`/app/frontend/public/`)
- `index.html`, `books.html`, `about.html`, `educators.html`, `blog.html`, `contact.html`, `thank-you.html`
- `books/max-the-boy-who-counts.html`, `playing-by-ear.html`, `read-the-room.html`
- `blog/notes-from-a-noisy-house.html`, `why-i-write-for-quiet-kids.html`, `a-letter-to-teachers.html`
- `partials/_header.html`, `_footer.html` (fetched + injected client-side by `js/main.js`)
- `css/main.css` — single-file design system (tokens, layout, components, pages, animations).
- `js/main.js` — partials loader, sticky nav, mobile overlay, demo form -> /thank-you.html, blog filter, custom cursor.
- `js/animations.js` — Lenis + GSAP + ScrollTrigger + SplitType (exposes `window.initAnimations`).
- `images/author/*.png` — 9 author photos (user-supplied).
- `images/books/*.png` — book covers generated via Gemini Nano Banana (`/app/scripts/generate_book_covers.py`).

## What's implemented (2026-06-08)
- 6 main pages from the brief + 3 book detail + 3 blog detail + thank-you page.
- Awwwards-style animations: page loader fade, SplitType line/word reveal on hero, image curtain reveals, marquee infinite loop, scroll-triggered fades, custom cursor (desktop only), Lenis smooth scroll.
- Brand: brief-accurate color palette, typography, voice, content.
- Mobile responsive (mobile-first breakpoints at 900px and 575px), full-screen hamburger overlay.
- Demo forms (newsletter on home/books/footer, contact form) submit -> `/thank-you.html`.
- Active nav highlighting per page.
- No inline CSS (audit clean).
- Lint: animations.js + main.js pass ESLint with no blocking issues.
- Testing agent: 100% frontend pass on 9 critical flows (iteration 1).

## Generated assets
- `images/books/max-the-boy-who-counts.png`
- `images/books/playing-by-ear.png`
- `images/books/read-the-room.png`
- `images/books/childrens-coming-soon.png`
- `images/books/watercolor-leaf-divider.png`
- `images/books/watercolor-book-stack.png`
(Script: `/app/scripts/generate_book_covers.py`, model: `gemini-3.1-flash-image-preview`.)

## Personas
- **Quiet middle-grade reader (8–12)** — the kid the books are written for.
- **Parent of a sensitive child** — looking for honest, age-appropriate stories.
- **Classroom teacher / librarian** — needs discussion guides, reading levels, visit info.
- **Press / event organiser** — needs to reach the author for visits and interviews.

## Backlog (P1 / P2)
- P1 — Wire newsletter signup to a real provider (Mailerlite / ConvertKit) instead of demo redirect.
- P1 — Real discussion-guide PDFs on /educators.html (currently `href="#"`).
- P1 — Real purchase URLs (Amazon / Bookshop.org / B&N) once ISBNs are set; ISBNs are placeholders.
- P2 — Replace placeholder Instagram/Facebook links in footer with real handles.
- P2 — Optional CMS for blog (Decap / NetlifyCMS) so Christina can post letters herself.
- P2 — Page transitions between routes (Barba.js-style overlay) for fuller awwwards feel.
- P2 — Optimise images (WebP, srcset, blur-up placeholders).

## Next tasks
- Collect real ISBNs, purchase URLs, and discussion guide PDFs from the author/publisher.
- Decide newsletter provider and swap the demo handler for the real one.
