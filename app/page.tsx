"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomePage } from "@/components/pages/home-page"
import { DonatePage } from "@/components/pages/donate-page"
import { ComplaintsPage } from "@/components/pages/complaints-page"
import { ProfilePage } from "@/components/pages/profile-page"

export default function App() {
  const [activeTab, setActiveTab] = useState("home")

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />
      case "donate":
        return <DonatePage />
      case "complaints":
        return <ComplaintsPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {renderPage()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
