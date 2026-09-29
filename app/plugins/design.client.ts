// Static generation always renders the classic design. Once hydration has
// fully resolved we switch to the design picked by the boot script (query
// param or storage), then reveal the app. Switching after hydration avoids
// mismatches between the prerendered HTML and the client render.
export default defineNuxtPlugin((nuxtApp) => {
  const { applyDesign } = useDesign()
  let initialised = false

  const reveal = () => requestAnimationFrame(() => {
    document.documentElement.classList.remove('design-pending')
  })

  nuxtApp.hook('app:suspense:resolve', async () => {
    if (initialised) return
    initialised = true

    const stored = document.documentElement.getAttribute('data-design')

    if (!isDesignId(stored) || stored === 'classic') {
      reveal()
      return
    }

    // Swapping the shell remounts <NuxtPage>, which suspends again while the
    // page re-runs its async setup. Reveal once that page has finished.
    const fallback = setTimeout(reveal, 1500)
    const unhook = nuxtApp.hook('page:finish', () => {
      unhook()
      clearTimeout(fallback)
      reveal()
    })

    applyDesign(stored)
  })
})
