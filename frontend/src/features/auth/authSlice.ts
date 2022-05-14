import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import client from '../../client'
import {
  INetworkState,
  ISignInPayload,
  ISignUpPayload,
  ISignUpResponse,
  IUser
} from '../../types'
import authService from './authService'

const userJson = localStorage.getItem('user')
const user = userJson !== null ? (JSON.parse(userJson) as IUser) : null

export enum Role {
  ADMIN,
  USER
}

interface AuthState extends INetworkState {
  user: IUser | null
}

const initialState: AuthState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const signUpUser = createAsyncThunk<
  ISignUpResponse,
  ISignUpPayload,
  {
    rejectValue: string
  }
>('auth/signUpUser', async (userData, thunkAPI) => {
  try {
    return await authService.signUpUser(userData)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    throw error
  }
})

export const signIn = createAsyncThunk<
  // ISignInResponse,
  IUser,
  ISignInPayload,
  {
    rejectValue: string
  }
>('auth/signIn', async (userData, thunkAPI) => {
  try {
    return (await authService.signIn(userData)) as IUser
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    throw error
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state: AuthState) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
    },
    signOut: (state: AuthState) => {
      state.user = null
      localStorage.removeItem('user')
      delete client.defaults.headers.common['Authorization']
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state: AuthState) => {
        state.isLoading = true
      })
      .addCase(signUpUser.fulfilled, (state: AuthState) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(
        signUpUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(signIn.pending, (state: AuthState) => {
        state.isLoading = true
      })
      .addCase(
        signIn.fulfilled,
        (state: AuthState, action: PayloadAction<IUser>) => {
          state.isLoading = false
          state.isSuccess = true
          state.user = action.payload
          client.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${state.user.token}`
        }
      )
      .addCase(
        signIn.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
  }
})

export const { reset, signOut } = authSlice.actions

export default authSlice.reducer
