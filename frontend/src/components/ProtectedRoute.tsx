import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { Role } from '../features/auth/authSlice'

type ProtectedRouteProps = {
  redirectPath: string
  requireAdmin?: boolean
}

function ProtectedRoute({ redirectPath, requireAdmin }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user || (requireAdmin && user.role !== Role.ADMIN)) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
