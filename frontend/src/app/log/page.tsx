"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, Zap, Utensils, ShoppingBag, Plane } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const CATEGORY_OPTIONS = {
  food: ["Beef", "Poultry", "Pork", "Fish", "Dairy", "Plant-based Meal"],
  transport: ["Petrol Car", "Diesel Car", "Electric Car", "Hybrid Car", "Bus", "Train", "Bicycle/Walking"],
  energy: ["Grid Electricity", "Natural Gas", "Heating Oil", "Renewable Energy"],
  shopping: ["Clothing Item", "Electronics", "Furniture"],
  travel: ["Short-haul Flight", "Long-haul Flight", "Hotel Stay"]
};

function LogActivityForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [activeTab, setActiveTab] = useState<keyof typeof CATEGORY_OPTIONS>((categoryParam && categoryParam in CATEGORY_OPTIONS ? categoryParam as keyof typeof CATEGORY_OPTIONS : "transport"));
  const [activityType, setActivityType] = useState(CATEGORY_OPTIONS[activeTab][0]);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState<{id: string, activity_type: string, co2e_kg: number, date: string, category: string}[]>([]);

  useEffect(() => {
    async function fetchRecent() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try {
        const res = await fetch(`${API_URL}/activities`, {
          headers: { "Authorization": `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data: {id: string, activity_type: string, co2e_kg: number, date: string, category: string}[] = await res.json();
          setRecentLogs((data || []).slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load recent logs", err);
      }
    }
    fetchRecent();
  }, [supabase.auth]);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          category: activeTab,
          activity_type: activityType,
          quantity: parseFloat(amount),
          notes: ""
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to log activity: ${errorText}`);
      }

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Log Activity</h1>
      </header>

      <Tabs 
        value={activeTab} 
        onValueChange={(v) => {
          const newTab = v as keyof typeof CATEGORY_OPTIONS;
          setActiveTab(newTab);
          setActivityType(CATEGORY_OPTIONS[newTab][0]);
          setAmount("");
        }} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 h-14 bg-muted border border-border rounded-xl">
          <TabsTrigger value="food"><Utensils className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="transport"><Car className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="energy"><Zap className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="shopping"><ShoppingBag className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="travel"><Plane className="w-5 h-5" /></TabsTrigger>
        </TabsList>

        <form onSubmit={handleLog}>
          <TabsContent value="transport" className="mt-6 focus-visible:outline-none">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="transport-type" className="text-sm font-medium">Vehicle Type</label>
                  <select 
                    id="transport-type" 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.transport.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="transport-dist" className="text-sm font-medium">Distance</label>
                  <div className="relative">
                    <Input id="transport-dist" type="text" inputMode="decimal" placeholder="0" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food" className="mt-6 focus-visible:outline-none">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="food-type" className="text-sm font-medium">Meal Type</label>
                  <select 
                    id="food-type" 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.food.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="food-qty" className="text-sm font-medium">Quantity (kg/items)</label>
                  <div className="relative">
                    <Input id="food-qty" type="text" inputMode="decimal" placeholder="1" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="mt-6 focus-visible:outline-none">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="energy-type" className="text-sm font-medium">Energy Source</label>
                  <select 
                    id="energy-type" 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.energy.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="energy-qty" className="text-sm font-medium">Usage Amount (kWh)</label>
                  <div className="relative">
                    <Input id="energy-qty" type="text" inputMode="decimal" placeholder="0" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping" className="mt-6 focus-visible:outline-none">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="shopping-type" className="text-sm font-medium">Item Category</label>
                  <select 
                    id="shopping-type" 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.shopping.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="shopping-qty" className="text-sm font-medium">Number of Items</label>
                  <div className="relative">
                    <Input id="shopping-qty" type="text" inputMode="decimal" placeholder="1" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel" className="mt-6 focus-visible:outline-none">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <label htmlFor="travel-type" className="text-sm font-medium">Travel Type</label>
                  <select 
                    id="travel-type" 
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {CATEGORY_OPTIONS.travel.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="travel-qty" className="text-sm font-medium">Distance/Nights</label>
                  <div className="relative">
                    <Input id="travel-qty" type="text" inputMode="decimal" placeholder="0" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg rounded-xl mt-4">
            {isLoading ? "Logging..." : "Log Activity"}
          </Button>
        </form>
      </Tabs>

      {/* Recent Logs Section */}
      <section className="mt-8">
        <h2 className="text-lg font-bold mb-3">Recent Logs</h2>
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activities.</p>
          ) : (
            recentLogs.map((log) => (
              <Card key={log.id} className="shadow-sm border-none">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {log.category === 'food' && <Utensils className="w-5 h-5 text-orange-500" />}
                      {log.category === 'transport' && <Car className="w-5 h-5 text-blue-500" />}
                      {log.category === 'energy' && <Zap className="w-5 h-5 text-yellow-500" />}
                      {log.category === 'shopping' && <ShoppingBag className="w-5 h-5 text-purple-500" />}
                      {log.category === 'travel' && <Plane className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{log.activity_type}</p>
                      <p className="text-xs text-muted-foreground capitalize">{log.date} • {log.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-foreground">{log.co2e_kg.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground ml-1">kg CO₂e</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
      <div className="h-4"></div>
    </div>
  );
}

export default function LogActivityPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <LogActivityForm />
    </Suspense>
  );
}
