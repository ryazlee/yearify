import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  actionCategories,
  categoryColorMap,
  categoryIds,
  clearStoredCategories,
  createDefaultCategories,
  loadCategories,
  randomPastelColor,
  saveCategories,
  slugifyCategoryId,
  UNCATEGORIZED_ID,
  type CategoryDefinition,
} from '../lib/categories'

type CategoryContextValue = {
  categories: CategoryDefinition[]
  actionCategories: CategoryDefinition[]
  colors: Record<string, string>
  ids: string[]
  addCategory: (input: {
    label: string
    color?: string
    keywords?: string[]
  }) => CategoryDefinition
  updateCategory: (
    id: string,
    patch: Partial<Pick<CategoryDefinition, 'label' | 'color' | 'keywords'>>,
  ) => void
  removeCategory: (id: string) => void
  resetCategories: () => void
}

const CategoryContext = createContext<CategoryContextValue | null>(null)

export function CategoryProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<CategoryDefinition[]>(() =>
    loadCategories(),
  )

  const persist = useCallback((next: CategoryDefinition[]) => {
    setCategories(next)
    saveCategories(next)
  }, [])

  const addCategory = useCallback(
    (input: { label: string; color?: string; keywords?: string[] }) => {
      const label = input.label.trim()
      if (!label) {
        throw new Error('Category name is required')
      }

      let created: CategoryDefinition | null = null
      setCategories((current) => {
        const id = slugifyCategoryId(
          label,
          current.map((c) => c.id),
        )
        created = {
          id,
          label,
          color: input.color ?? randomPastelColor(),
          keywords: (input.keywords ?? [])
            .map((k) => k.trim())
            .filter(Boolean),
          builtin: false,
        }
        const uncategorized = current.find((c) => c.id === UNCATEGORIZED_ID)
        const rest = current.filter((c) => c.id !== UNCATEGORIZED_ID)
        const next = [
          ...rest,
          created,
          ...(uncategorized ? [uncategorized] : []),
        ]
        saveCategories(next)
        return next
      })
      if (!created) throw new Error('Failed to create category')
      return created
    },
    [],
  )

  const updateCategory = useCallback(
    (
      id: string,
      patch: Partial<Pick<CategoryDefinition, 'label' | 'color' | 'keywords'>>,
    ) => {
      setCategories((current) => {
        const next = current.map((category) => {
          if (category.id !== id) return category
          return {
            ...category,
            ...(patch.label !== undefined
              ? { label: patch.label.trim() || category.label }
              : {}),
            ...(patch.color !== undefined ? { color: patch.color } : {}),
            ...(patch.keywords !== undefined
              ? {
                  keywords: patch.keywords
                    .map((k) => k.trim())
                    .filter(Boolean),
                }
              : {}),
          }
        })
        saveCategories(next)
        return next
      })
    },
    [],
  )

  const removeCategory = useCallback((id: string) => {
    setCategories((current) => {
      const target = current.find((c) => c.id === id)
      if (!target || target.builtin || id === UNCATEGORIZED_ID) return current
      const next = current.filter((c) => c.id !== id)
      saveCategories(next)
      return next
    })
  }, [])

  const resetCategories = useCallback(() => {
    clearStoredCategories()
    persist(createDefaultCategories())
  }, [persist])

  const value = useMemo(
    () => ({
      categories,
      actionCategories: actionCategories(categories),
      colors: categoryColorMap(categories),
      ids: categoryIds(categories),
      addCategory,
      updateCategory,
      removeCategory,
      resetCategories,
    }),
    [
      categories,
      addCategory,
      updateCategory,
      removeCategory,
      resetCategories,
    ],
  )

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  )
}

export function useCategories() {
  const ctx = useContext(CategoryContext)
  if (!ctx) throw new Error('useCategories must be used within CategoryProvider')
  return ctx
}
