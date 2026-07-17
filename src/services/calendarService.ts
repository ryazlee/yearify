import type { CalendarEvent } from '../datastore/types'
import { YEARIFY_YEAR } from '../datastore/types'
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
  year: number = YEARIFY_YEAR,
): Promise<CalendarEvent[]> {
  return datastore.listYearEvents(year)
}
