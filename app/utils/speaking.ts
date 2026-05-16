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

const parseDurationMinutes = (duration?: string): number | null => {
  if (!duration) return null

  const minutes = duration.match(/(\d+)\s*min/i)
  if (minutes) return Number(minutes[1])

  const hours = duration.match(/(\d+(?:\.\d+)?)\s*h/i)
  if (hours) return Math.round(Number(hours[1]) * 60)

  return null
}

const toIsoDateString = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return date.toISOString().slice(0, 10)
}

const buildEventStartDate = (date: string | Date | null | undefined, time?: string) => {
  if (!date) return null

  const isoDate = toIsoDateString(date)
  if (!isoDate) return null

  if (!time) return isoDate

  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return isoDate

  const hours = match[1]!.padStart(2, '0')
  return `${isoDate}T${hours}:${match[2]}:00`
}

const buildEventEndDate = (startDate: string | null, duration?: string) => {
  if (!startDate || !startDate.includes('T')) return null

  const minutes = parseDurationMinutes(duration)
  if (!minutes) return null

  const start = new Date(`${startDate}Z`)
  if (Number.isNaN(start.getTime())) return null

  const end = new Date(start.getTime() + minutes * 60_000)

  return end.toISOString().replace('Z', '').slice(0, 19)
}

const parsePostalAddress = (talk: TalkEntry) => {
  const localeParts = (talk.location ?? '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)

  const addressCountry = localeParts.length >= 2 ? localeParts[localeParts.length - 1] : undefined
  const addressLocality = localeParts.length >= 2
    ? localeParts[localeParts.length - 2]
    : localeParts[0]

  const venueParts = (talk.venueAddress ?? '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean)

  const streetAddress = venueParts[0]
  const postalLocality = venueParts[1]?.match(/^(\S+)\s+(.+)$/)
  const postalCode = postalLocality?.[1]
  const venueLocality = postalLocality?.[2]

  const address: Record<string, string> = { '@type': 'PostalAddress' }

  if (streetAddress) address.streetAddress = streetAddress
  if (postalCode) address.postalCode = postalCode
  if (venueLocality || addressLocality) address.addressLocality = venueLocality ?? addressLocality!
  if (addressCountry) address.addressCountry = addressCountry

  return Object.keys(address).length > 1 ? address : null
}

const buildEventLocation = (talk: TalkEntry) => {
  const trimmedLocation = talk.location?.trim().toLowerCase()
  const isOnline = trimmedLocation === 'online' || trimmedLocation === 'remote' || trimmedLocation === 'virtual'

  if (isOnline) {
    const url = talk.url ?? talk.eventUrl
    return url
      ? { '@type': 'VirtualLocation', url }
      : null
  }

  const address = parsePostalAddress(talk)
  const place: Record<string, unknown> = { '@type': 'Place' }

  const name = talk.venueName ?? talk.location?.split(',')[0]?.trim()
  if (name) place.name = name
  if (address) place.address = address

  return Object.keys(place).length > 1 ? place : null
}

export const buildTalkEventSchema = (talk: TalkEntry, canonicalUrl: string, performerId: string) => {
  const startDate = buildEventStartDate(talk.date, talk.time)
  const endDate = buildEventEndDate(startDate, talk.duration)
  const location = buildEventLocation(talk)
  const trimmedLocation = talk.location?.trim().toLowerCase()
  const isOnline = trimmedLocation === 'online' || trimmedLocation === 'remote' || trimmedLocation === 'virtual'

  const schema: Record<string, unknown> = {
    '@type': 'Event',
    'name': talk.title,
    'description': talk.description,
    'url': canonicalUrl,
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    'performer': { '@id': performerId },
    'organizer': talk.eventUrl
      ? { '@type': 'Organization', 'name': talk.event, 'url': talk.eventUrl }
      : { '@type': 'Organization', 'name': talk.event }
  }

  if (startDate) schema.startDate = startDate
  if (endDate) schema.endDate = endDate
  if (location) schema.location = location
  if (talk.language) schema.inLanguage = talk.language

  return schema
}
