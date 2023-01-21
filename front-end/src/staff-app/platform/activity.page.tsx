import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Activity } from "shared/models/activity"
import { ActivityListTile } from "staff-app/components/activity-list-tile/activity.list.tile.component"
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
)

export const ActivityPage: React.FC = () => {
  const classes = useStyles()
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Container>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {loadState === "loaded" && data?.activity && data?.activity.length > 0 && (
        <List className={classes.root}>
          {data.activity.map((s) => (
            <ActivityListTile key={s.entity.id} activity={s.entity} />
          ))}
        </List>
      )}
      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
