import onboardingYourAgentSlides from '../assets/Onboarding Your Agent.pdf'
import sddInDerPraxisSlides from '../assets/SDD in der Praxis.pdf'
import specCodeVerifySlides from '../assets/Spec Code Verify Workshop.pdf'

export const talkAssetRegistry = {
  'onboarding-your-agent-slides': onboardingYourAgentSlides,
  'spec-driven-development-in-practice-slides': sddInDerPraxisSlides,
  'spec-code-verify-slides': specCodeVerifySlides
} as const

export type TalkAssetKey = keyof typeof talkAssetRegistry

export const resolveTalkAsset = (key: string) => {
  const asset = talkAssetRegistry[key as TalkAssetKey]

  if (!asset) {
    throw new Error(`Unknown talk asset key: ${key}`)
  }

  return asset
}
