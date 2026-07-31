import type { CalendarEvent } from '../datastore/types'
import { UNCATEGORIZED_ID } from './categories'
import { eventCategories } from '../components/categorizer/utils'

/** Unique categorized colors for a day, in definition order. */
export function dayColors(
  events: CalendarEvent[],
  colorById: Record<string, string>,
  order: string[],
): string[] {
  const present = new Set<string>()
  events.forEach((event) => {
    eventCategories(event).forEach((category) => {
      if (category === UNCATEGORIZED_ID) return
      if (colorById[category]) present.add(category)
    })
  })

  const ordered = order.filter((category) => present.has(category))
  const extras = Array.from(present).filter(
    (category) => !ordered.includes(category),
  )

  return [...ordered, ...extras].map((category) => colorById[category])
}

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

export function dayBackground(
  events: CalendarEvent[],
  colorById: Record<string, string>,
  order: string[],
  emptyFill = '#fff',
): string {
  const colors = dayColors(events, colorById, order)
  if (colors.length === 0) return emptyFill
  if (colors.length === 1) return colors[0]

  if (colors.length === 2) {
    return `linear-gradient(135deg, ${colors[0]} 49.5%, ${colors[1]} 50.5%)`
  }

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
