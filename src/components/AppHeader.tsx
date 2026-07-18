import { Box, Button, IconButton } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { DEFAULT_YEAR } from '../datastore/types'
import { PRODUCT_MODES } from '../lib/productMode'
import { UserGuideModal } from './userGuide/UserGuideModal'

type Props = {
  year?: number
}

function pathWithYear(path: string, year?: number) {
  if (!year || year === DEFAULT_YEAR) return path
  return `${path}?year=${year}`
}

export default function AppHeader({ year }: Props) {
  const [showUserGuide, setShowUserGuide] = useState(false)
  const { authenticated, signingIn, isMock, signOut } = useAuth()

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
          <nav className="appHeader__nav" aria-label="Product">
            <NavLink
              to={pathWithYear(PRODUCT_MODES.yearify.path, year)}
              className={({ isActive }) =>
                `appHeader__link${isActive ? ' is-active' : ''}`
              }
              end
            >
              Yearify
            </NavLink>
            <NavLink
              to={pathWithYear(PRODUCT_MODES.monthify.path, year)}
              className={({ isActive }) =>
                `appHeader__link${isActive ? ' is-active' : ''}`
              }
            >
              Monthify
            </NavLink>
          </nav>

          <div className="appHeader__right">
            {authenticated ? (
              <Button
                className="appHeader__disconnect"
                size="small"
                variant="text"
                disabled={signingIn}
                onClick={() => {
                  void signOut()
                }}
                title={isMock ? 'Disconnect demo' : 'Disconnect Google Calendar'}
              >
                <span className="appHeader__statusDot" aria-hidden />
                <span className="appHeader__disconnectLabel">Disconnect</span>
              </Button>
            ) : null}
            <IconButton
              className="appHeader__help"
              size="small"
              onClick={() => setShowUserGuide(true)}
              aria-label="Open user guide"
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </Box>
    </>
  )
}
