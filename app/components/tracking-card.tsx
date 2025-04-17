import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrackingCard() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-green-600">📊 Tracking Progress</CardTitle>
        </div>
        <CardDescription>How we&apos;ll count your amazing contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          We&apos;ll use the following GitHub issues query to count closed bug fixes submitted after the competition start
          date:
        </p>
        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono overflow-x-auto border border-gray-200">
          is:pr is:merged label:bug closed:&gt;TBA
        </div>
      </CardContent>
    </Card>
  )
}
