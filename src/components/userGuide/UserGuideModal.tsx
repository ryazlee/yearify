import {
  Modal,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

const publicUrl = process.env.PUBLIC_URL || ''

const Tutorial = () => (
  <List sx={{ m: 0, py: 0 }}>
    <ListItem sx={{ px: 0 }}>
      <ListItemText primary="1. Connect Google Calendar to load your events from the past year." />
    </ListItem>
    <ListItem sx={{ px: 0 }}>
      <ListItemText primary="2. Events are auto-sorted into categories. Drag them between columns, or open the categorizer from the launch icon." />
    </ListItem>
    <Box sx={{ my: 2 }}>
      <Box
        component="img"
        src={`${publicUrl}/media/userGuide/user-guide-dnd.gif`}
        alt="Drag and drop guide"
        sx={{ width: '100%', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
      />
      <Box
        component="img"
        src={`${publicUrl}/media/userGuide/user-guide-modal.gif`}
        alt="Categorizer modal guide"
        sx={{
          width: '100%',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          mt: 2,
        }}
      />
    </Box>
    <ListItem sx={{ px: 0 }}>
      <ListItemText primary="3. Optionally toggle Show stats to include category percentages in your snapshot." />
    </ListItem>
    <ListItem sx={{ px: 0 }}>
      <ListItemText primary="4. Share, download, or open your year image in a new tab. On Chrome mobile, prefer Open in new tab to save to camera roll." />
    </ListItem>
    <ListItem sx={{ px: 0 }}>
      <ListItemText primary="5. Share it — Instagram or Facebook stories work great." />
    </ListItem>
  </List>
)

export const UserGuideModal = ({
  isOpen,
  onModalClose,
}: {
  isOpen: boolean
  onModalClose: () => void
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Modal open={isOpen} onClose={onModalClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          How it works
        </Typography>
        <Tutorial />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" size="medium" onClick={onModalClose}>
            Got it
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
