<script setup lang="ts">
import type { LabsCollectionItem, PagesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: PagesCollectionItem
  labs: LabsCollectionItem[]
}>()

const featuredLab = computed(() => props.labs[0])
const otherLabs = computed(() => props.labs.slice(1))

const openSource = computed(() => props.labs.filter(lab => lab.repoUrl).length)
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-24">
    <SectionHeader
      as="h1"
      eyebrow="Labs"
      index="~/"
      :title="page.title"
      :description="page.description"
    />

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <nav
        v-if="page.links?.length"
        aria-label="Labs links"
      >
        <ul class="flex flex-wrap items-center gap-2">
          <li
            v-for="link in page.links"
            :key="`${link.label}-${link.to}`"
          >
            <UButton
              :to="link.to"
              :target="link.target"
              :icon="link.icon"
              :label="link.label"
              color="neutral"
              variant="outline"
              class="rounded-full bg-(--signal-glass) backdrop-blur"
            />
          </li>
        </ul>
      </nav>
      <p class="font-mono text-xs text-muted">
        {{ labs.length }} projects · {{ openSource }} open source
      </p>
    </div>

    <ul
      class="mt-12 grid gap-5 md:grid-cols-2"
      aria-label="Lab projects"
    >
      <li
        v-if="featuredLab"
        class="md:col-span-2"
      >
        <LabCard
          :lab="featuredLab"
          featured
          heading-level="h2"
        />
      </li>
      <li
        v-for="lab in otherLabs"
        :key="lab.title"
        class="signal-reveal"
      >
        <LabCard
          :lab
          heading-level="h2"
        />
      </li>
    </ul>
  </div>
</template>
