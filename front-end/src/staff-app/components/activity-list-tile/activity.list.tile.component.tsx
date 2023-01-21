import React from "react"
import { Roll } from "shared/models/roll"
import ListItemText from "@material-ui/core/ListItemText"
import ListItem from "@material-ui/core/ListItem"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  activity: Roll
}
export const ActivityListTile: React.FC<Props> = ({ activity }) => {
  return (
    <ListItem>
      <ListItemText primary={activity.name} secondary={new Date(activity.completed_at).toDateString()} />
    </ListItem>
  )
}
