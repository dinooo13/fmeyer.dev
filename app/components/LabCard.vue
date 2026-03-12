<script setup lang="ts">
type Lab = {
  title: string
  description: string
  status: 'wip' | 'prototype' | 'paused'
  image: string
  url?: string
  repoUrl?: string
  tags: string[]
  date: string | Date
  note?: string
}

const props = defineProps<{
  lab: Lab
}>()

const statusMap = {
  wip: {
    label: 'WIP',
    color: 'warning'
  },
  prototype: {
    label: 'Prototype',
    color: 'info'
  },
  paused: {
    label: 'Paused',
    color: 'neutral'
  }
} as const

const formattedDate = computed(() => {
  return new Date(props.lab.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
})
</script>

<template>
  <UCard
    class="h-full overflow-hidden border border-default"
    :ui="{
      body: 'p-0'
    }"
  >
    <NuxtImg
      :src="lab.image"
      :alt="lab.title"
      width="1200"
      height="720"
      class="aspect-[16/10] w-full border-b border-default bg-muted object-cover"
    />

    <div class="flex h-full flex-col gap-4 p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.24em] text-muted">
            {{ formattedDate }}
          </p>
          <h3 class="mt-2 text-lg font-semibold text-highlighted">
            {{ lab.title }}
          </h3>
        </div>

        <UBadge
          :label="statusMap[lab.status].label"
          :color="statusMap[lab.status].color"
          variant="soft"
        />
      </div>

      <p class="text-sm text-muted">
        {{ lab.description }}
      </p>

      <p
        v-if="lab.note"
        class="text-sm text-muted"
      >
        {{ lab.note }}
      </p>

      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in lab.tags"
          :key="tag"
          :label="tag"
          color="neutral"
          variant="outline"
        />
      </div>

      <div class="mt-auto flex flex-wrap items-center gap-3 pt-2">
        <UButton
          v-if="lab.url"
          :to="lab.url"
          target="_blank"
          color="neutral"
          variant="ghost"
          label="Demo"
          class="text-highlighted hover:text-highlighted"
        />
        <UButton
          v-if="lab.repoUrl"
          :to="lab.repoUrl"
          target="_blank"
          color="neutral"
          variant="ghost"
          label="Repository"
          class="text-highlighted hover:text-highlighted"
        />
        <span
          v-if="!lab.url && !lab.repoUrl"
          class="text-sm text-muted"
        >
          Details and links will be added here.
        </span>
      </div>
    </div>
  </UCard>
</template>
