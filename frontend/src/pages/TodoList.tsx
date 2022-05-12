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

  function onAddNewTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  function onEditTodo(id: number, title: string) {}

  function onDeleteTodo(id: number) {}

  function onUpdateCompleted(id: number, completed: boolean) {}

  return (
    <div className="flex flex-col flex-grow">
      <h1 className="font-medium text-3xl my-4">Todo List</h1>
      <div className="flex flex-col gap-y-4 flex-grow overflow-x-auto">
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
      <form
        className="my-4 flex rounded-md overflow-hidden"
        onSubmit={onAddNewTodo}
      >
        <input
          type="text"
          className="flex-grow border border-slate-300 bg-white px-3 py-2 focus:outline-none rounded-l-md"
          placeholder="Enter todo title..."
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button type="submit" className="px-3 py-2 bg-teal-500 text-white">
          <FaPlus />
        </button>
      </form>
    </div>
  )
}

export default TodoList
