"use client"

import Link from "next/link"
import Logo from "@/components/common/Logo"
import { usePathname } from "next/navigation"
import LogoutButton from "@/components/features/auth/LogoutButton"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useState } from "react"

const navLinks = [
    { href: "/", label: "Summarizer" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
]

export default function Header() {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 sm:px-50 border-b border-ring-foreground bg-background backdrop-blur-sm">
            <div className="flex justify-center items-center gap-2">
                <Logo size={isMobile ? 20 : 40} />
                <p className="sm:text-2xl font-extrabold text-tertiary">AI Summarizer Pro</p>
            </div>

            {isMobile ? (
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-2xl p-2 hover:opacity-70 transition-opacity"
                        aria-label="Toggle menu"
                    >
                        ☰
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-background border border-ring rounded-md shadow-lg p-2 w-48 z-[9999]">
                            <nav className="flex flex-col">
                                {navLinks.map((link) => {
                                    const isActive = link.href === "/"
                                        ? pathname === "/" || pathname.startsWith("/results")
                                        : pathname === link.href
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={
                                                `text-sm transition-colors p-2 ${isActive ? "font-semibold text-tertiary" : "font-normal text-muted-foreground hover:text-primary"}`
                                            }
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                                <hr className="my-2 border-ring-foreground" />
                                <LogoutButton />
                            </nav>
                        </div>
                    )}
                </div>
            ) : (
                <>
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
                </>
            )}
        </header>
    )
}
