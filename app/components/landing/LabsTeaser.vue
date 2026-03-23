<script setup lang="ts">
type LabsSection = {
  title: string
  description: string
  link: ContentButton
}

defineProps<{
  section: LabsSection
  lab?: LabEntry | null
}>()
</script>

<template>
  <UPageSection
    :title="section.title"
    :description="section.description"
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-3xl text-left text-sm text-muted'
    }"
  >
    <Motion
      class="mb-4"
      :initial="{ opacity: 0, transform: 'translateY(12px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :in-view-options="{ once: true }"
    >
      <UButton
        v-bind="section.link"
        color="neutral"
      />
    </Motion>

    <UCard
      class="border border-default"
      :ui="{
        body: 'p-6 sm:p-8'
      }"
    >
      <div class="max-w-2xl">
        <UBadge
          color="success"
          variant="soft"
          label="Latest lab"
        />
        <h3
          v-if="lab"
          class="mt-2 text-xl font-semibold text-highlighted"
        >
          {{ lab.title }}
        </h3>
        <p class="mt-2 text-sm text-muted">
          {{ lab?.description || section.description }}
        </p>
        <p
          v-if="lab?.note"
          class="mt-2 text-sm text-muted"
        >
          {{ lab.note }}
        </p>

        <div
          v-if="lab"
          class="mt-5"
        >
          <UButton
            :to="getLabPath(lab)"
            color="neutral"
            size="sm"
            icon="i-lucide-arrow-right"
            label="View details"
          />
        </div>
      </div>
    </UCard>
  </UPageSection>
</template>
