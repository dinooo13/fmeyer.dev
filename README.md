# fmeyer.dev

Personal website and portfolio for [fmeyer.dev](https://fmeyer.dev), built with Nuxt 4, Nuxt UI, and Nuxt Content.

## Stack

- Nuxt 4
- `@nuxt/ui`
- `@nuxt/content`
- `@nuxt/image`
- `@nuxtjs/seo` (robots, sitemap, schema-org, OG images)
- TypeScript
- pnpm
- GitHub Actions for CI and deployment

## Requirements

- Node.js 22
- pnpm 10

If you use Corepack:

```bash
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

## Getting started

Install dependencies:

```bash
pnpm install
```

Copy the example environment file if you need to override the public site URL for local generation or preview builds:

```bash
cp .env.example .env
```

Start the local development server:

```bash
pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000).

## Available scripts

- `pnpm dev` starts the Nuxt development server.
- `pnpm build` creates the production build.
- `pnpm generate` creates the static output used for deployment.
- `pnpm preview` serves the production build locally.
- `pnpm lint` runs ESLint.
- `pnpm lint:fix` fixes lint issues where possible.
- `pnpm typecheck` runs Nuxt type checking.

## Content structure

Content is defined with Nuxt Content collections in [`content.config.ts`](content.config.ts).

- [`content/index.yml`](content/index.yml) drives the homepage content.
- [`content/labs.yml`](content/labs.yml) defines the overview page for labs.
- [`content/labs/`](content/labs) contains individual lab entries.
- [`content/speaking.yml`](content/speaking.yml) defines the speaking landing page.
- [`content/speaking/`](content/speaking) contains individual talk entries.

Static assets live in [`public/`](public), and the Nuxt application code lives in [`app/`](app).
