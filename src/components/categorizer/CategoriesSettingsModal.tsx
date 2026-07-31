import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCategories } from '../../contexts/CategoryContext'
import {
  randomPastelColor,
  UNCATEGORIZED_ID,
  type CategoryDefinition,
} from '../../lib/categories'

type Props = {
  open: boolean
  onClose: () => void
}

function CategoryEditor({
  category,
  onChange,
  onRemove,
}: {
  category: CategoryDefinition
  onChange: (
    patch: Partial<Pick<CategoryDefinition, 'label' | 'color' | 'keywords'>>,
  ) => void
  onRemove?: () => void
}) {
  const [keywordDraft, setKeywordDraft] = useState('')

  const addKeyword = () => {
    const next = keywordDraft.trim().toLowerCase()
    if (!next) return
    if (category.keywords.some((k) => k.toLowerCase() === next)) {
      setKeywordDraft('')
      return
    }
    onChange({ keywords: [...category.keywords, next] })
    setKeywordDraft('')
  }

  return (
    <Box className="catSettings__card" sx={{ bgcolor: category.color }}>
      <Box className="catSettings__cardTop">
        <input
          type="color"
          className="catSettings__color"
          value={category.color}
          aria-label={`${category.label} color`}
          onChange={(e) => onChange({ color: e.target.value.toUpperCase() })}
        />
        <TextField
          size="small"
          value={category.label}
          onChange={(e) => onChange({ label: e.target.value })}
          disabled={category.id === UNCATEGORIZED_ID}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.72)',
            },
          }}
        />
        <Button
          size="small"
          variant="text"
          onClick={() => onChange({ color: randomPastelColor() })}
          sx={{ color: 'text.secondary', flexShrink: 0 }}
        >
          Random
        </Button>
        {onRemove ? (
          <IconButton
            size="small"
            aria-label={`Delete ${category.label}`}
            onClick={onRemove}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>

      {category.id !== UNCATEGORIZED_ID ? (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.75 }}
          >
            Keywords — matched in event titles, locations, and descriptions
          </Typography>
          <Box className="catSettings__keywords">
            {category.keywords.map((keyword) => (
              <Chip
                key={keyword}
                size="small"
                label={keyword}
                onDelete={() =>
                  onChange({
                    keywords: category.keywords.filter((k) => k !== keyword),
                  })
                }
                sx={{ bgcolor: 'rgba(255,255,255,0.75)' }}
              />
            ))}
          </Box>
          <Box className="catSettings__keywordRow">
            <TextField
              size="small"
              placeholder="Add keyword"
              value={keywordDraft}
              onChange={(e) => setKeywordDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addKeyword()
                }
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.72)',
                },
              }}
            />
            <Button size="small" variant="outlined" onClick={addKeyword}>
              Add
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="caption" color="text.secondary">
          Catch-all bucket for events that don’t match another category.
        </Typography>
      )}
    </Box>
  )
}

export function CategoriesSettingsModal({ open, onClose }: Props) {
  const {
    categories,
    addCategory,
    updateCategory,
    removeCategory,
    resetCategories,
  } = useCategories()
  const [newName, setNewName] = useState('')

  const editable = useMemo(
    () => categories.filter((c) => c.id !== UNCATEGORIZED_ID),
    [categories],
  )
  const uncategorized = categories.find((c) => c.id === UNCATEGORIZED_ID)

  const handleAdd = () => {
    const label = newName.trim()
    if (!label) return
    addCategory({ label })
    setNewName('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: 'catSettings' }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            Categories
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Defaults stay put. Add your own, tweak colors, and teach keywords.
            Saved on this device.
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close categories">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'grid', gap: 1.5 }}>
        {editable.map((category) => (
          <CategoryEditor
            key={category.id}
            category={category}
            onChange={(patch) => updateCategory(category.id, patch)}
            onRemove={
              category.builtin
                ? undefined
                : () => removeCategory(category.id)
            }
          />
        ))}
        {uncategorized ? (
          <CategoryEditor
            category={uncategorized}
            onChange={(patch) => updateCategory(uncategorized.id, patch)}
          />
        ) : null}

        <Box className="catSettings__add">
          <TextField
            size="small"
            fullWidth
            placeholder="New category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={!newName.trim()}
          >
            Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, justifyContent: 'space-between' }}>
        <Button
          color="inherit"
          onClick={() => {
            if (
              window.confirm(
                'Reset all categories to the Yearify defaults? Custom categories will be removed.',
              )
            ) {
              resetCategories()
            }
          }}
        >
          Reset defaults
        </Button>
        <Button variant="contained" onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}
