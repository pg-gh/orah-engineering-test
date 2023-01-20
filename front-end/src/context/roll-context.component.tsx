import React, { useReducer } from "react"
import { RollAction, ContextModel, RollInput } from "shared/models/roll"

const defaultState: RollInput = {
  student_roll_states: [],
}

const reducer = (state: RollInput, action: RollAction): RollInput => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        student_roll_states: [...state.student_roll_states, action.payload],
      }

    case "UPDATE":
      const updatedRoll = action.payload

      const updatedRolls = state.student_roll_states.map((roll) => {
        if (roll.student_id === updatedRoll.student_id) {
          return updatedRoll
        }
        return roll
      })

      return {
        ...state,
        student_roll_states: updatedRolls,
      }

    default:
      return state
  }
}

export const Context = React.createContext({} as ContextModel)

export const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
}
