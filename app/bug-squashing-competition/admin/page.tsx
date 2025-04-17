import AdminPanel from "../components/admin-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Link href="/bug-squashing-competition">
          <Button variant="ghost" className="mb-6 hover:bg-white/20">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Competition
          </Button>
        </Link>

        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            🛠️ Competition Admin Panel 🛠️
          </h1>
          <p className="text-lg font-medium max-w-2xl">Manage the bug squashing competition data and settings</p>
        </div>

        <AdminPanel />
      </div>
    </div>
  )
}
