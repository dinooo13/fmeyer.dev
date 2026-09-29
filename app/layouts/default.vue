<script setup lang="ts">
const { design } = useDesign()
</script>

<template>
  <DesignsEditorialShell v-if="design === 'editorial'">
    <slot />
  </DesignsEditorialShell>
  <DesignsSignalShell v-else-if="design === 'signal'">
    <slot />
  </DesignsSignalShell>
  <DesignsStudioShell v-else-if="design === 'studio'">
    <slot />
  </DesignsStudioShell>
  <div v-else>
    <UContainer class="sm:border-x border-default pt-10">
      <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>
