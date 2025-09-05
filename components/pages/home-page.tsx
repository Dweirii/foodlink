import { Camera, Lightbulb, Sparkles, Heart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import VoiceAssistant from "@/components/voice-assistant"
import { SmartTips } from "@/components/smart-tips"
import { EventsCampaigns } from "@/components/events-campaigns"

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background" dir="rtl">
      <div className="p-4 space-y-8">
        {/* Voice Assistant Card */}
        <VoiceAssistant avatarSrc="/images/salem.png" brand="emerald"/>

        <SmartTips />

        <EventsCampaigns />
      </div>
    </div>
  )
}
