"use client"

import { useState } from "react"
import { Clock, CheckCircle, AlertCircle, Eye, Calendar, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ComplaintData } from "./complaint-form"
import { cn } from "@/lib/utils"

interface ComplaintListProps {
  complaints: ComplaintData[]
  onViewDetails?: (complaint: ComplaintData) => void
}

export function ComplaintList({ complaints, onViewDetails }: ComplaintListProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "in-review" | "resolved">("all")

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === "all") return true
    return complaint.status === filter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in-review":
        return <AlertCircle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: "all", label: "الكل" },
          { key: "pending", label: "قيد الانتظار" },
          { key: "in-review", label: "قيد المراجعة" },
          { key: "resolved", label: "تم الحل" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tab.key as any)}
            className="whitespace-nowrap"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">لا توجد شكاوى</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all" ? "لم تقم بتقديم أي شكاوى بعد" : `لا توجد شكاوى ${getStatusText(filter)}`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{complaint.title}</h3>
                      <Badge variant="outline" className={cn("text-xs", getStatusColor(complaint.status))}>
                        {getStatusIcon(complaint.status)}
                        <span className="mr-1">{getStatusText(complaint.status)}</span>
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(complaint)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>

                  {/* Image Preview */}
                  {complaint.image && (
                    <img
                      src={complaint.image || "/placeholder.svg"}
                      alt="Complaint evidence"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{complaint.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
