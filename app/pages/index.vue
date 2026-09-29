<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})

const { data: labs } = await useAsyncData('home-labs', async () => {
  const entries = await queryCollection('labs').all()

  return sortLabs(entries)
})

const { data: talks } = await useAsyncData('home-talks', async () => {
  const entries = await queryCollection('talks').all()

  return sortTalks(entries)
})

const latestLab = computed(() => labs.value?.[0])
const latestTalk = computed(() => getLatestTalk(talks.value ?? []))

const { design } = useDesign()

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page.value)

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
  <DesignsEditorialHome
    v-if="page && design === 'editorial'"
    :page
    :labs="labs ?? []"
    :talks="talks ?? []"
  />
  <DesignsSignalHome
    v-else-if="page && design === 'signal'"
    :page
    :labs="labs ?? []"
    :talks="talks ?? []"
  />
  <DesignsStudioHome
    v-else-if="page && design === 'studio'"
    :page
    :labs="labs ?? []"
    :talks="talks ?? []"
  />
  <UPage v-else-if="page">
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
