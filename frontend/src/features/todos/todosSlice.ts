import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface TodosState {}

const initialState: TodosState = {}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: {}
})

export const {} = todosSlice.actions

export default todosSlice.reducer
