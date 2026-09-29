<script setup lang="ts">
withDefaults(defineProps<{
  index?: string
  eyebrow: string
  title: string
  description?: string
  headingId?: string
  link?: ContentButton
  as?: 'h1' | 'h2'
}>(), {
  as: 'h2'
})
</script>

<template>
  <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div class="max-w-2xl">
      <p class="signal-eyebrow flex items-center gap-3">
        <span
          v-if="index"
          class="text-primary"
        >{{ index }}</span>
        <span>{{ eyebrow }}</span>
        <span
          class="signal-rule hidden w-16 sm:block"
          aria-hidden="true"
        />
      </p>
      <component
        :is="as"
        :id="headingId"
        class="mt-4 font-semibold tracking-[-0.035em] text-highlighted"
        :class="as === 'h1' ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-4xl'"
      >
        {{ title }}
      </component>
      <p
        v-if="description"
        class="mt-4 text-base text-pretty text-muted sm:text-lg"
      >
        {{ description }}
      </p>
    </div>

    <UButton
      v-if="link"
      :to="link.to"
      :target="link.target"
      :icon="link.icon"
      :label="link.label"
      trailing-icon="i-lucide-arrow-right"
      color="neutral"
      variant="outline"
      class="self-start rounded-full sm:self-auto"
    />
  </div>
</template>
