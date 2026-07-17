import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { Box, Button } from '@mui/material'

const DownloadableComponent = ({ children }: { children: React.ReactNode }) => {
  const componentRef = useRef<HTMLDivElement>(null)

  const captureImage = async () => {
    if (!componentRef.current) return null

    try {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
      })
      return new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/png'),
      )
    } catch (error) {
      console.error('Error capturing the image:', error)
      alert('Unable to generate image. Please try again.')
      return null
    }
  }

  const handleDownload = async () => {
    const blob = await captureImage()
    if (blob) {
      const fileName = `yearify-image-${new Date().toISOString()}.png`
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    }
  }

  const handleShare = async () => {
    const blob = await captureImage()
    if (blob) {
      const fileName = `yearify-image-${new Date().toISOString()}.png`
      const file = new File([blob], fileName, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file] })
        } catch (error) {
          console.error('Error sharing the image:', error)
          alert(
            'Unable to share image. Please try again or view in a new window.',
          )
        }
      } else {
        alert('File sharing is not supported on this browser.')
        handleDownload()
      }
    }
  }

  const handleViewInNewWindow = async () => {
    const blob = await captureImage()
    if (blob) {
      const imageURL = URL.createObjectURL(blob)
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(
          `<html><head><title>Yearify Image</title></head><body style="margin:0;background:#fff;"><img src="${imageURL}" style="width:100%;height:auto;" /></body></html>`,
        )
        newWindow.document.close()
      } else {
        alert(
          'Unable to open a new window. Please allow pop-ups in your browser.',
        )
      }
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <Button onClick={handleShare} variant="contained" size="medium">
          Share
        </Button>
        <Button onClick={handleDownload} variant="outlined" size="medium">
          Download
        </Button>
        <Button
          onClick={handleViewInNewWindow}
          variant="outlined"
          size="medium"
        >
          Open in new tab
        </Button>
      </Box>
      <Box
        ref={componentRef}
        className="surfaceCard"
        sx={{
          display: 'inline-block',
          p: 2.5,
          bgcolor: '#fff',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DownloadableComponent
