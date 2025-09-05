"use client"

import { Home, Heart, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "donate", icon: Heart, label: "تبرع" },
    { id: "complaints", icon: MessageSquare, label: "شكاوى" },
    { id: "profile", icon: User, label: "الملف الشخصي" },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl border-t border-border shadow-2xl"
      dir="rtl"
    >
      <div className="flex flex-row-reverse items-center justify-around py-3 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300",
                "min-w-[70px] min-h-[70px] relative overflow-hidden group",
                isActive
                  ? "text-white bg-primary shadow-lg scale-105 border border-primary/50"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-105",
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl"></div>
              )}
              <Icon
                className={cn(
                  "w-6 h-6 mb-2 transition-all duration-300 relative z-10",
                  isActive && "scale-110 text-white",
                )}
              />
              <span
                className={cn(
                  "text-xs font-semibold relative z-10 text-center leading-tight",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-primary",
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 start-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/80 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
