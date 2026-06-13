"use client";

import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";

interface ShareSummaryCardProps {
  footprint: number;
  streak: number;
  userName: string;
}

export const ShareSummaryCard = forwardRef<HTMLDivElement, ShareSummaryCardProps>(
  ({ footprint, streak, userName }, ref) => {
    return (
      <div ref={ref} className="w-[350px] p-6 bg-gradient-to-br from-green-500 to-emerald-700 text-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between" style={{ aspectRatio: "4/5" }}>
        {/* Background decorative elements */}
        <div className="absolute -right-10 -top-10 text-white/10">
          <Leaf className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-lg">CarbonTracker</span>
          </div>
          <h2 className="text-3xl font-black pt-4 leading-tight">
            I&apos;m taking action for the planet.
          </h2>
        </div>

        <div className="relative z-10 space-y-4">
          <Card className="bg-white/10 border-none backdrop-blur-md text-white">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white/80">Weekly Footprint</span>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black">{footprint}</span>
                  <span className="text-sm font-medium pb-1">kg CO₂e</span>
                </div>
              </div>
              <div className="h-[1px] bg-white/20 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-white/80">Current Streak</span>
                <span className="text-xl font-bold">{streak} days 🔥</span>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-sm font-medium text-white/80">
            Join {userName} in tracking your impact.
          </p>
        </div>
      </div>
    );
  }
);
ShareSummaryCard.displayName = "ShareSummaryCard";
