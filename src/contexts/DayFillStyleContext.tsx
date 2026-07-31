import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  loadDayFillStyle,
  saveDayFillStyle,
  type DayFillStyle,
} from '../lib/calendarDays'

type DayFillStyleContextValue = {
  fillStyle: DayFillStyle
  setFillStyle: (style: DayFillStyle) => void
}

const DayFillStyleContext = createContext<DayFillStyleContextValue | null>(null)

export function DayFillStyleProvider({ children }: PropsWithChildren) {
  const [fillStyle, setFillStyleState] = useState<DayFillStyle>(() =>
    loadDayFillStyle(),
  )

  const setFillStyle = useCallback((style: DayFillStyle) => {
    setFillStyleState(style)
    saveDayFillStyle(style)
  }, [])

  const value = useMemo(
    () => ({ fillStyle, setFillStyle }),
    [fillStyle, setFillStyle],
  )

  return (
    <DayFillStyleContext.Provider value={value}>
      {children}
    </DayFillStyleContext.Provider>
  )
}

export function useDayFillStyle() {
  const ctx = useContext(DayFillStyleContext)
  if (!ctx) {
    throw new Error('useDayFillStyle must be used within DayFillStyleProvider')
  }
  return ctx
}
