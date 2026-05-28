"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import React, { createContext, useContext, useState, useEffect } from "react"
import {
  authService,
  LoginFormData,
  SignupFormData,
} from "@/services/auth.service"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: LoginFormData) => Promise<void>
  signup: (data: SignupFormData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)

          const response = await authService.getMe()
          if (response.code !== 200) {
            throw new Error("Session invalid")
          }
          setUser(response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        } catch (e: any) {
          console.error("Session verification failed", e)

          const status = e.response?.status
          if (status === 401 || status === 403) {
            setUser(null)
            localStorage.removeItem("user")
          }
          console.log("[AuthContext]", e)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data)
      if (response.code === 200) {
        const userData = response.data.user
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/summarizer")
      } else {
        toast.error(response.message || "Login failed")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An unexpected error occurred"
      toast.error(message)
      throw error
    }
  }

  const signup = async (data: SignupFormData) => {
    try {
      const response = await authService.signup(data)
      if (response.code === 201 || response.code === 200) {
        toast.success(response.message)
        router.push("/login")
      } else {
        toast.error(response.message || "Signup failed")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An unexpected error occurred"
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      toast.success("Logged out successfully")
      router.push("/login")
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
