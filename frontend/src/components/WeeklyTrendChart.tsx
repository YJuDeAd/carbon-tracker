"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", co2: 12 },
  { day: "Tue", co2: 8 },
  { day: "Wed", co2: 15 },
  { day: "Thu", co2: 10 },
  { day: "Fri", co2: 18 },
  { day: "Sat", co2: 25 },
  { day: "Sun", co2: 14 },
];

export function WeeklyTrendChart() {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
