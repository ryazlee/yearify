import type { CalendarEvent } from './types'
import type { YearifyDatastore } from './YearifyDatastore'

/** Template events in a fixed reference year; remapped to the requested year. */
const TEMPLATE_YEAR = 2024

const mockEvents: CalendarEvent[] = [
  {
    id: 'mock-1',
    summary: 'Flight to Tokyo',
    start: `${TEMPLATE_YEAR}-03-12T08:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-03-12T14:00:00.000Z`,
    location: 'NRT',
  },
  {
    id: 'mock-2',
    summary: 'Gym — leg day',
    start: `${TEMPLATE_YEAR}-01-08T18:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-01-08T19:00:00.000Z`,
  },
  {
    id: 'mock-3',
    summary: 'Dinner with friends',
    start: `${TEMPLATE_YEAR}-02-14T19:30:00.000Z`,
    end: `${TEMPLATE_YEAR}-02-14T22:00:00.000Z`,
  },
  {
    id: 'mock-4',
    summary: 'Dentist',
    start: `${TEMPLATE_YEAR}-04-02T10:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-04-02T11:00:00.000Z`,
  },
  {
    id: 'mock-5',
    summary: 'Weekend hike',
    start: `${TEMPLATE_YEAR}-05-18T09:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-05-18T15:00:00.000Z`,
  },
  {
    id: 'mock-6',
    summary: 'Conference travel',
    start: `${TEMPLATE_YEAR}-09-09T00:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-09-12T00:00:00.000Z`,
    description: 'Annual industry conference',
  },
  {
    id: 'mock-7',
    summary: 'Birthday party',
    start: `${TEMPLATE_YEAR}-06-21T17:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-06-21T21:00:00.000Z`,
  },
  {
    id: 'mock-8',
    summary: 'Yoga',
    start: `${TEMPLATE_YEAR}-07-03T07:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-07-03T08:00:00.000Z`,
  },
  {
    id: 'mock-9',
    summary: 'Beach trip',
    start: `${TEMPLATE_YEAR}-07-12T00:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-07-14T00:00:00.000Z`,
  },
  {
    id: 'mock-10',
    summary: 'Team dinner',
    start: `${TEMPLATE_YEAR}-07-18T19:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-07-18T21:00:00.000Z`,
  },
  {
    id: 'mock-11',
    summary: 'Morning run',
    start: `${TEMPLATE_YEAR}-07-22T06:30:00.000Z`,
    end: `${TEMPLATE_YEAR}-07-22T07:15:00.000Z`,
  },
  {
    id: 'mock-12',
    summary: 'Haircut',
    start: `${TEMPLATE_YEAR}-07-25T12:00:00.000Z`,
    end: `${TEMPLATE_YEAR}-07-25T13:00:00.000Z`,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function remapToYear(events: CalendarEvent[], year: number): CalendarEvent[] {
  return events.map((event) => {
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

class MockYearifyDatastore implements YearifyDatastore {
  async signIn(): Promise<void> {
    await delay(300)
  }

  async signOut(): Promise<void> {
    await delay(150)
  }

  async listYearEvents(year: number): Promise<CalendarEvent[]> {
    await delay(400)
    return remapToYear(mockEvents, year)
  }
}

export const mockDatastore: YearifyDatastore = new MockYearifyDatastore()
