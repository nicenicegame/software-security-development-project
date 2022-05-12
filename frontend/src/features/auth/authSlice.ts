import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { ISignInFormData, ISignUpPayload, IUser } from '../../types'
import authService from './authService'

const userJson = localStorage.getItem('user')
const user = userJson !== null ? (JSON.parse(userJson) as IUser) : null

interface AuthState {
  user: IUser | null
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  message: string
}

const initialState: AuthState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData: ISignUpPayload, thunkAPI) => {
    try {
      return await authService.signUpUser(userData)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.message)
      }
      throw error
    }
  }
)

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (userData: ISignInFormData, thunkAPI) => {
    try {
      return await authService.signIn(userData)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error)
      }
    }
  }
)

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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state: AuthState) => {
        state.isLoading = true
      })
      .addCase(signUpUser.fulfilled, (state: AuthState, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(signUpUser.rejected, (state: AuthState, action) => {
        state.isLoading = false
        state.isSuccess = true
        console.log(action.payload)
      })
      .addCase(signIn.pending, (state: AuthState) => {
        state.isLoading = true
      })
      .addCase(signIn.fulfilled, (state: AuthState, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state: AuthState, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
  }
})

export const { reset, signOut } = authSlice.actions

export default authSlice.reducer
