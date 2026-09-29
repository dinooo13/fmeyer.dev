<script setup lang="ts">
const route = useRoute()
const { footer, global } = useAppConfig()

const isActive = (to: unknown) => {
  const path = String(to ?? '')

  if (path === '/') return route.path === '/'

  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <MotionConfig reduced-motion="user">
    <div class="ed-shell min-h-screen pb-28">
      <header
        role="banner"
        class="ed-masthead sticky top-0 z-30"
      >
        <UContainer class="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <NuxtLink
            to="/"
            class="ed-serif shrink-0 text-[1.4375rem] leading-none text-highlighted min-[380px]:text-[1.625rem] sm:text-[1.875rem]"
          >
            fmeyer<span class="text-primary">.</span>dev
          </NuxtLink>

          <div class="flex items-center gap-1 min-[380px]:gap-2 sm:gap-6">
            <nav aria-label="Primary">
              <ul class="flex list-none items-center gap-3 p-0 min-[380px]:gap-4 sm:gap-8">
                <li
                  v-for="link in navLinks"
                  :key="String(link.to)"
                >
                  <NuxtLink
                    :to="link.to"
                    class="ed-nav-link"
                    :aria-current="isActive(link.to) ? 'page' : undefined"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </nav>
            <ColorModeButton />
          </div>
        </UContainer>
        <div
          class="ed-rule ed-enter-draw"
          aria-hidden="true"
        />
      </header>

      <slot />

      <footer
        role="contentinfo"
        class="mt-32 sm:mt-44"
      >
        <UContainer>
          <div
            class="ed-rule"
            aria-hidden="true"
          />
          <div class="grid gap-12 pt-10 pb-12 lg:grid-cols-12 lg:gap-6 lg:pt-14">
            <div class="lg:col-span-8">
              <p class="ed-kicker">
                Get in touch
              </p>
              <a
                :href="`mailto:${global.email}`"
                class="ed-serif ed-link mt-5 inline-block text-[clamp(2.5rem,9vw,5.5rem)] leading-[0.95] italic"
              >{{ global.email }}</a>
            </div>

            <div class="lg:col-span-4 lg:pt-1">
              <p class="ed-kicker">
                Elsewhere
              </p>
              <DesignsEditorialSocialLinks
                class="mt-5"
                list-class="flex flex-col gap-3"
              />
            </div>
          </div>

          <div class="flex flex-col gap-2 border-t border-default pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>{{ footer.credits }}</p>
            <p class="ed-serif text-base italic">
              Set in Instrument Serif, Public Sans &amp; JetBrains Mono.
            </p>
          </div>
        </UContainer>
      </footer>
    </div>
  </MotionConfig>
</template>
