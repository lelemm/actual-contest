import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ObjectiveCard() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-purple-600">🎯 Objective</CardTitle>
        </div>
        <CardDescription>Your mission, should you choose to accept it...</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium">Fix as many bugs as possible before the next merge freeze on 24th April 2025! 💪</p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
          <li>All bug fixes must be submitted as pull requests 📝</li>
          <li>Quality matters as much as quantity ✨</li>
          <li>Focus on impactful fixes 💥</li>
        </ul>
      </CardContent>
    </Card>
  )
}
