"use client"

import { ArrowRight, Calendar, MapPin, Package, Clock, CheckCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { DonationData } from "./donation-form"
import { cn } from "@/lib/utils"

interface DonationDetailsProps {
  donation: DonationData
  onBack?: () => void
}

export function DonationDetails({ donation, onBack }: DonationDetailsProps) {
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

  const getProgressValue = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "confirmed":
        return 50
      case "collected":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getDaysUntilExpiry = (dateString: string) => {
    const expiryDate = new Date(dateString)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const statusSteps = [
    { status: "pending", label: "تم الإرسال", icon: Clock },
    { status: "confirmed", label: "تم التأكيد", icon: CheckCircle },
    { status: "collected", label: "تم الاستلام", icon: Package },
    { status: "delivered", label: "تم التوصيل", icon: Truck },
  ]

  const currentStepIndex = statusSteps.findIndex((step) => step.status === donation.status)
  const daysUntilExpiry = getDaysUntilExpiry(donation.expiryDate)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-xl font-bold">تفاصيل التبرع</h1>
      </div>

      {/* Status Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn("text-sm", getStatusColor(donation.status))}>
                {getStatusText(donation.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">{getProgressValue(donation.status)}% مكتمل</span>
            </div>
            <Progress value={getProgressValue(donation.status)} className="h-2" />
            <div className="flex justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex

                return (
                  <div key={step.status} className="flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                        isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        isCurrent && "ring-2 ring-primary ring-offset-2",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-xs", isCompleted ? "text-primary" : "text-muted-foreground")}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {donation.quantity} {donation.unit} {donation.foodName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category and Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">التصنيف</h4>
              <Badge variant="secondary">{donation.category}</Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">تاريخ انتهاء الصلاحية</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatExpiryDate(donation.expiryDate)}</span>
                {daysUntilExpiry <= 2 && donation.status !== "delivered" && (
                  <Badge variant="destructive" className="text-xs">
                    {daysUntilExpiry} {daysUntilExpiry === 1 ? "يوم" : "أيام"} متبقية
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {donation.description && (
            <div>
              <h4 className="font-semibold text-sm mb-2">وصف إضافي</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{donation.description}</p>
            </div>
          )}

          {/* Image */}
          {donation.image && (
            <div>
              <h4 className="font-semibold text-sm mb-2">صورة الطعام</h4>
              <img
                src={donation.image || "/placeholder.svg"}
                alt="Food donation"
                className="w-full max-w-sm rounded-lg border"
              />
            </div>
          )}

          {/* Donation Center */}
          <div>
            <h4 className="font-semibold text-sm mb-2">مركز التبرع</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{donation.donationCenter}</span>
            </div>
          </div>

          {/* Creation Date */}
          <div>
            <h4 className="font-semibold text-sm mb-2">تاريخ التبرع</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(donation.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-primary mb-2">شكراً لك على تبرعك!</h3>
          <p className="text-sm text-muted-foreground text-balance">
            تبرعك يساهم في مكافحة هدر الطعام وإطعام المحتاجين في مجتمعك
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
