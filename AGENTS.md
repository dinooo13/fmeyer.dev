# AGENTS.md

This file provides context and instructions for AI agents working in this repository.

## Project overview

Personal website and portfolio for [fmeyer.dev](https://fmeyer.dev), built with Nuxt 4, Nuxt UI, and Nuxt Content. The site is statically generated and deployed via GitHub Actions.

## Tech stack

- **Framework**: Nuxt 4 (with `app/` directory convention)
- **UI**: `@nuxt/ui` v4 (Tailwind CSS v4, component library)
- **Content**: `@nuxt/content` v3 (YAML-based content collections)
- **Images**: `@nuxt/image`, `nuxt-og-image`
- **SEO**: `@nuxtjs/seo` (robots, sitemap, schema-org, OG images)
- **Animations**: `motion-v`
- **Icons**: `@iconify-json/lucide` (prefix `i-lucide-`) and `@iconify-json/simple-icons` (prefix `i-simple-icons-`)
- **Language**: TypeScript
- **Package manager**: pnpm 10 (required — do not use npm or yarn)
- **Node**: 22

## Repository structure

```
fmeyer.dev/
├── app/                        # Nuxt application code
│   ├── app.vue                 # Root app component (global SEO, skip link, canonical URL, JSON-LD)
│   ├── app.config.ts           # Runtime app config (profile pic, email, footer links, UI theme)
│   ├── assets/css/main.css     # Global CSS (animations, prefers-reduced-motion)
│   ├── composables/
│   │   └── usePageSeo.ts       # Sets useSeoMeta from a content page's seo/title/description
│   ├── components/
│   │   ├── AppHeader.vue       # Floating pill navigation bar (role="banner")
│   │   ├── AppFooter.vue       # Footer with social links (role="contentinfo")
│   │   ├── ColorModeButton.vue # Dark/light mode toggle
│   │   ├── LabCard.vue         # Card for a lab entry in the grid
│   │   ├── OgImage/
│   │   │   └── NuxtSeoSatori.satori.vue  # OG image template
│   │   ├── landing/            # Landing page section components
│   │   │   ├── Hero.vue
│   │   │   ├── Focus.vue
│   │   │   ├── WorkExperience.vue
│   │   │   ├── LabsTeaser.vue
│   │   │   └── SpeakingTeaser.vue
│   │   └── talks/
│   │       └── TalkPreviewCard.vue
│   ├── layouts/
│   │   └── default.vue         # Wraps every page: UContainer + AppHeader + slot + AppFooter
│   ├── pages/
│   │   ├── index.vue           # Homepage (queries index, labs, talks collections)
│   │   ├── labs/
│   │   │   ├── index.vue       # Labs listing page
│   │   │   └── [slug].vue      # Individual lab detail page
│   │   └── speaking/
│   │       ├── index.vue       # Speaking listing page
│   │       └── [slug].vue      # Individual talk detail page
│   ├── utils/
│   │   ├── date.ts             # getTimestamp(value) helper
│   │   ├── clipboard.ts        # Clipboard utilities
│   │   ├── labs.ts             # LabEntry type, status maps, sortLabs, getLabSlug/Path, formatLabDate
│   │   ├── speaking.ts         # TalkEntry/Resource types, sortTalks, resolveTalkEntry/Resource, getTalkSlug/Path
│   │   ├── talkAssets.ts       # Registry mapping asset keys to bundled PDF paths
│   │   ├── types.ts            # ContentButton shared type
│   │   └── links.ts            # navLinks array (Home, Labs, Speaking)
│   └── error.vue               # Error page
├── content/                    # YAML content files (Nuxt Content collections)
│   ├── index.yml               # Homepage data: hero, focus, experience, labs teaser, speaking teaser
│   ├── labs.yml                # Labs listing page metadata
│   ├── labs/                   # One .yml file per lab project
│   ├── speaking.yml            # Speaking listing page metadata
│   └── speaking/               # One .yml file per talk
├── public/                     # Static assets served as-is
│   ├── favicon.ico
│   ├── hero/                   # Hero images (random-1.avif … random-9.avif)
│   ├── profile/                # Profile photo
│   └── robots.txt
├── content.config.ts           # Nuxt Content collection schemas (Zod)
├── nuxt.config.ts              # Nuxt config (modules, site URL, schema-org identity, Nitro prerender, ESLint stylistic)
├── eslint.config.mjs           # ESLint config (extends Nuxt's generated config)
├── tsconfig.json               # TypeScript config
├── renovate.json               # Renovate dependency update config
└── pnpm-workspace.yaml         # pnpm workspace config
```

## Development commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start development server at http://localhost:3000
pnpm build          # Production build
pnpm generate       # Static site generation (used for deployment)
pnpm preview        # Serve the generated output locally
pnpm lint           # Run ESLint
pnpm lint:fix       # Auto-fix ESLint issues
pnpm typecheck      # Run Nuxt type checking (vue-tsc)
```

## Environment variables

Copy `.env.example` to `.env` for local overrides:

```
NUXT_PUBLIC_SITE_URL=https://fmeyer.dev
NUXT_PUBLIC_NOINDEX=false
```

`NUXT_PUBLIC_SITE_URL` is required by `nuxt-og-image` during static generation. For `pnpm dev` it defaults correctly without a `.env` file.

`NUXT_PUBLIC_NOINDEX=true` switches the global robots meta to `noindex, nofollow` — used for preview/staging deployments.

## Content collections

Schemas are defined in `content.config.ts` using Zod. All content files are YAML.

| Collection | Source | Type | Purpose |
|---|---|---|---|
| `index` | `content/index.yml` | page | Homepage sections (hero, focus, experience, teasers) |
| `pages` | `content/labs.yml` | page | Labs listing page metadata and links |
| `labs` | `content/labs/*.yml` | data | Individual lab project entries |
| `speaking` | `content/speaking.yml` | page | Speaking page metadata |
| `talks` | `content/speaking/*.yml` | data | Individual talk entries |

### Adding a lab entry

Create `content/labs/<slug>.yml` with these fields:

```yaml
title: My Project          # required
description: ...           # required
challenge: ...             # required
approach: ...              # required
nextSteps:                 # required, at least one item
  - Step one
status: wip                # required: wip | prototype | paused
tags:
  - Vue
date: 2025-01-01T00:00:00Z # required
icon: i-lucide-code        # optional Iconify icon
image: /path/to/image.jpg  # optional, goes in public/
url: https://...           # optional live demo URL
repoUrl: https://...       # optional GitHub repo URL
note: ...                  # optional note shown on detail page
```

The slug used for the URL is derived from the filename (e.g., `my-project.yml` → `/labs/my-project`).

### Adding a talk entry

Create `content/speaking/<slug>.yml` with these fields:

```yaml
title: Talk Title          # required
summary: Short summary     # required
description: Full description # required
event: Event Name          # required
location: City, Country    # required
topic: Topic name          # required
dateLabel: "March 1, 2026" # required display string
date: 2026-03-01           # optional ISO date for sorting
organizerTitle: ...        # optional title as submitted to the organiser
time: "10:00"              # optional
room: Room Name            # optional
duration: 25 min           # optional
format: Full Talk          # optional
level: Advanced            # optional
language: English          # optional
venueName: ...             # optional
venueAddress: ...          # optional
url: https://...           # optional session URL
eventUrl: https://...      # optional event URL
placeholder: true          # optional, marks a not-yet-confirmed talk
resources:                 # optional list of linked assets
  - kind: slides           # slides | recording | handout | link
    title: Slides
    asset: my-talk-slides  # key in app/utils/talkAssets.ts (for bundled files)
    # OR
    url: https://...       # external URL — exactly one of asset or url is required
    format: PDF            # optional
    pages: 18              # optional
```

### Bundling a talk asset (PDF)

1. Place the file in `app/assets/` (e.g., `app/assets/My Talk.pdf`).
2. Add a key to the `talkAssetRegistry` in `app/utils/talkAssets.ts`.
3. Reference that key as `asset:` in the talk's YAML `resources` entry.

## Code conventions

### Vue components

- Use `<script setup lang="ts">` for all components.
- Use Nuxt auto-imports — do not manually import `ref`, `computed`, `useRoute`, etc.
- Use `@nuxt/ui` components (`UButton`, `UCard`, `UPage`, `UPageHero`, `UPageSection`, `UBadge`, `UNavigationMenu`, etc.) rather than raw HTML.
- Use Tailwind utility classes directly. The primary colour is `blue`, neutral is `neutral`.
- Icon names follow Iconify format: `i-lucide-<name>` or `i-simple-icons-<name>`.
- The `Motion` component from `motion-v` is available globally for entrance animations.

### TypeScript / utilities

- Types for content entries are defined in `app/utils/labs.ts` (`LabEntry`) and `app/utils/speaking.ts` (`TalkEntry`, `TalkResource`, etc.).
- Shared button type is in `app/utils/types.ts` (`ContentButton`).
- Utility functions are auto-imported from `app/utils/` — no explicit imports needed in Vue files (though explicit imports are used in other `.ts` files).

### SEO and structured data

This site targets strong Lighthouse SEO scores and Google rich results. Every page must meet the following bar:

- Call `usePageSeo(page)` at the top of every page. It reads `page.seo.title` / `page.seo.description` with fallback to `page.title` / `page.description` and sets both plain and OG variants.
- Call `defineOgImage('NuxtSeoSatori')` on every page to generate a social preview image.
- The global title template is `%s - fmeyer.dev` (set in `app.vue`).
- Canonical URLs are computed dynamically per route in `app.vue` and injected via `useSeoMeta`.
- `@nuxtjs/seo` handles robots, sitemap (`autoLastmod: true`), and schema-org globally.

**JSON-LD / schema-org**

- The global `Person` identity is defined once in `nuxt.config.ts` under `schemaOrg.identity`. Do not duplicate it elsewhere.
- `app.vue` registers `defineWebSite` and `defineWebPage` for every route.
- The homepage registers a `ProfilePage` schema (`useSchemaOrg([defineWebPage({ '@type': 'ProfilePage', ... })])`) with a `mainEntity` reference to the identity anchor (`#identity`) and a live `dateModified: new Date().toISOString()`.
- When adding new page types, extend schema-org appropriately (e.g., `Article`, `Event`) using `useSchemaOrg` in the page component.

### Performance

Performance directly affects user experience and Lighthouse scores. Follow these rules rigorously:

**Animations**
- Use CSS-only entrance animations for above-the-fold elements. Do **not** use `motion-v` with `initial: { opacity: 0 }` on LCP-critical elements — it hides them until JS hydrates and breaks Lighthouse LCP measurement.
- Animate with `transform` only (e.g., `scale`, `translateY`). Avoid animating `opacity`, `filter`, or layout properties above the fold — non-transform animations force main-thread repaints and increase Total Blocking Time.
- Staggered entrance classes (`.hero-enter-1` through `.hero-enter-4` in `main.css`) use `animation-delay` so the browser schedules them without blocking.
- Always include a `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms` and disables view-transition animations. This is in `main.css` — keep it up to date when adding new animations.

**Images**
- Hero / above-the-fold images: use `loading="eager"` and `fetchpriority="high"` on `<NuxtImg>`.
- Below-the-fold images: use `loading="lazy"`.
- Always supply `sizes` and `densities` on `<NuxtImg>` so `@nuxt/image` generates the correct `srcset`.
- Decorative images (profile photo next to the name) must have `alt=""` (WCAG H67) — empty string, not omitted.

**Build**
- `experimental.payloadExtraction: false` is set in `nuxt.config.ts`. This inlines `useAsyncData` payload into the HTML instead of writing a separate JSON file, eliminating an extra network round-trip before hydration.
- Nitro prerender crawls all links from `/` — ensure every page is reachable via an anchor so it gets prerendered.

### Accessibility

This site targets WCAG 2.1 AA compliance. Every change must preserve or improve the accessibility baseline:

**Landmarks and skip navigation**
- `app.vue` has a skip-to-main-content link as the first focusable element. It uses `sr-only focus:not-sr-only` to appear only on keyboard focus. Do not remove it.
- `<UMain id="main-content" tabindex="-1">` in `app.vue` is the skip-link target. Keep `id` and `tabindex="-1"` in sync.
- `AppHeader` carries `role="banner"`, `AppFooter` carries `role="contentinfo"`. Maintain these on any structural refactor.

**Semantic HTML**
- Wrap groups of navigation links in `<nav aria-label="...">` with `<ul>` / `<li>` children. Do not render link lists as bare `<div>` stacks.
- Use `<ul aria-label="...">` for content grids (lab grid, talk list). Render `<Motion as="li">` so the grid is a proper list.
- Action button groups on detail pages (back, demo, repo) go in `<nav aria-label="..."><ul class="list-none p-0">...</ul></nav>`.

**Interactive elements**
- Toggle buttons (e.g., "Show more experience" in `WorkExperience.vue`) must have `:aria-expanded` bound to state and `:aria-controls` pointing to the controlled element's `id`. The button label must also change to reflect state.
- Never use a `<div>` or `<span>` as a click target without `role="button"`, `tabindex="0"`, and keyboard handler.

**Screen-reader link text**
- When a button label is generic (e.g., "View details", "Learn more"), append `<span class="sr-only"> for {{ item.title }}</span>` inside the label slot. This gives screen reader users context without changing the visual design.
- Pattern used in `LabCard.vue` and `TalkPreviewCard.vue` — follow the same pattern for any new cards.

**Color contrast**
- Nuxt UI's `color="success" variant="soft"` renders green text on green background (~2:1 contrast ratio) — it does **not** meet WCAG AA (4.5:1). Use `color="neutral" variant="soft"` for status badges where the meaning is conveyed by text, not colour alone.
- Before using any colour variant for informational text, verify it meets 4.5:1 against its background in both light and dark mode.

### ESLint

Config is generated by `@nuxt/eslint` with stylistic rules:
- No trailing commas (`commaDangle: 'never'`)
- 1TBS brace style (`braceStyle: '1tbs'`)

Run `pnpm lint:fix` before committing if you change formatting.

### Sorting and slug logic

- Labs are sorted by `date` descending, then alphabetically by `title`. Use `sortLabs()`.
- Talks are sorted by `date` descending (undated entries come after dated ones, `placeholder: true` last). Use `sortTalks()`.
- Slugs are derived from the YAML filename stem (last path segment). If no stem is available, a slug is generated from the title.

## Quality checklist

Before considering any change done, verify:

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm typecheck` passes with no errors
- [ ] New above-the-fold elements do not use `opacity: 0` initial states (LCP impact)
- [ ] New animations have `@media (prefers-reduced-motion: reduce)` coverage in `main.css`
- [ ] New images have correct `loading`, `fetchpriority`, `alt`, `sizes`, and `densities` attributes
- [ ] New interactive elements have correct ARIA attributes (landmarks, expanded state, controls)
- [ ] New link groups use `<nav>` + `<ul>` + `<li>` structure
- [ ] Generic button labels have `<span class="sr-only">` context
- [ ] Status/info badges use `color="neutral"` — not `color="success"` or other low-contrast variants
- [ ] New pages call `usePageSeo(page)` and `defineOgImage('NuxtSeoSatori')`
- [ ] New page types add appropriate `useSchemaOrg(...)` structured data

## Deployment

The site is statically generated (`pnpm generate`) and deployed via GitHub Actions. `nuxt-og-image` requires `NUXT_PUBLIC_SITE_URL` to be set at generation time. Nitro is configured to prerender `/` and crawl all links.

## Dependency management

Renovate is configured to follow `github>nuxt/renovate-config-nuxt` presets with lock file maintenance enabled.

### `pnpm.overrides`

The `pnpm.overrides` block in `package.json` pins specific transitive dependencies. Each entry should be revisited whenever the upstream package no longer pulls a vulnerable version — once direct dependencies catch up, the override can be dropped.

| Override | Reason |
|---|---|
| `flatted: 3.4.2` | Compatibility pin (transitive dep). |
| `h3: 1.15.10` | Compatibility pin (transitive dep). |
| `socket.io-parser: 4.2.6` | Compatibility pin (transitive dep). |
| `brace-expansion@>=2.0.0 <2.0.3 → 2.0.3` | [GHSA-f886-m6hf-6m8v](https://github.com/advisories/GHSA-f886-m6hf-6m8v) — process hang via zero-step sequence. |
| `brace-expansion@>=4.0.0 <5.0.5 → 5.0.5` | Same advisory, v4/v5 stream. |
| `brace-expansion@>=5.0.0 <5.0.5 → 5.0.5` | Same advisory, v5 stream. |
| `node-forge@<1.4.0 → >=1.4.0` | [GHSA-2328-f5f3-gj25](https://github.com/advisories/GHSA-2328-f5f3-gj25), [GHSA-q67f-28xg-22rw](https://github.com/advisories/GHSA-q67f-28xg-22rw), [GHSA-5m6q-g25r-mvwx](https://github.com/advisories/GHSA-5m6q-g25r-mvwx), [GHSA-ppp5-5v6c-4jwp](https://github.com/advisories/GHSA-ppp5-5v6c-4jwp) — cert-chain bypass, signature forgery, infinite-loop DoS. |
| `picomatch@<2.3.2 → >=2.3.2`, `picomatch@>=4.0.0 <4.0.4 → >=4.0.4` | [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj), [GHSA-3v7f-55p6-f55p](https://github.com/advisories/GHSA-3v7f-55p6-f55p) — ReDoS, method injection. |
| `yaml@>=2.0.0 <2.8.3 → >=2.8.3` | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) — stack overflow via deeply nested collections. |
| `serialize-javascript@<7.0.5 → >=7.0.5` | [GHSA-qj8w-gfj5-8c6v](https://github.com/advisories/GHSA-qj8w-gfj5-8c6v) — CPU exhaustion DoS. |
| `lodash@<=4.17.23 → >=4.18.0` | [GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc), [GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh) — code injection via `_.template`, prototype pollution. |
| `defu@<=6.1.4 → >=6.1.5` | [GHSA-737v-mqg7-c878](https://github.com/advisories/GHSA-737v-mqg7-c878) — prototype pollution via `__proto__` key. |
| `vite@>=7.0.0 <=7.3.1 → >=7.3.2` | [GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r), [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583), [GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9) — `server.fs.deny` bypass, arbitrary file read, path traversal in optimized deps. |
| `unhead@<2.1.13 → >=2.1.13 <3` | [GHSA-95h2-gj7x-gx9w](https://github.com/advisories/GHSA-95h2-gj7x-gx9w) — `hasDangerousProtocol()` bypass. Upper bound keeps transitive `unhead` consumers (`@unhead/vue`, `@unhead/schema-org`) on the same v2 instance; without it the override pushes `@unhead/vue`'s `unhead` dep up to v3 while `@unhead/schema-org` stays on v2, splitting the head registry and producing empty JSON-LD on prerender. |
| `simple-git@<3.36.0 → >=3.36.0` | RCE in `simple-git` ≤3.35. |

After bumping a direct dependency, run `pnpm audit` and remove any override that the upstream now resolves on its own.
