import client from '../../client'
import { ISignInPayload, ISignUpPayload } from '../../types'

const signUpUser = async (userData: ISignUpPayload) => {
  const response = await client.post('/signup', userData)
  return response.data
}

const signIn = async (userData: ISignInPayload) => {
  const response = await client.post('/login', userData)
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
