"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, Github } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminPanel() {
  const [syncing, setSyncing] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/github/sync")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "GitHub data synced successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to sync GitHub data.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error syncing GitHub data:", error)
      toast({
        title: "Error",
        description: "Failed to sync GitHub data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl mb-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-purple-600 flex items-center">
          <Database className="h-5 w-5 mr-2 text-purple-500" />
          Admin Panel
        </CardTitle>
        <CardDescription>Manage the bug squashing competition data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">GitHub Sync</h3>
              <p className="text-sm text-gray-500">Fetch the latest bug fix PRs from GitHub</p>
            </div>
            <Button onClick={handleSync} disabled={syncing} className="flex items-center gap-2">
              <Github className={`h-4 w-4 ${syncing ? "animate-pulse" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Now"}</span>
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700 flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Automatic Updates
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              The leaderboard data is automatically refreshed every 24 hours. You can also manually refresh using the
              button on the leaderboard.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
