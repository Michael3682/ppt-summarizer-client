"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubscriptionCard() {
  return (
    <Card className="space-y-4 h-fit p-5 sm:p-8">
      <CardHeader className="p-0">
        <CardTitle className="text-base sm:text-lg font-semibold">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-0">
        <div className="rounded-xl border border-ring bg-transparent p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-tertiary">
                Current Plan
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-primary">Pro Member</p>
              <p className="max-w-xl text-xs sm:text-sm text-muted-foreground">
                Your next billing date is Oct 12, 2024 for $14.99.
              </p>
            </div>
            <Button className="text-sm sm:text-base cursor-pointer bg-tertiary text-white h-11 hover:bg-tertiary-foreground rounded-full px-6">Manage Billing</Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground">Need a different plan?</p>
          <button type="button" className="cursor-pointer text-xs sm:text-sm font-semibold text-tertiary">
            Compare Plans
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
