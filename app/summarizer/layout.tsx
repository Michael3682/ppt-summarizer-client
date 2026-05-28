import Header from "@/components/common/Header"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="px-50">
                {children}
            </div>
        </main>
    );
}