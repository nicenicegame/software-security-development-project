import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import TodoList from './pages/TodoList'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 flex flex-col flex-grow">
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
