import axios from 'axios'
import { IUser } from '../types'

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

export default axiosInstance
