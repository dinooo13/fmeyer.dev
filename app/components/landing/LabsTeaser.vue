<script setup lang="ts">
type Lab = {
  title: string;
  description: string;
  status: "wip" | "prototype" | "paused";
  date: string | Date;
  note?: string;
};

type LabsSection = {
  title: string;
  description: string;
  link: {
    label: string;
    to?: string;
    color?: "primary" | "neutral" | "success" | "warning" | "error" | "info";
    variant?: "solid" | "outline" | "subtle" | "soft" | "ghost" | "link";
    target?: "_blank" | "_self";
  };
};

defineProps<{
  section: LabsSection;
  lab?: Lab | null;
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
        <p class="text-sm font-medium text-highlighted">Latest lab</p>
        <h3 v-if="lab" class="mt-2 text-xl font-semibold text-highlighted">
          {{ lab.title }}
        </h3>
        <p class="mt-2 text-sm text-muted">
          {{ lab?.description || section.description }}
        </p>
        <p v-if="lab?.note" class="mt-2 text-sm text-muted">
          {{ lab.note }}
        </p>
      </div>

      <Motion
        :initial="{ opacity: 0, transform: 'translateY(12px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :in-view-options="{ once: true }"
      >
        <UButton v-bind="section.link" color="neutral" />
      </Motion>
    </UCard>
  </UPageSection>
</template>
