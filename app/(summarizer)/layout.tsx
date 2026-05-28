import Header from "@/components/common/Header"
import AuthGuard from "@/components/features/auth/AuthGuard"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <main className="min-h-screen">
                <Header />
                <div className="px-50">
                    {children}
                </div>
            </main>
        </AuthGuard>
    );
}