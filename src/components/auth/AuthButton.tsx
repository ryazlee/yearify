import { Button, type ButtonProps } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

type Props = {
  fullWidth?: boolean
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
}

export function AuthButton({
  fullWidth = false,
  size = 'large',
  variant = 'contained',
}: Props) {
  const { authenticated, signingIn, isMock, signIn, signOut } = useAuth()

  return (
    <Button
      variant={variant}
      color="primary"
      size={size}
      fullWidth={fullWidth}
      disabled={signingIn}
      onClick={() => {
        void (authenticated ? signOut() : signIn())
      }}
      sx={
        fullWidth
          ? { py: 1.35, fontSize: '1rem', fontWeight: 600 }
          : undefined
      }
    >
      {signingIn
        ? 'Connecting…'
        : authenticated
          ? isMock
            ? 'Disconnect demo'
            : 'Disconnect Google Calendar'
          : isMock
            ? 'Try with sample data'
            : 'Connect Google Calendar'}
    </Button>
  )
}
