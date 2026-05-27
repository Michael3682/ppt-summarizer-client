import Logo from "@/components/common/Logo"
import Section from "@/components/common/Section"
import AuthGuard from "@/components/features/auth/AuthGuard"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard mode="GUEST">
            <main className="flex min-h-screen flex-col items-center justify-center py-12 space-y-4">
                <Section className="w-full max-w-md !py-0">
                    <div className="flex flex-col items-center text-center mb-10 gap-2">
                        <Logo/>
                        <p className="font-extrabold text-4xl text-tertiary uppercase">{"[ ai summarizer pro]"}</p>
                        <p className="text-muted-foreground">
                            Simplify your presentations cleanly.
                        </p>
                    </div>
                    {children}
                </Section>
            </main>
        </AuthGuard>
    );
}