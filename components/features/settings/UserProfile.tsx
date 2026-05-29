"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserProfileProps } from "@/constants/account.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function UserProfile({ name, email }: UserProfileProps) {
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-base font-semibold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" value={name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-address">Email Address</Label>
              <Input id="email-address" value={email} disabled />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
