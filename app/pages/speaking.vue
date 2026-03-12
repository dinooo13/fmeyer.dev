<script setup lang="ts">
const { data: page } = await useAsyncData("speaking", () => {
  return queryCollection("speaking").first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
});
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 max-w-3xl text-left',
        description: '!mx-0 max-w-2xl text-left',
        links: 'justify-start',
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
      title="Upcoming talk"
      description="A first public talk is being prepared now. Real event details will replace these placeholders once they are confirmed."
      :ui="{
        container: '!pt-0',
      }"
    >
      <UCard
        v-if="page.upcoming"
        class="border border-default"
        :ui="{
          body: 'p-6 sm:p-8',
        }"
      >
        <div
          class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
        >
          <div class="space-y-3">
            <UBadge color="warning" variant="soft" label="Upcoming" />
            <div>
              <h2 class="text-2xl font-semibold text-highlighted">
                {{ page.upcoming.title }}
              </h2>
              <p class="mt-2 text-sm text-muted">
                {{ page.upcoming.description }}
              </p>
            </div>
          </div>

          <div
            class="grid gap-4 text-sm text-muted sm:grid-cols-2 lg:min-w-[22rem]"
          >
            <div>
              <p class="font-medium text-highlighted">Event</p>
              <p>{{ page.upcoming.event }}</p>
            </div>
            <div>
              <p class="font-medium text-highlighted">Date</p>
              <p>{{ page.upcoming.date }}</p>
            </div>
            <div>
              <p class="font-medium text-highlighted">Location</p>
              <p>{{ page.upcoming.location }}</p>
            </div>
            <div>
              <p class="font-medium text-highlighted">Topic</p>
              <p>{{ page.upcoming.topic }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </UPageSection>
  </UPage>
</template>
