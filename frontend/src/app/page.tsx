import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Car, Zap, Utensils, ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">You're 15% below your baseline! 🌿</p>
      </header>

      {/* Hero Metric */}
      <Card className="bg-primary text-primary-foreground border-none shadow-md">
        <CardContent className="p-6">
          <div className="text-sm font-medium opacity-90 mb-2">This Week's Footprint</div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold">102</span>
            <span className="text-lg opacity-90 pb-1">kg CO₂e</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Log Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Quick Log</h2>
          <Link href="/log" className="text-sm text-primary font-medium flex items-center">
            View All <Plus className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Utensils, label: "Food", color: "bg-orange-100 text-orange-600" },
            { icon: Car, label: "Drive", color: "bg-blue-100 text-blue-600" },
            { icon: Zap, label: "Energy", color: "bg-yellow-100 text-yellow-600" },
            { icon: ShoppingBag, label: "Shop", color: "bg-purple-100 text-purple-600" },
          ].map((item, i) => (
            <Link href={`/log?category=${item.label.toLowerCase()}`} key={i} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Trend */}
      <section>
        <h2 className="text-lg font-bold mb-3">Weekly Trend</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <WeeklyTrendChart />
          </CardContent>
        </Card>
      </section>
      
      {/* Spacer for bottom nav */}
      <div className="h-4"></div>
    </div>
  );
}
