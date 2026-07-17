import { Typography, Box, Grid2 as Grid } from '@mui/material'
import { CategorizedEvents } from '../types'
import { getMostEventfulDay, getStats } from './utils'

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Box
    sx={{
      padding: 1,
      textAlign: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      minWidth: 72,
    }}
  >
    <Typography sx={{ fontSize: '10px', fontWeight: 600 }} color="text.secondary" gutterBottom>
      {title.charAt(0).toUpperCase() + title.slice(1)}
    </Typography>
    <Typography sx={{ fontSize: '9px', fontWeight: 600, color: '#111827' }}>
      {value}
    </Typography>
  </Box>
)

const UserStats = ({
  categorizedEvents,
}: {
  categorizedEvents: CategorizedEvents | null
}) => {
  if (!categorizedEvents || Object.keys(categorizedEvents).length === 0) {
    return null
  }

  const stats = getStats(categorizedEvents)
  const mostEventfulDay = getMostEventfulDay(categorizedEvents)
  const viewableStats = Object.entries(stats).filter(
    (stat) => stat[0] !== 'uncategorized',
  )

  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em' }}>
        Your year in numbers
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Grid container spacing={1} sx={{ mt: 1.5 }}>
          {viewableStats.map(([key, value]) => (
            <Grid key={key}>
              <StatCard title={key.replace(/_/g, ' ')} value={value} />
            </Grid>
          ))}
          <Grid>
            <StatCard
              title="Most Eventful Day"
              value={
                mostEventfulDay?.date
                  ? `${mostEventfulDay.date} (${mostEventfulDay.events.length} events)`
                  : 'N/A'
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default UserStats
