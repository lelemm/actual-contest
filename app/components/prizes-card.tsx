import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrizesCard() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border border-white/30 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <CardTitle className="text-orange-600">🏆 Prizes</CardTitle>
        </div>
        <CardDescription>Awesome rewards await!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-white">
              <span className="text-sm font-bold">1st</span>
            </div>
            <div>
              <p className="font-medium">🥇 First Place</p>
              <p className="text-sm">3 bits of swag (e.g., T-shirts, etc.)</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white">
              <span className="text-sm font-bold">2nd</span>
            </div>
            <div>
              <p className="font-medium">🥈 Second Place</p>
              <p className="text-sm">2 bits of swag</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white">
              <span className="text-sm font-bold">3rd</span>
            </div>
            <div>
              <p className="font-medium">🥉 Third Place</p>
              <p className="text-sm">1 bit of swag</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
