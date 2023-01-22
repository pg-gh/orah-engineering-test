import React, { useContext, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { Person } from "shared/models/person"
import { Context as RollContext } from "context/roll-context.component"
import { ItemType, RollInput } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { useNavigate } from "react-router-dom"
import { getCount } from "shared/helpers/roll-utils"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: ItemType) => void
  list: Person[]
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, list } = props
  const { state, dispatch } = useContext(RollContext)
  const [saveRoll, , loadState] = useApi({ url: "save-roll" })
  const navigate = useNavigate()

  const handleComplete = () => {
    if (state.student_roll_states.length > 0) {
      void saveRoll(state as RollInput)
    }
  }

  useEffect(() => {
    if (loadState === "loaded") {
      dispatch({
        type: "RESET",
      })
      navigate("/staff/activity")
    }
  }, [loadState])

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: list?.length || 0 },
              { type: "present", count: getCount(state.student_roll_states, "present") },
              { type: "late", count: getCount(state.student_roll_states, "late") },
              { type: "absent", count: getCount(state.student_roll_states, "absent") },
            ]}
            onItemClick={(type: ItemType) => onItemClick("filter", type)}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={handleComplete} disabled={loadState === "loading" && state.student_roll_states.length === 0}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
