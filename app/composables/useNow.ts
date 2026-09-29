// Time-dependent UI (e.g. "Upcoming" badges) must render the same on the
// server and during hydration. The prerender time is shared via the payload,
// then replaced with the visitor's clock after mount so badges stay correct
// even when the static build is older than a talk's date.
export const useNow = () => {
  const now = useState('now', () => Date.now())

  onMounted(() => {
    now.value = Date.now()
  })

  return now
}
