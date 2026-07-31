import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import LinkIcon from '@mui/icons-material/Link'
import { useCategories } from '../../contexts/CategoryContext'
import { UNCATEGORIZED_ID, type Category } from '../../lib/categories'
import type { CategorizedEvents } from '../types'
import {
  deleteEvent,
  eventCategories,
  setEventCategories,
} from '../categorizer/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  categorizedEvents: CategorizedEvents
  onUpdate: (next: CategorizedEvents) => void
  canUndo?: boolean
  onUndo?: () => void
}

export function ReviewDeck({
  isOpen,
  onClose,
  categorizedEvents,
  onUpdate,
  canUndo = false,
  onUndo,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { actionCategories, categories, colors } = useCategories()
  const queue = categorizedEvents[UNCATEGORIZED_ID] ?? []
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string[]>([])

  const keyMap = useMemo(() => {
    const map: Record<string, Category> = {}
    actionCategories.slice(0, 9).forEach((category, i) => {
      map[String(i + 1)] = category.id
    })
    return map
  }, [actionCategories])

  useEffect(() => {
    if (!isOpen) return
    setIndex(0)
  }, [isOpen])

  useEffect(() => {
    if (index >= queue.length && queue.length > 0) {
      setIndex(queue.length - 1)
    }
  }, [queue.length, index])

  const current = queue.length > 0 ? queue[Math.min(index, queue.length - 1)] : null
  const remaining = queue.length

  useEffect(() => {
    setDraft(current ? eventCategories(current) : [])
  }, [current?.id])

  const toggleDraft = (categoryId: Category) => {
    setDraft((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    )
  }

  const commitAndAdvance = () => {
    if (!current) return
    onUpdate(
      setEventCategories(categorizedEvents, current.id, draft, categories),
    )
  }

  const handleSkip = () => {
    if (remaining <= 1) return
    setIndex((value) => (value + 1) % remaining)
  }

  const handleDelete = () => {
    if (!current) return
    onUpdate(deleteEvent(categorizedEvents, current.id, categories))
  }

  const handleClear = () => {
    if (!current) return
    setDraft([])
    onUpdate(setEventCategories(categorizedEvents, current.id, [], categories))
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (!current) return

      const mapped = keyMap[event.key]
      if (mapped) {
        event.preventDefault()
        toggleDraft(mapped)
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        if (draft.length > 0) commitAndAdvance()
        return
      }
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault()
        handleSkip()
        return
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault()
        handleDelete()
        return
      }
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'z' &&
        canUndo &&
        onUndo
      ) {
        event.preventDefault()
        onUndo()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    current,
    categorizedEvents,
    remaining,
    index,
    canUndo,
    onUndo,
    keyMap,
    draft,
  ])

  const shortcutHint =
    actionCategories.length <= 9
      ? `Keys 1–${Math.min(actionCategories.length, 9)} toggle`
      : 'Keys 1–9 toggle first nine'

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        className={`catReview${isMobile ? ' catReview--sheet' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Review uncategorized events"
      >
        <Box className="catReview__top">
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.05rem' }}
            >
              Review
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {remaining === 0
                ? 'All caught up'
                : `${Math.min(index + 1, remaining)} of ${remaining} uncategorized · tap all that apply`}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close review">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {!current ? (
          <Box className="catReview__empty">
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Every event has a category.
            </Typography>
            <Button variant="contained" onClick={onClose}>
              Done
            </Button>
          </Box>
        ) : (
          <>
            <Box className="catReview__event">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                <Typography className="catReview__title">
                  {current.summary || 'Untitled event'}
                </Typography>
                {current.htmlLink ? (
                  <IconButton
                    size="small"
                    aria-label="Open in Google Calendar"
                    onClick={() => window.open(current.htmlLink, '_blank')}
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Box>
              {current.description ? (
                <Typography className="catReview__description">
                  {current.description}
                </Typography>
              ) : null}
              <Typography className="catReview__meta">
                {new Date(current.start).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                {current.location ? ` · ${current.location}` : ''}
              </Typography>
            </Box>

            <Box className="catReview__categories">
              {actionCategories.map((category, i) => {
                const selected = draft.includes(category.id)
                return (
                  <Button
                    key={category.id}
                    className={`catReview__category${selected ? ' is-selected' : ''}`}
                    onClick={() => toggleDraft(category.id)}
                    sx={{
                      bgcolor: selected ? colors[category.id] : 'transparent',
                      color: '#111827',
                      border: '1px solid',
                      borderColor: selected
                        ? 'transparent'
                        : 'rgba(17,24,39,0.16)',
                      '&:hover': {
                        bgcolor: colors[category.id],
                        opacity: selected ? 0.92 : 0.85,
                      },
                    }}
                  >
                    {i < 9 ? (
                      <span className="catReview__categoryKey">{i + 1}</span>
                    ) : null}
                    <span className="catReview__categoryLabel">
                      {category.label}
                    </span>
                  </Button>
                )
              })}
            </Box>

            <Box className="catReview__secondary">
              <Button
                variant="text"
                onClick={onUndo}
                disabled={!canUndo || !onUndo}
              >
                Undo
              </Button>
              <Button variant="text" onClick={handleSkip} disabled={remaining <= 1}>
                Skip
              </Button>
              <Button variant="text" onClick={handleClear} disabled={draft.length === 0}>
                Clear
              </Button>
              <Button variant="text" color="error" onClick={handleDelete}>
                Remove
              </Button>
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={draft.length === 0}
              onClick={commitAndAdvance}
              sx={{ mt: 1.25 }}
            >
              {draft.length === 0
                ? 'Select categories'
                : `Save · ${draft.length} categor${draft.length === 1 ? 'y' : 'ies'}`}
            </Button>

            {!isMobile ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}
              >
                {shortcutHint} · Enter save · S skip · ⌘Z undo · Delete remove · Esc close
              </Typography>
            ) : null}
          </>
        )}
      </Box>
    </Modal>
  )
}
