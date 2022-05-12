import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="bg-teal-400 font-semibold">
      <nav className="max-w-3xl px-4 mx-auto flex items-center justify-between h-16">
        <Link to={'/'} className="text-2xl">
          Logo
        </Link>
        <ul className="flex gap-x-4">
          <li>
            <Link to={'/sign-in'}>Sign in</Link>
          </li>
          <li>
            <Link to={'/sign-up'}>Sign up</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
