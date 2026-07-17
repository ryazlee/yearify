import { YEARIFY_YEAR } from '../datastore/types'

export const queryKeys = {
  yearEvents: (year: number = YEARIFY_YEAR) => ['year-events', year] as const,
}
