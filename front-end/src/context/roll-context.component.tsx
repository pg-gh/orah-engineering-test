import React, { useReducer } from "react"
import { RollAction, ContextModel, RollState } from "shared/models/roll"

const defaultState: RollState = {
  rolls: [],
}

const reducer = (state: RollState, action: RollAction): RollState => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        rolls: [...state.rolls, action.payload],
      }

    case "UPDATE":
      const updatedRoll = action.payload

      const updatedRolls = state.rolls.map((roll) => {
        if (roll.student_id === updatedRoll.student_id) {
          return updatedRoll
        }
        return roll
      })

      return {
        ...state,
        rolls: updatedRolls,
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
