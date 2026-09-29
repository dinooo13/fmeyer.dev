<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = withDefaults(defineProps<{
  lab: LabsCollectionItem
  index: number
  headingLevel?: 'h2' | 'h3'
  kicker?: string
}>(), {
  headingLevel: 'h2',
  kicker: undefined
})

const splitSentence = (text: string) => {
  const match = text.match(/^.+?[.!?](?=\s|$)/)
  const lead = match ? match[0] : text

  return { lead, rest: text.slice(lead.length).trim() }
}

const copy = computed(() => splitSentence(props.lab.description))
const number = computed(() => String(props.index + 1).padStart(2, '0'))
const isoDate = computed(() => new Date(props.lab.date).toISOString().slice(0, 10))
</script>

<template>
  <article class="ed-row grid grid-cols-12 gap-x-6 gap-y-6 border-t border-accented pt-8 pb-14 sm:pt-10 sm:pb-20">
    <div class="col-span-12 flex items-baseline justify-between gap-4 lg:col-span-2 lg:flex-col lg:justify-start lg:gap-3">
      <p class="ed-kicker">
        <span class="text-primary">{{ number }}</span>
        <span
          v-if="kicker"
          class="ml-2"
        >{{ kicker }}</span>
      </p>
      <p class="ed-kicker">
        {{ labStatusMap[lab.status].label }}
        <span
          class="lg:hidden"
          aria-hidden="true"
        > · </span>
        <time
          :datetime="isoDate"
          class="whitespace-nowrap lg:mt-1 lg:block"
        >{{ formatLabDate(lab.date) }}</time>
      </p>
    </div>

    <div class="col-span-12 lg:col-span-5">
      <div>
        <component
          :is="headingLevel"
          class="ed-serif text-[clamp(3.25rem,8vw,6rem)] leading-[0.9] tracking-[-0.03em] text-highlighted"
        >
          <NuxtLink
            :to="getLabPath(lab)"
            class="ed-row-link ed-row-title"
          ><span class="ed-row-shift inline-block">{{ lab.title }}</span></NuxtLink>
        </component>
        <p class="ed-serif mt-6 max-w-xl text-[1.625rem] leading-[1.2] text-toned italic sm:text-[1.875rem]">
          {{ copy.lead }}
        </p>
      </div>
    </div>

    <div class="col-span-12 flex flex-col gap-6 lg:col-span-5 lg:pt-3">
      <p
        v-if="copy.rest"
        class="text-base leading-7 text-toned"
      >
        {{ copy.rest }}
      </p>
      <p
        v-if="lab.note"
        class="border-l border-primary pl-4 text-sm leading-6 text-muted"
      >
        {{ lab.note }}
      </p>

      <ul
        class="ed-mono flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-muted"
        :aria-label="`${lab.title} tags`"
      >
        <li
          v-for="tag in lab.tags"
          :key="tag"
        >
          {{ tag }}
        </li>
      </ul>

      <nav
        class="ed-row-above"
        :aria-label="`${lab.title} links`"
      >
        <ul class="flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0 text-[0.9375rem]">
          <li>
            <NuxtLink
              :to="getLabPath(lab)"
              class="ed-link"
            >
              View details<span class="sr-only"> for {{ lab.title }}</span><span
                class="ed-link-arrow ed-link-arrow-right ml-1.5"
                aria-hidden="true"
              >→</span>
            </NuxtLink>
          </li>
          <li v-if="lab.url">
            <NuxtLink
              :to="lab.url"
              target="_blank"
              rel="noopener noreferrer"
              class="ed-link"
            >
              Demo<span class="sr-only"> of {{ lab.title }}</span><span
                class="ed-link-arrow ml-1"
                aria-hidden="true"
              >↗</span>
            </NuxtLink>
          </li>
          <li v-if="lab.repoUrl">
            <NuxtLink
              :to="lab.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="ed-link"
            >
              Repository<span class="sr-only"> for {{ lab.title }}</span><span
                class="ed-link-arrow ml-1"
                aria-hidden="true"
              >↗</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </article>
</template>
