import { Role } from '../features/auth/authSlice'

export interface ITodoItem {
  id: string
  title: string
  completed: boolean
}

export interface ISignInFormData {
  email: string
  password: string
}

export interface ISignUpFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface IUser {
  email: string
  username: string
  token: string
  role: Role
}

export interface ISignUpPayload {
  username: string
  email: string
  password: string
}

export interface ISignInPayload {
  email: string
  password: string
}

export interface ISignUpResponse extends IMessageResponse {
  detail: {
    id: string
    email: string
    username: string
  }
}

export interface ISignInResponse extends IMessageResponse {}

export interface IGetTodosResponse {}

export interface IMessageResponse {
  message: string
}

export interface INetworkState {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
  message: string
}
