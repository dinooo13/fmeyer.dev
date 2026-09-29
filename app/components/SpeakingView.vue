<script setup lang="ts">
import type { SpeakingCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: SpeakingCollectionItem
  talks: TalksCollectionItem[]
}>()

const events = computed(() => new Set(props.talks.map(talk => talk.event)).size)
const languages = computed(() => [...new Set(props.talks.map(talk => talk.language).filter(Boolean))].join(' & '))
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-24">
    <SectionHeader
      as="h1"
      eyebrow="Speaking"
      index="~/"
      :title="page.title"
      :description="page.description"
    />

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <nav
        v-if="page.links?.length"
        aria-label="Speaking links"
      >
        <ul class="flex flex-wrap items-center gap-2">
          <li
            v-for="link in page.links"
            :key="`${link.label}-${link.to}`"
          >
            <UButton
              :to="link.to"
              :target="link.target"
              :icon="link.icon"
              :label="link.label"
              color="primary"
              class="rounded-full px-4"
            />
          </li>
        </ul>
      </nav>
      <p class="font-mono text-xs text-muted">
        {{ talks.length }} sessions · {{ events }} events<template v-if="languages">
          · {{ languages }}
        </template>
      </p>
    </div>

    <ul
      class="signal-stats mt-12 divide-y divide-(--ui-border) overflow-hidden"
      aria-label="Talks and speaking engagements"
    >
      <li
        v-for="talk in talks.slice(0, 2)"
        :key="`${talk.title}-${talk.event}`"
      >
        <TalkRow
          :talk
          heading-level="h2"
          show-summary
        />
      </li>
      <li
        v-for="talk in talks.slice(2)"
        :key="`${talk.title}-${talk.event}`"
        class="signal-reveal"
      >
        <TalkRow
          :talk
          heading-level="h2"
          show-summary
        />
      </li>
    </ul>
  </div>
</template>
