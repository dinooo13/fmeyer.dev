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
      <div class="hero-enter hero-enter-1">
        <NuxtImg
          class="size-18 rounded-full object-cover ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
          :src="avatarSrc"
          :alt="global.picture?.alt ?? 'Profile picture'"
          width="72"
          height="72"
          sizes="72px"
          densities="x1 x2"
          fit="cover"
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </template>

    <template #title>
      <div class="space-y-4 text-center">
        <div class="hero-enter hero-enter-1">
          <p class="text-sm font-medium uppercase tracking-[0.28em] text-muted">
            {{ page.hero.name }}
          </p>
        </div>

        <div class="hero-enter hero-enter-2">
          <h1>{{ page.hero.role }}</h1>
        </div>
      </div>
    </template>

    <template #description>
      <div class="hero-enter hero-enter-3">
        {{ page.hero.intro }}
      </div>
    </template>

    <template #links>
      <nav
        aria-label="Social and contact links"
        class="hero-enter hero-enter-4"
      >
        <ul class="flex flex-wrap items-center justify-center gap-3">
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
    </template>
  </UPageHero>
</template>
