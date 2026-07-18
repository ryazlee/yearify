import { useEffect, useState } from 'react'
import {
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import type { CategorizedEvents } from '../components/types'
import { categorizeEvents } from '../components/categorizer/utils'
import CategorizerPanel from '../components/categorizer/CategorizerPanel'
import DownloadableComponent from '../components/downloadableImage/DownloadableComponent'
import { SnapshotCalendar } from '../components/calendar/CalendarGrid'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'
import LandingPage from '../components/LandingPage'
import { useAuth } from '../contexts/AuthContext'
import { useMonthEvents, useYearEvents } from '../hooks/useCalendar'
import { isMockDatastore } from '../services/calendarService'
import {
  DEFAULT_YEAR,
  daysInYear,
  parseYearParam,
  yearOptions,
} from '../datastore/types'
import {
  daysInMonth,
  MONTH_NAMES,
  PRODUCT_MODES,
  type ProductMode,
} from '../lib/productMode'

type Props = {
  mode: ProductMode
}

export default function SnapshotPage({ mode }: Props) {
  const config = PRODUCT_MODES[mode]
  const { authenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const year = parseYearParam(searchParams.get('year')) ?? DEFAULT_YEAR
  const [monthIndex, setMonthIndex] = useState(() => new Date().getMonth())

  const yearQuery = useYearEvents(year)
  const monthQuery = useMonthEvents(monthIndex, year)
  const { events, loading, error } =
    mode === 'yearify' ? yearQuery : monthQuery

  const [categorizedEvents, setCategorizedEvents] =
    useState<CategorizedEvents | null>(null)
  const [showStats, setShowStats] = useState(false)

  const setYear = (nextYear: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (nextYear === DEFAULT_YEAR) next.delete('year')
        else next.set('year', String(nextYear))
        return next
      },
      { replace: true },
    )
  }

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
  }, [authenticated, events, loading, error, mode, monthIndex, year])

  const totalDays =
    mode === 'monthify' ? daysInMonth(year, monthIndex) : daysInYear(year)

  return (
    <div className={`appShell${authenticated ? '' : ' appShell--landing'}`}>
      <AppHeader year={year} />
      <main className="appMain">
        <div className="shellInner">
          {!authenticated ? (
            <LandingPage mode={mode} />
          ) : (
            <div className="workspace">
              <header className="workspace__toolbar">
                <div className="workspace__period">
                  <TextField
                    select
                    size="small"
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    sx={{ minWidth: 108 }}
                  >
                    {yearOptions().map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  {mode === 'monthify' ? (
                    <TextField
                      select
                      size="small"
                      label="Month"
                      value={monthIndex}
                      onChange={(e) => setMonthIndex(Number(e.target.value))}
                      sx={{ minWidth: 148 }}
                    >
                      {MONTH_NAMES.map((name, index) => (
                        <MenuItem key={name} value={index}>
                          {name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : null}
                </div>
                {isMockDatastore ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 'auto' }}
                  >
                    Mock data
                  </Typography>
                ) : null}
              </header>

              {loading || !categorizedEvents ? (
                <div className="loadingState">
                  <Typography color="text.secondary">
                    {error ? error : 'Loading your events…'}
                  </Typography>
                </div>
              ) : (
                <>
                  <section
                    className="workspace__stage"
                    aria-label={config.snapshotLabel}
                  >
                    <DownloadableComponent
                      filePrefix={config.id}
                      controls={
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showStats}
                              onChange={() => setShowStats(!showStats)}
                              name="showStats"
                              color="primary"
                              size="small"
                            />
                          }
                          label="Include stats"
                          sx={{ m: 0, mr: 'auto' }}
                        />
                      }
                    >
                      <SnapshotCalendar
                        mode={mode}
                        categorizedEvents={categorizedEvents}
                        year={year}
                        monthIndex={monthIndex}
                        showStats={showStats}
                        totalDays={totalDays}
                      />
                    </DownloadableComponent>
                  </section>

                  <CategorizerPanel
                    categorizedEvents={categorizedEvents}
                    onUpdate={setCategorizedEvents}
                  />
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
