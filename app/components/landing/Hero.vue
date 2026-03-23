<script setup lang="ts">
type HeroPage = {
  hero: {
    name: string
    role: string
    intro: string
  }
}

const { footer, global } = useAppConfig()
const colorMode = useColorMode()

const avatarSrc = computed(() => colorMode.value === 'dark'
  ? global.picture?.dark
  : global.picture?.light
)

const heroInitial = { scale: 1.1, opacity: 0, filter: 'blur(20px)' }
const heroAnimate = { scale: 1, opacity: 1, filter: 'blur(0px)' }
const heroTransition = (delay: number) => ({ duration: 0.6, delay })

defineProps<{
  page: HeroPage
}>()
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
        :initial="heroInitial"
        :animate="heroAnimate"
        :transition="heroTransition(0.1)"
      >
        <NuxtImg
          class="size-18 rounded-full object-cover ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
          :src="avatarSrc"
          :alt="global.picture?.alt ?? 'Profile picture'"
          width="72"
          height="72"
          sizes="72px"
          densities="x1 x2 x3"
          fit="cover"
          loading="eager"
        />
      </Motion>
    </template>

    <template #title>
      <div class="space-y-4 text-center">
        <Motion
          :initial="heroInitial"
          :animate="heroAnimate"
          :transition="heroTransition(0.1)"
        >
          <p class="text-sm font-medium uppercase tracking-[0.28em] text-muted">
            {{ page.hero.name }}
          </p>
        </Motion>

        <Motion
          :initial="heroInitial"
          :animate="heroAnimate"
          :transition="heroTransition(0.2)"
        >
          {{ page.hero.role }}
        </Motion>
      </div>
    </template>

    <template #description>
      <Motion
        :initial="heroInitial"
        :animate="heroAnimate"
        :transition="heroTransition(0.35)"
      >
        {{ page.hero.intro }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="heroInitial"
        :animate="heroAnimate"
        :transition="heroTransition(0.5)"
      >
        <div class="flex flex-wrap items-center justify-center gap-3">
          <UButton
            v-for="link of footer?.links"
            :key="link['aria-label'] || link.to"
            v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
            class="text-highlighted hover:text-highlighted"
          />
        </div>
      </Motion>
    </template>
  </UPageHero>
</template>
