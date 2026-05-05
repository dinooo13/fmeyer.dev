<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <footer
    class="z-10 bg-default py-8"
    role="contentinfo"
  >
    <UContainer class="flex flex-col items-center gap-3">
      <nav aria-label="Social and contact links">
        <ul class="flex items-center gap-2">
          <li
            v-for="link of footer?.links"
            :key="link['aria-label'] || link.to"
          >
            <UButton
              v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
              class="text-highlighted hover:text-highlighted"
            />
          </li>
        </ul>
      </nav>
      <p class="text-xs text-muted">
        {{ footer.credits }}
      </p>
    </UContainer>
  </footer>
</template>
