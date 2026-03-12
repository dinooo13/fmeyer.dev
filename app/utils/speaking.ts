export type TalkEntry = {
  title: string
  description: string
  event: string
  location: string
  topic: string
  date?: string | Date | null
  dateLabel: string
  placeholder?: boolean
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
