import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import AuthGuard from "@/components/features/auth/AuthGuard"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <main className="flex flex-col min-h-screen position-relative">
                <Header />
                <div className="px-4 py-4 sm:px-50 sm:py-6 flex-grow">
                    {children}
                </div>
                <Footer />
            </main>
        </AuthGuard>
    );
}