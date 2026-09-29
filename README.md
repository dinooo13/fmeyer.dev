# fmeyer.dev

**The home of Fabian Meyer on the web: who I am, what I build, and where I speak about agentic engineering.**

[fmeyer.dev](https://fmeyer.dev) · [Labs](https://fmeyer.dev/labs) · [Speaking](https://fmeyer.dev/speaking) · [hello@fmeyer.dev](mailto:hello@fmeyer.dev)

---

## What this is

fmeyer.dev is my personal site and portfolio. I'm a Staff Agentic Engineer at Cordes & Graefe KG, and my work is about moving engineering organisations to agentic engineering: new ways of working, agent-ready tooling, spec-driven development, and the coaching that makes it stick.

The site answers three questions quickly:

1. **Who is this?** What I focus on right now, and where I've worked.
2. **What have they built?** Hands-on projects and experiments, each written up as a short case study.
3. **Where can I hear them?** Talks, workshops, and courses, with slides and resources.

## Who it's for

- **Organisers and teams** looking for a speaker or workshop on agentic engineering and spec-driven development.
- **Engineering leaders** who want to see how I approach moving a company to agentic engineering.
- **Engineers** curious about the tools and workflows I build and use every day.
- **Recruiters and collaborators** who want a clear, current picture of my work.

## What's on the site

### Home

A hero with an animated "agent session" terminal that plays through the spec → code → verify loop I teach. Below it: current focus areas, experience, a featured lab, and recent talks.

### Labs

Projects built outside day-to-day product delivery. Each lab is written as a small case study, **challenge → approach → next steps**, with status, tags, and links to the demo and source. Current labs include:

- **Pladder**: on-device push-to-talk dictation for macOS, built for prompting coding agents.
- **Habit Tracker**: a local-first habit app built end to end by a seven-stage agent software factory.
- **Good Vibes Only**: Claude Code plugins that take care of the annoying parts of long agent runs.

### Speaking

Talks, workshops, and courses on agentic engineering. Each talk has its own page with the abstract, a session spec sheet (event, date, room, format, level, language), and resources such as slides. Upcoming sessions are flagged automatically until their date passes.

## Product principles

The site is small, but held to a high bar. These are the non-negotiables:

- **Fast.** Statically generated, with no content hidden behind JavaScript. Above-the-fold animations are CSS- and transform-only so they never delay the largest paint.
- **Accessible.** Targets WCAG 2.1 AA: skip link, proper landmarks, semantic lists and navigation, meaningful screen-reader link text, contrast-checked badges, and full `prefers-reduced-motion` support.
- **Findable.** Per-page SEO metadata, canonical URLs, generated social preview images, sitemap, and schema.org structured data (Person, ProfilePage, WebSite) for rich results.
- **Dark-first, light-ready.** The design is built for dark mode and fully themed for light mode.
- **Content over code.** Adding a lab or a talk means adding one YAML file. No component changes needed.

## Updating content

All content lives in [`content/`](content) as YAML and is validated against the schemas in [`content.config.ts`](content.config.ts).

| To change… | Edit… |
|---|---|
| Hero, focus areas, experience | [`content/index.yml`](content/index.yml) |
| Labs page intro and links | [`content/labs.yml`](content/labs.yml) |
| A lab | add or edit a file in [`content/labs/`](content/labs) |
| Speaking page intro | [`content/speaking.yml`](content/speaking.yml) |
| A talk | add or edit a file in [`content/speaking/`](content/speaking) |

The filename becomes the URL: `content/labs/pladder.yml` → `/labs/pladder`. See [`CLAUDE.md`](CLAUDE.md) for the full field reference for labs and talks, including how to bundle slide PDFs.

## Running it locally

Requires Node.js 22 and pnpm 10.

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `pnpm generate` | Build the static site (used for deployment) |
| `pnpm preview` | Serve the generated output locally |
| `pnpm lint` / `pnpm lint:fix` | Run ESLint / fix what it can |
| `pnpm typecheck` | Run Nuxt type checking |

Copy `.env.example` to `.env` if you need to override the public site URL or mark a build as `noindex` for previews.

## How it ships

Every push and pull request runs lint, typecheck, and a build in GitHub Actions. Pull requests get their own preview deployment, and merges to `main` go straight to production. Renovate keeps dependencies current.

## Built with

[Nuxt 4](https://nuxt.com) · [Nuxt UI](https://ui.nuxt.com) · [Nuxt Content](https://content.nuxt.com) · [Nuxt Image](https://image.nuxt.com) · [Nuxt SEO](https://nuxtseo.com) · [motion-v](https://motion.unovue.com) · TypeScript · Tailwind CSS v4

## License

[MIT](LICENSE) © Fabian Meyer
