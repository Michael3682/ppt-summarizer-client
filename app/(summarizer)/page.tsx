import AuthGuard from "@/components/features/auth/AuthGuard"
import GenerateSummary from "@/components/features/summarizer/GenerateSummary"

export default function Page() {
    return (
        <AuthGuard>
            <GenerateSummary />
        </AuthGuard>
    )
}
