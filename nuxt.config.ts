// Nuxt config — https://nuxt.com/docs/api/configuration/nuxt-config
import { generateContentArtifacts } from './build/generate-content-artifacts'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://fmeyer.dev').replace(/\/$/, '')

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    'motion-v/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: 'fmeyer.dev',
    // The host serves prerendered pages as directory indexes and 301-redirects
    // /labs to /labs/. Canonical URLs, sitemap entries and internal links all
    // use the trailing-slash form so nothing points at a redirect.
    trailingSlash: true,
    description: 'Fabian Meyer — Staff Agentic Engineer at Cordes & Graefe KG, moving the organisation to agentic engineering.',
    defaultLocale: 'en'
  },

  runtimeConfig: {
    public: {
      siteUrl,
      noindex: process.env.NUXT_PUBLIC_NOINDEX === 'true'
    }
  },

  experimental: {
    payloadExtraction: false
  },

  compatibilityDate: '2025-03-01',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/404',
        '/410'
      ],
      crawlLinks: true
    }
  },

  hooks: {
    'build:manifest'(manifest) {
      // Talk slides (app/utils/talkAssets.ts) are bundled so their URLs are
      // hashed, but they are only opened on demand. Without this every page
      // emits <link rel="prefetch"> for ~3 MB of PDFs, which competes with
      // the page's own resources on slow connections and hurts LCP.
      for (const entry of Object.values(manifest)) {
        if (entry.file?.endsWith('.pdf')) {
          entry.prefetch = false
          entry.preload = false
        }
        if (entry.assets) {
          entry.assets = entry.assets.filter(asset => !asset.endsWith('.pdf'))
        }
      }
    },
    'nitro:init'(nitro) {
      // Resolve __BASE__ in public/.htaccess.tpl using the runtime base URL
      // and write the result to .output/public/.htaccess. Templating happens at
      // generate time so production (/) and preview (/pr-<n>/) builds each get
      // the correct ErrorDocument and RewriteBase paths.
      if (nitro.options.dev) return
      nitro.hooks.hook('close', async () => {
        const { promises: fs } = await import('node:fs')
        const { resolve } = await import('node:path')
        const baseURL = nitro.options.runtimeConfig.app.baseURL || '/'
        const templatePath = resolve(nitro.options.rootDir, 'public/.htaccess.tpl')
        const outputDir = nitro.options.output.publicDir
        const outputPath = resolve(outputDir, '.htaccess')
        const leakedTemplate = resolve(outputDir, '.htaccess.tpl')
        try {
          const tpl = await fs.readFile(templatePath, 'utf8')
          await fs.writeFile(outputPath, tpl.replaceAll('__BASE__', baseURL))
          await fs.rm(leakedTemplate, { force: true })
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
        }

        // Generate llms.txt, llms-full.txt, and rss.xml from YAML content so
        // LLM crawlers and feed readers can pick up labs + talks without
        // having to render the site.
        await generateContentArtifacts(nitro)
      })
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    // The build-time scanner only sees static literals. We need to cover:
    //  - dynamic names in templates (ColorModeButton builds `i-lucide-${...}`)
    //  - icons referenced inside @nuxt/ui (lives in node_modules, not scanned)
    // The default scanner globs cover .vue / .yml / .md etc., but not .ts —
    // and several status / nav icons (labs.ts, links.ts, app.config.ts) live
    // there. Extend the globs to include .ts (and .mts for safety).
    // `fallbackToApi: 'server-only'` keeps SSR/generate-time resolution but
    // blocks the runtime `api.iconify.design` request that CSP `connect-src
    // 'self'` would otherwise reject.
    clientBundle: {
      scan: {
        globInclude: ['**/*.{vue,jsx,tsx,ts,mts,md,mdc,mdx,yml,yaml}']
      },
      icons: [
        'lucide:sun',
        'lucide:moon',
        'lucide:arrow-right',
        'lucide:arrow-up-right',
        'lucide:chevron-down'
      ]
    },
    fallbackToApi: 'server-only'
  },

  robots: {
    disallow: [],
    sitemap: '/sitemap.xml'
  },

  schemaOrg: {
    // Global Person identity: the node every page's WebSite / WebPage / Event /
    // CreativeWork points at (#identity). Beyond name and job, the properties
    // exist to disambiguate this Fabian Meyer from the many namesakes Google
    // knows about: legal name parts, handle, city, employer URL, topics, and
    // the third-party pages that describe the same person.
    identity: {
      type: 'Person',
      name: 'Fabian Meyer',
      givenName: 'Fabian',
      familyName: 'Meyer',
      alternateName: 'dinooo13',
      url: `${siteUrl}/`,
      image: '/profile/fabian-meyer-portrait.jpg',
      description: 'Staff Agentic Engineer at Cordes & Graefe KG. Leads the organisation-wide move to agentic engineering, building agent-ready tooling, spec-driven development workflows, and enabling engineers to work effectively with agents.',
      email: 'hello@fmeyer.dev',
      jobTitle: 'Staff Agentic Engineer',
      worksFor: {
        '@type': 'Organization',
        'name': 'Cordes & Graefe KG',
        'url': 'https://www.cordes-graefe.de/'
      },
      homeLocation: {
        '@type': 'Place',
        'name': 'Bremen, Germany',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bremen',
          'addressCountry': 'DE'
        }
      },
      nationality: {
        '@type': 'Country',
        'name': 'Germany'
      },
      knowsAbout: [
        'Agentic engineering',
        'Spec-driven development',
        'AI coding agents',
        { '@type': 'Thing', 'name': 'Software engineering', 'sameAs': 'https://en.wikipedia.org/wiki/Software_engineering' },
        { '@type': 'Thing', 'name': 'Vue.js', 'sameAs': 'https://en.wikipedia.org/wiki/Vue.js' },
        { '@type': 'Thing', 'name': 'Nuxt', 'sameAs': 'https://en.wikipedia.org/wiki/Nuxt' },
        { '@type': 'Thing', 'name': 'TypeScript', 'sameAs': 'https://en.wikipedia.org/wiki/TypeScript' }
      ],
      // Profiles first, then third-party pages that name this person with a
      // matching bio. Reciprocal links from these pages back to fmeyer.dev are
      // what lets Google confirm they all describe the same entity.
      sameAs: [
        'https://github.com/dinooo13',
        'https://linkedin.com/in/fabian-meyer-02038813a',
        'https://www.rheinwerk-verlag.de/konferenzen/coding-mit-ki/speaker/#fabian-meyer',
        'https://www.rheinwerk-verlag.de/online-kurse/spec-driven-development/',
        'https://agentic.hamburg/news/blog/2026/speaker-spotlight-fabian-meyer-onboarding-your-agent-how-eventim-integrates-agentic-engineering-into-enterprise-workflows/'
      ],
      subjectOf: {
        '@type': 'Article',
        'headline': 'Speaker Spotlight: Fabian Meyer – Onboarding Your Agent: How eventim Integrates Agentic Engineering into Enterprise Workflows',
        'url': 'https://agentic.hamburg/news/blog/2026/speaker-spotlight-fabian-meyer-onboarding-your-agent-how-eventim-integrates-agentic-engineering-into-enterprise-workflows/',
        'publisher': {
          '@type': 'Organization',
          'name': 'Agentic Conf Hamburg',
          'url': 'https://agentic.hamburg/'
        }
      }
    }
  },

  sitemap: {
    autoLastmod: true,
    xsl: false,
    exclude: ['/404', '/404/', '/410', '/410/'],
    // Image discovery reads <img src> out of the prerendered HTML, where the
    // @nuxt/image `_ipx/fit_cover&s_…` thumbnail URL is already HTML-escaped;
    // the sitemap escapes it again and emits a URL that 404s. Declare the
    // portrait explicitly instead — the same file the Person schema uses.
    discoverImages: false,
    urls: [
      {
        loc: '/',
        images: [{ loc: `${siteUrl}/profile/fabian-meyer-portrait.jpg` }]
      }
    ]
  }
})
