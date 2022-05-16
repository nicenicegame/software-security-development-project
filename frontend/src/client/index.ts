import { Store } from '@reduxjs/toolkit'
import axios from 'axios'
import { signOut } from '../features/auth/authSlice'
import { IUser } from '../types'

let store: Store

export const injectStore = (_store: Store) => {
  store = _store
}

const userJson = localStorage.getItem('user')

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
})

if (userJson != null) {
  const user = JSON.parse(userJson) as IUser
  axiosInstance.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${user.token}`
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(signOut())
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
