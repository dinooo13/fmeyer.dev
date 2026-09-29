export const designOptions = [
  { id: 'classic', label: 'Current', description: 'The site as it is today', themeColor: { light: 'white', dark: '#020618' } },
  { id: 'editorial', label: 'Editorial', description: 'Serif typography, paper tones, magazine layout', themeColor: { light: '#f5f1ea', dark: '#12110f' } },
  { id: 'signal', label: 'Signal', description: 'Technical, aurora glow, agent pipeline hero', themeColor: { light: '#fbfcfe', dark: '#07090f' } },
  { id: 'studio', label: 'Studio', description: 'Bento grid, soft colour, product-page energy', themeColor: { light: '#faf7f2', dark: '#0f0e13' } }
] as const

export type DesignId = typeof designOptions[number]['id']

export const DESIGN_STORAGE_KEY = 'fmeyer-design'

export const isDesignId = (value: unknown): value is DesignId => {
  return designOptions.some(option => option.id === value)
}

// Runs inline in <head> before first paint so design-scoped CSS applies
// immediately. Non-default designs keep the app hidden until the client
// plugin has swapped the components in (see plugins/design.client.ts).
export const designBootScript = `(function(){try{var ids=${JSON.stringify(designOptions.map(option => option.id))};var q=new URLSearchParams(location.search).get('design');var d=ids.indexOf(q)>-1?q:localStorage.getItem('${DESIGN_STORAGE_KEY}');if(ids.indexOf(d)<0)d='classic';if(q===d)localStorage.setItem('${DESIGN_STORAGE_KEY}',d);var h=document.documentElement;h.setAttribute('data-design',d);if(d!=='classic'){h.classList.add('design-pending');setTimeout(function(){h.classList.remove('design-pending')},5000)}}catch(e){}})()`

// The explorations only render on the client, so the static build never sees
// their <NuxtImg> sizes. Prerender them explicitly so previews don't 404.
const designPortraitSizes = [
  '1x1', '2x2', '28x28', '44x44', '56x56', '88x88', '170x213', '218x273', '340x426', '360x450',
  '436x546', '720x900', '538x495', '680x626', '1076x990', '1360x1252'
]

export const designPrerenderRoutes = designPortraitSizes.map(size => `/_ipx/fit_cover&s_${size}/profile/fabian-meyer-portrait.jpg`)
