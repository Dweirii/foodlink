"use client"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Trophy, Heart, MessageSquare, Lightbulb, Star, Award } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: "trophy" | "heart" | "message" | "lightbulb" | "star" | "award"
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: "sm" | "md" | "lg"
}

export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const icons = {
    trophy: Trophy,
    heart: Heart,
    message: MessageSquare,
    lightbulb: Lightbulb,
    star: Star,
    award: Award,
  }

  const Icon = icons[achievement.icon]

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", !achievement.unlocked && "opacity-60")}>
      <CardContent className="p-4 text-center">
        <div className="space-y-2">
          <div
            className={cn(
              "rounded-full flex items-center justify-center mx-auto",
              sizeClasses[size],
              achievement.unlocked
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30",
            )}
          >
            <Icon className={iconSizes[size]} />
          </div>
          <div>
            <h4 className={cn("font-semibold", size === "sm" ? "text-xs" : "text-sm")}>{achievement.title}</h4>
            <p className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-xs")}>
              {achievement.description}
            </p>
            {achievement.progress !== undefined && achievement.maxProgress && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
