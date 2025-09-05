"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SmartTips } from "@/components/smart-tips"

interface TipsPageProps {
  onBack?: () => void
}

export function TipsPage({ onBack }: TipsPageProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-primary">النصائح الذكية</h1>
      </div>

      {/* Full Tips Component */}
      <SmartTips showAll={true} />
    </div>
  )
}
