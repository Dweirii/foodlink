"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ComplaintForm, type ComplaintData } from "@/components/complaint-form"
import { ComplaintList } from "@/components/complaint-list"
import { ComplaintDetails } from "@/components/complaint-details"

type ViewMode = "list" | "form" | "details"

export function ComplaintsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [complaints, setComplaints] = useState<ComplaintData[]>([
    {
      id: "1",
      title: "طعام منتهي الصلاحية في السوبر ماركت",
      description: "وجدت منتجات ألبان منتهية الصلاحية معروضة للبيع في قسم الألبان",
      location: "الرياض، حي النخيل، سوبر ماركت الأسرة",
      status: "in-review",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: "انتهاء الصلاحية",
    },
    {
      id: "2",
      title: "أسعار مرتفعة بشكل غير مبرر",
      description: "ارتفاع مفاجئ في أسعار الخضروات دون مبرر واضح",
      location: "جدة، حي الصفا، سوق الخضار المركزي",
      status: "resolved",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: "الأسعار",
    },
  ])
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null)

  const handleSubmitComplaint = (complaint: ComplaintData) => {
    setComplaints((prev) => [complaint, ...prev])
    setViewMode("list")
  }

  const handleViewDetails = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint)
    setViewMode("details")
  }

  const renderContent = () => {
    switch (viewMode) {
      case "form":
        return <ComplaintForm onSubmit={handleSubmitComplaint} onCancel={() => setViewMode("list")} />
      case "details":
        return selectedComplaint ? (
          <ComplaintDetails complaint={selectedComplaint} onBack={() => setViewMode("list")} />
        ) : null
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/5 p-6 rounded-2xl border border-primary/20">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">الشكاوى والبلاغات</h1>
                <p className="text-muted-foreground">تابع شكاواك وقدم بلاغات جديدة</p>
              </div>
              <Button
                onClick={() => setViewMode("form")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 ml-2" />
                شكوى جديدة
              </Button>
            </div>
            <ComplaintList complaints={complaints} onViewDetails={handleViewDetails} />
          </div>
        )
    }
  }

  return (
    <div className="p-6" dir="rtl">
      {renderContent()}
    </div>
  )
}
