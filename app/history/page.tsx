import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import AuthGuard from "@/components/features/auth/AuthGuard"
import HistoryList from "@/components/features/history/HistoryList"

export default function HistoryPage() {
  return (
    <AuthGuard>
      <Header />
      <HistoryList />
      <Footer />
    </AuthGuard>
  )
}