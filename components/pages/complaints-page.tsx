"use client"

import { useState } from "react"
import { Angry, Plus } from "lucide-react"
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
            <div
              dir="rtl"
              className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4 bg-gradient-to-r from-accent/10 to-primary/5 p-6 rounded-2xl border border-accent/20"
            >
              <Button
                onClick={() => setViewMode("form")}
                size={"lg"}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 rtl:flex-row-reverse w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>تقديم شكوى</span>
              </Button>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-end gap-3 rtl:flex-row-reverse">
                  <span>الشكاوى والملاحظات</span>
                </h1>
              </div>
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
