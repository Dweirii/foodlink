"use client"

import React from "react"

import { useState, useRef } from "react"
import { Camera, MapPin, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ComplaintFormProps {
  onSubmit?: (complaint: ComplaintData) => void
  onCancel?: () => void
}

export interface ComplaintData {
  id: string
  title: string
  description: string
  image?: string
  location: string
  status: "pending" | "in-review" | "resolved"
  createdAt: Date
  category: string
}

export function ComplaintForm({ onSubmit, onCancel }: ComplaintFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [location, setLocation] = useState("جاري تحديد الموقع...")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = ["جودة الطعام", "انتهاء الصلاحية", "التلوث", "الأسعار", "الخدمة", "أخرى"]

  // Simulate location detection
  React.useEffect(() => {
    setTimeout(() => {
      setLocation("الرياض، حي النخيل، شارع الملك فهد")
    }, 2000)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !category) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const complaint: ComplaintData = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        image: image || undefined,
        location,
        status: "pending",
        createdAt: new Date(),
        category,
      }

      onSubmit?.(complaint)
      setIsSubmitting(false)

      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")
      setImage(null)
    }, 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">تقديم شكوى جديدة</CardTitle>
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="block text-right">نوع الشكوى</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block">عنوان الشكوى</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب عنواناً مختصراً للشكوى"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="block text-right">تفاصيل الشكوى</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اشرح تفاصيل المشكلة بوضوح..."
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-right block">صورة (اختيارية)</Label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                <Camera className="w-4 h-4 ml-2" />
                {image ? "تغيير الصورة" : "إضافة صورة"}
              </Button>
              {image && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setImage(null)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {image && (
              <img
                src={image || "/placeholder.svg"}
                alt="Complaint evidence"
                className="w-full h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="block text-right">الموقع</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!title.trim() || !description.trim() || !category || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                إرسال الشكوى
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
