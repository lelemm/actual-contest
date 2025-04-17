import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TimelineCard() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-pink-600">⏰ Timeline</CardTitle>
        </div>
        <CardDescription>Mark your calendars, bug hunters!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="font-medium">🚦 Starting Now</p>
              <p className="text-sm text-muted-foreground">Competition begins - Let&apos;s go!</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
            <div>
              <p className="font-medium">🏁 24th April 2025</p>
              <p className="text-sm text-muted-foreground">Merge freeze & competition ends</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
