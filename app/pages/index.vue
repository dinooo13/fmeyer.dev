<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})

const { data: latestLab } = await useAsyncData('latest-lab', async () => {
  const entries = await queryCollection('labs').all()

  return sortLabs(entries)[0]
})

const { data: latestTalk } = await useAsyncData('latest-talk', async () => {
  const entries = await queryCollection('talks').all()

  return getLatestTalk(entries)
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page.value)

defineOgImage('NuxtSeoSatori')

const runtimeConfig = useRuntimeConfig()
const identityId = `${runtimeConfig.public.siteUrl.replace(/\/$/, '')}/#identity`

useSchemaOrg([
  defineWebPage({
    '@type': 'ProfilePage',
    'dateCreated': '2026-03-12T19:45:05+01:00',
    'dateModified': new Date().toISOString(),
    'mainEntity': { '@id': identityId }
  })
])
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <LandingFocus :page />
    <LandingWorkExperience :page />
    <LandingLabsTeaser
      :section="page.labs"
      :lab="latestLab"
    />
    <LandingSpeakingTeaser
      :section="page.speaking"
      :talk="latestTalk"
    />
  </UPage>
</template>
