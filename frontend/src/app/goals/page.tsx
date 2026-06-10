"use client";

import { useEffect, useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy"
);

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Form states
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("food");
  const [deadline, setDeadline] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userToken = session?.access_token;
      
      if (!userToken) {
          setGoals([{ id: "1", target_co2e: 50, current_co2e: 20, category: "food", deadline: "2026-12-31", status: "active" }]);
          setLoading(false);
          return;
      }
      setToken(userToken);

      const headers = { "Authorization": `Bearer ${userToken}` };
      const res = await fetch("http://127.0.0.1:8000/goals", { headers });
      if (res.ok) {
        const data = await res.json();
        
        // Mock current_co2e for demo since there's no backend progress tracking
        const goalsWithProgress = data.map((g: any) => ({...g, current_co2e: Math.random() * g.target_co2e}));
        setGoals(goalsWithProgress);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (id: string, completed: boolean) => {
    if (!token) return;
    try {
        const res = await fetch(`http://127.0.0.1:8000/goals/${id}`, {
            method: "PATCH",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status: completed ? "completed" : "active" })
        });
        if (res.ok) {
            loadData();
        }
    } catch(e) {
        console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !target || !deadline) return;

    try {
        const res = await fetch(`http://127.0.0.1:8000/goals`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                target_co2e: parseFloat(target),
                deadline,
                status: "active"
            })
        });
        if (res.ok) {
            setTarget("");
            setDeadline("");
            loadData();
        }
    } catch(e) {
        console.error(e);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Goals</h1>
        <p className="text-muted-foreground mt-1">Set targets and challenge yourself</p>
      </header>

      {/* Create Goal Form */}
      <Card className="bg-primary/5 border-primary/10 mb-6">
        <CardContent className="p-4">
            <h3 className="font-bold mb-3 text-primary">New Goal</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        className="flex-1 bg-white border border-border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="energy">Energy</option>
                        <option value="shopping">Shopping</option>
                        <option value="travel">Travel</option>
                    </select>
                    <input 
                        type="number" 
                        placeholder="Target (kg CO₂e)" 
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="flex-1 bg-white border border-border rounded-md px-3 py-2 text-sm"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <input 
                        type="date" 
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        className="flex-1 bg-white border border-border rounded-md px-3 py-2 text-sm"
                        required
                    />
                    <button type="submit" className="bg-primary text-primary-foreground font-bold rounded-md px-4 py-2 text-sm">
                        Add Goal
                    </button>
                </div>
            </form>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-bold mb-3">Your Challenges</h2>
        {loading ? (
            <div className="animate-pulse space-y-3">
                <div className="h-24 bg-muted rounded-xl w-full"></div>
                <div className="h-24 bg-muted rounded-xl w-full"></div>
            </div>
        ) : goals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No goals active. Create one above!</p>
        ) : (
            goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onToggle={handleToggle} />
            ))
        )}
      </section>

      <div className="h-4"></div>
    </div>
  );
}
