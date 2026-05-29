import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import AuthGuard from "@/components/features/auth/AuthGuard"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <main className="flex flex-col min-h-screen">
                <Header />
                <div className="px-50 flex-grow">
                    {children}
                </div>
                <Footer />
            </main>
        </AuthGuard>
    );
}