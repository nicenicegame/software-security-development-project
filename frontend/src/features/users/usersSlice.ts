import { createSlice } from '@reduxjs/toolkit'

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
