"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Bug, RefreshCw } from "lucide-react"
import { getLeaderboardData, refreshLeaderboardData } from "@/app/actions/leaderboard"
import Image from "next/image"

// Define the leaderboard entry type
interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  bugs: number
  points: number
}

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"all" | "week" | "day">("all")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch leaderboard data when timeframe changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getLeaderboardData(timeframe)
        setLeaderboardData(data)
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const result = await refreshLeaderboardData()

      if (result.success) {
        // Fetch updated data
        const data = await getLeaderboardData(timeframe)
        setLeaderboardData(data)
      } else {
      }
    } catch (error) {
      console.error("Error refreshing leaderboard data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="mt-20 mb-10 pointer-events-auto">
      <div className="flex flex-col items-center text-center mb-8">
        <Badge className="mb-4 text-white border-0 px-4 py-1 text-base"  style={{ backgroundColor: '#9446ED' }}>
          Competition Standings
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          🏆 Bug Squashing Leaderboard 🏆
        </h2>
        <p className="text-xl font-medium max-w-2xl">
          Our top bug squashers are crushing it! 🚀 Who will take the crown? 👑
        </p>
      </div>

      <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl mb-8">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-600 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Current Rankings
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
              </Button>
              <div className="flex space-x-2">
                <div className="w-full">
                  <Button
                    variant={timeframe === "day" ? "default" : "outline"}
                    onClick={() => setTimeframe("day")}
                    className={`w-full ${
                      timeframe === "day" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0" : ""
                    }`}
                  >
                    <span className="w-full">Today</span>
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    variant={timeframe === "week" ? "default" : "outline"}
                    onClick={() => setTimeframe("week")}
                    className={`w-full ${
                      timeframe === "week" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0" : ""
                    }`}
                  >
                    <span className="w-full">This Week</span>
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    variant={timeframe === "all" ? "default" : "outline"}
                    onClick={() => setTimeframe("all")}
                    className={`w-full ${
                      timeframe === "all" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0" : ""
                    }`}
                  >
                    <span className="w-full">All Time</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CardDescription>
            {timeframe === "day" ? "Today's" : timeframe === "week" ? "This week's" : "All-time"} top bug squashers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg font-medium">No data available for this timeframe</p>
              <p className="text-sm mt-2">Start squashing bugs to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                    <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Developer</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Bugs Fixed</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((developer, index) => (
                    <tr
                      key={index}
                      className={`border-t ${
                        developer.rank <= 3
                          ? "bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">
                        {developer.rank <= 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold">
                            {developer.rank}
                          </span>
                        ) : (
                          developer.rank
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <Image
                            src={developer.avatar || "/placeholder.svg"}
                            alt={developer.name}
                            className="w-8 h-8 rounded-full mr-2 border-2 border-purple-200"
                            width={8}
                            height={8}
                          />
                          <span className="font-medium">{developer.name}</span>
                          {developer.rank === 1 && <span className="ml-2">👑</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end">
                          <Bug className="h-4 w-4 mr-1 text-red-500" />
                          {developer.bugs}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-right">{developer.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Rankings are updated daily. Keep squashing those bugs to climb the leaderboard! 🐞
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
