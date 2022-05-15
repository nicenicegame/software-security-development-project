import client from '../../client'

const getUsers = async () => {
  const response = await client.get('/api/users')
  return response.data
}

const getUserById = async (id: string) => {
  const response = await client.get(`/api/users/${id}`)
  return response.data
}

const editUser = async (id: string) => {
  const response = await client.put(`/api/users/${id}`)
  return response.data
}

const deleteUser = async (id: string) => {
  const response = await client.delete(`/api/users/${id}`)
  return response.data
}

const usersService = {
  getUsers,
  editUser,
  deleteUser
}

export default usersService
