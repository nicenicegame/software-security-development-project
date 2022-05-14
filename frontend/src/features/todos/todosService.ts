import client from '../../client'
import { ITodoItem } from '../../types'

const API_URL = '/api/todos/'

const getTodos = () => {}

const updateTodo = (id: string, todo: ITodoItem) => {}

const deleteTodo = (id: string) => {}

const todosService = {
  getTodos,
  updateTodo,
  deleteTodo
}

export default todosService
