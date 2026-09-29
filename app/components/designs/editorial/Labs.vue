<script setup lang="ts">
import type { LabsCollectionItem, PagesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: PagesCollectionItem
  labs: LabsCollectionItem[]
}>()

const tagCount = computed(() => new Set(props.labs.flatMap(lab => lab.tags)).size)
</script>

<template>
  <div class="ed-page">
    <UContainer>
      <header class="pt-12 sm:pt-16 lg:pt-20">
        <p class="ed-kicker ed-enter-rise-sm">
          <span class="text-primary">Index</span>
          <span aria-hidden="true"> · </span>{{ labs.length }} projects
          <span aria-hidden="true"> · </span>{{ tagCount }} tags
        </p>
        <div class="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <h1 class="ed-page-title ed-enter-rise ed-delay-1 col-span-12 -ml-[0.04em] lg:col-span-7">
            {{ page.title }}<span
              class="text-primary"
              aria-hidden="true"
            >.</span>
          </h1>
          <div class="ed-enter-rise-sm ed-delay-2 col-span-12 lg:col-span-5 lg:pb-4">
            <p class="ed-serif text-[1.75rem] leading-[1.2] text-toned italic sm:text-[2rem]">
              {{ page.description }}
            </p>
            <nav
              v-if="page.links?.length"
              aria-label="Labs links"
              class="mt-6"
            >
              <ul class="flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                <li
                  v-for="link in page.links"
                  :key="`${link.label}-${link.to}`"
                >
                  <NuxtLink
                    :to="link.to"
                    :target="link.target"
                    :rel="link.target === '_blank' ? 'noopener noreferrer' : undefined"
                    class="ed-link text-[0.9375rem]"
                  >
                    <span v-if="link.to?.includes('github.com')">GitHub · </span>{{ link.label }}<span
                      class="ed-link-arrow ml-1"
                      aria-hidden="true"
                    >↗</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div
          class="ed-rule ed-enter-draw ed-delay-2 mt-12 sm:mt-16"
          aria-hidden="true"
        />
      </header>

      <ul
        class="mt-6 list-none p-0"
        aria-label="Lab projects"
      >
        <Motion
          v-for="(lab, index) in labs"
          :key="lab.title"
          as="li"
          :class="index === 0 ? '[&>article]:border-t-0' : ''"
          :initial="{ transform: 'translateY(20px)' }"
          :while-in-view="{ transform: 'translateY(0)' }"
          :transition="{ delay: index * 0.06 }"
          :in-view-options="{ once: true }"
        >
          <DesignsEditorialLabSpread
            :lab="lab"
            :index="index"
          />
        </Motion>
      </ul>
    </UContainer>
  </div>
</template>
