import { Box, IconButton } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState } from 'react'
import { APP_NAME } from '../lib/brand'
import { UserGuideModal } from './userGuide/UserGuideModal'

export default function AppHeader() {
  const [showUserGuide, setShowUserGuide] = useState(false)

  return (
    <>
      {showUserGuide && (
        <UserGuideModal
          isOpen={showUserGuide}
          onModalClose={() => setShowUserGuide(false)}
        />
      )}
      <Box component="header" className="appHeader">
        <div className="appHeader__inner">
          <span className="appHeader__brand">{APP_NAME}</span>
          <IconButton
            size="small"
            onClick={() => setShowUserGuide(true)}
            aria-label="Open user guide"
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </div>
      </Box>
    </>
  )
}
