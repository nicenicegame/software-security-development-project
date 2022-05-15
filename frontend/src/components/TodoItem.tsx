import { ITodoItem } from '../types'
import { FaTrashAlt, FaEdit, FaCheck } from 'react-icons/fa'
import { useState } from 'react'

type TodoItemProps = {
  todo: ITodoItem
  onEditTodo: (id: string, todo: ITodoItem) => void
  onDeleteTodo: (id: string) => void
}

function TodoItem({ todo, onEditTodo, onDeleteTodo }: TodoItemProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.title)

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const submitEditTodo = () => {
    if (newTodoTitle === todo.title) {
      toggleEditMode()
      return
    }
    onEditTodo(todo.id, { ...todo, title: newTodoTitle })
  }

  const deleteTodo = () => {
    onDeleteTodo(todo.id)
  }

  const updateCompleted = () => {
    onEditTodo(todo.id, { ...todo, completed: !todo.completed })
  }

  return (
    <div
      className={`flex shadow-md rounded-md ${
        todo.completed && 'opacity-60 line-through'
      }`}>
      {!isEditMode ? (
        <>
          <span className="p-3 flex items-center justify-center bg-slate-100 rounded-l-md">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={updateCompleted}
            />
          </span>
          <p className="flex-grow p-3 bg-slate-100 border border-transparent truncate">
            {todo.title}
          </p>
        </>
      ) : (
        <>
          <input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            type="text"
            className="flex-grow p-3 input-field rounded-none rounded-l-md"
          />
        </>
      )}
      <button className="p-3 bg-green-500 text-white" onClick={submitEditTodo}>
        {isEditMode ? <FaCheck /> : <FaEdit />}
      </button>
      <button
        className="p-3 bg-red-500 text-white rounded-r-md"
        onClick={deleteTodo}>
        <FaTrashAlt />
      </button>
    </div>
  )
}

export default TodoItem
