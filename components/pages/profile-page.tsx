"use client"

import { useState } from "react"
import { Heart, MessageSquare, Lightbulb, Settings, Edit, Trophy, TrendingUp, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "@/components/stats-card"
import { AchievementBadge } from "@/components/achievement-badge"
import { Leaderboard } from "@/components/leaderboard"

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock user data
  const userData = {
    name: "أحمد محمد السعيد",
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
    {
      id: "1",
      title: "متبرع مبتدئ",
      description: "أول تبرع لك",
      icon: "heart" as const,
      unlocked: true,
    },
    {
      id: "2",
      title: "صديق البيئة",
      description: "10 تبرعات",
      icon: "trophy" as const,
      unlocked: true,
    },
    {
      id: "3",
      title: "مستشار الطعام",
      description: "50 نصيحة مستلمة",
      icon: "lightbulb" as const,
      unlocked: false,
      progress: 45,
      maxProgress: 50,
    },
    {
      id: "4",
      title: "محارب الهدر",
      description: "منع هدر 100 كيلو",
      icon: "award" as const,
      unlocked: false,
      progress: 67,
      maxProgress: 100,
    },
    {
      id: "5",
      title: "مواطن مثالي",
      description: "مستوى 10",
      icon: "star" as const,
      unlocked: false,
      progress: 5,
      maxProgress: 10,
    },
    {
      id: "6",
      title: "صوت المجتمع",
      description: "20 شكوى مفيدة",
      icon: "message" as const,
      unlocked: false,
      progress: 7,
      maxProgress: 20,
    },
  ]

  // Mock leaderboard data
  const leaderboardUsers = [
    { id: "1", name: "فاطمة أحمد", donations: 45, impact: 234, rank: 1 },
    { id: "2", name: "محمد علي", donations: 38, impact: 198, rank: 2 },
    { id: "3", name: "سارة محمود", donations: 32, impact: 187, rank: 3 },
    { id: "4", name: "عبدالله حسن", donations: 29, impact: 176, rank: 4 },
    { id: "5", name: "نورا سالم", donations: 27, impact: 165, rank: 5 },
    { id: "6", name: "خالد يوسف", donations: 25, impact: 159, rank: 6 },
    { id: "7", name: "مريم عبدالله", donations: 24, impact: 158, rank: 7 },
    {
      id: "8",
      name: userData.name,
      donations: userData.totalDonations,
      impact: userData.impactScore,
      rank: userData.rank,
      isCurrentUser: true,
    },
  ]

  const currentUser = leaderboardUsers.find((user) => user.isCurrentUser)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getLevelProgress = () => {
    const currentLevelXP = (userData.level - 1) * 10
    const nextLevelXP = userData.level * 10
    const userXP = userData.totalDonations + userData.adviceReceived / 5
    const progress = ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(Math.max(progress, 0), 100)
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <Card className="gradient-card border-primary/20 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-lg">
                <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-background">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{userData.name}</h1>
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-3 font-medium">عضو منذ {userData.joinDate}</p>
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 bg-primary/15 text-primary border-primary/30"
                >
                  <Trophy className="w-4 h-4" />
                  المستوى {userData.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 border-accent/50 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  المرتبة #{userData.rank}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/50 rounded-xl border border-primary/10">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium text-foreground">التقدم للمستوى التالي</span>
              <span className="font-bold text-primary arabic-nums">{Math.round(getLevelProgress())}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border/50 shadow-sm">
          <TabsTrigger value="dashboard" className="font-semibold">
            لوحة التحكم
          </TabsTrigger>
          <TabsTrigger value="achievements" className="font-semibold">
            الإنجازات
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="font-semibold">
            لوحة الشرف
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <StatsCard
              title="إجمالي التبرعات"
              value={userData.totalDonations}
              icon={Heart}
              color="primary"
              trend={{ value: 3, label: "هذا الشهر" }}
            />
            <StatsCard
              title="نقاط الأثر"
              value={userData.impactScore}
              icon={TrendingUp}
              color="success"
              trend={{ value: 12, label: "هذا الأسبوع" }}
            />
            <StatsCard title="الشكاوى المقدمة" value={userData.totalComplaints} icon={MessageSquare} color="accent" />
            <StatsCard
              title="النصائح المستلمة"
              value={userData.adviceReceived}
              icon={Lightbulb}
              color="warning"
              trend={{ value: 5, label: "هذا الأسبوع" }}
            />
          </div>

          <Card className="gradient-card border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3 text-primary">
                <Calendar className="w-6 h-6" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "تبرع بـ 5 كيلو تفاح", time: "منذ ساعتين", type: "donation" },
                { action: "حصل على نصيحة حول حفظ الخضروات", time: "منذ 4 ساعات", type: "advice" },
                { action: "قدم شكوى حول جودة الطعام", time: "أمس", type: "complaint" },
                { action: "وصل للمستوى 5", time: "منذ 3 أيام", type: "achievement" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-border/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    {activity.type === "donation" && <Heart className="w-5 h-5 text-primary" />}
                    {activity.type === "advice" && <Lightbulb className="w-5 h-5 text-yellow-600" />}
                    {activity.type === "complaint" && <MessageSquare className="w-5 h-5 text-blue-600" />}
                    {activity.type === "achievement" && <Trophy className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Leaderboard users={leaderboardUsers} currentUser={currentUser} />
        </TabsContent>
      </Tabs>

      <Card className="gradient-card border-border/50 shadow-lg">
        <CardContent className="p-6">
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
