import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Modal,
  Switch,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import IosShareIcon from '@mui/icons-material/IosShare'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import html2canvas from 'html2canvas'

type Props = {
  children: ReactNode
  filePrefix?: string
  /** Controls shown beside Share under the preview (e.g. stats toggle). */
  controls?: ReactNode
}

type BusyAction = 'share' | 'download' | 'tab' | null

/** Export multiplier — keeps downloads sharp regardless of on-screen scale. */
const EXPORT_SCALE = 3

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png'),
  )
}

export default function DownloadableComponent({
  children,
  filePrefix = 'yearify',
  controls,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const frameRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<BusyAction>(null)
  const [transparentBg, setTransparentBg] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [fit, setFit] = useState({ scale: 1, width: 0, height: 0 })

  const fileName = () =>
    `${filePrefix}${transparentBg ? '-transparent' : ''}-${new Date().toISOString()}.png`

  const setPreview = (blob: Blob | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    if (blob) {
      const url = URL.createObjectURL(blob)
      previewUrlRef.current = url
      setPreviewUrl(url)
      setPreviewBlob(blob)
    } else {
      setPreviewUrl(null)
      setPreviewBlob(null)
    }
  }

  useLayoutEffect(() => {
    const frame = frameRef.current
    const scaler = scalerRef.current
    if (!frame || !scaler) return

    const measure = () => {
      const card = scaler.querySelector('.snapCard') as HTMLElement | null
      if (!card) return

      // offset* ignores CSS transform — natural export size
      const naturalW = card.offsetWidth
      const naturalH = card.offsetHeight
      if (!naturalW || !naturalH) return

      const available = Math.max(0, frame.clientWidth)
      if (!available) return

      const fitScale = available / naturalW
      // Mobile: fill the screen width. Desktop: natural size (shrink only if needed).
      const isCompact = available < 560
      const scale = isCompact ? fitScale : Math.min(1, fitScale)

      setFit({
        scale,
        width: naturalW * scale,
        height: naturalH * scale,
      })
    }

    measure()
    const observer = new ResizeObserver(() => measure())
    observer.observe(frame)
    observer.observe(scaler)
    const card = scaler.querySelector('.snapCard')
    if (card) observer.observe(card)

    return () => observer.disconnect()
  }, [children])

  const captureImage = async (transparent: boolean) => {
    const scaler = scalerRef.current
    if (!scaler) return null

    const card = scaler.querySelector('.snapCard') as HTMLElement | null
    if (!card) return null

    const restore: Array<() => void> = []

    // Capture at natural size — ignore on-screen fit scale
    const prevTransform = scaler.style.transform
    scaler.style.transform = 'none'
    restore.push(() => {
      scaler.style.transform = prevTransform
    })

    if (transparent) {
      card.classList.add('snapCard--exportTransparent')
      restore.push(() => card.classList.remove('snapCard--exportTransparent'))
    }

    const exportWidth = card.offsetWidth
    card.classList.add('snapCard--exporting')
    card.style.width = `${exportWidth}px`
    restore.push(() => {
      card.classList.remove('snapCard--exporting')
      card.style.width = ''
    })

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve())
      })

      const canvas = await html2canvas(card, {
        scale: EXPORT_SCALE,
        useCORS: true,
        backgroundColor: transparent ? null : '#ffffff',
        logging: false,
        width: card.offsetWidth,
        height: card.offsetHeight,
      })
      return canvasToBlob(canvas)
    } catch (error) {
      console.error('Error capturing the image:', error)
      alert('Unable to generate image. Please try again.')
      return null
    } finally {
      restore.reverse().forEach((fn) => fn())
    }
  }

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setPreviewLoading(true)

    void (async () => {
      const blob = await captureImage(transparentBg)
      if (cancelled) return
      setPreview(blob)
      setPreviewLoading(false)
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transparentBg])

  useEffect(() => {
    if (open) return
    setPreview(null)
    setPreviewLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const runAction = async (
    action: Exclude<BusyAction, null>,
    work: (blob: Blob) => Promise<void>,
  ) => {
    setBusy(action)
    try {
      const blob = previewBlob ?? (await captureImage(transparentBg))
      if (!blob) return
      await work(blob)
    } finally {
      setBusy(null)
    }
  }

  const handleDownload = () =>
    runAction('download', async (blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName()
      link.click()
      URL.revokeObjectURL(link.href)
    })

  const handleShare = () =>
    runAction('share', async (blob) => {
      const file = new File([blob], fileName(), { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] })
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Error sharing the image:', error)
            alert('Unable to share image. Try download or open in a new tab.')
          }
        }
      } else {
        alert('Sharing isn’t supported here — try Download or Open in new tab.')
      }
    })

  const handleViewInNewWindow = () =>
    runAction('tab', async (blob) => {
      const imageURL = URL.createObjectURL(blob)
      const newWindow = window.open()
      if (newWindow) {
        const pageBg = transparentBg
          ? 'repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px'
          : '#fff'
        newWindow.document.write(
          `<html><head><title>${filePrefix}</title></head><body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:${pageBg};"><img src="${imageURL}" style="max-width:100%;height:auto;" /></body></html>`,
        )
        newWindow.document.close()
      } else {
        alert('Unable to open a new window. Please allow pop-ups.')
      }
    })

  const actions = [
    {
      id: 'share' as const,
      label: 'Share image',
      description: 'Send to Instagram, Messages, and more',
      icon: <IosShareIcon />,
      onClick: handleShare,
    },
    {
      id: 'download' as const,
      label: 'Download image',
      description: transparentBg
        ? 'Save a transparent PNG to your device'
        : 'Save a PNG to your device',
      icon: <DownloadIcon />,
      onClick: handleDownload,
    },
    {
      id: 'tab' as const,
      label: 'Open in new tab',
      description: 'Preview, then long-press to save on mobile',
      icon: <OpenInNewIcon />,
      onClick: handleViewInNewWindow,
    },
  ]

  const actionsDisabled = Boolean(busy) || previewLoading || !previewBlob

  return (
    <div className="snapshotStage">
      <div ref={frameRef} className="snapshotStage__frame">
        <div
          className="snapshotStage__fit"
          style={{
            width: fit.width || undefined,
            height: fit.height || undefined,
          }}
        >
          <div
            ref={scalerRef}
            className="snapshotStage__scaler"
            style={{
              transform: `scale(${fit.scale})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <div className="snapshotStage__bar">
        <div className="snapshotStage__controls">{controls}</div>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          size="medium"
          startIcon={<IosShareIcon />}
          sx={{ flexShrink: 0, minWidth: 120 }}
        >
          Share
        </Button>
      </div>

      <Modal open={open} onClose={() => !busy && setOpen(false)}>
        <Box
          className={`shareSheet${isMobile ? ' shareSheet--mobile' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Share options"
        >
          <Box className="shareSheet__top">
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  fontSize: '1.05rem',
                }}
              >
                Share your snapshot
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Preview the export, then choose how to save it
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              disabled={Boolean(busy)}
              aria-label="Close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box
            className={`shareSheet__preview${
              transparentBg ? ' shareSheet__preview--checker' : ''
            }`}
          >
            {previewLoading ? (
              <Box className="shareSheet__previewLoading">
                <CircularProgress size={28} thickness={4} />
                <Typography variant="caption" color="text.secondary">
                  Rendering preview…
                </Typography>
              </Box>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Snapshot export preview" />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Couldn’t render preview
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                disabled={Boolean(busy) || previewLoading}
                size="small"
                color="primary"
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Transparent background
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Keeps day squares solid — only the card backdrop clears
                </Typography>
              </Box>
            }
            sx={{
              alignItems: 'flex-start',
              mx: 0,
              mb: 1.25,
              width: '100%',
              gap: 1,
            }}
          />

          <Box className="shareSheet__actions">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="shareSheet__action"
                onClick={action.onClick}
                disabled={actionsDisabled}
              >
                <span className="shareSheet__actionIcon">{action.icon}</span>
                <span className="shareSheet__actionCopy">
                  <span className="shareSheet__actionLabel">{action.label}</span>
                  <span className="shareSheet__actionDesc">
                    {action.description}
                  </span>
                </span>
                {busy === action.id ? (
                  <CircularProgress size={18} thickness={5} />
                ) : null}
              </button>
            ))}
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
