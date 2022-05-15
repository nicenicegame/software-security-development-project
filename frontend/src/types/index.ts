import { Role } from '../features/auth/authSlice'

export interface ITodoItem {
  id: string
  title: string
  completed: boolean
}

export interface ITodoItemResponse {
  id: string
  owner_id: string
  is_done: boolean
  title: string
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
    role: 'user' | 'admin'
  }
  access_token: string
  token_type: string
}

export interface IGetUserTodosPayload {}

export interface ICreateTodoPayload {
  title: string
  is_done: boolean
}

export interface IUpdateTodoPayload extends ICreateTodoPayload {
  id: string
}

export interface IGetTodosResponse {
  todos: ITodoItemResponse[]
}

export interface IDeleteTodoResponse extends IDetailResponse {}

export interface IUpdateTodoResponse extends IDetailResponse {}

export interface IUserInfomation extends IGetTodosResponse {
  name: string
  id: string
  email: string
}

export interface IDetailResponse {
  detail: string
}

export interface IMessageResponse {
  message: string
}

export interface INetworkState extends IMessageResponse {
  isError: boolean
  isSuccess: boolean
  isLoading: boolean
}
