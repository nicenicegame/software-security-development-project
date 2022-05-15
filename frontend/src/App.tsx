import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import TodoList from './pages/TodoList'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify'
import UserDashboard from './pages/admin/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 flex flex-col flex-grow">
        <Routes>
          <Route element={<ProtectedRoute redirectPath="/sign-in" />}>
            <Route index element={<TodoList />} />
          </Route>
          <Route
            path="admin"
            element={<ProtectedRoute requireAdmin redirectPath="/" />}>
            <Route path="users/:userId/todos" element={<TodoList />} />
            <Route path="users" element={<UserDashboard />} />
          </Route>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />
      </main>
    </div>
  )
}

export default App
