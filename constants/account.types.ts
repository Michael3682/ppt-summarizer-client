export type AccountPreferencesProps = {
  language: string
  timezone: string
  onLanguageChange: (value: string) => void
  onTimezoneChange: (value: string) => void
}

export type SecuritySettingsProps = {
  currentPassword: string
  newPassword: string
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
}

export type SettingsFormState = {
  language: string
  timezone: string
  currentPassword: string
  newPassword: string
}