import React, { useEffect, useMemo, useState } from 'react'
import TodoItem from '../components/TodoItem'
import { FaAngleLeft, FaPlus } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearTodos,
  createTodo,
  createUserTodo,
  deleteTodo,
  deleteUserTodo,
  getTodos,
  getUserTodos,
  reset,
  setSelectedTodoFilter,
  TodoFilter,
  updateTodo,
  updateTodosByFilter,
  updateUserTodo
} from '../features/todos/todosSlice'
import Spinner from '../components/Spinner'
import { Link, useParams } from 'react-router-dom'
import { Role } from '../features/auth/authSlice'
import { toast } from 'react-toastify'
import { ITodoItem } from '../types'

const filterButtons = [
  {
    label: 'All',
    value: TodoFilter.ALL
  },
  {
    label: 'Not Done',
    value: TodoFilter.NOT_DONE
  },
  {
    label: 'Completed',
    value: TodoFilter.COMPLETED
  }
]

function TodoList() {
  const { userId } = useParams()
  const [todoTitle, setTodoTitle] = useState<string>('')
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const {
    displayedTodos,
    selectedFilter,
    isLoading,
    isError,
    isSuccess,
    message
  } = useAppSelector((state) => state.todos)
  const { selectedUser } = useAppSelector((state) => state.users)

  const adminMode = useMemo(
    () => userId && user?.role === Role.ADMIN,
    [userId, user]
  )

  useEffect(() => {
    ;(async () => {
      if (adminMode) {
        await dispatch(getUserTodos(userId!))
      } else {
        await dispatch(getTodos())
      }
      dispatch(updateTodosByFilter())
    })()

    return () => {
      dispatch(clearTodos())
    }
  }, [dispatch, adminMode, userId])

  useEffect(() => {
    dispatch(updateTodosByFilter())
  }, [dispatch, selectedFilter])

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
  }, [dispatch, isError, isSuccess, message])

  const onChangeTodoFilter = (filter: TodoFilter) => {
    dispatch(setSelectedTodoFilter(filter))
  }

  const onAddNewTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!todoTitle) return

    if (adminMode) {
      await dispatch(
        createUserTodo({ userId: userId!, is_done: false, title: todoTitle })
      )
      await dispatch(getUserTodos(userId!))
    } else {
      await dispatch(createTodo({ title: todoTitle, is_done: false }))
      await dispatch(getTodos())
    }

    dispatch(updateTodosByFilter())

    setTodoTitle('')
  }

  const onEditTodo = async (id: string, todo: ITodoItem) => {
    if (adminMode) {
      await dispatch(
        updateUserTodo({
          userId: userId!,
          id,
          is_done: todo.completed,
          title: todo.title
        })
      )
      await dispatch(getUserTodos(userId!))
    } else {
      await dispatch(
        updateTodo({ id, is_done: todo.completed, title: todo.title })
      )
      await dispatch(getTodos())
    }

    dispatch(updateTodosByFilter())
  }

  const onDeleteTodo = async (id: string) => {
    if (adminMode) {
      await dispatch(deleteUserTodo({ id, userId: userId! }))
      await dispatch(getUserTodos(userId!))
    } else {
      await dispatch(deleteTodo(id))
      await dispatch(getTodos())
    }

    dispatch(updateTodosByFilter())
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col flex-grow overflow-y-hidden">
      <h1 className="font-medium text-3xl my-4 flex gap-x-2 items-center">
        {adminMode && (
          <Link to={'/admin/users'}>
            <FaAngleLeft />
          </Link>
        )}
        <span>{adminMode ? selectedUser?.name : user?.name}'s Todo list</span>
      </h1>
      <div className="grid grid-cols-3 divide-x-2 py-3">
        {filterButtons.map((btn, btnIndex) => (
          <button
            key={btnIndex}
            onClick={() => onChangeTodoFilter(btn.value)}
            className={`p-1 ${
              selectedFilter === btn.value
                ? 'font-bold text-teal-600'
                : 'font-semibold text-slate-400'
            }`}>
            {btn.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col flex-grow gap-y-4 overflow-y-auto p-1 h-0">
        {displayedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </div>
      <form className="my-4 flex p-1" onSubmit={onAddNewTodo}>
        <input
          type="text"
          className="flex-grow px-3 py-2 input-field rounded-none rounded-l-md"
          placeholder="Enter todo title..."
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-2 bg-teal-500 text-white rounded-r-md">
          <FaPlus />
        </button>
      </form>
    </div>
  )
}

export default TodoList
