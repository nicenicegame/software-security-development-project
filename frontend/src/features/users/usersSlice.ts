import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface UsersState {}

const initialState: UsersState = {}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: {}
})

export const {} = usersSlice.actions

export default usersSlice.reducer
