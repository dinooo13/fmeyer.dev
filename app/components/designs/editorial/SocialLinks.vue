<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  listClass?: string
}>(), {
  label: 'Social and contact links',
  listClass: 'flex flex-wrap items-center gap-x-6 gap-y-2'
})

const { footer } = useAppConfig()

const links = computed(() => (footer?.links ?? []).map((link) => {
  const to = String(link.to ?? '')
  const external = /^https?:\/\//.test(to)
  let text = link['aria-label'] ?? to

  if (to.startsWith('mailto:')) text = 'Email'
  else if (to.includes('github.com')) text = 'GitHub'
  else if (to.includes('linkedin.com')) text = 'LinkedIn'

  return {
    to,
    text,
    external,
    ariaLabel: link['aria-label']
  }
}))
</script>

<template>
  <nav :aria-label="label">
    <ul
      class="list-none p-0"
      :class="listClass"
    >
      <li
        v-for="link in links"
        :key="link.to"
      >
        <NuxtLink
          :to="link.to"
          :external="true"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          :aria-label="link.ariaLabel"
          class="ed-link text-[0.9375rem]"
        >
          {{ link.text }}<span
            class="ed-link-arrow ml-1 text-[0.8em]"
            aria-hidden="true"
          >{{ link.external ? '↗' : '→' }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
