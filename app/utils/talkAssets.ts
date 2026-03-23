import onboardingYourAgentSlides from '../assets/Onboarding Your Agent.pdf'

export const talkAssetRegistry = {
  'onboarding-your-agent-slides': onboardingYourAgentSlides
} as const

export type TalkAssetKey = keyof typeof talkAssetRegistry

export const resolveTalkAsset = (key: string) => {
  const asset = talkAssetRegistry[key as TalkAssetKey]

  if (!asset) {
    throw new Error(`Unknown talk asset key: ${key}`)
  }

  return asset
}
