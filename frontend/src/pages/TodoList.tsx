import React, { useEffect, useState } from 'react'
import TodoItem from '../components/TodoItem'
import { FaPlus } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  setSelectedTodoFilter,
  TodoFilter,
  updateTodosByFilter
} from '../features/todos/todosSlice'
import Spinner from '../components/Spinner'

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
  const [todoTitle, setTodoTitle] = useState<string>('')
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { displayedTodos, selectedFilter, isLoading } = useAppSelector(
    (state) => state.todos
  )

  useEffect(() => {
    dispatch(updateTodosByFilter())
  }, [dispatch, selectedFilter])

  const onChangeTodoFilter = (filter: TodoFilter) => {
    dispatch(setSelectedTodoFilter(filter))
  }

  const onAddNewTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const onEditTodo = (id: string, title: string) => {}

  const onDeleteTodo = (id: string) => {}

  const onUpdateCompleted = (id: string, completed: boolean) => {}

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col flex-grow overflow-y-hidden">
      <h1 className="font-medium text-3xl my-4">{user?.name}'s' Todo list</h1>
      <div className="grid grid-cols-3 divide-x-2 py-3">
        {filterButtons.map((btn, btnIndex) => (
          <button
            key={btnIndex}
            onClick={() => onChangeTodoFilter(btn.value)}
            className={`p-1 ${
              selectedFilter === btn.value
                ? 'font-bold text-teal-600'
                : 'font-semibold text-slate-400'
            }`}
          >
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
            onUpdateCompleted={onUpdateCompleted}
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
          className="px-3 py-2 bg-teal-500 text-white rounded-r-md"
        >
          <FaPlus />
        </button>
      </form>
    </div>
  )
}

export default TodoList
