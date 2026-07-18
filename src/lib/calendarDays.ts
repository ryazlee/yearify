import type { CalendarEvent } from '../datastore/types'
import { CATEGORY_COLORS, type Category } from '../components/types'

const FILL_CATEGORY_ORDER: Category[] = [
  'travel',
  'social',
  'fitness',
  'personal',
]

export function adjustAllDayEnd(start: string, end: string): Date {
  const startDate = new Date(start)
  const endDate = new Date(end)

  const diffHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)

  if (diffHours === 24) {
    endDate.setDate(endDate.getDate() - 1)
  }
  return endDate
}

export function eventsForDay(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
  dayNum: number,
): CalendarEvent[] {
  const dayStart = new Date(year, monthIndex, dayNum, 0, 0, 0)
  const dayEnd = new Date(year, monthIndex, dayNum, 23, 59, 59)

  return events.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = adjustAllDayEnd(event.start, event.end)
    return eventStart <= dayEnd && eventEnd >= dayStart
  })
}

/** Unique categorized colors for a day, in stable category order. */
export function dayColors(events: CalendarEvent[]): string[] {
  const present = new Set(
    events
      .map((event) => event.category)
      .filter((category): category is Category => {
        if (!category || category === 'uncategorized') return false
        return Boolean(CATEGORY_COLORS[category])
      }),
  )

  return FILL_CATEGORY_ORDER.filter((category) => present.has(category)).map(
    (category) => CATEGORY_COLORS[category],
  )
}

export function dayBackground(
  events: CalendarEvent[],
  emptyFill = '#fff',
): string {
  const colors = dayColors(events)
  if (colors.length === 0) return emptyFill
  if (colors.length === 1) return colors[0]

  if (colors.length === 2) {
    return `linear-gradient(135deg, ${colors[0]} 49.5%, ${colors[1]} 50.5%)`
  }

  // 3–4 categories: equal vertical bands
  const step = 100 / colors.length
  const stops = colors
    .map((color, index) => {
      const start = step * index
      const end = step * (index + 1)
      return `${color} ${start}% ${end}%`
    })
    .join(', ')
  return `linear-gradient(90deg, ${stops})`
}
