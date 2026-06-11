"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type ChartData = { name: string; value: number }[];

const COLORS = ['#f97316', '#3b82f6', '#eab308', '#a855f7', '#22c55e'];

export function CategoryBreakdownChart({ data }: { data: ChartData }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-sm text-muted-foreground p-8 flex items-center justify-center h-64">No data available this week.</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number | string | (number | string)[]) => [`${Number(value).toFixed(1)} kg CO₂e`, 'Emissions']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
