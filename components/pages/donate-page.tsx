"use client"

import { useState } from "react"
import { Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DonationForm, type DonationData } from "@/components/donation-form"
import { DonationList } from "@/components/donation-list"
import { DonationDetails } from "@/components/donation-details"

type ViewMode = "list" | "form" | "details"

export function DonatePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [donations, setDonations] = useState<DonationData[]>([
    {
      id: "1",
      foodName: "تفاح أحمر",
      quantity: "5",
      unit: "كيلو",
      expiryDate: "2024-03-20",
      description: "تفاح طازج من المزرعة، حالة ممتازة",
      donationCenter: "مركز الخير للتبرعات - حي النخيل (0.8 كم)",
      status: "delivered",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: "فواكه",
    },
    {
      id: "2",
      foodName: "خبز أبيض",
      quantity: "10",
      unit: "قطعة",
      expiryDate: "2024-03-18",
      description: "خبز طازج من المخبز",
      donationCenter: "جمعية البر الخيرية - حي الملز (1.2 كم)",
      status: "collected",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: "مخبوزات",
    },
  ])
  const [selectedDonation, setSelectedDonation] = useState<DonationData | null>(null)

  const handleSubmitDonation = (donation: DonationData) => {
    const safeDonation: DonationData = {
      ...donation,
      id: donation.id || `${Date.now()}`,
      createdAt: donation.createdAt ? new Date(donation.createdAt) : new Date(),
    }
    setDonations((prev) => [safeDonation, ...prev])
    setViewMode("list")
  }

  const handleViewDetails = (donation: DonationData) => {
    setSelectedDonation(donation)
    setViewMode("details")
  }

  const getTotalDonations = () => donations.length
  const getDeliveredDonations = () => donations.filter((d) => d.status === "delivered").length

  const renderContent = () => {
    switch (viewMode) {
      case "form":
        return <DonationForm onSubmit={handleSubmitDonation} onCancel={() => setViewMode("list")} />
      case "details":
        return selectedDonation ? (
          <DonationDetails donation={selectedDonation} onBack={() => setViewMode("list")} />
        ) : null
      default:
        return (
          <div className="space-y-6">
         {/* Hero */}
            <div
              dir="rtl"
              className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4 bg-gradient-to-r from-accent/10 to-primary/5 p-6 rounded-2xl border border-accent/20"
            >
              <Button
                onClick={() => setViewMode("form")}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 rtl:flex-row-reverse w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>تبرع جديد</span>
              </Button>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-end gap-3 rtl:flex-row-reverse">
                  <span>تبرع بالطعام</span>
                </h1>
                <p className="text-muted-foreground">شارك الخير وقلل من هدر الطعام</p>
              </div>
            </div>

            {/* Impact */}
            <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/30 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-primary flex items-center justify-end gap-2 rtl:flex-row-reverse">
                  <span>أثرك في المجتمع</span>
                  <Heart className="w-6 h-6 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-foreground leading-relaxed text-balance">
                  بفضل تبرعاتك، ساهمت في تقليل هدر الطعام وإطعام{" "}
                  <span className="font-bold text-primary arabic-nums">{getDeliveredDonations() * 3}</span> شخص محتاج في
                  مجتمعك
                </p>
              </CardContent>
            </Card>

            {/* Donations List */}
            <DonationList donations={donations} onViewDetails={handleViewDetails} />
          </div>
        )
    }
  }

  return (
    <div className="p-6 max-w-screen-md mx-auto" dir="rtl">
      {renderContent()}
    </div>
  )
}
