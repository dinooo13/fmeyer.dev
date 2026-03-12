<script setup lang="ts">
import { sortTalks } from "../utils/speaking";

const { data: page } = await useAsyncData("speaking", () => {
  return queryCollection("speaking").first();
});

const { data: talks } = await useAsyncData("speaking-talks", async () => {
  const entries = await queryCollection("talks").all();

  return sortTalks(entries);
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
      :ui="{
        container: '!pt-0',
      }"
    >
      <div class="space-y-6">
        <Motion
          v-for="(talk, index) in talks"
          :key="`${talk.title}-${talk.event}`"
          :initial="{ opacity: 0, transform: 'translateY(12px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.08 }"
          :in-view-options="{ once: true }"
        >
          <UCard
            class="border border-default"
            :ui="{
              body: 'p-6 sm:p-8',
            }"
          >
            <div
              class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"
            >
              <div class="space-y-3">
                <UBadge
                  color="warning"
                  variant="soft"
                  :label="talk.placeholder ? 'Upcoming' : 'Talk'"
                />
                <div>
                  <h2 class="text-2xl font-semibold text-highlighted">
                    {{ talk.title }}
                  </h2>
                  <p class="mt-2 text-sm text-muted">
                    {{ talk.description }}
                  </p>
                </div>
              </div>

              <div
                class="grid gap-4 text-sm text-muted sm:grid-cols-2 lg:min-w-[22rem]"
              >
                <div>
                  <p class="font-medium text-highlighted">Event</p>
                  <p>{{ talk.event }}</p>
                </div>
                <div>
                  <p class="font-medium text-highlighted">Date</p>
                  <p>{{ talk.dateLabel }}</p>
                </div>
                <div>
                  <p class="font-medium text-highlighted">Location</p>
                  <p>{{ talk.location }}</p>
                </div>
                <div>
                  <p class="font-medium text-highlighted">Topic</p>
                  <p>{{ talk.topic }}</p>
                </div>
              </div>
            </div>
          </UCard>
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
