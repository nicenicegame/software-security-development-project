import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

type ProtectedRouteProps = {
  redirectPath: string
}

function ProtectedRoute({ redirectPath }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
