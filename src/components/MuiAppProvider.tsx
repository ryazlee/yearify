import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'

const palette = {
  primary: '#111827',
  bg: '#fafafa',
  paper: '#ffffff',
  text: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',
  divider: '#e5e7eb',
  dividerLight: '#f3f4f6',
}

const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

export default function MuiAppProvider({ children }: PropsWithChildren) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: palette.primary,
            contrastText: '#ffffff',
          },
          text: {
            primary: palette.text,
            secondary: palette.textSecondary,
          },
          background: {
            default: palette.bg,
            paper: palette.paper,
          },
          divider: palette.divider,
        },
        shape: { borderRadius: 10 },
        typography: {
          fontFamily,
          h4: { fontWeight: 700, letterSpacing: '-0.03em' },
          h5: { fontWeight: 600, letterSpacing: '-0.02em' },
          h6: { fontWeight: 600, letterSpacing: '-0.02em' },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: { backgroundColor: palette.bg },
            },
          },
          MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                boxShadow: 'none',
                minHeight: 44,
                '@media (min-width: 768px)': {
                  minHeight: 40,
                },
                '&:hover': { boxShadow: 'none', opacity: 0.92 },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                width: 44,
                height: 44,
                '@media (min-width: 768px)': {
                  width: 36,
                  height: 36,
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              switchBase: {
                '&.Mui-checked': {
                  color: palette.primary,
                },
                '&.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: palette.primary,
                },
              },
            },
          },
        },
      }),
    [],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
