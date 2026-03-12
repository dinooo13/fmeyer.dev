<script setup lang="ts">
type UpcomingTalk = {
  title: string;
  topic: string;
  description: string;
};

type SpeakingSection = {
  title: string;
  description: string;
  note?: string;
  link: {
    label: string;
    to?: string;
    color?: "primary" | "neutral" | "success" | "warning" | "error" | "info";
    variant?: "solid" | "outline" | "subtle" | "soft" | "ghost" | "link";
    target?: "_blank" | "_self";
  };
};

defineProps<{
  section: SpeakingSection;
  upcoming?: UpcomingTalk | null;
}>();
</script>

<template>
  <UPageSection
    :title="section.title"
    :description="section.description"
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-3xl text-left text-sm text-muted',
    }"
  >
    <UCard
      class="border border-default"
      :ui="{
        body: 'flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8',
      }"
    >
      <div class="max-w-2xl">
        <p v-if="section.note" class="text-sm font-medium text-highlighted">
          {{ section.note }}
        </p>
        <h3 v-if="upcoming" class="mt-2 text-xl font-semibold text-highlighted">
          {{ upcoming.title }}
        </h3>
        <p class="mt-2 text-sm text-muted">
          {{ upcoming?.description || section.description }}
        </p>
        <p v-if="upcoming?.topic" class="mt-2 text-sm text-muted">
          {{ upcoming.topic }}
        </p>
      </div>

      <UButton v-bind="section.link" color="neutral" />
    </UCard>
  </UPageSection>
</template>
