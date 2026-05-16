<script setup lang="ts">
defineProps({
  title: { type: String, required: false, default: 'fmeyer.dev' },
  description: { type: String, required: false, default: '' },
  siteName: { type: String, required: false, default: 'fmeyer.dev' }
})
</script>

<template>
  <div
    class="relative flex h-full w-full flex-col justify-between bg-white p-[72px] text-neutral-900"
  >
    <div
      class="absolute inset-0"
      :style="{
        backgroundImage:
          'radial-gradient(ellipse 90% 90% at 100% 0%, rgba(37, 99, 235, 0.18) 0%, transparent 60%), radial-gradient(ellipse 90% 90% at 0% 100%, rgba(37, 99, 235, 0.12) 0%, transparent 55%)'
      }"
    />

    <div class="relative flex items-center gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-[24px] font-bold text-white">
        F
      </div>
      <span class="text-[26px] font-semibold tracking-tight text-neutral-900">
        {{ siteName }}
      </span>
    </div>

    <div class="relative flex flex-col gap-6">
      <h1
        class="m-0 text-[64px] font-bold leading-[1.1] tracking-tight text-neutral-900"
        style="text-wrap: balance; line-clamp: 3; text-overflow: ellipsis;"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="m-0 text-[28px] leading-[1.4] text-neutral-600"
        style="line-clamp: 3; text-overflow: ellipsis;"
      >
        {{ description }}
      </p>
    </div>

    <div class="relative flex items-center justify-between text-[20px] text-neutral-500">
      <span>Fabian Meyer · Chapter Lead Vue at eventim Tech</span>
      <span class="text-blue-600">fmeyer.dev</span>
    </div>
  </div>
</template>
