import React, { useCallback, useState, useEffect, useContext, useMemo, useRef } from "react"
import { useSort } from "shared/hooks/useSort"
import { ListItem, SortOption } from "shared/models/sort"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import Button from "@material-ui/core/ButtonBase"
import { Context as RollContext } from "context/roll-context.component"
import styled from "styled-components"
import { ItemType } from "shared/models/roll"
import debouce from "lodash.debounce"

const sortOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
]

type ToolbarAction = "roll" | "sort"
export interface Props {
  list: ListItem[]
  isRollMode?: boolean
  onItemClick: (action: ToolbarAction, value?: string) => void
  rollState: ItemType
}

function renderSortOptions<ListItem>({ label, value }: SortOption<ListItem>, index: number) {
  const optionTitle = `Sort by ${label} (${value.toString()})`
  return <option key={index} label={`${label}`} title={optionTitle} value={value.toString()} />
}

export const StudentList: React.FC<Props> = ({ list, isRollMode, onItemClick, rollState }) => {
  const [data, setData] = useState(list)
  const elInput = useRef<HTMLInputElement>(null)
  const { state } = useContext(RollContext)

  /**
   * Callback for the SortControl to update state and restart component rendering.
   * @param data: ListItem[]
   */
  const onSortChange = useCallback((list: ListItem[]) => {
    setData(list)
  }, [])

  // Pass props to the custom sort hook to get sort functionality.
  const { handleDirectionToggle, handleSortKeyChange, sortDirection, sortKey } = useSort<ListItem>({ data, onSortChange, sortOptions })

  const renderList = (list: ListItem[]) => (
    <>
      {list.map((s: ListItem) => (
        <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
      ))}
    </>
  )

  const renderSortOptionSelect = () =>
    sortOptions?.length ? <S.Select onChange={handleSortKeyChange}>{sortOptions.map(renderSortOptions)}</S.Select> : <span>(No sort options were found)</span>

  const renderSortDirectionIcon = () => {
    const directionIcon = sortDirection === "asc" ? <FontAwesomeIcon icon="arrow-circle-down" /> : <FontAwesomeIcon icon="arrow-circle-up" />
    const buttonTitle = sortDirection === "asc" ? `Sort by ${sortKey} in Descending order` : `Sort by ${sortKey} in Ascending order`
    return (
      <>
        <S.Button title={buttonTitle} onClick={handleDirectionToggle}>
          {directionIcon}
        </S.Button>
      </>
    )
  }

  // filter records by search text
  const filterSearchData = (value: string) => {
    const lowercasedValue = value.toLowerCase().trim()
    const dataList = [...list]
    if (lowercasedValue === "") setData(dataList)
    else {
      const filteredData = dataList.filter((item) => {
        return `${item.first_name} ${item.last_name}`.toString().toLowerCase().includes(lowercasedValue)
      })
      setData(filteredData)
    }
  }

  // filter record by roll state
  const filterRollData = () => {
    const dataList = [...list]
    if (rollState === "all") setData(dataList)
    else {
      const matchedIds = state.student_roll_states.filter((item) => item.roll_state === rollState).map((item) => item.student_id)
      const filteredData = dataList.filter((item) => matchedIds.includes(item.id))
      setData(filteredData)
    }
  }

  // handle search Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    filterSearchData(value)
  }

  const filterResults = useMemo(() => {
    return debouce(handleChange, 300)
  }, [])

  useEffect(() => {
    return () => {
      filterResults.cancel()
    }
  })

  useEffect(() => {
    if (elInput.current) {
      elInput.current.value = ""
    }
    filterRollData()
  }, [rollState])

  function renderHeader() {
    return (
      <S.ToolbarContainer>
        <div>
          {renderSortOptionSelect()}
          {renderSortDirectionIcon()}
        </div>
        <S.SearchContainer>
          <S.Input onChange={filterResults} ref={elInput} placeholder="Search for a name..." />
        </S.SearchContainer>
        <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
      </S.ToolbarContainer>
    )
  }

  return (
    <>
      {renderHeader()}
      {renderList(data)}
    </>
  )
}

const S = {
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  Select: styled.select`
    height: 35px;
    background: transparent;
    color: #fff;
    border: none;
    font-weight: 600;

    option {
      color: black;
      background: white;
      display: flex;
      white-space: pre;
      min-height: 20px;
      padding: 0px 2px 1px;
    }
  `,
  Input: styled.input`
    line-height: 1;
    width: 100%;
    border: none;
    color: #37474f;
    font-weight: 600;
    &:focus,
    &:active {
      outline: none;
    }
    &::placeholder {
      color: #37474f;
    }
  `,
  SearchContainer: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #37474f;
    width: 35%;
    cursor: auto;
    padding: 1rem;
    height: 0;
    border-radius: 10rem;
  `,
}
