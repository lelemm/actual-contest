"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bug } from "lucide-react"

import CellSystem from "./components/cell-system"
import TimelineCard from "./components/timeline-card"
import ObjectiveCard from "./components/objective-card"
import PrizesCard from "./components/prizes-card"
import ParticipationCard from "./components/participation-card"
import TrackingCard from "./components/tracking-card"
import Leaderboard from "./components/leaderboard"

export default function BugSquashingCompetition() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cell background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 opacity-70"></div>

      {/* Cell system */}
      <CellSystem onCellCountChange={() => {}} onBurstCountChange={() => {}} />

      <div className="relative container mx-auto py-10 px-4 max-w-5xl" style={{ zIndex: 20 }}>
        <div className="flex flex-col items-center text-center mb-10">
          <Badge className="mb-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 px-4 py-1 text-base">
            Actual Budget
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            🐞 Bug Squashing Competition 🐞
          </h1>
          <p className="text-xl font-medium max-w-2xl">
            Attention, awesome developers! 🚀 We&apos;re kicking off a super fun bug squashing competition for Actual Budget,
            and we want YOU to join the party! 🎉
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10">
          <TimelineCard />
          <ObjectiveCard />
          <PrizesCard />
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-10">
          <ParticipationCard />
          <TrackingCard />
        </div>

        <div className="flex justify-center mb-16">
          <a
            href="https://github.com/actualbudget/actual/issues?q=is%3Aissue+is%3Aopen+label%3Abug"
            target="_blank"
            rel="noopener noreferrer"
            className="w-auto inline-block"
          >
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-pulse w-full h-full"
            >
              <Bug className="h-6 w-6" />🎮 Start Squashing Bugs Now! 🎮
            </Button>
          </a>
        </div>

        {/* Integrated Leaderboard */}
        <Leaderboard />
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          50% { transform: translate(-50%, -50%) translateY(-20px) rotate(180deg); }
          100% { transform: translate(-50%, -50%) translateY(0px) rotate(360deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        /* Make all buttons fully clickable */
        button {
          position: relative;
          cursor: pointer;
        }
        
        button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
        
        button * {
          position: relative;
          z-index: 2;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
