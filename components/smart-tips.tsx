"use client"

import { useState } from "react"
import { Lightbulb, Play, BookOpen, ChevronRight, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Tip {
  id: string
  title: string
  content: string
  category: "storage" | "cooking" | "shopping" | "waste"
  type: "text" | "video"
  duration?: string
  difficulty: "easy" | "medium" | "hard"
  likes: number
  isLiked: boolean
}

interface SmartTipsProps {
  showAll?: boolean
}

export function SmartTips({ showAll = false }: SmartTipsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [likedTips, setLikedTips] = useState<Set<string>>(new Set())

  const tips: Tip[] = [
    {
      id: "1",
      title: "حفظ الخضروات الورقية",
      content: "احفظ الخضروات الورقية في أكياس ورقية داخل الثلاجة للحفاظ على نضارتها لفترة أطول",
      category: "storage",
      type: "text",
      difficulty: "easy",
      likes: 45,
      isLiked: false,
    },
    {
      id: "2",
      title: "طريقة تخزين الموز",
      content: "لف أطراف الموز بورق الألمنيوم لمنع النضج السريع وإطالة مدة الحفظ",
      category: "storage",
      type: "video",
      duration: "2:30",
      difficulty: "easy",
      likes: 32,
      isLiked: true,
    },
    {
      id: "3",
      title: "استخدام بقايا الخبز",
      content: "حول الخبز القديم إلى فتات خبز محمص واحفظه في الفريزر للاستخدام لاحقاً",
      category: "cooking",
      type: "text",
      difficulty: "medium",
      likes: 28,
      isLiked: false,
    },
    {
      id: "4",
      title: "التسوق الذكي",
      content: "اكتب قائمة بالمشتريات قبل الذهاب للسوق وتجنب الشراء عند الجوع",
      category: "shopping",
      type: "text",
      difficulty: "easy",
      likes: 67,
      isLiked: false,
    },
    {
      id: "5",
      title: "إعادة استخدام قشور الخضار",
      content: "استخدم قشور الخضار لعمل مرق نباتي غني بالفيتامينات",
      category: "waste",
      type: "video",
      duration: "4:15",
      difficulty: "medium",
      likes: 23,
      isLiked: false,
    },
    {
      id: "6",
      title: "حفظ الأعشاب الطازجة",
      content: "ضع الأعشاب الطازجة في كوب من الماء مثل الورود للحفاظ على نضارتها",
      category: "storage",
      type: "text",
      difficulty: "easy",
      likes: 41,
      isLiked: false,
    },
  ]

  const categories = [
    { key: "all", label: "الكل", icon: Lightbulb },
    { key: "storage", label: "التخزين", icon: BookOpen },
    { key: "cooking", label: "الطبخ", icon: Play },
    { key: "shopping", label: "التسوق", icon: ChevronRight },
    { key: "waste", label: "تقليل الهدر", icon: Star },
  ]

  const filteredTips = activeCategory === "all" ? tips : tips.filter((tip) => tip.category === activeCategory)
  const displayedTips = showAll ? filteredTips : filteredTips.slice(0, 3)

  const toggleLike = (tipId: string) => {
    setLikedTips((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(tipId)) {
        newSet.delete(tipId)
      } else {
        newSet.add(tipId)
      }
      return newSet
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-200 text-green-900 border-green-300"
      case "medium":
        return "bg-yellow-200 text-yellow-900 border-yellow-300"
      case "hard":
        return "bg-red-200 text-red-900 border-red-300"
      default:
        return "bg-gray-200 text-gray-900 border-gray-300"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "سهل"
      case "medium":
        return "متوسط"
      case "hard":
        return "صعب"
      default:
        return "غير محدد"
    }
  }

  if (showAll) {
    return (
      <div className="space-y-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger key={category.key} value={category.key} className="text-xs">
                  <Icon className="w-3 h-3 ml-1" />
                  {category.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-3 mt-4">
            {displayedTips.map((tip) => (
              <Card key={tip.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm">{tip.title}</h3>
                          {tip.type === "video" && (
                            <Badge variant="secondary" className="text-xs">
                              <Play className="w-3 h-3 ml-1" />
                              {tip.duration}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
                          {getDifficultyText(tip.difficulty)}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3" />
                          <span>{tip.likes}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(tip.id)}
                        className={likedTips.has(tip.id) ? "text-red-500" : ""}
                      >
                        <Star className={`w-4 h-4 ${likedTips.has(tip.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Compact view for home page
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="w-5 h-5 ml-2 text-accent" />
          نصائح ذكية من سالم
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedTips.map((tip) => (
          <div key={tip.id} className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{tip.title}</h4>
              {tip.type === "video" && (
                <Badge variant="secondary" className="text-xs">
                  <Play className="w-3 h-3 ml-1" />
                  {tip.duration}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
                {getDifficultyText(tip.difficulty)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3" />
                <span>{tip.likes}</span>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-3 bg-transparent">
          <ChevronRight className="w-4 h-4 ml-2" />
          عرض المزيد من النصائح
        </Button>
      </CardContent>
    </Card>
  )
}
