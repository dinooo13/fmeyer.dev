<script setup lang="ts">
const route = useRoute()
const { footer, global } = useAppConfig()

const isActive = (to: unknown) => {
  const path = String(to ?? '')

  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

const socialLinks = computed(() => (footer?.links ?? []).filter(link => !String(link.to).startsWith('mailto:')))
</script>

<template>
  <div class="relative min-h-screen">
    <div
      class="studio-mesh"
      aria-hidden="true"
    >
      <div class="studio-blob studio-blob-1" />
      <div class="studio-blob studio-blob-2" />
      <div class="studio-blob studio-blob-3" />
      <div class="studio-blob studio-blob-4" />
    </div>

    <header
      role="banner"
      class="fixed inset-x-0 top-3 z-40 flex justify-center px-3 sm:top-4"
    >
      <div class="studio-glass flex items-center gap-1 rounded-full p-1.5 shadow-lg shadow-stone-900/5 ring-1 ring-(--studio-card-ring)">
        <NuxtLink
          to="/"
          class="studio-link group flex items-center gap-2 rounded-full py-0.5 pr-2 pl-0.5 sm:pr-3"
        >
          <NuxtImg
            :src="global.picture.light"
            alt=""
            width="28"
            height="28"
            sizes="28px"
            densities="x1 x2"
            fit="cover"
            loading="eager"
            class="size-7 rounded-full object-cover ring-2 ring-white dark:ring-white/10"
          />
          <span class="studio-display hidden text-[0.95rem] font-semibold text-highlighted sm:inline">fmeyer<span class="text-(--ui-primary)">.dev</span></span>
          <span class="sr-only sm:hidden">fmeyer.dev home</span>
        </NuxtLink>

        <nav aria-label="Primary">
          <ul class="flex items-center gap-0.5">
            <li
              v-for="link in navLinks"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                class="studio-link block rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                :class="isActive(link.to)
                  ? 'bg-(--ui-bg-inverted) text-(--ui-text-inverted)'
                  : 'text-toned hover:bg-(--ui-bg-accented)/60 hover:text-highlighted'"
                :aria-current="isActive(link.to) ? 'page' : undefined"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <span
          class="mx-0.5 h-5 w-px bg-(--ui-border-accented)"
          aria-hidden="true"
        />
        <ColorModeButton />
      </div>
    </header>

    <div class="pt-20 sm:pt-24">
      <slot />
    </div>

    <footer
      role="contentinfo"
      class="mx-auto max-w-6xl px-3 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8"
    >
      <div class="studio-tile studio-tinted studio-tint-blue overflow-hidden p-7 sm:p-10 lg:p-12">
        <div
          class="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-3),transparent)]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-[radial-gradient(closest-side,var(--studio-blob-2),transparent)]"
          aria-hidden="true"
        />

        <div class="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div class="max-w-xl">
            <p class="studio-pill">
              <UIcon
                name="i-lucide-message-circle-heart"
                class="size-3.5"
              />
              Say hello
            </p>
            <p class="studio-display mt-4 text-4xl font-bold text-highlighted sm:text-5xl">
              Let's talk.
            </p>
            <p class="mt-3 text-base text-muted">
              Want to discuss a talk, a workshop, or an internal session? Email is the best starting point.
            </p>
          </div>

          <div class="flex flex-col items-start gap-5 md:items-end">
            <a
              :href="`mailto:${global.email}`"
              class="studio-btn studio-btn-solid group px-5 py-3 text-base"
            >
              <UIcon
                name="i-lucide-mail"
                class="size-5"
              />
              {{ global.email }}
              <UIcon
                name="i-lucide-arrow-right"
                class="studio-arrow size-4"
              />
            </a>

            <nav aria-label="Social links">
              <ul class="flex items-center gap-2">
                <li
                  v-for="link in socialLinks"
                  :key="link.to"
                >
                  <a
                    :href="link.to"
                    target="_blank"
                    rel="noopener noreferrer me"
                    :aria-label="link['aria-label']"
                    class="studio-btn studio-btn-soft size-11 justify-center p-0"
                  >
                    <UIcon
                      :name="link.icon"
                      class="size-5"
                    />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col items-center justify-between gap-2 px-2 text-sm text-muted sm:flex-row">
        <p>{{ footer.credits }}</p>
        <p>Built with Nuxt</p>
      </div>
    </footer>
  </div>
</template>
