<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="signal-shell relative isolate min-h-screen overflow-x-clip">
    <div
      class="signal-backdrop"
      :class="isHome ? '' : 'signal-backdrop--compact'"
      aria-hidden="true"
    />
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
