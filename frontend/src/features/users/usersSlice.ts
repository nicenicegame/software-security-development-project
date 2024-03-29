import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { INetworkState, IUserInfomation } from '../../types'
import usersService from './usersService'

interface UsersState extends INetworkState {
  users: IUserInfomation[]
  selectedUser: IUserInfomation | null
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: ''
}

export const getUsers = createAsyncThunk<
  IUserInfomation[],
  void,
  { rejectValue: string }
>('users/getUsers', async (_, thunkAPI) => {
  try {
    return await usersService.getUsers()
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const deleteUser = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('users/deleteUser', async (userId, thunkAPI) => {
  try {
    return await usersService.deleteUser(userId)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUserById: (
      state: UsersState,
      action: PayloadAction<string | null>
    ) => {
      state.selectedUser =
        state.users.find((user) => user.id === action.payload) || null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state: UsersState) => {
        state.isLoading = true
      })
      .addCase(
        getUsers.fulfilled,
        (state: UsersState, action: PayloadAction<IUserInfomation[]>) => {
          state.isLoading = false
          state.isSuccess = true
          state.users = action.payload
        }
      )
      .addCase(
        getUsers.rejected,
        (state: UsersState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(deleteUser.pending, (state: UsersState) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state: UsersState) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(deleteUser.rejected, (state: UsersState) => {
        state.isLoading = false
        state.isError = true
      })
  }
})

export const { setSelectedUserById } = usersSlice.actions

export default usersSlice.reducer
