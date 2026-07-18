import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useMonthRangeEvents, useYearEvents } from '../hooks/useCalendar'
import { isMockDatastore } from '../services/calendarService'
import {
  DEFAULT_YEAR,
  daysInYear,
  parseYearParam,
  yearOptions,
} from '../datastore/types'
import {
  currentHalfIndex,
  currentQuarterIndex,
  daysInMonth,
  daysInMonths,
  HALVES,
  MONTH_NAMES,
  PRODUCT_MODES,
  QUARTERS,
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
  const [quarterIndex, setQuarterIndex] = useState(() => currentQuarterIndex())
  const [halfIndex, setHalfIndex] = useState(() => currentHalfIndex())

  const rangeMonths = useMemo(() => {
    if (mode === 'monthify') return [monthIndex]
    if (mode === 'quarterify') return [...QUARTERS[quarterIndex].months]
    if (mode === 'halfify') return [...HALVES[halfIndex].months]
    return []
  }, [mode, monthIndex, quarterIndex, halfIndex])

  const yearQuery = useYearEvents(year)
  const rangeQuery = useMonthRangeEvents(rangeMonths, year)
  const { events, loading, error } =
    mode === 'yearify' ? yearQuery : rangeQuery

  const [categorizedEvents, setCategorizedEvents] =
    useState<CategorizedEvents | null>(null)
  const [showStats, setShowStats] = useState(false)
  const historyRef = useRef<CategorizedEvents[]>([])
  const [canUndo, setCanUndo] = useState(false)

  const commitCategories = useCallback((next: CategorizedEvents) => {
    setCategorizedEvents((current) => {
      if (current) {
        historyRef.current = [...historyRef.current.slice(-39), current]
        setCanUndo(true)
      }
      return next
    })
  }, [])

  const undoCategories = useCallback(() => {
    const previous = historyRef.current.pop()
    if (!previous) {
      setCanUndo(false)
      return
    }
    setCategorizedEvents(previous)
    setCanUndo(historyRef.current.length > 0)
  }, [])

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
      historyRef.current = []
      setCanUndo(false)
      return
    }
    if (loading) return
    if (error) {
      setCategorizedEvents(null)
      historyRef.current = []
      setCanUndo(false)
      return
    }
    historyRef.current = []
    setCanUndo(false)
    setCategorizedEvents(
      categorizeEvents(events.map((event) => ({ ...event }))),
    )
  }, [
    authenticated,
    events,
    loading,
    error,
    mode,
    monthIndex,
    quarterIndex,
    halfIndex,
    year,
  ])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'z') {
        return
      }
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      if (!canUndo) return
      event.preventDefault()
      undoCategories()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canUndo, undoCategories])

  const totalDays =
    mode === 'monthify'
      ? daysInMonth(year, monthIndex)
      : mode === 'yearify'
        ? daysInYear(year)
        : daysInMonths(year, rangeMonths)

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
                  {mode === 'quarterify' ? (
                    <TextField
                      select
                      size="small"
                      label="Quarter"
                      value={quarterIndex}
                      onChange={(e) => setQuarterIndex(Number(e.target.value))}
                      sx={{ minWidth: 120 }}
                    >
                      {QUARTERS.map((quarter) => (
                        <MenuItem key={quarter.index} value={quarter.index}>
                          {quarter.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : null}
                  {mode === 'halfify' ? (
                    <TextField
                      select
                      size="small"
                      label="Half"
                      value={halfIndex}
                      onChange={(e) => setHalfIndex(Number(e.target.value))}
                      sx={{ minWidth: 120 }}
                    >
                      {HALVES.map((half) => (
                        <MenuItem key={half.index} value={half.index}>
                          {half.label}
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
                        quarterIndex={quarterIndex}
                        halfIndex={halfIndex}
                        showStats={showStats}
                        totalDays={totalDays}
                      />
                    </DownloadableComponent>
                  </section>

                  <CategorizerPanel
                    categorizedEvents={categorizedEvents}
                    onUpdate={commitCategories}
                    canUndo={canUndo}
                    onUndo={undoCategories}
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
