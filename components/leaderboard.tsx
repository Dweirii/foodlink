"use client"

import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LeaderboardUser {
  id: string
  name: string
  donations: number
  impact: number
  rank: number
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  users: LeaderboardUser[]
  currentUser?: LeaderboardUser
}

export function Leaderboard({ users, currentUser }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200"
      case 2:
        return "bg-gray-50 border-gray-200"
      case 3:
        return "bg-amber-50 border-amber-200"
      default:
        return ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="w-5 h-5 ml-2 text-primary" />
          لوحة الشرف - أفضل المتبرعين
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.slice(0, 10).map((user) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              user.isCurrentUser && "bg-primary/5 border border-primary/20",
              getRankColor(user.rank),
            )}
          >
            {/* Rank */}
            <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarFallback className="text-sm font-semibold">{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm truncate">{user.name}</h4>
                {user.isCurrentUser && (
                  <Badge variant="secondary" className="text-xs">
                    أنت
                  </Badge>
                )}
              </div>
            </div>

            {/* Impact Score */}
            <div className="text-left">
              <div className="font-bold text-sm text-primary">{user.impact}</div>
              <div className="text-xs text-muted-foreground">نقطة أثر</div>
            </div>
          </div>
        ))}

        {/* Current User Position (if not in top 10) */}
        {currentUser && currentUser.rank > 10 && (
          <>
            <div className="flex items-center justify-center py-2">
              <div className="flex-1 h-px bg-border"></div>
              <span className="px-3 text-xs text-muted-foreground">...</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex-shrink-0">{getRankIcon(currentUser.rank)}</div>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-sm font-semibold">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm truncate">{currentUser.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    أنت
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentUser.donations} تبرع • أثر على {currentUser.impact} شخص
                </p>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-primary">{currentUser.impact}</div>
                <div className="text-xs text-muted-foreground">نقطة أثر</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
