<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = withDefaults(defineProps<{
  talk: TalksCollectionItem
  headingLevel?: 'h2' | 'h3'
  showSummary?: boolean
}>(), {
  headingLevel: 'h3',
  showSummary: false
})

const date = computed(() => {
  if (!props.talk.date) return null
  const value = new Date(props.talk.date)
  return Number.isNaN(value.getTime()) ? null : value
})

const isoDate = computed(() => date.value?.toISOString().slice(0, 10))

const dateParts = computed(() => {
  if (!date.value) return null

  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en', { ...options, timeZone: 'UTC' }).format(date.value!)

  return {
    day: format({ day: '2-digit' }),
    month: format({ month: 'short' }),
    year: format({ year: 'numeric' })
  }
})

const now = useNow()

const isUpcoming = computed(() => {
  if (props.talk.placeholder) return true
  if (!date.value) return false
  const today = new Date(now.value)
  today.setUTCHours(0, 0, 0, 0)
  return date.value.getTime() >= today.getTime()
})

const place = computed(() => {
  const parts = props.talk.location.split(',').map(part => part.trim()).filter(Boolean)
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0]
})
</script>

<template>
  <div class="signal-row grid grid-cols-[3.75rem_minmax(0,1fr)] items-start gap-x-4 gap-y-3 px-4 py-6 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-8 sm:px-6">
    <p class="font-mono leading-none">
      <time
        v-if="dateParts && isoDate"
        :datetime="isoDate"
        class="flex flex-col gap-1.5"
      >
        <span class="text-[0.7rem] tracking-[0.12em] text-muted uppercase">{{ dateParts.month }}</span>
        <span class="text-3xl font-medium tracking-tight text-highlighted sm:text-4xl">{{ dateParts.day }}</span>
        <span class="text-[0.7rem] text-muted">{{ dateParts.year }}</span>
      </time>
      <span
        v-else
        class="text-xs text-muted"
      >{{ talk.dateLabel }}</span>
    </p>

    <div class="min-w-0">
      <p class="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.72rem] text-muted uppercase">
        <span
          v-if="isUpcoming"
          class="inline-flex items-center gap-2.5 rounded-full border border-(--signal-ok)/40 py-0.5 pr-2 pl-2.5 text-(--signal-ok)"
        >
          <span
            class="signal-live !size-1"
            aria-hidden="true"
          />
          Upcoming
        </span>
        <span class="text-toned">{{ talk.format ?? 'Talk' }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ place }}</span>
        <template v-if="talk.language">
          <span aria-hidden="true">·</span>
          <span>{{ talk.language }}</span>
        </template>
      </p>

      <component
        :is="headingLevel"
        class="mt-2 text-lg leading-snug font-semibold tracking-[-0.02em] text-balance text-highlighted sm:text-xl"
      >
        <NuxtLink
          :to="getTalkPath(talk)"
          class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {{ talk.title }}
        </NuxtLink>
      </component>

      <p class="mt-1.5 text-sm text-muted">
        {{ talk.event }}
      </p>

      <p
        v-if="showSummary"
        class="mt-3 max-w-2xl text-sm leading-relaxed text-pretty text-muted"
      >
        {{ talk.summary }}
      </p>
    </div>

    <span
      class="signal-row-arrow hidden size-10 place-items-center self-center rounded-full border border-default text-muted sm:grid"
      aria-hidden="true"
    >
      <UIcon
        name="i-lucide-arrow-up-right"
        class="size-4"
      />
    </span>
  </div>
</template>
