import React, { useCallback, useState, useEffect } from "react"

import { useSort } from "shared/hooks/useSort"
import { ListItem, SortOption } from "shared/models/sort"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import Button from "@material-ui/core/ButtonBase"

import styled from "styled-components"

const sortOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
]

type ToolbarAction = "roll" | "sort"
export interface SortableListProps {
  list: ListItem[]
  isRollMode?: boolean
  onItemClick: (action: ToolbarAction, value?: string) => void
}

function renderSortOptions<ListItem>({ label, value }: SortOption<ListItem>, index: number) {
  const optionTitle = `Sort by ${label} (${value.toString()})`
  return <option key={index} label={`${label}`} title={optionTitle} value={value.toString()} />
}

export function StudentList({ list, isRollMode, onItemClick }: SortableListProps) {
  const [data, setData] = useState(list)
  const [searchInput, setSearchInput] = useState("")

  /**
   * Callback for the SortControl to update state and restart component rendering.
   * @param data: ListItem[]
   */
  const onSortChange = useCallback((list: ListItem[]) => {
    setData(list)
  }, [])

  // Pass props to the custom sort hook to get sort functionality.
  const { handleDirectionToggle, handleSortKeyChange, sortDirection, sortKey } = useSort<ListItem>({ data, onSortChange, sortOptions })

  const renderListItem = (s: ListItem) => <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />

  const renderList = (list: ListItem[]) => <>{list.map(renderListItem)}</>

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

  const searchStudent = (searchValue: string) => {
    const searchedData = [...list]
    if (searchInput !== "") {
      const filteredData = searchedData.filter((s) => `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchValue.toLowerCase()))
      setData(filteredData)
    } else {
      setData(searchedData)
    }
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => searchStudent(searchInput), 500)
    return () => clearTimeout(timeOutId)
  }, [searchInput])

  function renderHeader() {
    return (
      <S.ToolbarContainer>
        <div>
          {renderSortOptionSelect()}
          {renderSortDirectionIcon()}
        </div>
        <S.SearchContainer>
          <S.Input onChange={(e) => setSearchInput(e.target.value)} value={searchInput} placeholder="Search for a name..." />
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
