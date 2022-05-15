import client from '../../client'
import { ITodoItem } from '../../types'

const getTodos = async () => {
  const response = await client.get('/api/todos')
  return response.data
}

const updateTodo = async (id: string, todo: ITodoItem) => {
  const response = await client.put(`/api/todos/${id}`, { todo })
  return response.data
}

const deleteTodo = async (id: string) => {
  const response = await client.delete(`/api/todos/${id}`)
  return response.data
}

const todosService = {
  getTodos,
  updateTodo,
  deleteTodo
}

export default todosService
