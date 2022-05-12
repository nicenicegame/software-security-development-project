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
