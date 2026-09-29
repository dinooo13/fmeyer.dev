<script setup lang="ts">
const props = withDefaults(defineProps<{
  lab: LabEntry
  tint?: 'blue' | 'amber' | 'violet' | 'emerald' | 'rose'
  featured?: boolean
  headingLevel?: 'h2' | 'h3'
}>(), {
  tint: 'violet',
  featured: false,
  headingLevel: 'h3'
})

const status = computed(() => labStatusMap[props.lab.status])
const statusIcon = computed(() => labStatusIconMap[props.lab.status])
const isoDate = computed(() => new Date(props.lab.date).toISOString().slice(0, 10))
const lead = computed(() => props.lab.description.split(/(?<=\.)\s/)[0] ?? props.lab.description)
const latency = computed(() => props.lab.description.match(/(\d+)\s?ms/)?.[1])
const rest = computed(() => props.lab.description.slice(lead.value.length).trim())
</script>

<template>
  <article
    class="studio-tile studio-lift group flex h-full flex-col overflow-hidden"
    :class="[`studio-tint-${tint}`, featured ? 'lg:flex-row' : '']"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,var(--tint-surface),transparent)]"
      :class="featured ? 'lg:right-[22rem]' : ''"
      aria-hidden="true"
    />
    <div
      class="relative flex flex-1 flex-col gap-5 p-6 sm:p-8"
      :class="featured ? 'lg:p-10' : ''"
    >
      <div class="flex items-start justify-between gap-4">
        <span
          class="studio-chip rounded-2xl"
          :class="featured ? 'size-14' : 'size-12'"
        >
          <UIcon
            :name="lab.icon || 'i-lucide-box'"
            :class="featured ? 'size-7' : 'size-6'"
          />
        </span>
        <span class="studio-tag gap-1.5">
          <UIcon
            :name="statusIcon"
            class="size-3.5"
          />
          {{ status.label }}
        </span>
      </div>

      <div>
        <p class="text-sm font-medium text-muted">
          <time :datetime="isoDate">{{ formatLabDate(lab.date) }}</time>
        </p>
        <component
          :is="headingLevel"
          class="studio-display mt-1 font-bold text-highlighted"
          :class="featured ? 'text-4xl sm:text-5xl' : 'text-3xl'"
        >
          <NuxtLink
            :to="getLabPath(lab)"
            class="studio-stretched"
          >
            {{ lab.title }}
          </NuxtLink>
        </component>
        <p
          class="mt-3 font-medium text-pretty text-toned"
          :class="featured ? 'text-lg sm:text-xl' : 'text-base'"
        >
          {{ lead }}
        </p>
        <p
          v-if="rest"
          class="mt-2 text-sm leading-6 text-pretty text-muted"
          :class="featured ? 'sm:text-base sm:leading-7' : ''"
        >
          {{ rest }}
        </p>
      </div>

      <p
        v-if="lab.note"
        class="relative z-[1] flex items-start gap-2 rounded-2xl bg-(--tint-surface) px-4 py-3 text-sm text-toned"
      >
        <UIcon
          name="i-lucide-info"
          class="studio-ink mt-0.5 size-4 shrink-0"
        />
        <span>{{ lab.note }}</span>
      </p>

      <ul
        class="flex flex-wrap gap-2"
        :aria-label="`${lab.title} tags`"
      >
        <li
          v-for="tag in lab.tags"
          :key="tag"
          class="studio-tag"
        >
          {{ tag }}
        </li>
      </ul>

      <nav
        :aria-label="`${lab.title} links`"
        class="mt-auto pt-1"
      >
        <ul class="flex flex-wrap items-center gap-2">
          <li>
            <NuxtLink
              :to="getLabPath(lab)"
              class="studio-btn studio-btn-solid"
              tabindex="-1"
            >
              View details<span class="sr-only"> for {{ lab.title }}</span>
              <UIcon
                name="i-lucide-arrow-right"
                class="studio-arrow size-4"
              />
            </NuxtLink>
          </li>
          <li v-if="lab.url">
            <a
              :href="lab.url"
              target="_blank"
              rel="noopener noreferrer"
              class="studio-btn studio-btn-soft"
            >
              <UIcon
                name="i-lucide-external-link"
                class="size-4"
              />
              Live demo<span class="sr-only"> of {{ lab.title }}</span>
            </a>
          </li>
          <li v-if="lab.repoUrl">
            <a
              :href="lab.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="studio-btn studio-btn-soft"
            >
              <UIcon
                name="i-simple-icons-github"
                class="size-4"
              />
              Source<span class="sr-only"> for {{ lab.title }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div
      v-if="featured"
      class="relative hidden w-[22rem] shrink-0 items-center justify-center overflow-hidden bg-(--tint-surface) lg:flex"
      aria-hidden="true"
    >
      <div class="absolute -top-20 -right-20 size-80 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-3),transparent)]" />
      <div class="absolute -bottom-24 -left-16 size-72 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-1),transparent)]" />
      <div class="relative flex flex-col items-center gap-6">
        <span class="studio-chip size-36 rotate-[-6deg] rounded-[2.5rem]">
          <UIcon
            :name="lab.icon || 'i-lucide-box'"
            class="size-16"
          />
        </span>
        <span
          v-if="latency"
          class="studio-display studio-ink rounded-full bg-(--studio-card) px-4 py-1.5 text-xl font-extrabold shadow-sm"
        >~{{ latency }}&thinsp;ms</span>
      </div>
    </div>
  </article>
</template>
