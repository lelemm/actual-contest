"use server"

import { getLeaderboard, updateLeaderboardCache } from "@/lib/github"

// Server action to get leaderboard data
export async function getLeaderboardData(timeframe: "all" | "week" | "day" = "all") {
  try {
    return await getLeaderboard(timeframe)
  } catch (error) {
    console.error("Error in getLeaderboardData action:", error)
    return []
  }
}

// Server action to refresh leaderboard data
export async function refreshLeaderboardData() {
  try {
    const result = await updateLeaderboardCache()
    return { success: result.success, message: result.message }
  } catch (error) {
    console.error("Error in refreshLeaderboardData action:", error)
    return { success: false, message: `Error: ${String(error)}` }
  }
}
