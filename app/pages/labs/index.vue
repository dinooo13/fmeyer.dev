<script setup lang="ts">
const { data: page } = await useAsyncData('labs-page', () => {
  return queryCollection('pages').path('/labs').first()
})

const { data: labs } = await useAsyncData('labs', async () => {
  const entries = await queryCollection('labs').all()

  return sortLabs(entries)
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page.value)

defineOgImage()
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 max-w-3xl text-left',
        description: '!mx-0 max-w-2xl text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links?.length"
          class="flex flex-wrap items-center gap-3"
        >
          <UButton
            v-for="link in page.links"
            :key="`${link.label}-${link.to}`"
            v-bind="link"
            color="neutral"
          />
        </div>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <div class="grid gap-6 lg:grid-cols-3">
        <Motion
          v-for="(lab, index) in labs"
          :key="lab.title"
          :initial="{ opacity: 0, transform: 'translateY(12px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08 }"
          :in-view-options="{ once: true }"
        >
          <LabCard :lab="lab" />
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
