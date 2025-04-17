import { type NextRequest, NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/github"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get timeframe from query parameter
    const timeframe = (request.nextUrl.searchParams.get("timeframe") as "all" | "week" | "day") || "all"

    // Get leaderboard data
    const leaderboardData = await getLeaderboard(timeframe)

    return NextResponse.json({ success: true, data: leaderboardData })
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    return NextResponse.json({ success: false, message: `Error: ${String(error)}` }, { status: 500 })
  }
}
