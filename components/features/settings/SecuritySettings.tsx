"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SecuritySettingsProps } from "@/constants/account.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function SecuritySettings({
  currentPassword,
  newPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
}: SecuritySettingsProps) {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-semibold">Security</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-normal" htmlFor="current-password">Current Password</Label>
            <Input
              className="text-xs sm:text-sm"
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(event) => onCurrentPasswordChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-normal" htmlFor="new-password">New Password</Label>
            <Input
              className="text-xs sm:text-sm"
              id="new-password"
              type="password"
              placeholder="Must be at least 8 characters"
              value={newPassword}
              onChange={(event) => onNewPasswordChange(event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
