export const getTimestamp = (value?: string | Date | null): number | null => {
  if (!value) {
    return null
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? null : timestamp
}
