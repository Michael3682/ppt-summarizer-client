"use client"

import Link from "next/link"
import Logo from "@/components/common/Logo"
import { usePathname } from "next/navigation"
import LogoutButton from "@/components/features/auth/LogoutButton"

const navLinks = [
    { href: "/", label: "Summarizer" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
]

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="w-full flex justify-between items-center px-50 py-4 border-b border-ring-foreground">
            <div className="flex justify-center items-center gap-2">
                <Logo size={30} />
                <p className="text-2xl font-extrabold text-tertiary">AI Summarizer Pro</p>
            </div>
            <nav className="flex gap-7 list-none">
                {navLinks.map((link) => {
                    const isActive = link.href === "/"
                        ? pathname === "/" || pathname.startsWith("/results")
                        : pathname === link.href
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={
                                    `transition-colors p-2 ${isActive ? "font-semibold text-tertiary border-b border-tertiary-foreground" : "font-normal text-muted-foreground hover:text-primary"}`
                                }
                            >
                                {link.label}
                            </Link>
                        </li>
                    )
                })}
            </nav>
            <LogoutButton />
        </header>
    )
}