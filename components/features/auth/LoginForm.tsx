"use client"

import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { LoginFormData } from "@/constants/auth.types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export default function LoginForm() {
  const { login } = useAuth()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      toast.success("Login Successful!")
    } catch (error) {
      console.log("[Login Error]", error)
    }
  }
  return (
    <Card className="max-w-auto w-full">
      <CardContent className="w-full">
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm sm:text-base" htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    className="text-xs sm:text-sm"
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm sm:text-base" htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    className="text-xs sm:text-sm"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="login-form"
          className="w-full text-xs sm:text-base sm:py-5 cursor-pointer bg-tertiary text-white hover:bg-tertiary-foreground dark:text-white"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Logging in..." : "[ Log In ]"}
        </Button>
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-tertiary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
