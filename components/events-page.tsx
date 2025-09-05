"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventsCampaigns } from "@/components/events-campaigns"

interface EventsPageProps {
  onBack?: () => void
}

export function EventsPage({ onBack }: EventsPageProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">الفعاليات والمبادرات</h1>
      </div>

      {/* Full Events Component */}
      <EventsCampaigns showAll={true} />
    </div>
  )
}
