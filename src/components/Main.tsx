import { useEffect, useState } from 'react'
import { FormControlLabel, Switch, Typography } from '@mui/material'
import LaunchIcon from '@mui/icons-material/Launch'
import type { CategorizedEvents } from './types'
import { categorizeEvents } from './categorizer/utils'
import DownloadableComponent from './downloadableImage/DownloadableComponent'
import { EventDragAndDrop } from './dnd/EventDragAndDrop'
import { AuthButton } from './auth/AuthButton'
import { CalendarGrid, CalendarGridWaterMark } from './calendar/CalendarGrid'
import UserStats from './stats/UserStats'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import LandingPage from './LandingPage'
import { useAuth } from '../contexts/AuthContext'
import { useYearEvents } from '../hooks/useCalendar'
import { isMockDatastore } from '../services/calendarService'

function Main() {
  const { authenticated } = useAuth()
  const { events, loading, error } = useYearEvents()
  const [categorizedEvents, setCategorizedEvents] =
    useState<CategorizedEvents | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (!authenticated) {
      setCategorizedEvents(null)
      return
    }
    if (loading) return
    if (error) {
      setCategorizedEvents(null)
      return
    }
    setCategorizedEvents(
      categorizeEvents(events.map((event) => ({ ...event }))),
    )
  }, [authenticated, events, loading, error])

  return (
    <div className={`appShell${authenticated ? '' : ' appShell--landing'}`}>
      <AppHeader />
      <main className="appMain">
        <div className="shellInner">
          {!authenticated ? (
            <LandingPage />
          ) : (
            <div className="workspace">
              <div className="workspace__actions">
                <AuthButton variant="outlined" size="medium" />
                {isMockDatastore ? (
                  <Typography variant="caption" color="text.secondary">
                    Mock datastore
                  </Typography>
                ) : null}
              </div>

              {loading || !categorizedEvents ? (
                <div className="loadingState">
                  <Typography color="text.secondary">
                    {error ? error : 'Loading your events…'}
                  </Typography>
                </div>
              ) : (
                <>
                  <p className="section-label">Categorize</p>
                  <p className="workspace__hint">
                    Drag and drop, or click the
                    <LaunchIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mx: 0.25 }}
                    />
                    icon to categorize events
                  </p>

                  <EventDragAndDrop
                    initialCategories={categorizedEvents}
                    onUpdateCategories={setCategorizedEvents}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={showStats}
                        onChange={() => setShowStats(!showStats)}
                        name="showStats"
                        color="primary"
                      />
                    }
                    label={showStats ? 'Hide stats' : 'Show stats'}
                    sx={{ alignSelf: 'center', m: 0 }}
                  />

                  <p className="section-label" style={{ textAlign: 'center' }}>
                    Your year
                  </p>
                  <DownloadableComponent>
                    <CalendarGrid categorizedEvents={categorizedEvents} />
                    {showStats && (
                      <UserStats categorizedEvents={categorizedEvents} />
                    )}
                    <CalendarGridWaterMark />
                  </DownloadableComponent>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <AppFooter />
    </div>
  )
}

export default Main
