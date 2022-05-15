import client from '../../client'
import { ICreateTodoPayload, IUpdateTodoPayload } from '../../types'

const getTodos = async () => {
  const response = await client.get('/api/user/todos')
  return response.data
}

const getUserTodos = async (userId: string) => {
  const response = await client.get(`/api/user/${userId}/todos`)
  return response.data
}

const createTodo = async (createTodoPayload: ICreateTodoPayload) => {
  const response = await client.post('/api/user/todos', createTodoPayload)
  return response.data
}

const updateTodo = async (updateTodoPayload: IUpdateTodoPayload) => {
  const response = await client.put(`/api/user/todos/${updateTodoPayload.id}`, {
    title: updateTodoPayload.title,
    is_done: updateTodoPayload.is_done
  })
  return response.data
}

const deleteTodo = async (id: string) => {
  const response = await client.delete(`/api/user/todos/${id}`)
  return response.data
}

const todosService = {
  getTodos,
  getUserTodos,
  createTodo,
  updateTodo,
  deleteTodo
}

export default todosService
