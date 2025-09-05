"use client"

import { useState } from "react"
import { Clock, CheckCircle, Truck, Package, Eye, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { DonationData } from "./donation-form"
import { cn } from "@/lib/utils"

interface DonationListProps {
  donations: DonationData[]
  onViewDetails?: (donation: DonationData) => void
}

type FilterKey = "all" | "pending" | "confirmed" | "collected" | "delivered"

export function DonationList({ donations, onViewDetails }: DonationListProps) {
  const [filter, setFilter] = useState<FilterKey>("all")

  const toDate = (d: unknown) => (d instanceof Date ? d : new Date(d as any))

  const filteredDonations = donations.filter((donation) => {
    if (filter === "all") return true
    return donation.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "collected":
        return <Package className="w-4 h-4" />
      case "delivered":
        return <Truck className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد المراجعة"
      case "confirmed":
        return "تم التأكيد"
      case "collected":
        return "تم الاستلام"
      case "delivered":
        return "تم التوصيل"
      default:
        return "غير محدد"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "collected":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric" }).format(date)

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? "—"
      : new Intl.DateTimeFormat("ar-SA", { month: "short", day: "numeric" }).format(date)
  }

  const daysUntil = (dateString: string) => {
    const expiry = new Date(dateString)
    if (isNaN(expiry.getTime())) return null
    const today = new Date()
    expiry.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const pluralDaysAr = (n: number) => {
    if (n === 0) return "اليوم"
    if (n === 1) return "يوم"
    if (n === 2) return "يومان"
    if (n <= 10) return "أيام"
    return "يومًا"
  }

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: "الكل" },
    { key: "pending", label: "قيد المراجعة" },
    { key: "confirmed", label: "تم التأكيد" },
    { key: "collected", label: "تم الاستلام" },
    { key: "delivered", label: "تم التوصيل" },
  ]

  return (
    <div className="space-y-4" dir="rtl">
      {/* Filter Tabs */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.key)}
            className="whitespace-nowrap"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Donations List */}
      {filteredDonations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">لا توجد تبرعات</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "لم تقم بأي تبرعات بعد" : `لا توجد تبرعات ${getStatusText(filter)}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDonations.map((donation) => {
            const days = daysUntil(donation.expiryDate)
            const isExpiringSoon = typeof days === "number" && days >= 0 && days <= 2
            const createdAtDate = toDate(donation.createdAt)
            const centerName = donation.donationCenter ? donation.donationCenter.split(" - ")[0] : "—"

            return (
              <Card
                key={donation.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewDetails?.(donation)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onViewDetails?.(donation)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="space-y-3 text-right">
                    {/* Header */}
                    <div className="flex items-start justify-between rtl:flex-row-reverse">
                      {/* المحتوى (يمين في RTL) */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                          {donation.quantity} {donation.unit} {donation.foodName}
                        </h3>
                        <div className="flex items-center gap-2 rtl:flex-row-reverse">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rtl:flex-row-reverse text-xs rounded-md px-2 py-0.5 border",
                              getStatusColor(donation.status)
                            )}
                          >
                            {getStatusIcon(donation.status)}
                            <span>{getStatusText(donation.status)}</span>
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {donation.category || "عام"}
                          </Badge>
                        </div>
                      </div>

                      {/* زر العرض (يسار في RTL) */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewDetails?.(donation)
                        }}
                        aria-label="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Expiry Warning */}
                    {isExpiringSoon && donation.status !== "delivered" && (
                      <div className="flex items-center gap-2 rtl:flex-row-reverse p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-orange-700">
                          ينتهي خلال {days} {pluralDaysAr(days!)}
                        </span>
                      </div>
                    )}

                    {/* Image Preview */}
                    {donation.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={donation.image || "/placeholder.svg"}
                        alt="صورة التبرع"
                        className="w-full h-24 object-cover rounded-lg"
                        loading="lazy"
                      />
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground rtl:flex-row-reverse">
                      <div className="flex items-center gap-1 rtl:flex-row-reverse">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(createdAtDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 rtl:flex-row-reverse">
                        <span>ينتهي: {formatExpiryDate(donation.expiryDate)}</span>
                      </div>
                    </div>

                    {/* Donation Center */}
                    <div className="flex items-center gap-1 rtl:flex-row-reverse text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{centerName}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
