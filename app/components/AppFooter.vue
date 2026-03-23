<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <footer class="z-10 bg-default py-8">
    <UContainer class="flex flex-col items-center gap-3">
      <div class="flex items-center gap-2">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
          class="text-highlighted hover:text-highlighted"
        />
      </div>
      <p class="text-xs text-muted">
        {{ footer.credits }}
      </p>
    </UContainer>
  </footer>
</template>
