import type { CalendarEvent } from '../datastore/types'
import { DEFAULT_YEAR } from '../datastore/types'
import { mockDatastore } from '../datastore/mockDatastore'
import { googleCalendarDatastore } from '../datastore/googleCalendarDatastore'
import type { YearifyDatastore } from '../datastore/YearifyDatastore'

/** Set REACT_APP_USE_MOCK=true to exercise the UI without Google OAuth. */
export const isMockDatastore =
  process.env.REACT_APP_USE_MOCK === 'true' ||
  process.env.REACT_APP_USE_MOCK === '1'

const datastore: YearifyDatastore = isMockDatastore
  ? mockDatastore
  : googleCalendarDatastore

export async function signIn(): Promise<void> {
  return datastore.signIn()
}

export async function signOut(): Promise<void> {
  return datastore.signOut()
}

export async function listYearEvents(
  year: number = DEFAULT_YEAR,
): Promise<CalendarEvent[]> {
  return datastore.listYearEvents(year)
}

/** Client-side filter — keeps Monthify on the same year query cache. */
export function filterEventsForMonth(
  events: CalendarEvent[],
  year: number,
  monthIndex: number,
): CalendarEvent[] {
  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 0, 23, 59, 59)

  return events.filter((event) => {
    const start = new Date(event.start)
    const end = new Date(event.end)
    return start <= monthEnd && end >= monthStart
  })
}
