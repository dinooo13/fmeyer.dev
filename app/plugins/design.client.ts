// Static generation always renders the classic design. Once hydration has
// fully resolved we switch to the design picked by the boot script (query
// param or storage), then reveal the app. Switching after hydration avoids
// mismatches between the prerendered HTML and the client render.
export default defineNuxtPlugin((nuxtApp) => {
  const { applyDesign } = useDesign()
  let initialised = false

  nuxtApp.hook('app:suspense:resolve', async () => {
    if (initialised) return
    initialised = true

    const root = document.documentElement
    const stored = root.getAttribute('data-design')

    if (isDesignId(stored) && stored !== 'classic') {
      applyDesign(stored)
      await nextTick()
    }

    requestAnimationFrame(() => root.classList.remove('design-pending'))
  })
})
