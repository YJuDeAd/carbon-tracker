import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function InsightCard({ tips }: { tips: string[] }) {
  const router = useRouter();

  if (!tips || tips.length === 0) return null;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/10 overflow-hidden relative">
      <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 text-green-200 dark:text-green-800/30">
        <Sparkles className="w-48 h-48" />
      </div>
      <CardContent className="p-6 relative z-10 space-y-4">
        <div className="flex items-center space-x-2 text-green-800 dark:text-green-300 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h3>AI Insights</h3>
        </div>
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="text-sm font-medium text-green-900 dark:text-green-100 flex items-start space-x-2">
              <span className="text-green-600 dark:text-green-400 font-bold">{i + 1}.</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => router.push("/goals")}
          className="text-xs font-bold text-green-700 dark:text-green-400 bg-background/60 hover:bg-background border border-green-300 dark:border-green-800 py-1.5 px-3 rounded-full transition-colors"
        >
          Try this
        </button>
      </CardContent>
    </Card>
  );
}
