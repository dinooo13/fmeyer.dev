<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const baseURL = runtimeConfig.app.baseURL

const basePrefix = baseURL.replace(/\/$/, '')

const canonicalUrl = computed(() => {
  return new URL(`${basePrefix}${route.path || '/'}`, runtimeConfig.public.siteUrl).toString()
})

useHead({
  meta: [
    { charset: 'utf-8' },
    // No `key` on the theme-color pair: unhead treats same-name theme-color tags
    // as an array and matches them to the prerendered pair by position. Custom
    // keys made the client insert a second pair after hydration.
    { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#fbfcfe' },
    { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#07090f' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'author', content: 'Fabian Meyer' },
    {
      name: 'robots',
      content: runtimeConfig.public.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large'
    }
  ],
  link: [
    { rel: 'icon', href: `${baseURL}favicon.ico` },
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'alternate', type: 'application/rss+xml', title: 'fmeyer.dev — Labs & Speaking', href: `${baseURL}rss.xml` },
    { rel: 'me', href: 'https://github.com/dinooo13' },
    { rel: 'me', href: 'https://linkedin.com/in/fabian-meyer-02038813a' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s - fmeyer.dev',
  ogSiteName: 'fmeyer.dev',
  ogType: 'website',
  ogLocale: 'en_US',
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image'
})

useSchemaOrg([
  defineWebSite({
    name: 'fmeyer.dev',
    description: 'Personal site of Fabian Meyer — Staff Agentic Engineer at Cordes & Graefe KG.',
    inLanguage: 'en'
  }),
  defineWebPage()
])
</script>

<template>
  <UApp>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    >
      Skip to main content
    </a>
    <NuxtLayout>
      <UMain
        id="main-content"
        class="relative"
        tabindex="-1"
      >
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
