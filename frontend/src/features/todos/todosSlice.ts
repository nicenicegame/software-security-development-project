import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  ICreateTodoPayload,
  ICreateUserTodoPayload,
  IDeleteTodoResponse,
  IDeleteUserTodoPayload,
  IGetTodosResponse,
  INetworkState,
  ITodoItem,
  ITodoItemResponse,
  IUpdateTodoPayload,
  IUpdateTodoResponse,
  IUpdateUserTodoPayload
} from '../../types'
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
  userTodos: ITodoItem[]
}

const initialState: TodosState = {
  todos: [],
  displayedTodos: [],
  selectedFilter: TodoFilter.ALL,
  userTodos: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const getTodos = createAsyncThunk<
  IGetTodosResponse,
  void,
  {
    rejectValue: string
  }
>('todos/getTodos', async (_, thunkAPI) => {
  try {
    return await todosService.getTodos()
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const getUserTodos = createAsyncThunk<
  IGetTodosResponse,
  string,
  {
    rejectValue: string
  }
>('todos/getUserTodos', async (userId, thunkAPI) => {
  try {
    return await todosService.getUserTodos(userId)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const createTodo = createAsyncThunk<
  ITodoItemResponse,
  ICreateTodoPayload,
  {
    rejectValue: string
  }
>('todos/createTodo', async (payload, thunkAPI) => {
  try {
    return todosService.createTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const createUserTodo = createAsyncThunk<
  ITodoItemResponse,
  ICreateUserTodoPayload,
  {
    rejectValue: string
  }
>('todos/createUserTodo', async (payload, thunkAPI) => {
  try {
    return todosService.createUserTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const updateTodo = createAsyncThunk<
  IUpdateTodoResponse,
  IUpdateTodoPayload,
  {
    rejectValue: string
  }
>('todos/updateTodo', async (payload, thunkAPI) => {
  try {
    return await todosService.updateTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const updateUserTodo = createAsyncThunk<
  IUpdateTodoResponse,
  IUpdateUserTodoPayload,
  {
    rejectValue: string
  }
>('todos/updateUserTodo', async (payload, thunkAPI) => {
  try {
    return await todosService.updateUserTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const deleteTodo = createAsyncThunk<
  IDeleteTodoResponse,
  string,
  {
    rejectValue: string
  }
>('todos/deleteTodo', async (payload, thunkAPI) => {
  try {
    return await todosService.deleteTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const deleteUserTodo = createAsyncThunk<
  IDeleteTodoResponse,
  IDeleteUserTodoPayload,
  {
    rejectValue: string
  }
>('todos/deleteUserTodo', async (payload, thunkAPI) => {
  try {
    return await todosService.deleteUserTodo(payload)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(error.message)
    }
    return (
      error.message ||
      error.response.message ||
      error.toString() ||
      'Error occurred'
    )
  }
})

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearTodos: (state: TodosState) => {
      state.todos = []
      state.displayedTodos = []
      state.userTodos = []
    },
    reset: (state: TodosState) => {
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
      state.message = ''
    },
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
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        getTodos.fulfilled,
        (state: TodosState, action: PayloadAction<IGetTodosResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          const mappedTodos = action.payload.todos.map((todo) => ({
            id: todo.id,
            title: todo.title,
            completed: todo.is_done
          }))
          state.todos = mappedTodos
        }
      )
      .addCase(
        getTodos.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(getUserTodos.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        getUserTodos.fulfilled,
        (state: TodosState, action: PayloadAction<IGetTodosResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          const mappedTodos = action.payload.todos.map((todo) => ({
            id: todo.id,
            title: todo.title,
            completed: todo.is_done
          }))
          state.userTodos = mappedTodos
          state.todos = mappedTodos
        }
      )
      .addCase(
        getUserTodos.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(createTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(createTodo.fulfilled, (state: TodosState) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = 'Create new todo successfully'
      })
      .addCase(
        createTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(createUserTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(createUserTodo.fulfilled, (state: TodosState) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = 'Create new todo successfully'
      })
      .addCase(
        createUserTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(updateTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        updateTodo.fulfilled,
        (state: TodosState, action: PayloadAction<IUpdateTodoResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          state.message = action.payload.detail
        }
      )
      .addCase(
        updateTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(updateUserTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        updateUserTodo.fulfilled,
        (state: TodosState, action: PayloadAction<IUpdateTodoResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          state.message = action.payload.detail
        }
      )
      .addCase(
        updateUserTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(deleteTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        deleteTodo.fulfilled,
        (state: TodosState, action: PayloadAction<IDeleteTodoResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          state.message = action.payload.detail
        }
      )
      .addCase(
        deleteTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
      .addCase(deleteUserTodo.pending, (state: TodosState) => {
        state.isLoading = true
      })
      .addCase(
        deleteUserTodo.fulfilled,
        (state: TodosState, action: PayloadAction<IDeleteTodoResponse>) => {
          state.isLoading = false
          state.isSuccess = true
          state.message = action.payload.detail
        }
      )
      .addCase(
        deleteUserTodo.rejected,
        (state: TodosState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false
          state.isError = true
          if (action.payload !== undefined) {
            state.message = action.payload
          }
        }
      )
  }
})

export const { clearTodos, reset, setSelectedTodoFilter, updateTodosByFilter } =
  todosSlice.actions

export default todosSlice.reducer
