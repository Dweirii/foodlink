"use client"

import { ArrowRight, Calendar, MapPin, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ComplaintData } from "./complaint-form"
import { cn } from "@/lib/utils"

interface ComplaintDetailsProps {
  complaint: ComplaintData
  onBack?: () => void
}

export function ComplaintDetails({ complaint, onBack }: ComplaintDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-review":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "in-review":
        return "قيد المراجعة"
      case "resolved":
        return "تم الحل"
      default:
        return "غير محدد"
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

  const mockUpdates = [
    {
      id: "1",
      message: "تم استلام شكواكم وسيتم مراجعتها خلال 24 ساعة",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: "فريق خدمة العملاء",
    },
    {
      id: "2",
      message: "جاري التحقق من المعلومات المقدمة",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      author: "قسم الجودة",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        <h1 className="text-xl font-bold">تفاصيل الشكوى</h1>
      </div>

      {/* Main Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">{complaint.title}</CardTitle>
              <Badge variant="outline" className={cn("w-fit", getStatusColor(complaint.status))}>
                {getStatusText(complaint.status)}
              </Badge>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category */}
          <div>
            <h4 className="font-semibold text-sm mb-1">التصنيف</h4>
            <Badge variant="secondary">{complaint.category}</Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-sm mb-2">تفاصيل الشكوى</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{complaint.description}</p>
          </div>

          {/* Image */}
          {complaint.image && (
            <div>
              <h4 className="font-semibold text-sm mb-2">الصورة المرفقة</h4>
              <img
                src={complaint.image || "/placeholder.svg"}
                alt="Complaint evidence"
                className="w-full max-w-sm rounded-lg border"
              />
            </div>
          )}

          {/* Location */}
          <div>
            <h4 className="font-semibold text-sm mb-2">الموقع</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{complaint.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageSquare className="w-5 h-5 ml-2" />
            تحديثات الشكوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockUpdates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">لا توجد تحديثات بعد</p>
          ) : (
            <div className="space-y-4">
              {mockUpdates.map((update, index) => (
                <div key={update.id}>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{update.author}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(update.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.message}</p>
                    </div>
                  </div>
                  {index < mockUpdates.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
