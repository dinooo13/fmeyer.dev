<script setup lang="ts">
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')
const canonicalUrl = computed(() => {
  return new URL(route.path || '/', runtimeConfig.public.siteUrl).toString()
})

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
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
  ogUrl: canonicalUrl,
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
