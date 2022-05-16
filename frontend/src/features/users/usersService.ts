import client from '../../client'

const getUsers = async () => {
  const response = await client.get('/api/users')
  return response.data
}

const deleteUser = async (id: string) => {
  const response = await client.delete(`/api/user/${id}`)
  return response.data
}

const usersService = {
  getUsers,
  deleteUser
}

export default usersService
