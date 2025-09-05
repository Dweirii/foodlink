"use client"

import React from "react"

import { useState, useRef } from "react"
import { Camera, MapPin, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DonationFormProps {
  onSubmit?: (donation: DonationData) => void
  onCancel?: () => void
}

export interface DonationData {
  id: string
  foodName: string
  quantity: string
  unit: string
  expiryDate: string
  description: string
  image?: string
  donationCenter: string
  status: "pending" | "confirmed" | "collected" | "delivered"
  createdAt: Date
  category: string
}

export function DonationForm({ onSubmit, onCancel }: DonationFormProps) {
  const [foodName, setFoodName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [donationCenter, setDonationCenter] = useState("جاري البحث عن أقرب مركز...")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = ["خضروات", "فواكه", "منتجات ألبان", "لحوم", "حبوب", "معلبات", "مخبوزات", "أخرى"]
  const units = ["كيلو", "جرام", "قطعة", "علبة", "كيس", "صندوق"]

  const donationCenters = [
    "مركز الخير للتبرعات - حي النخيل (0.8 كم)",
    "جمعية البر الخيرية - حي الملز (1.2 كم)",
    "مركز إطعام المحتاجين - حي العليا (1.5 كم)",
  ]

  // Simulate finding nearest donation center
  React.useEffect(() => {
    setTimeout(() => {
      setDonationCenter(donationCenters[0])
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
    if (!foodName.trim() || !quantity.trim() || !unit || !expiryDate || !category) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const donation: DonationData = {
        id: Date.now().toString(),
        foodName: foodName.trim(),
        quantity: quantity.trim(),
        unit,
        expiryDate,
        description: description.trim(),
        image: image || undefined,
        donationCenter,
        status: "pending",
        createdAt: new Date(),
        category,
      }

      onSubmit?.(donation)
      setIsSubmitting(false)

      // Reset form
      setFoodName("")
      setQuantity("")
      setUnit("")
      setExpiryDate("")
      setDescription("")
      setCategory("")
      setImage(null)
    }, 2000)
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">تبرع بالطعام الإضافي</CardTitle>
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
            <Label htmlFor="category">نوع الطعام</Label>
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

          {/* Food Name */}
          <div className="space-y-2">
            <Label htmlFor="foodName">اسم الطعام</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="مثال: تفاح أحمر، خبز أبيض، أرز بسمتي"
              required
            />
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="5"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">الوحدة</Label>
              <Select value={unit} onValueChange={setUnit} required>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوحدة" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={getTomorrowDate()}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف إضافي (اختياري)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="معلومات إضافية عن حالة الطعام أو طريقة الحفظ..."
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>صورة الطعام (اختيارية)</Label>
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
                alt="Food donation"
                className="w-full h-32 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Donation Center */}
          <div className="space-y-2">
            <Label>مركز التبرع المقترح</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{donationCenter}</span>
              </div>
              {donationCenter !== "جاري البحث عن أقرب مركز..." && (
                <Select value={donationCenter} onValueChange={setDonationCenter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {donationCenters.map((center) => (
                      <SelectItem key={center} value={center}>
                        {center}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={
              !foodName.trim() ||
              !quantity.trim() ||
              !unit ||
              !expiryDate ||
              !category ||
              isSubmitting ||
              donationCenter === "جاري البحث عن أقرب مركز..."
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 ml-2" />
                تأكيد التبرع
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
