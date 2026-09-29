<script setup lang="ts">
import type { TalksCollectionItem } from '@nuxt/content'

const props = withDefaults(defineProps<{
  talk: TalksCollectionItem
  variant?: 'row' | 'spread'
  headingLevel?: 'h2' | 'h3'
}>(), {
  variant: 'row',
  headingLevel: 'h3'
})

const date = computed(() => {
  if (!props.talk.date) return null
  const value = new Date(props.talk.date)

  return Number.isNaN(value.getTime()) ? null : value
})

const isoDate = computed(() => date.value?.toISOString().slice(0, 10))
const day = computed(() => date.value ? new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'UTC' }).format(date.value) : null)
const monthYear = computed(() => date.value ? new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date.value) : props.talk.dateLabel)
const shortDate = computed(() => day.value ? `${day.value} ${monthYear.value}` : props.talk.dateLabel)

const isUpcoming = computed(() => {
  if (props.talk.placeholder) return true
  if (!date.value) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date.value.getTime() >= today.getTime()
})

const format = computed(() => props.talk.format ?? 'Talk')

const subtitle = computed(() => {
  const organizerTitle = props.talk.organizerTitle?.trim()
  if (!organizerTitle) return null
  const prefix = `${props.talk.title.trim()}:`

  return organizerTitle.startsWith(prefix)
    ? organizerTitle.slice(prefix.length).trim()
    : organizerTitle
})
</script>

<template>
  <article
    v-if="variant === 'row'"
    class="ed-row grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-accented py-8 sm:py-9"
  >
    <p class="ed-kicker col-span-7 lg:col-span-2">
      <time
        v-if="isoDate"
        :datetime="isoDate"
      >{{ shortDate }}</time>
      <span v-else>{{ talk.dateLabel }}</span>
    </p>
    <p class="ed-kicker col-span-5 text-right lg:order-last lg:col-span-3">
      <span
        v-if="isUpcoming"
        class="text-primary"
      >Upcoming · </span>
      {{ format }}
    </p>
    <div class="col-span-11 lg:col-span-6">
      <component
        :is="headingLevel"
        class="ed-serif text-[clamp(1.875rem,3.4vw,2.625rem)] leading-[1.02] tracking-[-0.015em] text-highlighted"
      >
        <NuxtLink
          :to="getTalkPath(talk)"
          class="ed-row-link ed-row-title"
        ><span class="ed-row-shift inline-block">{{ talk.title }}</span></NuxtLink>
      </component>
      <p class="mt-2 text-[0.9375rem] text-muted">
        {{ talk.event }}
      </p>
    </div>
    <span
      class="ed-row-arrow col-span-1 justify-self-end text-2xl leading-none text-highlighted lg:order-last"
      aria-hidden="true"
    >→</span>
  </article>

  <article
    v-else
    class="ed-row grid grid-cols-12 gap-x-6 gap-y-6 border-t border-accented pt-8 pb-14 sm:pt-10 sm:pb-16"
  >
    <div class="col-span-12 flex items-baseline gap-4 lg:col-span-2 lg:flex-col lg:gap-2">
      <p
        v-if="day"
        class="ed-serif text-[4.5rem] leading-[0.8] text-highlighted lg:text-[6rem]"
        aria-hidden="true"
      >
        {{ day }}
      </p>
      <p class="ed-kicker">
        <time
          v-if="isoDate"
          :datetime="isoDate"
        ><span class="sr-only">{{ day }} </span>{{ monthYear }}</time>
        <span v-else>{{ talk.dateLabel }}</span>
        <span
          v-if="isUpcoming"
          class="mt-1 block text-primary"
        >Upcoming</span>
      </p>
    </div>

    <div class="col-span-12 lg:col-span-6">
      <p class="ed-kicker">
        {{ format }}<template v-if="talk.language">
          <span aria-hidden="true"> · </span>{{ talk.language }}
        </template>
      </p>
      <component
        :is="headingLevel"
        class="ed-serif mt-4 text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1] tracking-[-0.02em] text-balance text-highlighted"
      >
        <NuxtLink
          :to="getTalkPath(talk)"
          class="ed-row-link ed-row-title"
        >{{ talk.title }}</NuxtLink>
      </component>
      <p
        v-if="subtitle"
        class="ed-serif mt-3 text-2xl leading-tight text-toned italic"
      >
        {{ subtitle }}
      </p>
      <p class="mt-5 max-w-2xl text-base leading-7 text-toned">
        {{ talk.summary }}
      </p>
    </div>

    <div class="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:pt-8">
      <dl class="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-default pt-4 text-sm">
        <dt class="ed-kicker pt-0.5">
          Event
        </dt>
        <dd class="text-highlighted">
          {{ talk.event }}
        </dd>
        <dt class="ed-kicker pt-0.5">
          Location
        </dt>
        <dd class="text-toned">
          {{ talk.location }}
        </dd>
        <template v-if="talk.duration">
          <dt class="ed-kicker pt-0.5">
            Duration
          </dt>
          <dd class="text-toned">
            {{ talk.duration }}
          </dd>
        </template>
        <dt class="ed-kicker pt-0.5">
          Topic
        </dt>
        <dd class="text-toned">
          {{ talk.topic }}
        </dd>
      </dl>
      <p class="ed-row-above text-[0.9375rem]">
        <NuxtLink
          :to="getTalkPath(talk)"
          class="ed-link"
        >
          View details<span class="sr-only"> for {{ talk.title }}</span><span
            class="ed-link-arrow ed-link-arrow-right ml-1.5"
            aria-hidden="true"
          >→</span>
        </NuxtLink>
      </p>
    </div>
  </article>
</template>
