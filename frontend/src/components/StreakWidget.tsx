import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StreakWidget({ streak = 3 }: { streak?: number }) {
  return (
    <Card className="bg-orange-50 border-orange-200 shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-orange-900">Current Streak</h3>
            <p className="text-sm text-orange-700">You're on fire! 🔥</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-orange-600">{streak}</div>
      </CardContent>
    </Card>
  );
}
