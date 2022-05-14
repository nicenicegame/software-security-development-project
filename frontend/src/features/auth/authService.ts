import client from '../../client'
import { ISignInFormData, ISignUpPayload } from '../../types'
import { Role } from './authSlice'

const API_URL = '/api/users/'

const signUpUser = async (userData: ISignUpPayload) => {
  const response = await client.post(API_URL, userData)
  return response.data
}

const signIn = async (userData: ISignInFormData) => {
  // const response = await client.post(API_URL, userData)

  const response = {
    data: {
      email: 'nicenicegame@gmail.com',
      username: 'nicenicegame',
      token: 'test token',
      role: Role.USER
    }
  }

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const signInWithGoogle = async (token: string) => {
  const response = await client.post('/login/google', { token })
  return response.data
}

const authService = {
  signUpUser,
  signIn,
  signInWithGoogle
}

export default authService
