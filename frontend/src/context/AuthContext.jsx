import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    if (token && name) {
      setUser({ name, email, token })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, name } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    setUser({ name, email, token })
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('name', name)
    localStorage.setItem('email', email)
    setUser({ name, email, token })
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
