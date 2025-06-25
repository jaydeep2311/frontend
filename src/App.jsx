import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
      <AuthProvider>
      <ToastContainer/>  
        <Router>
          <div className='app'>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path='/' element={<Navigate to="/login" replace/>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
