<script setup lang="ts">
const { data: page } = await useAsyncData('speaking', () => {
  return queryCollection('speaking').first()
})

const { data: talks } = await useAsyncData('speaking-talks', async () => {
  const entries = await queryCollection('talks').all()

  return sortTalks(entries)
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

usePageSeo(page.value)

defineOgImage({ component: 'Default' })
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 max-w-3xl text-left text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl',
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
      <ul
        class="space-y-6 list-none p-0"
        aria-label="Talks and speaking engagements"
      >
        <Motion
          v-for="(talk, index) in talks"
          :key="`${talk.title}-${talk.event}`"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(12px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08 }"
          :in-view-options="{ once: true }"
        >
          <TalksTalkPreviewCard
            :talk="talk"
            variant="list"
            :show-summary="true"
            :show-meta="true"
            :primary-action="{
              label: 'View details',
              to: getTalkPath(talk)
            }"
          />
        </Motion>
      </ul>
    </UPageSection>
  </UPage>
</template>
