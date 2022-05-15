import client from '../../client'
import {
  ICreateTodoPayload,
  ICreateUserTodoPayload,
  IDeleteUserTodoPayload,
  IUpdateTodoPayload,
  IUpdateUserTodoPayload
} from '../../types'

const getTodos = async () => {
  const response = await client.get('/api/user/todos')
  return response.data
}

const getUserTodos = async (userId: string) => {
  const response = await client.get(`/api/user/${userId}/todos`)
  return response.data
}

const createTodo = async (payload: ICreateTodoPayload) => {
  const response = await client.post('/api/user/todos', payload)
  return response.data
}

const createUserTodo = async (payload: ICreateUserTodoPayload) => {
  const response = await client.post(`/api/user/${payload.userId}/todos`, {
    title: payload.title,
    is_done: payload.is_done
  })
  return response.data
}

const updateTodo = async (payload: IUpdateTodoPayload) => {
  const response = await client.put(`/api/user/todos/${payload.id}`, {
    title: payload.title,
    is_done: payload.is_done
  })
  return response.data
}

const updateUserTodo = async (payload: IUpdateUserTodoPayload) => {
  const response = await client.put(
    `/api/user/${payload.userId}/todos/${payload.id}`,
    {
      title: payload.title,
      is_done: payload.is_done
    }
  )
  return response.data
}

const deleteTodo = async (id: string) => {
  const response = await client.delete(`/api/user/todos/${id}`)
  return response.data
}

const deleteUserTodo = async (payload: IDeleteUserTodoPayload) => {
  const response = await client.delete(
    `/api/user/${payload.userId}/todos/${payload.id}`
  )
  return response.data
}

const todosService = {
  getTodos,
  getUserTodos,
  createTodo,
  createUserTodo,
  updateTodo,
  updateUserTodo,
  deleteTodo,
  deleteUserTodo
}

export default todosService
