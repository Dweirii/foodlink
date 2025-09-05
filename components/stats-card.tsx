"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  color?: "primary" | "secondary" | "accent" | "success" | "warning"
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn("font-medium", trend.value > 0 ? "text-green-600" : "text-red-600")}>
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
