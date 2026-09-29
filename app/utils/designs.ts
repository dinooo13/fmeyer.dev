export const designOptions = [
  { id: 'classic', label: 'Current', description: 'The site as it is today' },
  { id: 'editorial', label: 'Editorial', description: 'Serif typography, paper tones, magazine layout' },
  { id: 'signal', label: 'Signal', description: 'Technical, aurora glow, agent pipeline hero' },
  { id: 'studio', label: 'Studio', description: 'Bento grid, soft colour, product-page energy' }
] as const

export type DesignId = typeof designOptions[number]['id']

export const DESIGN_STORAGE_KEY = 'fmeyer-design'

export const isDesignId = (value: unknown): value is DesignId => {
  return designOptions.some(option => option.id === value)
}

// Runs inline in <head> before first paint so design-scoped CSS applies
// immediately. Non-default designs keep the app hidden until the client
// plugin has swapped the components in (see plugins/design.client.ts).
export const designBootScript = `(function(){try{var ids=${JSON.stringify(designOptions.map(option => option.id))};var q=new URLSearchParams(location.search).get('design');var d=ids.indexOf(q)>-1?q:localStorage.getItem('${DESIGN_STORAGE_KEY}');if(ids.indexOf(d)<0)d='classic';if(q===d)localStorage.setItem('${DESIGN_STORAGE_KEY}',d);var h=document.documentElement;h.setAttribute('data-design',d);if(d!=='classic'){h.classList.add('design-pending');setTimeout(function(){h.classList.remove('design-pending')},2500)}}catch(e){}})()`
