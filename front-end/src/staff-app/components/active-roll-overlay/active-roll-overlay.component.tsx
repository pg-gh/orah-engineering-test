import React, { useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { Person } from "shared/models/person"
import { Context as RollContext } from "context/roll-context.component"
import { ItemType } from "shared/models/roll"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: ItemType) => void
  list: Person[]
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, list } = props

  const { state } = useContext(RollContext)

  const getCount = (status: string) => {
    if (state?.student_roll_states.length === 0) return 0
    else {
      return state?.student_roll_states.reduce((counter, obj) => (obj.roll_state === status ? (counter += 1) : counter), 0)
    }
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: list?.length || 0 },
              { type: "present", count: getCount("present") },
              { type: "late", count: getCount("late") },
              { type: "absent", count: getCount("absent") },
            ]}
            onItemClick={(type: ItemType) => onItemClick("filter", type)}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => onItemClick("exit")}>
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
