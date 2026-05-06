<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')
const canonicalUrl = computed(() => {
  return new URL(route.path || '/', runtimeConfig.public.siteUrl).toString()
})

const verificationMeta = computed(() => {
  const token = runtimeConfig.public.googleSiteVerification
  return token ? [{ name: 'google-site-verification', content: token }] : []
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
    { name: 'author', content: 'Fabian Meyer' },
    {
      name: 'robots',
      content: runtimeConfig.public.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large'
    },
    ...verificationMeta.value
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: canonicalUrl }
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
    description: 'Personal site of Fabian Meyer — Leader, software engineer and AI mentor at eventim Tech.',
    inLanguage: 'en'
  }),
  defineWebPage(),
  definePerson({
    name: 'Fabian Meyer',
    image: '/profile/fabian-meyer-portrait.jpg',
    jobTitle: 'Chapter Lead Vue, Software Engineer, AI Mentor',
    worksFor: { name: 'eventim Tech GmbH' },
    sameAs: [
      'https://github.com/dinooo13',
      'https://linkedin.com/in/fabian-meyer-02038813a'
    ]
  })
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
