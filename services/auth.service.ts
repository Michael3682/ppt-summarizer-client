import { z } from "zod"
import axiosInstance from "@/lib/axios"
import type { LoginFormData, SignupFormData } from "@/constants/auth.types"

export const loginSchema = z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
        name: z
            .string({ message: "Name is required" })
            .min(2, "Name must be at least 2 characters"),
        email: z.email("Invalid email format"),
        password: z
            .string({ message: "Password is required" })
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
})


export const authService = {
    login: async (data: LoginFormData) => {
        const response = await axiosInstance.post("api/auth/v1/login", data)
        return response.data
    },
    signup: async (data: SignupFormData) => {
        const response = await axiosInstance.post("api/auth/v1/signup", data)
        return response.data
    },
    logout: async () => {
        const response = await axiosInstance.post("api/auth/v1/logout")
        return response.data
    },
    refreshToken: async () => {
        const response = await axiosInstance.post("api/auth/v1/refresh-token")
        return response.data
    },
    verifyEmail: async (token: string) => {
        const response = await axiosInstance.get(`api/auth/v1/verify-email?token=${token}`)
        return response.data
    },
    getMe: async () => {
        const response = await axiosInstance.get("api/auth/v1/me")
        return response.data
    }
}