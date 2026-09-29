<script setup lang="ts">
const route = useRoute()

const links = computed(() => navLinks.map(link => ({
  label: String(link.label),
  to: String(link.to)
})))

const isActive = (to: string) => {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
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
</template>
