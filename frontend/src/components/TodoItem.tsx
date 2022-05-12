import { ITodoItem } from '../types'
import { FaTrashAlt, FaEdit, FaCheck } from 'react-icons/fa'
import { useState } from 'react'

type TodoItemProps = {
  todo: ITodoItem
  onEditTodo: (id: number, newTitle: string) => void
  onDeleteTodo: (id: number) => void
  onUpdateCompleted: (id: number, completed: boolean) => void
}

function TodoItem({
  todo,
  onEditTodo,
  onDeleteTodo,
  onUpdateCompleted
}: TodoItemProps) {
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
    onEditTodo(todo.id, newTodoTitle)
  }

  const deleteTodo = () => {
    onDeleteTodo(todo.id)
  }

  const updateCompleted = () => {
    onUpdateCompleted(todo.id, !todo.completed)
  }

  return (
    <div className="flex">
      {!isEditMode ? (
        <>
          <span className="px-3 py-2 flex items-center justify-center bg-slate-100 rounded-l-md">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={updateCompleted}
            />
          </span>
          <p className="flex-grow px-3 py-2 bg-slate-100 border border-transparent shadow-sm truncate">
            {todo.title}
          </p>
        </>
      ) : (
        <>
          <input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            type="text"
            className="flex-grow px-3 py-2 input-field rounded-none rounded-l-md"
          />
        </>
      )}
      <button
        className="py-2 px-3 bg-green-500 text-white"
        onClick={submitEditTodo}
      >
        {isEditMode ? <FaCheck /> : <FaEdit />}
      </button>
      <button
        className="py-2 px-3 bg-red-500 text-white rounded-r-md"
        onClick={deleteTodo}
      >
        <FaTrashAlt />
      </button>
    </div>
  )
}

export default TodoItem
