import React, { useState } from 'react'
import TodoItem from '../components/TodoItem'
import { ITodoItem } from '../types'
import { FaPlus } from 'react-icons/fa'

function TodoList() {
  const [todoTitle, setTodoTitle] = useState<string>('')
  const [todos, setTodos] = useState<ITodoItem[]>([
    {
      id: 1,
      title: 'Go shoppping',
      completed: false
    },
    {
      id: 2,
      title: 'Wash dishes',
      completed: true
    },
    {
      id: 3,
      title: 'Walking',
      completed: false
    }
  ])

  const onAddNewTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const onEditTodo = (id: number, title: string) => {}

  const onDeleteTodo = (id: number) => {}

  const onUpdateCompleted = (id: number, completed: boolean) => {}

  return (
    <div className="flex flex-col flex-grow">
      <h1 className="font-medium text-3xl my-4">Todo List</h1>
      <div className="flex flex-col gap-y-4 flex-grow overflow-y-auto p-1">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEditTodo={onEditTodo}
            onDeleteTodo={onDeleteTodo}
            onUpdateCompleted={onUpdateCompleted}
          />
        ))}
      </div>
      <form className="my-4 flex" onSubmit={onAddNewTodo}>
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
