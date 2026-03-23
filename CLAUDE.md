# CLAUDE.md

This file provides context for AI assistants working in this repository.

## Project overview

Personal website and portfolio for [fmeyer.dev](https://fmeyer.dev), built with Nuxt 4, Nuxt UI, and Nuxt Content. The site is statically generated and deployed via GitHub Actions.

## Tech stack

- **Framework**: Nuxt 4 (with `app/` directory convention)
- **UI**: `@nuxt/ui` v4 (Tailwind CSS v4, component library)
- **Content**: `@nuxt/content` v3 (YAML-based content collections)
- **Images**: `@nuxt/image`, `nuxt-og-image`
- **Animations**: `motion-v`
- **Icons**: `@iconify-json/lucide` (prefix `i-lucide-`) and `@iconify-json/simple-icons` (prefix `i-simple-icons-`)
- **Language**: TypeScript
- **Package manager**: pnpm 10 (required — do not use npm or yarn)
- **Node**: 22

## Repository structure

```
fmeyer.dev/
├── app/                        # Nuxt application code
│   ├── app.vue                 # Root app component (global head, SEO, canonical URL)
│   ├── app.config.ts           # Runtime app config (profile pic, email, footer links, UI theme)
│   ├── assets/css/main.css     # Global CSS
│   ├── composables/
│   │   └── usePageSeo.ts       # Sets useSeoMeta from a content page's seo/title/description
│   ├── components/
│   │   ├── AppHeader.vue       # Floating pill navigation bar
│   │   ├── AppFooter.vue       # Footer with social links
│   │   ├── ColorModeButton.vue # Dark/light mode toggle
│   │   ├── LabCard.vue         # Card for a lab entry in the grid
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
├── nuxt.config.ts              # Nuxt config (modules, site URL, Nitro prerender, ESLint stylistic)
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

Copy `.env.example` to `.env` for local overrides. The only variable is:

```
NUXT_PUBLIC_SITE_URL=https://fmeyer.dev
```

This is used by `nuxt-og-image` during static generation. For `pnpm dev` it defaults correctly without a `.env` file.

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

### SEO

- Call `usePageSeo(page)` at the top of each page, passing the content collection result. It reads `page.seo.title` / `page.seo.description` with fallback to `page.title` / `page.description`.
- Call `defineOgImage()` on each page to generate an OG image.
- The global title template is `%s - fmeyer.dev` (set in `app.vue`).

### ESLint

Config is generated by `@nuxt/eslint` with stylistic rules:
- No trailing commas (`commaDangle: 'never'`)
- 1TBS brace style (`braceStyle: '1tbs'`)

Run `pnpm lint:fix` before committing if you change formatting.

### Sorting and slug logic

- Labs are sorted by `date` descending, then alphabetically by `title`. Use `sortLabs()`.
- Talks are sorted by `date` descending (undated entries come after dated ones, `placeholder: true` last). Use `sortTalks()`.
- Slugs are derived from the YAML filename stem (last path segment). If no stem is available, a slug is generated from the title.

## Deployment

The site is statically generated (`pnpm generate`) and deployed via GitHub Actions. `nuxt-og-image` requires `NUXT_PUBLIC_SITE_URL` to be set at generation time. Nitro is configured to prerender `/` and crawl all links.

## Dependency management

Renovate is configured to follow `github>nuxt/renovate-config-nuxt` presets with lock file maintenance enabled. The `pnpm.overrides` in `package.json` pin specific transitive dependencies (`flatted`, `h3`, `socket.io-parser`) for compatibility.
