import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function ParticipationCard() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-blue-600">🚀 How to Participate</CardTitle>
        </div>
        <CardDescription>Follow these fun steps!</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">🔗 Link bugs to pull requests</p>
              <p className="text-sm">Ensure each bug is linked to its corresponding PR.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">👤 Assign yourself to bug issues</p>
              <p className="text-sm">Take credit for the bugs you&apos;re fixing!</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">✅ Bug fixes approval</p>
              <p className="text-sm">All fixes must be approved by a maintainer during PR.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">🆕 New bugs welcome</p>
              <p className="text-sm">You can raise new bugs, but remember—only fixes count toward your score.</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
