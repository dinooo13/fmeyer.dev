<script setup lang="ts">
type HeroPage = {
  hero: {
    name: string
    role: string
    intro: string
  }
}

const { footer, global } = useAppConfig()

defineProps<{
  page: HeroPage
}>()

const socialLinks = computed(() => {
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
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'mx-auto max-w-4xl text-pretty',
      description: 'mx-auto max-w-2xl text-pretty',
      links: 'mt-6 justify-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <UColorModeAvatar
          class="size-18 ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
          :light="global.picture?.light!"
          :dark="global.picture?.dark!"
          :alt="global.picture?.alt!"
        />
      </Motion>
    </template>

    <template #title>
      <div class="space-y-4 text-center">
        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.1
          }"
        >
          <p class="text-sm font-medium uppercase tracking-[0.28em] text-muted">
            {{ page.hero.name }}
          </p>
        </Motion>

        <Motion
          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.2
          }"
        >
          {{ page.hero.role }}
        </Motion>
      </div>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.35
        }"
      >
        {{ page.hero.intro }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div class="flex flex-wrap items-center justify-center gap-3">
          <UButton
            v-for="link in socialLinks"
            :key="`${link.label}-${link.to}`"
            color="neutral"
            variant="subtle"
            v-bind="link"
          />
        </div>
      </Motion>
    </template>
  </UPageHero>
</template>
