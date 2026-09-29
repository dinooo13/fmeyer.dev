<script setup lang="ts">
import type { SpeakingCollectionItem, TalksCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: SpeakingCollectionItem
  talks: TalksCollectionItem[]
}>()

const tints = ['emerald', 'blue', 'amber', 'violet'] as const

const isUpcoming = (talk: TalksCollectionItem) => {
  const timestamp = getTimestamp(talk.date)
  return talk.placeholder || (timestamp !== null && timestamp >= Date.now() - 86_400_000)
}

const upcoming = computed(() => props.talks.filter(isUpcoming).reverse())
const past = computed(() => props.talks.filter(talk => !isUpcoming(talk)))

const groups = computed(() => [
  { id: 'studio-upcoming', title: 'Coming up', icon: 'i-lucide-calendar-clock', items: upcoming.value },
  { id: 'studio-past', title: 'Past sessions', icon: 'i-lucide-history', items: past.value }
].filter(group => group.items.length))

const events = computed(() => new Set(props.talks.map(talk => talk.event)).size)
</script>

<template>
  <div class="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
    <header class="studio-tile studio-glass studio-enter studio-tint-emerald relative overflow-hidden p-7 sm:p-10 lg:p-12">
      <div
        class="pointer-events-none absolute -top-24 -right-10 size-80 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-4),transparent)]"
        aria-hidden="true"
      />
      <div class="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="studio-pill">
            <UIcon
              name="i-lucide-mic-vocal"
              class="size-3.5"
            />
            {{ talks.length }} sessions · {{ events }} events
          </p>
          <h1 class="studio-display mt-4 text-6xl leading-none font-extrabold text-highlighted sm:text-7xl">
            {{ page.title }}
          </h1>
          <p class="mt-4 text-lg leading-8 text-pretty text-toned">
            {{ page.description }}
          </p>
        </div>

        <nav
          v-if="page.links?.length"
          aria-label="Speaking links"
        >
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="link in page.links"
              :key="`${link.label}-${link.to}`"
            >
              <a
                :href="link.to"
                :target="link.target"
                :rel="link.target === '_blank' ? 'noopener noreferrer' : undefined"
                class="studio-btn studio-btn-solid group"
              >
                <UIcon
                  v-if="link.icon"
                  :name="link.icon"
                  class="size-4"
                />
                {{ link.label }}
                <UIcon
                  name="i-lucide-arrow-right"
                  class="studio-arrow size-4"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <section
      v-for="(group, groupIndex) in groups"
      :key="group.id"
      :aria-labelledby="group.id"
      class="mt-14 sm:mt-16"
    >
      <h2
        :id="group.id"
        class="studio-display flex items-center gap-2.5 text-2xl font-bold text-highlighted"
      >
        <UIcon
          :name="group.icon"
          class="size-5 text-muted"
        />
        {{ group.title }}
        <span class="studio-tag ml-1">{{ group.items.length }}</span>
      </h2>
      <ul
        class="mt-5 grid gap-4"
        :aria-label="group.title"
      >
        <Motion
          v-for="(talk, index) in group.items"
          :key="`${talk.title}-${talk.event}`"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(16px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.06, duration: 0.5 }"
          :in-view-options="{ once: true }"
        >
          <DesignsStudioTalkCard
            :talk="talk"
            :tint="tints[(index + groupIndex) % tints.length]"
            variant="wide"
            :highlight="group.id === 'studio-upcoming'"
          />
        </Motion>
      </ul>
    </section>
  </div>
</template>
