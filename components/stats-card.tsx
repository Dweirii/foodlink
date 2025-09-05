"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type ColorKey = "primary" | "secondary" | "accent" | "success" | "warning"

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string } // e.g., { value: +12, label: "هذا الأسبوع" }
  color?: ColorKey
  emphasize?: boolean              // makes the number bigger
  animate?: boolean                // count-up effect for numbers
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  emphasize = true,
  animate = false,
  className,
}: StatsCardProps) {
  // theme-aware color bubbles (no brand drift)
  const colorClasses: Record<ColorKey, string> = {
    primary: "bg-primary/12 text-primary",
    secondary: "bg-secondary/12 text-secondary",
    accent: "bg-accent/12 text-accent",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  }

  // Count-up (only when value is numeric and animate=true)
  const numericTarget = useMemo(() => (typeof value === "number" ? value : Number.NaN), [value])
  const [animatedValue, setAnimatedValue] = useState<number>(numericTarget)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!animate || Number.isNaN(numericTarget)) {
      setAnimatedValue(numericTarget)
      return
    }
    const duration = 650
    const start = performance.now()
    const from = 0

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setAnimatedValue(Math.round(from + (numericTarget - from) * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [animate, numericTarget])

  const displayValue =
    animate && !Number.isNaN(numericTarget) ? animatedValue.toLocaleString("ar-EG") : String(value)

  const trendColor =
    trend?.value === 0
      ? "text-muted-foreground"
      : trend && trend.value > 0
      ? "text-emerald-600"
      : "text-rose-600"

  const TrendIcon = trend
    ? trend.value > 0
      ? ArrowUpRight
      : trend.value < 0
      ? ArrowDownRight
      : null
    : null

  return (
    <Card
      className={cn(
        "relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-[1px]",
        "shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      {/* Floating icon badge */}
      <div
        className={cn(
          "absolute -top-3 -left-3 rtl:-right-3 rtl:left-auto",
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-border/50",
          colorClasses[color]
        )}
      >
        <Icon className="w-6 h-6" />
      </div>

      <CardContent className="p-5 pt-7" dir="rtl">
        {/* Title */}
        <p className="text-sm text-muted-foreground font-medium mb-1.5">{title}</p>

        {/* Value + Trend */}
        <div className="flex items-center justify-end gap-3">
          <h3
            className={cn(
              "font-extrabold text-2xl tracking-tight text-foreground",
              emphasize && "text-3xl"
            )}
          >
            {displayValue}
          </h3>
        </div>

        {/* Subtitle / Trend label */}
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{subtitle}</span>
          {trend?.label && <span className="text-muted-foreground">{trend.label}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
