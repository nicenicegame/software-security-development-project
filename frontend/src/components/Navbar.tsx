import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { Role, signOut } from '../features/auth/authSlice'
import { FaClipboardList } from 'react-icons/fa'
import { googleLogout } from '@react-oauth/google'
import { setSelectedUserById } from '../features/users/usersSlice'

function Navbar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const signOutApp = () => {
    googleLogout()
    dispatch(signOut())
    dispatch(setSelectedUserById(null))
  }

  return (
    <header className="bg-teal-400 font-semibold">
      <nav className="max-w-3xl px-4 mx-auto flex items-center justify-between h-16">
        <Link to={'/'} className="text-2xl flex items-center gap-x-2">
          <FaClipboardList /> Tistdolo
        </Link>
        <ul className="flex gap-x-4">
          {user ? (
            <>
              {user.role === Role.ADMIN && (
                <li>
                  <Link to={'/admin/users'}>Admin</Link>
                </li>
              )}
              <li>
                <Link to={'/sign-in'} onClick={signOutApp}>
                  Sign out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={'/sign-in'}>Sign in</Link>
              </li>
              <li>
                <Link to={'/sign-up'}>Sign up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
