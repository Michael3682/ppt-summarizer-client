'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface AuthGuardProps {
  children: React.ReactNode;
  mode?: "GUEST" | "PRIVATE";
}

export default function AuthGuard({ children, mode = "PRIVATE" }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (mode === "GUEST" && isAuthenticated) {
      router.push("/")
    } else if (mode === "PRIVATE" && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, mode, router])

  if (isLoading ||
     (mode === "GUEST" && isAuthenticated) ||
     (mode === "PRIVATE" && !isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}