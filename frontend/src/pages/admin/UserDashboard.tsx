import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { Role } from '../../features/auth/authSlice'

function UserDashboard() {
  const { user } = useAppSelector((state) => state.auth)

  if (user?.role !== Role.ADMIN) {
    return <Navigate to={'/'} />
  }

  return <div>UserDashboard</div>
}

export default UserDashboard
