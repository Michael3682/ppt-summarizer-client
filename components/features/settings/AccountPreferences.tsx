"use client"

import { Label } from "@/components/ui/label"
import type { AccountPreferencesProps } from "@/constants/account.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const languages = ["English (US)", "English (UK)", "Spanish (ES)"]
const timezones = [
  "(GMT-12:00) International Date Line West",
  "(GMT-08:00) Pacific Time",
  "(GMT-05:00) Eastern Time",
  "(GMT+00:00) UTC",
]

export default function AccountPreferences({
  language,
  timezone,
  onLanguageChange,
  onTimezoneChange,
}: AccountPreferencesProps) {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold">Account Preferences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-normal" htmlFor="language">Language</Label>
            <select
              id="language"
              value={language}
              onChange={(event) => onLanguageChange(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs sm:text-sm text-muted-foreground outline-none transition focus:border-ring focus-visible:ring-ring/50"
            >
              {languages.map((option) => (
                <option className="text-xs sm:text-sm" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-normal" htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              value={timezone}
              onChange={(event) => onTimezoneChange(event.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs sm:text-sm text-muted-foreground outline-none transition focus:border-ring focus-visible:ring-ring/50"
            >
              {timezones.map((option) => (
                <option className="text-xs sm:text-sm" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
