import { useQuery } from '@tanstack/react-query'
import type { CalendarEvent } from '../datastore/types'
import { DEFAULT_YEAR } from '../datastore/types'
import {
  filterEventsForMonth,
  listYearEvents,
} from '../services/calendarService'
import { getQueryErrorMessage } from '../lib/getQueryErrorMessage'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useYearEvents(year: number = DEFAULT_YEAR): {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
} {
  const { authenticated } = useAuth()

  const query = useQuery({
    queryKey: queryKeys.yearEvents(year),
    queryFn: () => listYearEvents(year),
    enabled: authenticated,
  })

  return {
    events: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? getQueryErrorMessage(query.error, 'Failed to load calendar events')
      : null,
  }
}

/**
 * Monthify reads from the same `year-events` query as Yearify.
 * Switching modes / months for a cached year does not refetch.
 */
export function useMonthEvents(
  monthIndex: number,
  year: number = DEFAULT_YEAR,
): {
  events: CalendarEvent[]
  loading: boolean
  error: string | null
} {
  const { authenticated } = useAuth()

  const query = useQuery({
    queryKey: queryKeys.yearEvents(year),
    queryFn: () => listYearEvents(year),
    enabled: authenticated && monthIndex >= 0 && monthIndex <= 11,
    select: (events) => filterEventsForMonth(events, year, monthIndex),
  })

  return {
    events: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? getQueryErrorMessage(query.error, 'Failed to load calendar events')
      : null,
  }
}
