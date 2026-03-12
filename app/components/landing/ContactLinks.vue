<script setup lang="ts">
const { footer, global } = useAppConfig()

const links = computed(() => {
  const footerLinks = footer?.links || []

  return [{
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: footerLinks.find(link => link['aria-label']?.includes('GitHub'))?.to,
    target: '_blank' as const
  }, {
    label: 'LinkedIn',
    icon: 'i-simple-icons-linkedin',
    to: footerLinks.find(link => link['aria-label']?.includes('LinkedIn'))?.to,
    target: '_blank' as const
  }, {
    label: 'Email',
    icon: 'i-lucide-mail',
    to: `mailto:${global.email}`
  }].filter(link => Boolean(link.to))
})
</script>

<template>
  <UPageSection
    title="Contact"
    description="GitHub, LinkedIn, and email are the best places to reach me."
    :ui="{
      title: 'text-left text-2xl font-medium',
      description: 'max-w-xl text-left text-sm text-muted'
    }"
  >
    <div class="flex flex-wrap items-center gap-3">
      <UButton
        v-for="link in links"
        :key="`${link.label}-${link.to}`"
        color="neutral"
        variant="subtle"
        v-bind="link"
      />
    </div>
  </UPageSection>
</template>
