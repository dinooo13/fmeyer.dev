<script setup lang="ts">
type SpeakingSection = {
  title: string
  description: string
  note?: string
  link: ContentButton
}

defineProps<{
  section: SpeakingSection
  talk?: TalkEntry | null
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

    <div class="space-y-4">
      <TalksTalkPreviewCard
        v-if="talk"
        :talk="talk"
        variant="featured"
        :show-summary="true"
        :primary-action="{
          label: 'View details',
          to: getTalkPath(talk)
        }"
      />

      <UCard
        v-else
        class="border border-default"
        :ui="{
          body: 'p-6 sm:p-8'
        }"
      >
        <p class="text-sm text-muted">
          {{ section.description }}
        </p>
      </UCard>
    </div>
  </UPageSection>
</template>
