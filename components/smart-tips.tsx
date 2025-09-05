"use client"

import { useMemo, useRef, useState } from "react"
import { Lightbulb, Play, BookOpen, ChevronRight, Star, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type CategoryKey = "all" | "storage" | "cooking" | "shopping" | "waste"
type Difficulty = "easy" | "medium" | "hard"
type TipType = "text" | "video"

interface Tip {
  id: string
  title: string
  content: string
  category: Exclude<CategoryKey, "all">
  type: TipType
  duration?: string
  difficulty: Difficulty
  likes: number
}

interface SmartTipsProps {
  showAll?: boolean
  className?: string
}

export function SmartTips({ showAll = false, className }: SmartTipsProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all")
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [likesMap, setLikesMap] = useState<Record<string, number>>({})
  const railRef = useRef<HTMLDivElement>(null)

  const tips: Tip[] = useMemo(
    () => [
      { id: "1", title: "حفظ الخضروات الورقية", content: "احفظ الخضروات الورقية في أكياس ورقية داخل الثلاجة للحفاظ على نضارتها لفترة أطول", category: "storage", type: "text", difficulty: "easy", likes: 45 },
      { id: "2", title: "طريقة تخزين الموز", content: "لف أطراف الموز بورق الألمنيوم لمنع النضج السريع وإطالة مدة الحفظ", category: "storage", type: "video", duration: "2:30", difficulty: "easy", likes: 32 },
      { id: "3", title: "استخدام بقايا الخبز", content: "حوّل الخبز القديم إلى فتات خبز محمّص واحفظه في الفريزر للاستخدام لاحقًا", category: "cooking", type: "text", difficulty: "medium", likes: 28 },
      { id: "4", title: "التسوق الذكي", content: "اكتب قائمة بالمشتريات قبل الذهاب للسوق وتجنّب الشراء عند الجوع", category: "shopping", type: "text", difficulty: "easy", likes: 67 },
      { id: "5", title: "إعادة استخدام قشور الخضار", content: "استخدم قشور الخضار لعمل مرق نباتي غني بالفيتامينات", category: "waste", type: "video", duration: "4:15", difficulty: "medium", likes: 23 },
      { id: "6", title: "حفظ الأعشاب الطازجة", content: "ضع الأعشاب الطازجة في كوب من الماء مثل الورود للحفاظ على نضارتها", category: "storage", type: "text", difficulty: "easy", likes: 41 },
    ],
    []
  )

  const categories: Array<{ key: CategoryKey; label: string; icon: React.ElementType }> = [
    { key: "all",      label: "الكل",        icon: Lightbulb },
    { key: "waste",    label: "تقليل الهدر", icon: Star },
    { key: "shopping", label: "التسوق",      icon: ShoppingCart },
    { key: "cooking",  label: "الطبخ",       icon: BookOpen },
    { key: "storage",  label: "التخزين",     icon: BookOpen },
  ]

  const filteredTips = useMemo(
    () => (activeCategory === "all" ? tips : tips.filter(t => t.category === activeCategory)),
    [tips, activeCategory]
  )

  const visibleTips = useMemo(() => {
    if (showAll || expanded) return filteredTips
    return filteredTips.slice(0, 3)
  }, [filteredTips, showAll, expanded])

  const difficultyBadge = (d: Difficulty) =>
    d === "easy" ? "bg-green-200 text-green-900 border-green-300"
      : d === "medium" ? "bg-yellow-200 text-yellow-900 border-yellow-300"
      : "bg-red-200 text-red-900 border-red-300"

  const difficultyText = (d: Difficulty) => (d === "easy" ? "سهل" : d === "medium" ? "متوسط" : "صعب")

  const toggleLike = (id: string, base: number) => {
    setLiked(prev => {
      const n = new Set(prev)
      const isLiked = n.has(id)
      isLiked ? n.delete(id) : n.add(id)
      setLikesMap(m => ({ ...m, [id]: (m[id] ?? base) + (isLiked ? -1 : 1) }))
      return n
    })
  }

  const selectCategory = (key: CategoryKey) => {
    setActiveCategory(key)
    // Snap إلى العنصر المفعّل
    const rail = railRef.current
    if (!rail) return
    const el = rail.querySelector<HTMLButtonElement>(`button[data-key="${key}"]`)
    el?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" })
  }

  return (
    <Card dir="rtl" className={cn("rounded-2xl", className)}>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center justify-end gap-3 rtl:flex-row-reverse text-right" dir="rtl">
         <span className="text-xl font-extrabold tracking-tight">نصائح ذكية من سالم</span>
         <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Lightbulb className="w-5 h-5" />
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative justify-end" dir="rtl">
          <div
            ref={railRef}
            className="
              flex items-center gap-2 rtl:flex-row
              overflow-x-auto snap-x snap-mandatory scroll-px-4 px-2 py-1
              [-webkit-overflow-scrolling:touch]
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              bg-emerald-50/50 rounded-xl border border-emerald-100
            "
            role="tablist"
            aria-label="تصنيفات النصائح"
          >
            {categories.map(({ key, label, icon: Icon }) => {
              const active = activeCategory === key
              return (
                <button
                  key={key}
                  type="button"
                  data-key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectCategory(key)}
                  className={cn(
                    "snap-center whitespace-nowrap select-none",
                    "flex items-center gap-2 rtl:flex-row-reverse px-3 py-1.5 rounded-full border transition",
                    active
                      ? "bg-white border-emerald-300 text-emerald-700 shadow-sm"
                      : "bg-transparent border-transparent text-emerald-800/80 hover:bg-white/70"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* قائمة النصائح */}
        <div className="space-y-3">
          {visibleTips.map((tip) => (
            <div key={tip.id} className="p-3 bg-muted/50 rounded-xl text-right border border-muted/40">
              {/* شارة الفيديو أعلى اليسار (مع دعم RTL) */}
              {tip.type === "video" && (
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs inline-flex items-center gap-1 rtl:flex-row-reverse">
                    <Play className="w-3 h-3" />
                    <span>{tip.duration}</span>
                  </Badge>
                </div>
              )}

              <h4 className="font-bold text-base mb-1">{tip.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>

              <div className="flex items-center justify-between mt-3">
                <Badge variant="outline" className={difficultyBadge(tip.difficulty)}>
                  {difficultyText(tip.difficulty)}
                </Badge>

                <button
                  type="button"
                  onClick={() => toggleLike(tip.id, tip.likes)}
                  className={cn(
                    "flex items-center gap-1 rtl:flex-row-reverse text-xs",
                    liked.has(tip.id) ? "text-rose-600" : "text-muted-foreground"
                  )}
                  aria-pressed={liked.has(tip.id)}
                  aria-label={liked.has(tip.id) ? "إزالة إعجاب" : "إعجاب"}
                >
                  <Star className={cn("w-3 h-3", liked.has(tip.id) && "fill-current")} />
                  <span>{likesMap[tip.id] ?? tip.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* عرض المزيد */}
        {!showAll && !expanded && filteredTips.length > 3 && (
          <Button
            variant="outline"
            className="w-full mt-1 bg-transparent flex items-center justify-center gap-2 rtl:flex-row-reverse"
            onClick={() => setExpanded(true)}
          >
            <ChevronRight className="w-4 h-4" />
            <span>عرض المزيد من النصائح</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
