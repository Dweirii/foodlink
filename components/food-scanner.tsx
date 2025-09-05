"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, CheckCircle, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FoodScannerProps {
  onClose?: () => void
}

type ScanResult = {
  freshness: "fresh" | "moderate" | "expired"
  confidence: number
  recommendations: string[]
  expiryEstimate?: string
}

export function FoodScanner({ onClose }: FoodScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        startScanning()
      }
      reader.readAsDataURL(file)
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setScanResult(null)

    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: ScanResult[] = [
        {
          freshness: "fresh",
          confidence: 92,
          recommendations: [
            "الطعام طازج وصالح للاستهلاك",
            "يُنصح بتناوله خلال 3-4 أيام",
            "احفظه في الثلاجة للحفاظ على جودته",
          ],
          expiryEstimate: "4 أيام",
        },
        {
          freshness: "moderate",
          confidence: 78,
          recommendations: [
            "الطعام لا يزال صالحاً لكن يجب تناوله قريباً",
            "تناوله خلال يوم واحد",
            "تأكد من طهيه جيداً قبل التناول",
          ],
          expiryEstimate: "يوم واحد",
        },
        {
          freshness: "expired",
          confidence: 89,
          recommendations: ["لا يُنصح بتناول هذا الطعام", "يظهر عليه علامات التلف", "تخلص منه بطريقة آمنة"],
        },
      ]

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setScanResult(randomResult)
      setIsScanning(false)
    }, 3000)
  }

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case "fresh":
        return "bg-green-100 text-green-800 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getFreshnessIcon = (freshness: string) => {
    switch (freshness) {
      case "fresh":
        return <CheckCircle className="w-4 h-4" />
      case "moderate":
      case "expired":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getFreshnessText = (freshness: string) => {
    switch (freshness) {
      case "fresh":
        return "طازج"
      case "moderate":
        return "متوسط النضارة"
      case "expired":
        return "منتهي الصلاحية"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">فحص الطعام بالذكاء الاصطناعي</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedImage ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-balance">ارفع صورة للطعام لتحليل نضارته وصلاحيته</p>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="w-4 h-4 ml-2" />
              اختر صورة
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Food to analyze"
                className="w-full h-48 object-cover rounded-lg"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">جاري التحليل...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Results */}
            {scanResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getFreshnessColor(scanResult.freshness)}>
                    {getFreshnessIcon(scanResult.freshness)}
                    <span className="mr-1">{getFreshnessText(scanResult.freshness)}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">دقة التحليل: {scanResult.confidence}%</span>
                </div>

                {scanResult.expiryEstimate && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">مدة الصلاحية المتوقعة:</p>
                    <p className="text-sm text-muted-foreground">{scanResult.expiryEstimate}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">التوصيات:</h4>
                  <ul className="space-y-1">
                    {scanResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-1 h-1 bg-primary rounded-full mt-2 ml-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedImage(null)
                  setScanResult(null)
                }}
                className="flex-1"
              >
                صورة جديدة
              </Button>
              {scanResult && (
                <Button onClick={() => startScanning()} className="flex-1">
                  إعادة التحليل
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
