import type { CalendarEvent, CategorizedEvents, Category } from '../types'

export const getStats = (
  categorizedEvents: CategorizedEvents,
  totalDays = 365,
): Record<string, string> => {
  const stats: Record<string, string> = {}

  for (const category in categorizedEvents) {
    let categoryDayCount = 0
    const categoryEvents = categorizedEvents[category as Category]

    for (const event of categoryEvents) {
      const startDateTime = new Date(event.start)
      const endDateTime = new Date(event.end)
      const days = Math.max(
        1,
        Math.ceil(
          (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 3600 * 24),
        ),
      )
      categoryDayCount += days
    }

    const pct = (categoryDayCount / totalDays) * 100
    stats[category] =
      pct >= 10 ? `${pct.toFixed(0)}%` : `${pct.toFixed(1)}%`
  }

  return stats
}

const extractDate = (dateTime: string): string => {
  const date = new Date(dateTime)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export const getMostEventfulDay = (
  categorizedEvents: CategorizedEvents,
): { date: string; events: CalendarEvent[] } | null => {
  const eventMap: Record<string, CalendarEvent[]> = {}

  Object.values(categorizedEvents).forEach((events) => {
    events.forEach((event) => {
      const date = extractDate(event.start)
      if (!eventMap[date]) eventMap[date] = []
      eventMap[date].push(event)
    })
  })

  let maxDate: string | null = null
  let maxEvents: CalendarEvent[] = []

  Object.entries(eventMap).forEach(([date, events]) => {
    if (events.length > maxEvents.length) {
      maxDate = date
      maxEvents = events
    }
  })

  if (maxDate) return { date: maxDate, events: maxEvents }
  return null
}
