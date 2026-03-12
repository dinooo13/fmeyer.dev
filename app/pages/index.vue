<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})

const { data: labs } = await useAsyncData('labs-teaser', async () => {
  const entries = await queryCollection('labs').all()

  return entries
    .slice()
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 3)
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <LandingFocus :page />
    <LandingWorkExperience :page />
    <LandingLabsTeaser
      :section="page.labs"
      :labs="labs || []"
    />
    <LandingSpeakingTeaser :section="page.speaking" />
    <LandingContactLinks />
  </UPage>
</template>
