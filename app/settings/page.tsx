import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import AuthGuard from "@/components/features/auth/AuthGuard"
import SettingsLayout from "@/components/features/settings/SettingsLayout"

export default function SettingsPage() {
  return (
    <AuthGuard>
      <Header />
      <SettingsLayout />
      <Footer />
    </AuthGuard>
  )
}
