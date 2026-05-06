// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

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
      googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
      noindex: process.env.NUXT_PUBLIC_NOINDEX === 'true'
    }
  },

  compatibilityDate: '2025-03-01',

  nitro: {
    prerender: {
      routes: [
        '/',
        '/sitemap.xml',
        '/robots.txt'
      ],
      crawlLinks: true
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
      jobTitle: 'Chapter Lead Vue, Software Development Expert',
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
    xsl: false
  }
})
