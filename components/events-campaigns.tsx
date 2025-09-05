"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, ChevronRight, UserPlus, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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

  const displayedEvents = showAll ? events : events.slice(0, 3)

  const toggleRegistration = (eventId: string) => {
    setRegisteredEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatTime = (timeString: string) => {
    return new Intl.DateTimeFormat("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(`2024-01-01T${timeString}`))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (showAll) {
    return (
      <div className="space-y-4">
        {displayedEvents.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const isFull = event.maxParticipants && event.participants >= event.maxParticipants

          return (
            <Card key={event.id} className={`border-l-4 ${getPriorityColor(event.priority)}`}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge variant="outline" className={getTypeColor(event.type)}>
                          {getTypeText(event.type)}
                        </Badge>
                        {event.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            عاجل
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {event.participants} مشارك
                        {event.maxParticipants && ` من أصل ${event.maxParticipants}`}
                      </span>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{getInitials(event.organizer)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{event.organizer}</p>
                      <p className="text-xs text-muted-foreground">منظم الفعالية</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => toggleRegistration(event.id)}
                    disabled={isFull && !isRegistered}
                    className="w-full"
                    variant={isRegistered ? "outline" : "default"}
                  >
                    {isRegistered ? (
                      <>
                        <UserPlus className="w-4 h-4 ml-2" />
                        مسجل - إلغاء التسجيل
                      </>
                    ) : isFull ? (
                      "مكتمل العدد"
                    ) : (
                      <>
                        <Heart className="w-4 h-4 ml-2" />
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

  // Compact view for home page
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Calendar className="w-5 h-5 ml-2 text-primary" />
          الفعاليات والمبادرات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedEvents.map((event) => {
          const isRegistered = registeredEvents.has(event.id)
          const isFull = event.maxParticipants && event.participants >= event.maxParticipants

          return (
            <div key={event.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <Badge variant="outline" className={`text-xs ${getTypeColor(event.type)}`}>
                    {getTypeText(event.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDate(event.date)}</span>
                  <span>{formatTime(event.time)}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant={isRegistered ? "outline" : "default"}
                onClick={() => toggleRegistration(event.id)}
                disabled={isFull && !isRegistered}
              >
                {isRegistered ? "مسجل" : isFull ? "مكتمل" : "سجل الآن"}
              </Button>
            </div>
          )
        })}
        <Button variant="outline" className="w-full mt-3 bg-transparent">
          <ChevronRight className="w-4 h-4 ml-2" />
          عرض جميع الفعاليات
        </Button>
      </CardContent>
    </Card>
  )
}
