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
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface IUser {
  name: string
  email: string
  token: string
  role: Role
}

export interface ISignUpPayload {
  name: string
  email: string
  password: string
}

export interface ISignInPayload {
  email: string
  password: string
}

export interface ISignUpResponse extends IMessageResponse {
  details: {
    id: string
    email: string
    name: string
  }
}

export interface ISignInResponse {
  details: {
    name: string
    email: string
    role: Role
  }
  access_token: string
  token_type: string
}

export interface IGetTodosResponse {}

export interface IMessageResponse {
  message: string
}

export interface INetworkState extends IMessageResponse {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
}
