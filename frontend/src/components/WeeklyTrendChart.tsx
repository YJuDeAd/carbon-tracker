"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function WeeklyTrendChart({ trendData }: { trendData?: { date: string; co2e_kg: number }[] }) {
  const chartData = trendData 
    ? [...trendData].reverse().map(d => ({
        day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
        co2: Math.round(d.co2e_kg)
      }))
    : [
        { day: "Mon", co2: 0 },
        { day: "Tue", co2: 0 },
        { day: "Wed", co2: 0 },
        { day: "Thu", co2: 0 },
        { day: "Fri", co2: 0 },
        { day: "Sat", co2: 0 },
        { day: "Sun", co2: 0 },
      ];

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#525252" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#525252" }} />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            labelStyle={{ fontWeight: "bold", color: "#171717" }}
          />
          <Area 
            type="monotone" 
            dataKey="co2" 
            stroke="#22c55e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCo2)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
