<script setup lang="ts">
defineProps<{
  id: string
  number: string
  total?: string
  title: string
  description?: string
  link?: {
    label: string
    to?: string
  }
}>()
</script>

<template>
  <div class="mb-12 sm:mb-16">
    <Motion
      class="ed-rule"
      aria-hidden="true"
      :initial="{ transform: 'scaleX(0)' }"
      :while-in-view="{ transform: 'scaleX(1)' }"
      :transition="{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }"
      :in-view-options="{ once: true, margin: '0px 0px -10% 0px' }"
    />
    <div class="grid grid-cols-12 gap-x-6 gap-y-5 pt-5 sm:pt-7">
      <p
        class="ed-kicker col-span-12 pt-2 lg:col-span-2"
        aria-hidden="true"
      >
        <span class="text-primary">{{ number }}</span><template v-if="total">
          <span class="mx-1.5">/</span>{{ total }}
        </template>
      </p>
      <h2
        :id="id"
        class="ed-section-title col-span-12 lg:col-span-6"
      >
        {{ title }}
      </h2>
      <div class="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:items-end lg:pt-3 lg:text-right">
        <p
          v-if="description"
          class="ed-serif max-w-sm text-xl leading-snug text-toned italic sm:text-2xl"
        >
          {{ description }}
        </p>
        <NuxtLink
          v-if="link?.to"
          :to="link.to"
          class="ed-link text-[0.9375rem]"
        >
          {{ link.label }}<span
            class="ed-link-arrow ed-link-arrow-right ml-1.5"
            aria-hidden="true"
          >→</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
