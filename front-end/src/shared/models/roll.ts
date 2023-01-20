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

export type RollAction = { type: "ADD"; payload: RollInputItem } | { type: "UPDATE"; payload: RollInputItem }

export interface RollInputItem {
  student_id: number
  roll_state: RolllStateType
}

export interface RollState {
  rolls: RollInputItem[]
}

export interface ContextModel {
  state: RollState
  dispatch: React.Dispatch<RollAction>
}

export type ItemType = RolllStateType | "all"
