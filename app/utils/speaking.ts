import { resolveTalkAsset } from './talkAssets'

export type TalkResourceKind = 'slides' | 'recording' | 'handout' | 'link'

export type TalkResource = {
  kind: TalkResourceKind
  title: string
  asset?: string
  url?: string
  format?: string
  pages?: number
  description?: string
}

export type ResolvedTalkResource = Omit<TalkResource, 'asset' | 'url'> & {
  href: string
}

export type TalkEntry = {
  id?: string
  stem?: string
  title: string
  summary: string
  description: string
  event: string
  organizerTitle?: string
  location: string
  topic: string
  date?: string | Date | null
  dateLabel: string
  time?: string
  room?: string
  duration?: string
  format?: string
  level?: string
  language?: string
  venueName?: string
  venueAddress?: string
  url?: string
  eventUrl?: string
  resources?: TalkResource[]
  placeholder?: boolean
}

export type ResolvedTalkEntry<Talk extends TalkEntry = TalkEntry> = Omit<Talk, 'resources'> & {
  resources: ResolvedTalkResource[]
}

const getTimestamp = (value?: string | Date | null) => {
  if (!value) {
    return null
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? null : timestamp
}

export const sortTalks = <Talk extends TalkEntry>(talks: Talk[]) => {
  return talks.slice().sort((left, right) => {
    const leftTimestamp = getTimestamp(left.date)
    const rightTimestamp = getTimestamp(right.date)

    if (leftTimestamp !== null && rightTimestamp !== null) {
      return rightTimestamp - leftTimestamp || left.title.localeCompare(right.title)
    }

    if (leftTimestamp !== null) {
      return -1
    }

    if (rightTimestamp !== null) {
      return 1
    }

    if (Boolean(left.placeholder) !== Boolean(right.placeholder)) {
      return left.placeholder ? 1 : -1
    }

    return left.title.localeCompare(right.title)
  })
}

export const getLatestTalk = <Talk extends TalkEntry>(talks: Talk[]) => {
  return sortTalks(talks)[0] ?? null
}

export const resolveTalkResource = (resource: TalkResource): ResolvedTalkResource => {
  const hasAsset = Boolean(resource.asset)
  const hasUrl = Boolean(resource.url)

  if (hasAsset === hasUrl) {
    throw new Error(`Talk resource "${resource.title}" must define exactly one source: asset or url.`)
  }

  return {
    kind: resource.kind,
    title: resource.title,
    format: resource.format,
    pages: resource.pages,
    description: resource.description,
    href: resource.asset ? resolveTalkAsset(resource.asset) : resource.url!
  }
}

export const resolveTalkResources = (resources?: TalkResource[]) => {
  return (resources ?? []).map(resolveTalkResource)
}

export const resolveTalkEntry = <Talk extends TalkEntry>(talk: Talk): ResolvedTalkEntry<Talk> => ({
  ...talk,
  resources: resolveTalkResources(talk.resources)
})

export const getTalkSlug = <Talk extends Pick<TalkEntry, 'stem' | 'title'>>(talk: Talk) => {
  const stem = talk.stem?.split('/').filter(Boolean).at(-1)

  if (stem) {
    return stem
  }

  return talk.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getTalkPath = <Talk extends Pick<TalkEntry, 'stem' | 'title'>>(talk: Talk) => {
  return `/speaking/${getTalkSlug(talk)}`
}
