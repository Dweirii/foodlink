"use client"

import { useMemo, useState } from "react"
import { Heart, MessageSquare, Lightbulb, Settings, Edit, Trophy, TrendingUp, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "@/components/stats-card"
import { AchievementBadge } from "@/components/achievement-badge"
import { Leaderboard } from "@/components/leaderboard"
import { cn } from "@/lib/utils"

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock user data
  const userData = {
    name: " زيد الدويري ",
    joinDate: "يناير 2024",
    level: 5,
    totalDonations: 23,
    totalComplaints: 7,
    adviceReceived: 45,
    impactScore: 156,
    rank: 8,
  }

  // Mock achievements data
  const achievements = [
    { id: "1", title: "متبرع مبتدئ", description: "أول تبرع لك", icon: "heart" as const, unlocked: true },
    { id: "2", title: "صديق البيئة", description: "10 تبرعات", icon: "trophy" as const, unlocked: true },
    { id: "3", title: "مستشار الطعام", description: "50 نصيحة مستلمة", icon: "lightbulb" as const, unlocked: false, progress: 45, maxProgress: 50 },
    { id: "4", title: "محارب الهدر", description: "منع هدر 100 كيلو", icon: "award" as const, unlocked: false, progress: 67, maxProgress: 100 },
    { id: "5", title: "مواطن مثالي", description: "مستوى 10", icon: "star" as const, unlocked: false, progress: 5, maxProgress: 10 },
    { id: "6", title: "صوت المجتمع", description: "20 شكوى مفيدة", icon: "message" as const, unlocked: false, progress: 7, maxProgress: 20 },
  ]

  // Mock leaderboard data
  const leaderboardUsers = [
    { id: "1", name: "لارا نجم", donations: 45, impact: 234, rank: 1 },
    { id: "2", name: "حازب العزب ", donations: 38, impact: 198, rank: 2 },
    { id: "3", name: "سارة نجم", donations: 32, impact: 187, rank: 3 },
    { id: "4", name: "عون دويري", donations: 29, impact: 176, rank: 4 },
    { id: "5", name: "ليث عنتر ", donations: 27, impact: 165, rank: 5 },
    { id: "6", name: "خالد عفانه", donations: 25, impact: 159, rank: 6 },
    { id: "7", name: "مريم خرخش", donations: 24, impact: 158, rank: 7 },
    { id: "8", name: userData.name, donations: userData.totalDonations, impact: userData.impactScore, rank: userData.rank, isCurrentUser: true },
  ]

  const currentUser = leaderboardUsers.find((u) => (u as any).isCurrentUser)

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase()

  // Progress is derived; clamp and memoize
  const levelProgressPct = useMemo(() => {
    const currentLevelXP = (userData.level - 1) * 10
    const nextLevelXP = userData.level * 10
    const userXP = userData.totalDonations + userData.adviceReceived / 5
    const denom = Math.max(nextLevelXP - currentLevelXP, 1)
    const pct = ((userXP - currentLevelXP) / denom) * 100
    return Math.min(Math.max(pct, 0), 100)
  }, [userData.level, userData.totalDonations, userData.adviceReceived])

  return (
    <div className="p-4 sm:p-6 space-y-6">
     {/* Profile header (final) */}
        <Card className="rounded-2xl border border-primary/20 shadow-xl">
          <CardContent className="p-5 sm:p-7">
            {/* Top row */}
            <div
              className="
                grid items-center gap-4 sm:gap-6
                grid-cols-[auto,1fr,auto]
              "
            >
              {/* Avatar */}
              <div className="flex flex-row items-center justify-start gap-4 sm:gap-5">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 shadow-lg">
                  <AvatarFallback className="text-lg sm:text-xl font-bold bg-primary/10 text-primary">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                {/* mirrored badge in RTL */}
                <div className="absolute -bottom-1 -left-1 rtl:left-auto rtl:-right-1 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background shadow-sm">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex items-start justify-start gap-2 sm:gap-3 mb-1.5 text-left" dir="rtl">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{userData.name}</h1>
                </div>
              </div>

              {/* Identity */}
              <div className="min-w-0 relative" dir="rtl">
                <p className="text-muted-foreground mb-3 font-medium">
                  عضو منذ {userData.joinDate}
                </p>

                <div className="flex flex-wrap items-start justify-end gap-2 sm:gap-3">
                  <Badge className="h-7 flex items-center gap-2 px-3 bg-primary/15 text-primary border border-primary/30">
                    <Trophy className="w-4 h-4" />
                    المستوى <span className="tabular-nums">{userData.level}</span>
                  </Badge>

                  <Badge variant="outline" className="h-7 flex items-center gap-2 px-3 border-accent/50 text-accent">
                    <TrendingUp className="w-4 h-4" />
                    المرتبة #<span className="tabular-nums">{userData.rank}</span>
                  </Badge>
                </div>
              </div>

              {/* (Optional) right-side KPI chip */}
              <div className="hidden sm:flex items-center justify-center">
                <div className="px-3 py-2 rounded-xl border border-primary/20 bg-primary/10 text-primary text-sm font-semibold">
                  حساب موثق
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5 sm:mt-6 p-4 rounded-xl border border-primary/10 bg-white/60 supports-[backdrop-filter]:backdrop-blur-[1px]">
              <div className="flex items-baseline justify-between text-sm mb-2.5">
                <span className="font-medium text-foreground">التقدم للمستوى التالي</span>
                <span className="font-bold text-primary tabular-nums">{Math.round(levelProgressPct)}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={Math.round(levelProgressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full h-3 rounded-full bg-muted shadow-inner overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-500 will-change-[width]"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>


      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={cn(
            "w-full bg-card border border-border/50 shadow-sm rounded-xl",
            "grid grid-cols-3",
            "overflow-x-auto"
          )}
        >
          <TabsTrigger value="achievements" className="font-semibold">الإنجازات</TabsTrigger>
          <TabsTrigger value="leaderboard" className="font-semibold">لوحة الشرف</TabsTrigger>
          <TabsTrigger value="dashboard" className="font-semibold">لوحة التحكم</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <StatsCard title="إجمالي التبرعات" value={userData.totalDonations} icon={Heart} color="primary" trend={{ value: 3, label: "هذا الشهر" }} />
            <StatsCard title="نقاط الأثر" value={userData.impactScore} icon={TrendingUp} color="success" trend={{ value: 12, label: "هذا الأسبوع" }} />
            <StatsCard title="الشكاوى المقدمة" value={userData.totalComplaints} icon={MessageSquare} color="accent" />
            <StatsCard title="النصائح المستلمة" value={userData.adviceReceived} icon={Lightbulb} color="warning" trend={{ value: 5, label: "هذا الأسبوع" }} />
          </div>

          <Card className="gradient-card border-border/50 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2.5 sm:gap-3 text-primary">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 sm:space-y-4" dir="rtl">
              {[
                { action: "تبرع بـ 5 كيلو تفاح", time: "منذ ساعتين", type: "donation", Icon: Heart },
                { action: "حصل على نصيحة حول حفظ الخضروات", time: "منذ 4 ساعات", type: "advice", Icon: Lightbulb },
                { action: "قدم شكوى حول جودة الطعام", time: "أمس", type: "complaint", Icon: MessageSquare },
                { action: "وصل للمستوى 5", time: "منذ 3 أيام", type: "achievement", Icon: Trophy },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3.5 sm:gap-4 p-4 bg-white/60 rounded-xl border border-border/30 hover:shadow-md transition-all">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <a.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{a.action}</p>
                    <p className="text-sm text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {achievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} />
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-6 mt-4">
          <Leaderboard users={leaderboardUsers as any} currentUser={currentUser as any} />
        </TabsContent>
      </Tabs>

      {/* Settings */}
      <Card className="gradient-card border-border/50 shadow-lg">
        <CardContent className="p-5 sm:p-6">
          <Button
            variant="outline"
            className="w-full bg-white/50 hover:bg-white/70 border-primary/30 text-primary hover:text-primary font-semibold py-3"
          >
            <Settings className="w-5 h-5 ml-2" />
            إعدادات الحساب
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
