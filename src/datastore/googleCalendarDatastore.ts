import ApiCalendar from 'react-google-calendar-api'
import type { CalendarEvent } from './types'
import type { YearifyDatastore } from './YearifyDatastore'

const config = {
  clientId:
    '630414025877-qea2q4pmk86335ul1m259uk3p0klgvit.apps.googleusercontent.com',
  apiKey: 'AIzaSyAfDGFQrNL92O_92PZ2JD2pX_aXP9Ug1QE',
  scope: 'https://www.googleapis.com/auth/calendar',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ],
}

type GoogleCalendarEvent = {
  id?: string
  summary?: string
  description?: string
  location?: string
  htmlLink?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

function mapGoogleEvent(
  event: GoogleCalendarEvent,
  year: number,
): CalendarEvent | null {
  if (!event.id) return null

  const startRaw = event.start?.dateTime || event.start?.date
  const endRaw = event.end?.dateTime || event.end?.date
  if (!startRaw || !endRaw) return null

  const startDateTime = new Date(startRaw)
  const endDateTime = new Date(endRaw)
  startDateTime.setFullYear(year)
  endDateTime.setFullYear(year)

  return {
    id: event.id,
    summary: event.summary ?? '(No title)',
    start: startDateTime.toISOString(),
    end: endDateTime.toISOString(),
    description: event.description,
    location: event.location,
    htmlLink: event.htmlLink,
  }
}

class GoogleCalendarDatastore implements YearifyDatastore {
  private apiCalendar = new ApiCalendar(config)

  async signIn(): Promise<void> {
    await this.apiCalendar.handleAuthClick()
  }

  async signOut(): Promise<void> {
    this.apiCalendar.handleSignoutClick()
  }

  async listYearEvents(year: number): Promise<CalendarEvent[]> {
    const response = await this.apiCalendar.listEvents({
      timeMin: new Date(year, 0, 1).toISOString(),
      timeMax: new Date(year, 11, 31, 23, 59, 59).toISOString(),
      showDeleted: false,
      maxResults: 1000,
      orderBy: 'updated',
    })

    const items = (response?.result?.items ?? []) as GoogleCalendarEvent[]
    return items
      .map((event) => mapGoogleEvent(event, year))
      .filter((event): event is CalendarEvent => event !== null)
  }
}

export const googleCalendarDatastore: YearifyDatastore =
  new GoogleCalendarDatastore()
