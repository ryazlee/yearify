import { useEffect, useState } from 'react'
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
import {
  CATEGORY_COLORS,
  type CategorizedEvents,
  type Category,
} from '../types'
import {
  ACTION_CATEGORIES,
  deleteEvent,
  moveEvent,
  type ActionCategory,
} from '../categorizer/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  categorizedEvents: CategorizedEvents
  onUpdate: (next: CategorizedEvents) => void
  canUndo?: boolean
  onUndo?: () => void
}

const KEY_TO_CATEGORY: Record<string, ActionCategory> = {
  '1': 'travel',
  '2': 'fitness',
  '3': 'social',
  '4': 'personal',
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
  const queue = categorizedEvents.uncategorized
  const [index, setIndex] = useState(0)

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

  const handleCategorize = (category: Category) => {
    if (!current) return
    onUpdate(moveEvent(categorizedEvents, current.id, category))
  }

  const handleDelete = () => {
    if (!current) return
    onUpdate(deleteEvent(categorizedEvents, current.id))
  }

  const handleSkip = () => {
    if (remaining <= 1) return
    setIndex((value) => (value + 1) % remaining)
  }

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (!current) return

      const mapped = KEY_TO_CATEGORY[event.key]
      if (mapped) {
        event.preventDefault()
        handleCategorize(mapped)
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
  }, [isOpen, current, categorizedEvents, remaining, index, canUndo, onUndo])

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
                : `${Math.min(index + 1, remaining)} of ${remaining} uncategorized`}
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
              {ACTION_CATEGORIES.map((category, i) => (
                <Button
                  key={category}
                  className="catReview__category"
                  onClick={() => handleCategorize(category)}
                  sx={{
                    bgcolor: CATEGORY_COLORS[category],
                    color: '#111827',
                    '&:hover': {
                      bgcolor: CATEGORY_COLORS[category],
                      opacity: 0.92,
                    },
                  }}
                >
                  <span className="catReview__categoryKey">{i + 1}</span>
                  <span className="catReview__categoryLabel">{category}</span>
                </Button>
              ))}
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
              <Button variant="text" color="error" onClick={handleDelete}>
                Remove
              </Button>
            </Box>

            {!isMobile ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}
              >
                Keys 1–4 to file · S skip · ⌘Z undo · Delete remove · Esc close
              </Typography>
            ) : null}
          </>
        )}
      </Box>
    </Modal>
  )
}
