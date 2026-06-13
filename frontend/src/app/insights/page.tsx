"use client";

import { useEffect, useState } from "react";
import { InsightCard } from "@/components/InsightCard";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function InsightsPage() {
  const supabase = createClient();
  const [tips, setTips] = useState<string[]>([]);
  const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        
        if (!token) {
            setTips(["Consider carpooling to work", "Reduce meat intake", "Turn off lights"]);
            setChartData([
                { name: "Food", value: 40 },
                { name: "Transport", value: 30 },
                { name: "Energy", value: 20 },
            ]);
            setLoading(false);
            return;
        }

        const headers = { "Authorization": `Bearer ${token}` };

        // Fetch insights
        fetch(`${API_URL}/insights`, { headers })
          .then(res => res.json())
          .then(data => {
            if (data && data.tips_json) setTips(data.tips_json);
          }).catch(console.error);

        // Fetch activities
        fetch(`${API_URL}/activities`, { headers })
          .then(res => res.json())
          .then(acts => {
            if (Array.isArray(acts)) {
              const summary: Record<string, number> = {};
              acts.forEach((a: { category: string; co2e_kg: number }) => {
                summary[a.category] = (summary[a.category] || 0) + a.co2e_kg;
              });
              setChartData(Object.keys(summary).map(k => ({ name: k, value: summary[k] })));
            }
          }).catch(console.error);

      } catch (e) {
        console.error("Error loading data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supabase.auth]);

  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1">Personalized tips and breakdown</p>
      </header>

      {loading ? (
        <div className="animate-pulse space-y-4">
            <div className="h-40 bg-muted rounded-xl w-full"></div>
            <div className="h-64 bg-muted rounded-xl w-full"></div>
        </div>
      ) : (
        <>
            <InsightCard tips={tips} />
            <section>
                <h2 className="text-lg font-bold mb-3">Emissions Breakdown</h2>
                <Card className="shadow-sm">
                <CardContent className="p-2">
                    <CategoryBreakdownChart data={chartData} />
                </CardContent>
                </Card>
            </section>
        </>
      )}
      <div className="h-4"></div>
    </div>
  );
}
