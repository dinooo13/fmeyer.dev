<script setup lang="ts">
import type { LabsCollectionItem } from '@nuxt/content'

const props = withDefaults(defineProps<{
  lab: LabsCollectionItem
  featured?: boolean
  headingLevel?: 'h2' | 'h3'
}>(), {
  featured: false,
  headingLevel: 'h3'
})

const status = computed(() => labStatusMap[props.lab.status])
const isoDate = computed(() => new Date(props.lab.date).toISOString().slice(0, 10))
const shortDate = computed(() => new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
}).format(new Date(props.lab.date)))

const onPointerMove = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  target.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
</script>

<template>
  <article
    class="signal-card flex h-full flex-col p-6 sm:p-8"
    :class="featured ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10' : ''"
    @pointermove="onPointerMove"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-start justify-between gap-4">
        <span
          class="signal-icon-tile"
          :class="featured ? 'size-14' : 'size-12'"
          aria-hidden="true"
        >
          <UIcon
            :name="lab.icon || 'i-lucide-box'"
            :class="featured ? 'size-6' : 'size-5'"
          />
        </span>

        <p class="flex flex-wrap items-center justify-end gap-2 font-mono text-[0.7rem] tracking-wide text-muted uppercase">
          <span class="inline-flex items-center gap-2.5 rounded-full border border-default py-1 pr-2.5 pl-3 text-toned">
            <span
              v-if="lab.status === 'wip'"
              class="signal-live !size-1"
              aria-hidden="true"
            />
            <UIcon
              v-else
              :name="labStatusIconMap[lab.status]"
              class="size-3"
              aria-hidden="true"
            />
            <span><span class="sr-only">Status: </span>{{ status.label }}</span>
          </span>
          <time
            :datetime="isoDate"
            class="rounded-full border border-default px-2.5 py-1"
          >{{ shortDate }}</time>
        </p>
      </div>

      <component
        :is="headingLevel"
        class="mt-6 font-semibold tracking-[-0.03em] text-highlighted"
        :class="featured ? 'text-3xl sm:text-4xl' : 'text-2xl'"
      >
        <!-- Stretched link: the whole card opens the lab; the buttons below stay clickable on top. -->
        <NuxtLink
          :to="getLabPath(lab)"
          class="signal-stretched"
        >{{ lab.title }}</NuxtLink>
      </component>

      <p
        class="mt-3 text-pretty text-muted"
        :class="featured ? 'text-base sm:text-lg' : 'text-[0.95rem] leading-relaxed'"
      >
        {{ lab.description }}
      </p>

      <ul
        class="mt-5 flex flex-wrap gap-1.5"
        :aria-label="`${lab.title} tags`"
      >
        <li
          v-for="tag in lab.tags"
          :key="tag"
          class="rounded-md border border-default bg-(--ui-bg-muted) px-2 py-0.5 font-mono text-[0.72rem] text-toned"
        >
          {{ tag }}
        </li>
      </ul>

      <div class="mt-auto pt-7">
        <nav
          :aria-label="`${lab.title} links`"
          class="relative z-10"
        >
          <ul class="flex flex-wrap items-center gap-2">
            <li>
              <UButton
                :to="getLabPath(lab)"
                color="primary"
                trailing-icon="i-lucide-arrow-right"
                class="rounded-full px-4"
              >
                View project<span class="sr-only"> for {{ lab.title }}</span>
              </UButton>
            </li>
            <li v-if="lab.url">
              <UButton
                :to="lab.url"
                target="_blank"
                rel="noopener noreferrer"
                icon="i-lucide-external-link"
                color="neutral"
                variant="outline"
                class="rounded-full"
              >
                Demo<span class="sr-only"> of {{ lab.title }}</span>
              </UButton>
            </li>
            <li v-if="lab.repoUrl">
              <UButton
                :to="lab.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                icon="i-simple-icons-github"
                color="neutral"
                variant="outline"
                class="rounded-full"
              >
                Source<span class="sr-only"> for {{ lab.title }}</span>
              </UButton>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div
      v-if="featured"
      class="mt-8 rounded-xl border border-default bg-(--ui-bg-muted) p-5 lg:mt-0"
    >
      <p class="signal-eyebrow text-[0.68rem]">
        Next up
      </p>
      <ol class="mt-4 space-y-4">
        <li
          v-for="(step, index) in lab.nextSteps"
          :key="step"
          class="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 text-sm text-toned"
        >
          <span class="font-mono text-xs leading-5 text-primary">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="leading-5">{{ step }}</span>
        </li>
      </ol>
    </div>
  </article>
</template>
