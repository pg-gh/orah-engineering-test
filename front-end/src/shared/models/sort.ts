import { Person } from "./person"

export type ListItem = Person

export type SortDirection = "asc" | "desc"

export type ItemKey<T> = keyof T

/**
 * Mapped type to convert a supplied generic list item type `T`
 * a label / value pair for use in a select control.
 */
export type SortOption<T> = {
  label: T[ItemKey<T>]
  value: ItemKey<T>
}

/**
 * MyArray.sort(compareObjectsByKey<MyObjectType>('myObjectKey', true/false)`
 * @type T
 * @param key: keyof T
 * @param ascending: boolean
 */
export function compareObjectsByKey<T>(key: keyof T, ascending = true) {
  return function innerSort(objectA: T, objectB: T) {
    const sortValue = objectA[key] > objectB[key] ? 1 : objectA[key] < objectB[key] ? -1 : 0
    return ascending ? sortValue : -1 * sortValue
  }
}
