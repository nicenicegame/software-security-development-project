export interface ITodoItem {
  id: number
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
  role: 'admin' | 'user'
}

export interface ISignUpPayload {
  username: string
  email: string
  password: string
}
