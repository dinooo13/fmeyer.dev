<script setup lang="ts">
defineProps<{
  lab: LabEntry
}>()
</script>

<template>
  <UCard
    class="h-full border border-default"
    :ui="{
      body: 'p-5 sm:p-6'
    }"
  >
    <div class="flex h-full flex-col gap-5">
      <div class="flex items-start justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <UIcon
            :name="lab.icon || 'i-lucide-box'"
            class="size-5 shrink-0 text-black dark:text-white"
          />

          <h3 class="min-w-0 text-lg font-semibold text-highlighted">
            {{ lab.title }}
          </h3>
        </div>

        <UBadge
          :label="labStatusMap[lab.status].label"
          :icon="labStatusIconMap[lab.status]"
          :color="labStatusMap[lab.status].color"
          variant="soft"
        />
      </div>

      <div class="space-y-3">
        <p class="text-sm text-muted">
          {{ lab.description }}
        </p>

        <p
          v-if="lab.note"
          class="text-sm text-muted"
        >
          {{ lab.note }}
        </p>
      </div>

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
          :to="getLabPath(lab)"
          icon="i-lucide-arrow-right"
          color="neutral"
          size="sm"
          label="View details"
        />
        <UButton
          v-if="lab.url"
          :to="lab.url"
          target="_blank"
          icon="i-lucide-external-link"
          color="neutral"
          size="sm"
          label="Demo"
        />
        <UButton
          v-if="lab.repoUrl"
          :to="lab.repoUrl"
          target="_blank"
          icon="i-simple-icons-github"
          color="neutral"
          size="sm"
          label="Repository"
        />
      </div>
    </div>
  </UCard>
</template>
