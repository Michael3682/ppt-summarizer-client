"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { authService } from "@/services/auth.service"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Status = "loading" | "success" | "error" | "missing"

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<Status>(token ? "loading" : "missing")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const hasVerified = useRef(false)

    useEffect(() => {
        if (!token || hasVerified.current) return
        hasVerified.current = true

        const verify = async () => {
            try {
                await authService.verifyEmail(token)
                setStatus("success")
            } catch (error: unknown) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                setErrorMessage(axiosError.response?.data?.message || "Verification failed. The link may have expired.")
                setStatus("error")
            }
        }

        verify()
    }, [token])

    return (
        <Card className="w-full">
            <CardContent className="flex flex-col items-center text-center gap-3 pt-2">
                {status === "loading" && (
                    <>
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-tertiary border-t-transparent" />
                        <p className="text-muted-foreground">Verifying your email...</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <p className="text-2xl font-bold">Email Verified!</p>
                        <p className="text-muted-foreground text-sm">
                            Your email has been verified. You can now log in.
                        </p>
                    </>
                )}
                {status === "error" && (
                    <>
                        <p className="text-2xl font-bold">Verification Failed</p>
                        <p className="text-muted-foreground text-sm">{errorMessage}</p>
                    </>
                )}
                {status === "missing" && (
                    <>
                        <p className="text-2xl font-bold">Invalid Link</p>
                        <p className="text-muted-foreground text-sm">
                            No verification token found. Please use the link sent to your email.
                        </p>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                {status === "success" && (
                    <Button asChild className="w-full bg-tertiary text-white dark:text-white hover:bg-tertiary-foreground cursor-pointer">
                        <Link href="/login">Go to Login</Link>
                    </Button>
                )}
                {(status === "error" || status === "missing") && (
                    <>
                        <Button asChild variant="outline" className="w-full cursor-pointer">
                            <Link href="/signup">Back to Sign Up</Link>
                        </Button>
                        <Button asChild className="w-full bg-tertiary text-white dark:text-white hover:bg-tertiary-foreground cursor-pointer">
                            <Link href="/login">Go to Login</Link>
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
