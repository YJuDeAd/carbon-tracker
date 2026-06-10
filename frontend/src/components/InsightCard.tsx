import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function InsightCard({ tips }: { tips: string[] }) {
  if (!tips || tips.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-green-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-green-600" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-green-900 text-lg">AI Insights</h3>
        </div>
        <ul className="space-y-3 mb-4">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex gap-2 text-green-800 text-sm">
              <span className="font-bold text-green-600 opacity-50">{idx + 1}.</span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
        <button className="text-xs font-bold text-green-700 bg-white/60 hover:bg-white border border-green-300 py-1.5 px-3 rounded-full transition-colors">
          Try this
        </button>
      </CardContent>
    </Card>
  );
}
