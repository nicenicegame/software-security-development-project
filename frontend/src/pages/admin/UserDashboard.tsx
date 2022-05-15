import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getUserTodos } from '../../features/todos/todosSlice'
import { getUsers, setSelectedUserById } from '../../features/users/usersSlice'

function UserDashboard() {
  const dispatch = useAppDispatch()
  const { users, selectedUser } = useAppSelector((state) => state.users)
  const { userTodos } = useAppSelector((state) => state.todos)

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const onSelectUser = async (userId: string) => {
    await dispatch(setSelectedUserById(userId))
    await dispatch(getUserTodos(selectedUser?.id!))
  }

  return (
    <div>
      <h1 className="font-medium text-3xl my-4">Users</h1>
      <div className="sm:grid sm:grid-cols-2 sm:divide-x">
        <div className="flex flex-col divide-y">
          {users.map((user) => (
            <div
              key={user.id}
              className={`py-3`}
              onClick={() => onSelectUser(user.id)}>
              <h1>{user.name}</h1>
              <h3>{user.email}</h3>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {selectedUser ? (
            <>
              <h1>{selectedUser.name}</h1>
              <h3>{selectedUser.email}</h3>
              <p>{userTodos.length}</p>
            </>
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
