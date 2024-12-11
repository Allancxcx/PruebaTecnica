import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && !router.pathname.includes('/login') && !router.pathname.includes('/register')) {
      router.push('/login')
    } else if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    router.push('/login')
  }

  return { isAuthenticated, isLoading, logout }
}