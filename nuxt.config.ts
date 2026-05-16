// Nuxt config — https://nuxt.com/docs/api/configuration/nuxt-config
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
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://fmeyer.dev',
    name: 'fmeyer.dev',
    description: 'Fabian Meyer — Leader, software engineer and AI mentor at eventim Tech. Vue chapter leadership, agentic engineering, and frontend craft.',
    defaultLocale: 'en'
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://fmeyer.dev',
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
    identity: {
      type: 'Person',
      name: 'Fabian Meyer',
      url: process.env.NUXT_PUBLIC_SITE_URL || 'https://fmeyer.dev',
      image: '/profile/fabian-meyer-portrait.jpg',
      description: 'Chapter Lead Vue, software engineer, and AI mentor at eventim Tech. Leads the Vue chapter, provides technical leadership for the Tixx Online Shop, and helps teams apply agentic engineering with measurable customer impact.',
      jobTitle: 'Chapter Lead Vue, Software Engineer, AI Mentor',
      worksFor: {
        '@type': 'Organization',
        'name': 'eventim Tech GmbH'
      },
      sameAs: [
        'https://github.com/dinooo13',
        'https://linkedin.com/in/fabian-meyer-02038813a'
      ]
    }
  },

  sitemap: {
    autoLastmod: true,
    xsl: false,
    exclude: ['/404', '/410']
  }
})
