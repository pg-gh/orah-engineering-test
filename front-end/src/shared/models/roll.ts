export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export interface RollInput {
  student_roll_states: { student_id: number; roll_state: RolllStateType }[]
}

export type RolllStateType = "unmark" | "present" | "absent" | "late"

export type RollAction = { type: "ADD"; payload: RollInputItem } | { type: "UPDATE"; payload: RollInputItem } | { type: "RESET" }

export interface RollInputItem {
  student_id: number
  roll_state: RolllStateType
}

export interface ContextModel {
  state: RollInput
  dispatch: React.Dispatch<RollAction>
}

export type ItemType = RolllStateType | "all"
