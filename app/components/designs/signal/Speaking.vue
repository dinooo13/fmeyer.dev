<script setup lang="ts">
import type { SpeakingCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: SpeakingCollectionItem
  talks: TalksCollectionItem[]
}>()

const events = computed(() => new Set(props.talks.map(talk => talk.event)).size)
const languages = computed(() => [...new Set(props.talks.map(talk => talk.language).filter(Boolean))].join(' & '))

const reveal = {
  initial: { opacity: 0, transform: 'translateY(16px)' },
  whileInView: { opacity: 1, transform: 'translateY(0)' },
  inViewOptions: { once: true, amount: 0.15 }
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-24">
    <DesignsSignalSectionHeader
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
        <DesignsSignalTalkRow
          :talk
          heading-level="h2"
          show-summary
        />
      </li>
      <Motion
        v-for="(talk, index) in talks.slice(2)"
        :key="`${talk.title}-${talk.event}`"
        as="li"
        v-bind="reveal"
        :transition="{ delay: index * 0.06 }"
      >
        <DesignsSignalTalkRow
          :talk
          heading-level="h2"
          show-summary
        />
      </Motion>
    </ul>

    <aside
      v-if="page.invite"
      aria-labelledby="signal-invite-title"
      class="signal-card mt-16 overflow-hidden p-8 sm:p-10"
    >
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div class="max-w-xl">
          <p class="signal-eyebrow">
            Invite
          </p>
          <h2
            id="signal-invite-title"
            class="mt-3 text-2xl font-semibold tracking-[-0.03em] text-highlighted sm:text-3xl"
          >
            {{ page.invite.title }}
          </h2>
          <p class="mt-3 text-muted">
            {{ page.invite.description }}
          </p>
        </div>
        <UButton
          v-if="page.invite.link"
          :to="page.invite.link.to"
          :icon="page.invite.link.icon"
          :label="page.invite.link.label"
          color="primary"
          size="lg"
          class="self-start rounded-full px-5 sm:self-auto"
        />
      </div>
    </aside>
  </div>
</template>
