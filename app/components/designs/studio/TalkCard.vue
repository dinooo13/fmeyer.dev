<script setup lang="ts">
const props = withDefaults(defineProps<{
  talk: TalkEntry
  tint?: 'blue' | 'amber' | 'violet' | 'emerald' | 'rose'
  variant?: 'compact' | 'wide'
  headingLevel?: 'h2' | 'h3'
  highlight?: boolean
}>(), {
  tint: 'emerald',
  variant: 'compact',
  headingLevel: 'h3',
  highlight: false
})

const meta = computed(() => {
  return [props.talk.format, props.talk.language, props.talk.location === 'Online' ? 'Online' : props.talk.location.split(',').at(-2)?.trim()]
    .filter((value): value is string => Boolean(value))
})
</script>

<template>
  <article
    class="studio-tile studio-lift group flex h-full flex-row gap-4 p-5 sm:gap-6 sm:p-7"
    :class="[`studio-tint-${tint}`, highlight ? 'studio-tinted' : '']"
  >
    <DesignsStudioDateBlock
      :date="talk.date"
      :label="talk.dateLabel"
      :size="variant === 'wide' ? 'lg' : 'md'"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <p class="studio-ink text-sm font-semibold">
        {{ talk.event }}
      </p>
      <component
        :is="headingLevel"
        class="studio-display mt-1.5 font-bold text-balance text-highlighted"
        :class="variant === 'wide' ? 'text-xl sm:text-3xl' : 'text-lg sm:text-2xl'"
      >
        <NuxtLink
          :to="getTalkPath(talk)"
          class="studio-stretched"
        >
          {{ talk.title }}
        </NuxtLink>
      </component>
      <p
        class="mt-3 text-sm leading-6 text-pretty text-muted"
        :class="variant === 'wide' ? 'sm:text-base sm:leading-7' : 'line-clamp-3'"
      >
        {{ talk.summary }}
      </p>

      <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <ul
          class="flex flex-wrap gap-2"
          :aria-label="`${talk.title} details`"
        >
          <li
            v-for="item in meta"
            :key="item"
            class="studio-tag"
          >
            {{ item }}
          </li>
        </ul>
        <span
          class="studio-ink inline-flex items-center gap-1.5 text-sm font-semibold"
          aria-hidden="true"
        >
          Details
          <UIcon
            name="i-lucide-arrow-right"
            class="studio-arrow size-4"
          />
        </span>
      </div>
    </div>
  </article>
</template>
