"use client";

import { useEffect, useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function GoalsPage() {
  const supabase = createClient();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Form states
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("food");
  const [deadlineDate, setDeadlineDate] = useState<Date>();

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
      const res = await fetch(`${API_URL}/goals`, { headers });
      if (res.ok) {
        const data = await res.json();
        
        setGoals(data);
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
        const res = await fetch(`${API_URL}/goals/${id}`, {
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
    const deadlineStr = deadlineDate ? format(deadlineDate, "yyyy-MM-dd") : "";
    if (!token) {
      alert("You must be logged in to create a goal.");
      return;
    }
    if (!target) {
      alert("Please enter a target amount.");
      return;
    }
    if (!deadlineStr) {
      alert("Please pick a deadline.");
      return;
    }

    try {
        const res = await fetch(`${API_URL}/goals`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category,
                target_co2e: parseFloat(target),
                deadline: deadlineStr,
                status: "active"
            })
        });
        if (res.ok) {
            setTarget("");
            setDeadlineDate(undefined);
            loadData();
        } else {
            const err = await res.text();
            console.error(err);
            alert("Failed to save goal: " + err);
        }
    } catch(e: any) {
        console.error(e);
        alert("Network error: " + e.message);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Goals</h1>
        <p className="text-muted-foreground mt-1">Set targets and challenge yourself</p>
      </header>

      {/* Create Goal Form */}
      <Card className="bg-primary/5 border-primary/10 mb-6 overflow-visible">
        <CardContent className="p-4">
            <h3 className="font-bold mb-3 text-primary">New Goal</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <Select value={category} onValueChange={(v) => { if (v) setCategory(v); }}>
                      <SelectTrigger className="flex-1 bg-background">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                    <input 
                        type="number" 
                        placeholder="Target (kg CO₂e)" 
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger 
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "flex-1 justify-start text-left font-normal bg-background text-sm px-3 py-2 h-auto",
                          !deadlineDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick deadline</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deadlineDate}
                          onSelect={setDeadlineDate}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

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
