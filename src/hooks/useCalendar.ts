import { useQuery } from '@tanstack/react-query'
import type { CalendarEvent } from '../datastore/types'
import { YEARIFY_YEAR } from '../datastore/types'
import { listYearEvents } from '../services/calendarService'
import { getQueryErrorMessage } from '../lib/getQueryErrorMessage'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useYearEvents(year: number = YEARIFY_YEAR): {
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
