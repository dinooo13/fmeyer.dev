<script setup lang="ts">
const route = useRoute()
const { footer, global } = useAppConfig()

const links = computed(() => navLinks.map(link => ({
  label: String(link.label),
  to: String(link.to)
})))

const isActive = (to: string) => {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="signal-shell relative isolate min-h-screen overflow-x-clip">
    <div
      class="signal-backdrop"
      :class="isHome ? '' : 'signal-backdrop--compact'"
      aria-hidden="true"
    />

    <header
      role="banner"
      class="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6"
    >
      <div class="signal-glass mx-auto flex h-13 max-w-6xl items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-1.5 sm:pl-2">
        <NuxtLink
          to="/"
          class="group flex items-center gap-2.5 rounded-full pr-2 text-highlighted"
          aria-label="Fabian Meyer, home"
        >
          <span
            class="signal-monogram transition-transform duration-300 group-hover:rotate-[-8deg]"
            aria-hidden="true"
          >FM</span>
          <span class="hidden font-mono text-[0.8rem] tracking-tight sm:inline">fmeyer<span class="text-muted">.dev</span></span>
        </NuxtLink>

        <div class="flex items-center gap-1">
          <nav aria-label="Primary">
            <ul class="flex items-center gap-0.5">
              <li
                v-for="link in links"
                :key="link.to"
              >
                <NuxtLink
                  :to="link.to"
                  class="signal-navlink block rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-highlighted"
                  :class="isActive(link.to) ? 'is-active' : ''"
                  :aria-current="isActive(link.to) ? 'page' : undefined"
                >
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <span
            class="mx-1 hidden h-5 w-px bg-(--ui-border-accented) sm:block"
            aria-hidden="true"
          />
          <ColorModeButton />
        </div>
      </div>
    </header>

    <slot />

    <footer
      role="contentinfo"
      class="relative border-t border-default pt-12 pb-28 sm:pb-32"
    >
      <div class="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span
              class="signal-monogram"
              aria-hidden="true"
            >FM</span>
            <div>
              <p class="text-sm font-semibold text-highlighted">
                {{ global.picture.alt }}
              </p>
              <p class="font-mono text-xs text-muted">
                <a
                  :href="`mailto:${global.email}`"
                  class="underline-offset-4 hover:text-highlighted hover:underline"
                >{{ global.email }}</a>
              </p>
            </div>
          </div>
          <p class="font-mono text-xs text-muted">
            {{ footer.credits }}
          </p>
        </div>

        <nav aria-label="Social and contact links">
          <ul class="flex items-center gap-2">
            <li
              v-for="link of footer?.links"
              :key="link['aria-label'] || link.to"
            >
              <UButton
                v-bind="{ size: 'md', color: 'neutral', variant: 'outline', ...link }"
                class="rounded-full"
              />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
</template>
