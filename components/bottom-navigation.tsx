"use client"

import { Home, Heart, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home",        icon: Home,          label: "الرئيسية" },
    { id: "donate",      icon: Heart,         label: "تبرع" },
    { id: "complaints",  icon: MessageSquare, label: "شكاوى" },
    { id: "profile",     icon: User,          label: "الملف الشخصي" },
  ]

  return (
    <nav
      dir="rtl"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-card/95 backdrop-blur-xl border-t border-border shadow-[0_-6px_20px_-10px_rgba(0,0,0,0.25)]"
      )}
      // padding أسفل للـ notch / home indicator
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.5rem)" }}
      aria-label="التنقل السفلي"
    >
      <div className="mx-auto max-w-screen-md px-3">
        <div
          className={cn(
            "grid grid-cols-4 gap-2",
            "py-1"
          )}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative select-none touch-manipulation",
                  "h-16 w-full rounded-2xl border transition-all duration-300",
                  "flex flex-col items-center justify-center overflow-hidden",
                  isActive
                    ? "border-primary/40 text-primary-foreground"
                    : "border-transparent text-muted-foreground hover:text-primary"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
                    "bg-gradient-to-br from-primary to-accent",
                    isActive && "opacity-100"
                  )}
                />
                {!isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl bg-primary/5"
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 h-5 w-5 mb-1 transition-transform duration-300",
                    isActive ? "scale-110 text-white" : "group-hover:scale-105"
                  )}
                />

                <span
                  className={cn(
                    "relative z-10 text-[11px] font-semibold leading-none",
                    isActive ? "text-white" : "group-hover:text-primary"
                  )}
                >
                  {tab.label}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-1 start-6 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-300",
                    isActive ? "bg-white/85 opacity-100" : "opacity-0"
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
