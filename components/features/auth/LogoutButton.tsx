"use client"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function LogoutButton() {
    const { logout } = useAuth()

    return (
        <Button
            variant="outline"
            className="text-xs sm:text-base cursor-pointer"
            onClick={logout}
        >
            Log Out
        </Button>
    )
}
