"use client";

import { useEffect, useState } from "react";
import { GoalCard } from "@/components/GoalCard";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { API_URL } from "@/lib/config";

export default function GoalsPage() {
  const supabase = createClient();
  const [goals, setGoals] = useState<{id: string, status: string, target_co2e: number, current_co2e?: number, category: string, deadline: string}[]>([]);
  const [leaderboard, setLeaderboard] = useState<{name: string, score: number, rank: number, is_current_user: boolean, color: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("Eco Warrior");

  // Form states
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("food");
  const [deadlineDate, setDeadlineDate] = useState<Date>();

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userToken = session?.access_token;
      
      if (session?.user?.user_metadata?.name) {
          setCurrentUserName(session.user.user_metadata.name);
      }
      
      if (!userToken) {
          setGoals([{ id: "1", target_co2e: 50, current_co2e: 20, category: "food", deadline: "2026-12-31", status: "active" }]);
          setLoading(false);
          return;
      }
      setToken(userToken);

      const headers = { "Authorization": `Bearer ${userToken}` };
      
      const [resGoals, resLeaderboard] = await Promise.all([
        fetch(`${API_URL}/goals`, { headers }).catch(e => null),
        fetch(`${API_URL}/users/leaderboard`, { headers }).catch(e => null)
      ]);
      
      if (resGoals && resGoals.ok) {
        setGoals(await resGoals.json());
      }
      
      if (resLeaderboard && resLeaderboard.ok) {
        setLeaderboard(await resLeaderboard.json());
      } else {
        // Set a sentinel value to indicate error state
        setLeaderboard([{ name: "Error loading leaderboard", score: 0, rank: 0, is_current_user: false, color: "text-red-500" }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch(e) {
        console.error(e);
        alert("Network error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Goals</h1>
        <p className="text-muted-foreground mt-1">Set targets and challenge yourself</p>
      </header>

      <Tabs defaultValue="my-goals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="my-goals" className="font-bold flex items-center gap-2">
            <Target className="w-4 h-4" /> My Goals
          </TabsTrigger>
          <TabsTrigger value="community" className="font-bold flex items-center gap-2">
            <Users className="w-4 h-4" /> Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-goals" className="space-y-6">
          {/* Create Goal Form */}
          <Card className="bg-primary/5 border-primary/10 overflow-visible">
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
                goals.map((goal: {id: string, status: string, target_co2e: number, current_co2e?: number, category: string, deadline: string}) => (
                    <GoalCard key={goal.id} goal={goal} onToggle={handleToggle} />
                ))
            )}
          </section>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <section>
            <h2 className="text-lg font-bold mb-3">Community Leaderboard</h2>
            <Card className="border-none shadow-sm">
              <CardContent className="p-0 divide-y divide-border">
                {leaderboard.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Loading leaderboard...</div>
                ) : (
                  leaderboard.map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`font-black text-lg w-6 text-center ${user.color}`}>#{user.rank}</div>
                        <span className={cn("font-medium text-sm", user.is_current_user && "font-bold text-blue-600")}>
                          {user.is_current_user ? `${currentUserName} (You)` : user.name}
                        </span>
                      </div>
                      <div className="font-bold text-sm">{user.score} kg CO₂e</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Active Challenges</h2>
            <Card className="border-none shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardContent className="p-4 flex flex-col items-start space-y-2">
                <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-1 rounded-full">Ends in 3 days</div>
                <h3 className="font-bold text-lg">Meatless Monday Marathon</h3>
                <p className="text-sm text-muted-foreground">Join 1,204 others in skipping meat for the entire week.</p>
                <button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors">
                  Join Challenge
                </button>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>

      <div className="h-4"></div>
    </div>
  );
}
