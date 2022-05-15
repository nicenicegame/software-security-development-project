import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Spinner from '../../components/Spinner'
import { getUserTodos } from '../../features/todos/todosSlice'
import { Link } from 'react-router-dom'
import { getUsers, setSelectedUserById } from '../../features/users/usersSlice'

function UserDashboard() {
  const dispatch = useAppDispatch()
  const {
    users,
    selectedUser,
    isLoading: loadUsers
  } = useAppSelector((state) => state.users)
  const { userTodos, isLoading: loadTodos } = useAppSelector(
    (state) => state.todos
  )

  useEffect(() => {
    ;(async () => {
      await dispatch(getUsers())

      if (selectedUser) {
        await dispatch(getUserTodos(selectedUser.id))
      }
    })()
  }, [dispatch, selectedUser])

  const onSelectUser = async (userId: string) => {
    dispatch(setSelectedUserById(userId))
    await dispatch(getUserTodos(userId))
  }

  const getCompletedAmount = useMemo(
    () => userTodos.filter((todo) => todo.completed).length,
    [userTodos]
  )

  const getUnCompletedAmount = useMemo(
    () => userTodos.filter((todo) => !todo.completed).length,
    [userTodos]
  )

  if (loadTodos || loadUsers) {
    return <Spinner />
  }

  return (
    <div>
      <h1 className="font-medium text-3xl my-4">Users</h1>
      <div className="sm:grid sm:grid-cols-2 sm:divide-x">
        <div className="flex flex-col divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className={`py-3 cursor-pointer ${
                user.id === selectedUser?.id ? 'bg-slate-100' : 'bg-white'
              }`}
              onClick={() => onSelectUser(user.id)}>
              <h1 className="font-bold">{user.name}</h1>
              <h3 className="text-slate-500">{user.email}</h3>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {selectedUser ? (
            <div className="flex-grow flex flex-col items-center justify-center">
              <h1 className="text-xl font-semibold">{selectedUser.name}</h1>
              <h3 className="text-slate-500 mt-2 mb-6">{selectedUser.email}</h3>
              <p className="px-3 py-1 text-sm rounded-full bg-teal-200">
                {userTodos.length} active todo items
              </p>
              <div className="mt-3 mb-5 text-xs">
                <div className="flex gap-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>{getCompletedAmount} completed</span>
                </div>
                <div className="flex gap-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{getUnCompletedAmount} uncompleted</span>
                </div>
              </div>
              <Link to={`${selectedUser.id}/todos`}>
                <button className="my-2 py-2 px-3 bg-teal-500 text-white rounded-md">
                  Manage tasks
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p>Select user to view profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
