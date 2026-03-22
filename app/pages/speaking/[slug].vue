<script setup lang="ts">
import { getTalkSlug, resolveTalkEntry, sortTalks, type ResolvedTalkResource } from '../../utils/speaking'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const { data: talk } = await useAsyncData(`talk-${slug}`, async () => {
  const entries = await queryCollection('talks').all()
  const sortedEntries = sortTalks(entries)
  const entry = sortedEntries.find(entry => getTalkSlug(entry) === slug) ?? null

  return entry ? resolveTalkEntry(entry) : null
})

if (!talk.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Talk not found',
    fatal: true
  })
}

useSeoMeta({
  title: talk.value.title,
  ogTitle: talk.value.title,
  description: talk.value.summary || talk.value.description,
  ogDescription: talk.value.summary || talk.value.description
})

const organizerSubtitle = computed(() => {
  if (!talk.value?.organizerTitle) {
    return null
  }

  const prefix = `${talk.value.title}: `

  return talk.value.organizerTitle.startsWith(prefix)
    ? talk.value.organizerTitle.slice(prefix.length)
    : talk.value.organizerTitle
})

const resourceKindLabels: Record<ResolvedTalkResource['kind'], string> = {
  slides: 'Slides',
  recording: 'Recording',
  handout: 'Handout',
  link: 'Link'
}
</script>

<template>
  <UPage v-if="talk">
    <UPageHero
      :ui="{
        title: '!mx-0 max-w-3xl text-left',
        description: '!mx-0 max-w-2xl text-left',
        links: 'justify-start'
      }"
    >
      <template #title>
        <div class="max-w-3xl text-left">
          <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">
            {{ talk.title }}
          </h1>
          <p
            v-if="organizerSubtitle"
            class="mt-3 max-w-2xl text-base leading-6 font-normal text-muted sm:text-lg sm:leading-7"
          >
            {{ organizerSubtitle }}
          </p>
        </div>
      </template>

      <template #description>
        <div class="max-w-2xl text-left">
          <p class="text-sm text-muted sm:text-base">
            {{ talk.summary }}
          </p>
        </div>
      </template>

      <template #links>
        <div class="flex flex-wrap items-center gap-3">
          <UButton
            to="/speaking"
            color="neutral"
            variant="outline"
            icon="i-lucide-arrow-left"
            label="Back to Speaking"
          />
          <UButton
            v-if="talk.url"
            :to="talk.url"
            target="_blank"
            color="neutral"
            icon="i-lucide-external-link"
            label="View organizer session"
          />
        </div>
      </template>

      <template #default>
        <div class="mt-8 grid gap-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p class="font-medium text-highlighted">
              Event
            </p>
            <p>{{ talk.event }}</p>
          </div>
          <div>
            <p class="font-medium text-highlighted">
              Date
            </p>
            <p>{{ talk.dateLabel }}</p>
          </div>
          <div>
            <p class="font-medium text-highlighted">
              Location
            </p>
            <p>{{ talk.location }}</p>
          </div>
          <div v-if="talk.language">
            <p class="font-medium text-highlighted">
              Language
            </p>
            <p>{{ talk.language }}</p>
          </div>
        </div>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <UCard
        class="border border-default"
        :ui="{
          body: 'p-6 sm:p-8'
        }"
      >
        <div class="space-y-6">
          <div>
            <p class="text-sm font-medium text-highlighted">
              Summary
            </p>
            <p class="mt-2 text-sm text-muted">
              {{ talk.summary }}
            </p>
          </div>

          <div>
            <p class="text-sm font-medium text-highlighted">
              Abstract
            </p>
            <p class="mt-2 whitespace-pre-line text-sm leading-7 text-muted">
              {{ talk.description }}
            </p>
          </div>
        </div>
      </UCard>
    </UPageSection>

    <UPageSection
      v-if="talk.resources.length"
      title="Resources"
      description="Slides and supporting material for this talk."
      :ui="{
        container: '!pt-0',
        title: 'text-left text-2xl font-semibold',
        description: 'max-w-2xl text-left text-sm text-muted'
      }"
    >
      <div class="grid gap-4 lg:grid-cols-2">
        <UCard
          v-for="resource in talk.resources"
          :key="`${resource.kind}-${resource.title}`"
          class="border border-default"
          :ui="{
            body: 'p-6 sm:p-8'
          }"
        >
          <div class="flex h-full flex-col gap-5">
            <div class="space-y-4">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge
                  color="neutral"
                  variant="soft"
                  :label="resourceKindLabels[resource.kind]"
                />
                <UBadge
                  v-if="resource.format"
                  color="neutral"
                  variant="outline"
                  :label="resource.format"
                />
                <UBadge
                  v-if="resource.pages"
                  color="neutral"
                  variant="outline"
                  :label="`${resource.pages} pages`"
                />
              </div>

              <div class="space-y-2">
                <h2 class="text-lg font-semibold text-highlighted">
                  {{ resource.title }}
                </h2>

                <p
                  v-if="resource.description"
                  class="text-sm text-muted"
                >
                  {{ resource.description }}
                </p>
              </div>
            </div>

            <div class="mt-auto">
              <UButton
                :to="resource.href"
                target="_blank"
                color="neutral"
                icon="i-lucide-file-text"
                label="Open resource"
              />
            </div>
          </div>
        </UCard>
      </div>
    </UPageSection>
  </UPage>
</template>
