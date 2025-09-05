"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, ChevronRight, UserPlus, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: "donation" | "campaign" | "workshop" | "volunteer"
  participants: number
  maxParticipants?: number
  organizer: string
  isRegistered: boolean
  priority: "high" | "medium" | "low"
}

interface EventsCampaignsProps {
  showAll?: boolean
}

export function EventsCampaigns({ showAll = false }: EventsCampaignsProps) {
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set(["2"]))
  // NEW: تحكّم عرض المزيد/أقل في العرض المختصر
  const [expanded, setExpanded] = useState(false)

  const events: Event[] = [
    {
      id: "1",
      title: "حملة توزيع الطعام",
      description: "توزيع وجبات مجانية للأسر المحتاجة في الحي",
      date: "2024-03-20",
      time: "09:00",
      location: "مركز الحي - النخيل",
      type: "donation",
      participants: 45,
      maxParticipants: 100,
      organizer: "جمعية البر الخيرية",
      isRegistered: false,
      priority: "high",
    },
    {
      id: "2",
      title: "ورشة حفظ الطعام",
      description: "تعلم أفضل الطرق لحفظ الطعام وتقليل الهدر",
      date: "2024-03-22",
      time: "16:00",
      location: "مركز التدريب المجتمعي",
      type: "workshop",
      participants: 23,
      maxParticipants: 30,
      organizer: "وزارة البيئة",
      isRegistered: true,
      priority: "medium",
    },
    {
      id: "3",
      title: "مبادرة إنقاذ الطعام",
      description: "جمع الطعام الفائض من المطاعم والمتاجر",
      date: "2024-03-25",
      time: "18:00",
      location: "منطقة الأعمال المركزية",
      type: "volunteer",
      participants: 12,
      maxParticipants: 20,
      organizer: "مبادرة FoodLink",
      isRegistered: false,
      priority: "high",
    },
    {
      id: "4",
      title: "معرض الأمن الغذائي",
      description: "معرض توعوي حول أهمية الأمن الغذائي والاستدامة",
      date: "2024-03-28",
      time: "10:00",
      location: "مركز المعارض",
      type: "campaign",
      participants: 156,
      organizer: "وزارة الزراعة",
      isRegistered: false,
      priority: "medium",
    },
    {
      id: "5",
      title: "يوم التطوع البيئي",
      description: "تنظيف الحدائق وزراعة الأشجار المثمرة",
      date: "2024-03-30",
      time: "07:00",
      location: "حديقة الملك فهد",
      type: "volunteer",
      participants: 78,
      maxParticipants: 150,
      organizer: "أمانة المدينة",
      isRegistered: false,
      priority: "low",
    },
  ]

  // لو showAll=true نعرض الكل، غير ذلك نعتمد expanded
  const displayedEvents = showAll ? events : (expanded ? events : events.slice(0, 3))

  const toggleRegistration = (eventId: string) => {
    setRegisteredEvents((prev) => {
      const newSet = new Set(prev)
      newSet.has(eventId) ? newSet.delete(eventId) : newSet.add(eventId)
      return newSet
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "donation":
        return "bg-green-100 text-green-800"
      case "campaign":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-purple-100 text-purple-800"
      case "volunteer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "donation":
        return "تبرع"
      case "campaign":
        return "حملة"
      case "workshop":
        return "ورشة"
      case "volunteer":
        return "تطوع"
      default:
        return "فعالية"
    }
  }

  const priorityBorder = (priority: string) => {
    const base = "rtl:border-r-4 ltr:border-l-4"
    switch (priority) {
      case "high":
        return `${base} border-red-500`
      case "medium":
        return `${base} border-yellow-500`
      case "low":
        return `${base} border-green-500`
      default:
        return `${base} border-gray-500`
    }
  }

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("ar-SA", { weekday: "long", month: "long", day: "numeric" }).format(new Date(dateString))

  const formatTime = (timeString: string) =>
    new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit" }).format(new Date(`2024-01-01T${timeString}`))

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase()

  // ---------- Full view ----------
  if (showAll) {
    return (
      <div className="space-y-4" dir="rtl">
        {displayedEvents.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const isFull = !!event.maxParticipants && event.participants >= event.maxParticipants

          return (
            <Card key={event.id} className={cn("text-right", priorityBorder(event.priority))} dir="rtl">
              <CardContent className="p-4 text-right" dir="rtl">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between" dir="rtl">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 rtl:flex-row-reverse mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge variant="outline" className={getTypeColor(event.type)}>
                          {getTypeText(event.type)}
                        </Badge>
                        {event.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">عاجل</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 rtl:flex-row-reverse text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {event.participants} مشارك
                        {event.maxParticipants && ` من أصل ${event.maxParticipants}`}
                      </span>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 rtl:flex-row-reverse">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{getInitials(event.organizer)}</AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.organizer}</p>
                      <p className="text-xs text-muted-foreground">منظم الفعالية</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => toggleRegistration(event.id)}
                    className="w-full flex items-center justify-center gap-2 rtl:flex-row-reverse"
                    variant={isRegistered ? "outline" : "default"}
                  >
                    {isRegistered ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        مسجل - إلغاء التسجيل
                      </>
                    ) : isFull ? (
                      "مكتمل العدد"
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        سجل الآن
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // ---------- Compact view (Home) ----------
  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-end gap-2 rtl:flex-row-reverse text-right" dir="rtl">
          <span>الفعاليات والمبادرات</span>
          <Calendar className="w-5 h-5 text-primary" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {displayedEvents.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const isFull = !!event.maxParticipants && event.participants >= event.maxParticipants

          return (
            <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border text-right" dir="rtl">
              <Button
                size="sm"
                variant={isRegistered ? "outline" : "default"}
                onClick={() => toggleRegistration(event.id)}
                className="flex items-center gap-2 rtl:flex-row"
              >
                {isRegistered ? "مسجل" : isFull ? "مكتمل" : (
                  <>
                    <Heart className="w-4 h-4" />
                    سجّل الآن
                  </>
                )}
              </Button>
              <div className="flex-1 ">
                <div className="flex items-center gap-2 rtl:flex-row mb-1">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getTypeColor(event.type)}`}>
                    {getTypeText(event.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 rtl:flex-row text-xs text-muted-foreground">
                  <span>{formatDate(event.date)}</span>
                  <span>{formatTime(event.time)}</span>
                </div>
              </div>
            </div>
          )
        })}

        {/* NEW: الزر يعمل كتبديل عرض/إخفاء */}
        {!showAll && (
          <Button
            variant="outline"
            onClick={() => setExpanded((v) => !v)}
            className="w-full mt-3 bg-transparent flex items-center justify-center gap-2 rtl:flex-row-reverse"
          >
            <ChevronRight className="w-4 h-4" />
            {expanded ? "عرض أقل" : "عرض جميع الفعاليات"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
