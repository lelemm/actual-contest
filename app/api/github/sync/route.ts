import { NextResponse } from "next/server"
import { fetchBugFixPRs } from "@/lib/github"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Fetch bug fix PRs from GitHub and update the database
    const result = await fetchBugFixPRs()

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Error syncing GitHub data:", error)
    return NextResponse.json({ success: false, message: `Error: ${String(error)}` }, { status: 500 })
  }
}
