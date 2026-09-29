<script setup lang="ts">
import type { LabsCollectionItem, PagesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: PagesCollectionItem
  labs: LabsCollectionItem[]
}>()

const tints = ['violet', 'emerald', 'amber', 'blue'] as const

const featured = computed(() => props.labs[0])
const others = computed(() => props.labs.slice(1))
</script>

<template>
  <div class="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
    <header class="studio-tile studio-glass studio-enter studio-tint-violet relative overflow-hidden p-7 sm:p-10 lg:p-12">
      <div
        class="pointer-events-none absolute -top-24 -right-10 size-80 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-3),transparent)]"
        aria-hidden="true"
      />
      <div class="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="studio-pill">
            <UIcon
              name="i-lucide-flask-conical"
              class="size-3.5"
            />
            {{ labs.length }} projects in the lab
          </p>
          <h1 class="studio-display mt-4 text-6xl leading-none font-extrabold text-highlighted sm:text-7xl">
            {{ page.title }}
          </h1>
          <p class="mt-4 text-lg leading-8 text-pretty text-toned">
            {{ page.description }}
          </p>
        </div>

        <div class="flex flex-col gap-4 lg:items-end">
          <nav
            v-if="page.links?.length"
            aria-label="Labs links"
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
                    name="i-lucide-arrow-up-right"
                    class="studio-arrow studio-arrow-diagonal size-4"
                  />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <ul
      class="mt-4 grid gap-4 md:grid-cols-2"
      aria-label="Lab projects"
    >
      <li
        v-if="featured"
        class="studio-enter md:col-span-2"
        style="--studio-i: 1"
      >
        <DesignsStudioLabCard
          :lab="featured"
          :tint="tints[0]"
          featured
          heading-level="h2"
        />
      </li>
      <Motion
        v-for="(lab, index) in others"
        :key="lab.title"
        as="li"
        :initial="{ opacity: 0, transform: 'translateY(16px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: index * 0.08, duration: 0.5 }"
        :in-view-options="{ once: true }"
      >
        <DesignsStudioLabCard
          :lab="lab"
          :tint="tints[(index + 1) % tints.length]"
          heading-level="h2"
        />
      </Motion>
    </ul>
  </div>
</template>
