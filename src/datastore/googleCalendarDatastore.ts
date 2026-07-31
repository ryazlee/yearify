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

const TOKEN_STORAGE_KEY = 'yearify.googleToken.v1'

type StoredToken = {
  access_token: string
  expires_at: number
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

type TokenResponse = {
  access_token?: string
  expires_in?: number | string
  error?: string
}

declare const gapi: {
  client: {
    getToken: () => { access_token?: string; expires_in?: number | string } | null
    setToken: (token: { access_token: string } | null) => void
  }
}

declare const google: {
  accounts: {
    oauth2: {
      revoke: (token: string, callback: () => void) => void
    }
    id: {
      disableAutoSelect: () => void
    }
  }
}

function mapGoogleEvent(event: GoogleCalendarEvent): CalendarEvent | null {
  if (!event.id) return null

  const startRaw = event.start?.dateTime || event.start?.date
  const endRaw = event.end?.dateTime || event.end?.date
  if (!startRaw || !endRaw) return null

  return {
    id: event.id,
    summary: event.summary ?? '(No title)',
    start: new Date(startRaw).toISOString(),
    end: new Date(endRaw).toISOString(),
    description: event.description,
    location: event.location,
    htmlLink: event.htmlLink,
  }
}

function readStoredToken(): StoredToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredToken
    if (!parsed?.access_token || typeof parsed.expires_at !== 'number') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStoredToken(token: StoredToken | null): void {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token))
}

function persistCurrentToken(expiresIn?: number | string): void {
  const token = gapi.client.getToken()
  if (!token?.access_token) return

  const seconds =
    typeof expiresIn === 'number'
      ? expiresIn
      : typeof expiresIn === 'string'
        ? Number(expiresIn)
        : typeof token.expires_in === 'number'
          ? token.expires_in
          : typeof token.expires_in === 'string'
            ? Number(token.expires_in)
            : 3600

  writeStoredToken({
    access_token: token.access_token,
    expires_at: Date.now() + Math.max(60, Number.isFinite(seconds) ? seconds : 3600) * 1000,
  })
}

class GoogleCalendarDatastore implements YearifyDatastore {
  private apiCalendar = new ApiCalendar(config)

  private waitForReady(timeoutMs = 15000): Promise<void> {
    return new Promise((resolve, reject) => {
      const started = Date.now()
      const tick = () => {
        const gapiReady =
          typeof gapi !== 'undefined' && Boolean(gapi?.client)
        const tokenClientReady = Boolean(
          (this.apiCalendar as { tokenClient?: unknown }).tokenClient,
        )
        if (gapiReady && tokenClientReady) {
          resolve()
          return
        }
        if (Date.now() - started > timeoutMs) {
          reject(new Error('Google API failed to load'))
          return
        }
        window.setTimeout(tick, 50)
      }
      tick()
    })
  }

  private requestAccessToken(prompt: '' | 'consent'): Promise<TokenResponse> {
    const tokenClient = (
      this.apiCalendar as {
        tokenClient: {
          callback?: (resp: TokenResponse) => void
          error_callback?: (resp: unknown) => void
          requestAccessToken: (override?: { prompt?: string }) => void
        } | null
      }
    ).tokenClient

    if (!tokenClient) {
      return Promise.reject(new Error('Google token client not ready'))
    }

    return new Promise((resolve, reject) => {
      tokenClient.callback = (resp) => {
        if (resp?.error) reject(resp)
        else resolve(resp)
      }
      tokenClient.error_callback = (resp) => {
        reject(resp)
      }
      tokenClient.requestAccessToken({ prompt })
    })
  }

  async restoreSession(): Promise<boolean> {
    await this.waitForReady()

    const stored = readStoredToken()
    if (!stored) return false

    const stillFresh = stored.expires_at > Date.now() + 60_000
    if (stillFresh) {
      gapi.client.setToken({ access_token: stored.access_token })
      return true
    }

    // Token expired — try a silent refresh (works if Google session + prior consent).
    gapi.client.setToken({ access_token: stored.access_token })
    try {
      const resp = await this.requestAccessToken('')
      persistCurrentToken(resp.expires_in)
      return Boolean(gapi.client.getToken()?.access_token)
    } catch {
      writeStoredToken(null)
      gapi.client.setToken(null)
      return false
    }
  }

  async signIn(): Promise<void> {
    await this.waitForReady()
    const existing = gapi.client.getToken()
    const resp = await this.requestAccessToken(existing ? '' : 'consent')
    persistCurrentToken(resp.expires_in)
  }

  async signOut(): Promise<void> {
    writeStoredToken(null)
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
      .map(mapGoogleEvent)
      .filter((event): event is CalendarEvent => event !== null)
  }
}

export const googleCalendarDatastore: YearifyDatastore =
  new GoogleCalendarDatastore()
