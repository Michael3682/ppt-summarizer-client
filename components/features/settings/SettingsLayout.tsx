"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { authService } from "@/services/auth.service"
import type { SettingsFormState } from "@/constants/account.types"
import UserProfile from "@/components/features/settings/UserProfile"
import SecuritySettings from "@/components/features/settings/SecuritySettings"
import AccountPreferences from "@/components/features/settings/AccountPreferences"
import SubscriptionCard from "@/components/features/settings/SubscriptionCard"

const defaultLanguage = "English (US)"
const defaultTimezone = "(GMT-08:00) Pacific Time"

export default function SettingsLayout() {
  const { user } = useAuth()
  const [form, setForm] = useState<SettingsFormState>({
    language: defaultLanguage,
    timezone: defaultTimezone,
    currentPassword: "",
    newPassword: "",
  })
  const [savedState, setSavedState] = useState<SettingsFormState>(form)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) return

    const initialState: SettingsFormState = {
      language: defaultLanguage,
      timezone: defaultTimezone,
      currentPassword: "",
      newPassword: "",
    }

    setForm(initialState)
    setSavedState(initialState)
  }, [user])

  const handleFieldChange = (field: keyof SettingsFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleDiscard = () => {
    setForm(savedState)
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      let hasSavedSomething = false

      if (form.currentPassword || form.newPassword) {
        if (!form.currentPassword || !form.newPassword) {
          throw new Error("Please fill both current and new password fields")
        }

        const response = await authService.changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })

        if (response.code !== 200) {
          throw new Error(response.message || "Unable to change password")
        }

        toast.success(response.message || "Password changed successfully")
        setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }))
        hasSavedSomething = true
      }

      if (!hasSavedSomething) {
        toast.success("No changes to save")
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to save preferences")
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[320px] px-4 py-10 text-muted-foreground">
        Loading account settings...
      </div>
    )
  }

  return (
    <main className="flex-grow mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Account Settings
          </p>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Manage your profile and security settings
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <UserProfile />
            <AccountPreferences
              language={form.language}
              timezone={form.timezone}
              onLanguageChange={(value) => handleFieldChange("language", value)}
              onTimezoneChange={(value) => handleFieldChange("timezone", value)}
            />
            <SecuritySettings
              currentPassword={form.currentPassword}
              newPassword={form.newPassword}
              onCurrentPasswordChange={(value) => handleFieldChange("currentPassword", value)}
              onNewPasswordChange={(value) => handleFieldChange("newPassword", value)}
            />
          </div>
          <SubscriptionCard />
        </div>

        <div className="flex justify-end gap-3">
          <Button className="text-xs sm:text-base border border-tertiary bg-transparent text-primary hover:bg-tertiary hover:text-white cursor-pointer" onClick={handleDiscard} disabled={isSaving}>
            Discard Changes
          </Button>
          <Button className="text-xs sm:text-base cursor-pointer bg-tertiary text-white hover:bg-tertiary-foreground" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </main>
  )
}
