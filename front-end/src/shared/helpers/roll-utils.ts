import { RollInputItem } from "shared/models/roll"

export const getCount = (data: RollInputItem[], status: string) => {
  if (data.length === 0) return 0
  else {
    return data.reduce((counter, obj) => (obj.roll_state === status ? (counter += 1) : counter), 0)
  }
}
