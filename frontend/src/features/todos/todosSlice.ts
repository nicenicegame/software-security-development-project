import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { INetworkState, ITodoItem } from '../../types'
import todosService from './todosService'

export enum TodoFilter {
  ALL,
  NOT_DONE,
  COMPLETED
}

interface TodosState extends INetworkState {
  todos: ITodoItem[]
  displayedTodos: ITodoItem[]
  selectedFilter: TodoFilter
}

const initialState: TodosState = {
  todos: [
    {
      id: '1',
      title: 'Go shoppping',
      completed: false
    },
    {
      id: '2',
      title: 'Wash dishes',
      completed: true
    },
    {
      id: '3',
      title: 'Walking',
      completed: false
    },
    {
      id: '4',
      title: 'Go shoppping',
      completed: false
    },
    {
      id: '5',
      title: 'Wash dishes',
      completed: true
    },
    {
      id: '6',
      title: 'Walking',
      completed: false
    }
  ],
  displayedTodos: [],
  selectedFilter: TodoFilter.ALL,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

const getTodos = createAsyncThunk('todos/getTodos', async (_, thunkApi) => {
  try {
    return await todosService.getTodos()
  } catch (error: any) {
    return thunkApi.rejectWithValue(error)
  }
})

const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (payload, thunkApi) => {
    try {
      // return await todosService.updateTodo()
    } catch (error: any) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (payload, thunkApi) => {
    try {
      // return await todosService.deleteTodo()
    } catch (error: any) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setSelectedTodoFilter: (
      state: TodosState,
      action: PayloadAction<TodoFilter>
    ) => {
      state.selectedFilter = action.payload
    },
    updateTodosByFilter: (state: TodosState) => {
      if (state.selectedFilter === TodoFilter.ALL) {
        state.displayedTodos = state.todos
      } else if (state.selectedFilter === TodoFilter.NOT_DONE) {
        state.displayedTodos = state.todos.filter((todo) => !todo.completed)
      } else if (state.selectedFilter === TodoFilter.COMPLETED) {
        state.displayedTodos = state.todos.filter((todo) => todo.completed)
      } else {
        state.displayedTodos = []
      }
    }
  },
  extraReducers: {}
})

export const { setSelectedTodoFilter, updateTodosByFilter } = todosSlice.actions

export default todosSlice.reducer
