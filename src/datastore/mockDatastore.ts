import type { CalendarEvent } from './types'
import type { YearifyDatastore } from './YearifyDatastore'
import { YEARIFY_YEAR } from './types'

const mockEvents: CalendarEvent[] = [
  {
    id: 'mock-1',
    summary: 'Flight to Tokyo',
    start: `${YEARIFY_YEAR}-03-12T08:00:00.000Z`,
    end: `${YEARIFY_YEAR}-03-12T14:00:00.000Z`,
    location: 'NRT',
  },
  {
    id: 'mock-2',
    summary: 'Gym — leg day',
    start: `${YEARIFY_YEAR}-01-08T18:00:00.000Z`,
    end: `${YEARIFY_YEAR}-01-08T19:00:00.000Z`,
  },
  {
    id: 'mock-3',
    summary: 'Dinner with friends',
    start: `${YEARIFY_YEAR}-02-14T19:30:00.000Z`,
    end: `${YEARIFY_YEAR}-02-14T22:00:00.000Z`,
  },
  {
    id: 'mock-4',
    summary: 'Dentist',
    start: `${YEARIFY_YEAR}-04-02T10:00:00.000Z`,
    end: `${YEARIFY_YEAR}-04-02T11:00:00.000Z`,
  },
  {
    id: 'mock-5',
    summary: 'Weekend hike',
    start: `${YEARIFY_YEAR}-05-18T09:00:00.000Z`,
    end: `${YEARIFY_YEAR}-05-18T15:00:00.000Z`,
  },
  {
    id: 'mock-6',
    summary: 'Conference travel',
    start: `${YEARIFY_YEAR}-09-09T00:00:00.000Z`,
    end: `${YEARIFY_YEAR}-09-12T00:00:00.000Z`,
    description: 'Annual industry conference',
  },
  {
    id: 'mock-7',
    summary: 'Birthday party',
    start: `${YEARIFY_YEAR}-06-21T17:00:00.000Z`,
    end: `${YEARIFY_YEAR}-06-21T21:00:00.000Z`,
  },
  {
    id: 'mock-8',
    summary: 'Yoga',
    start: `${YEARIFY_YEAR}-07-03T07:00:00.000Z`,
    end: `${YEARIFY_YEAR}-07-03T08:00:00.000Z`,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class MockYearifyDatastore implements YearifyDatastore {
  async signIn(): Promise<void> {
    await delay(300)
  }

  async signOut(): Promise<void> {
    await delay(150)
  }

  async listYearEvents(year: number): Promise<CalendarEvent[]> {
    await delay(400)
    return mockEvents.map((event) => {
      const start = new Date(event.start)
      const end = new Date(event.end)
      start.setFullYear(year)
      end.setFullYear(year)
      return {
        ...event,
        start: start.toISOString(),
        end: end.toISOString(),
      }
    })
  }
}

export const mockDatastore: YearifyDatastore = new MockYearifyDatastore()
