<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  lab: LabsCollectionItem
  index: number
}>()

const lead = computed(() => {
  const match = props.lab.description.match(/^.+?[.!?](?=\s|$)/)

  return match ? match[0] : props.lab.description
})

const number = computed(() => String(props.index + 1).padStart(2, '0'))
const date = computed(() => new Date(props.lab.date))
const monthLabel = computed(() => new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date.value))
</script>

<template>
  <article class="ed-row grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-accented py-8 sm:py-10">
    <p class="ed-kicker col-span-6 lg:col-span-1">
      <span class="text-primary">{{ number }}</span>
    </p>
    <p class="ed-kicker col-span-6 text-right lg:order-last lg:col-span-2">
      {{ labStatusMap[lab.status].label }}
      <span aria-hidden="true"> · </span>
      <time :datetime="date.toISOString().slice(0, 10)">{{ monthLabel }}</time>
    </p>
    <h3 class="ed-serif col-span-12 text-[clamp(2.5rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-highlighted lg:col-span-4">
      <NuxtLink
        :to="getLabPath(lab)"
        class="ed-row-link ed-row-title"
      ><span class="ed-row-shift inline-block">{{ lab.title }}</span></NuxtLink>
    </h3>
    <p class="col-span-11 text-base leading-7 text-toned lg:col-span-4">
      {{ lead }}
    </p>
    <span
      class="ed-row-arrow col-span-1 justify-self-end text-2xl leading-none text-highlighted lg:order-last lg:col-span-1"
      aria-hidden="true"
    >→</span>
  </article>
</template>
