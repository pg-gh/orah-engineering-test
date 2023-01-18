import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { compareObjectsByKey, SortDirection, ItemKey, SortOption } from "shared/models/sort"

export interface SortProps<T> {
  data: T[]
  onSortChange(data: T[]): void
  sortOptions: any[]
}

export function useSort<T>({ data, onSortChange, sortOptions }: SortProps<T>) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const initialSortKey = sortOptions[0].value as ItemKey<T>
  const [sortKey, setSortKey] = useState<ItemKey<T>>(initialSortKey)

  const sortedData = useMemo(() => {
    return [...data]
  }, [data])

  useEffect(() => {
    if (sortedData?.length) {
      sortedData.sort(compareObjectsByKey(sortKey, sortDirection === "asc"))

      const dataFlat = JSON.stringify(data)
      const sortedFlat = JSON.stringify(sortedData)

      if (dataFlat !== sortedFlat && onSortChange) {
        onSortChange(sortedData)
      }
    }
  }, [data, onSortChange, sortDirection, sortedData, sortKey])

  const handleSortKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newSortKey = event.target.value as ItemKey<T>
    if (sortKey !== newSortKey) {
      setSortKey(newSortKey)
    }
  }

  const handleKeyChange = (selectedOption: SortOption<T> | null) => {
    const newSortKey = selectedOption?.value
    if (newSortKey && sortKey !== newSortKey) {
      setSortKey(newSortKey)
    }
  }

  const handleDirectionToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  return {
    handleDirectionToggle,
    handleKeyChange,
    handleSortKeyChange,
    sortDirection,
    sortKey,
  }
}
