import React from "react"
import { Roll } from "shared/models/roll"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styled from "styled-components"
import { RollStateList } from "../roll-state/roll-state-list.component"
import { getCount } from "shared/helpers/roll-utils"

interface Props {
  activity: Roll
}
export const ActivityListTile: React.FC<Props> = ({ activity }) => {
  return (
    <S.ListItem>
      <S.Icon>
        <FontAwesomeIcon icon="lightbulb" size="2x" />
      </S.Icon>
      <S.Name>{activity.name}</S.Name>
      <S.RollListItem>
        <RollStateList
          stateList={[
            { type: "present", count: getCount(activity.student_roll_states, "present") },
            { type: "late", count: getCount(activity.student_roll_states, "late") },
            { type: "absent", count: getCount(activity.student_roll_states, "absent") },
          ]}
        />
      </S.RollListItem>
      <S.ItemDate>- {new Date(activity.completed_at).toDateString()}</S.ItemDate>
    </S.ListItem>
  )
}

const S = {
  ListItem: styled.div`
    width: auto;
    height: 38px;
    margin: 5px;
    box-shadow: 0px 0.5px 1px rgb(0 0 0 / 1%), 0px 1px 3px rgb(0 0 0 / 2%), 0px 2px 5px rgb(0 0 0 / 2%), 0px 4px 8px rgb(0 0 0 / 2%);
    border-radius: 6px;
    background-color: #ffffff;
    display: flex;
  `,
  RollListItem: styled.div`
    padding-left: 10px;
    border-radius: 6px;
    display: flex;
  `,
  Name: styled.div`
    overflow: hidden;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 10px;
    align-self: center;
  `,
  Icon: styled.div`
    margin: 0;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    align-self: center;
  `,
  ItemDate: styled.div`
    align-self: center;
    margin-left: auto;
    padding-right: 10px;
    font-size: 14px;
    font-weight: 700;
  `,
}
