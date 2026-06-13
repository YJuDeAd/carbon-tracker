"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, Zap, Utensils, ShoppingBag, Plane } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

import { API_URL } from "@/lib/config";

const CATEGORY_OPTIONS = {
  food: ["Poultry", "Pork", "Fish", "Dairy", "Plant-based Meal"],
  transport: ["Petrol Car", "Diesel Car", "Electric Car", "Hybrid Car", "Bus", "Train", "Bicycle/Walking"],
  energy: ["Grid Electricity", "Natural Gas", "Heating Oil", "Renewable Energy"],
  shopping: ["Clothing Item", "Electronics", "Furniture"],
  travel: ["Short-haul Flight", "Long-haul Flight", "Hotel Stay"]
};

const ICONS: Record<string, React.ElementType> = {
  food: Utensils,
  transport: Car,
  energy: Zap,
  shopping: ShoppingBag,
  travel: Plane,
};

const FLAT_OPTIONS = Object.entries(CATEGORY_OPTIONS).flatMap(([cat, types]) => 
  types.map(t => ({ category: cat, type: t, Icon: ICONS[cat] }))
);

const getUnit = (cat: string, type: string) => {
  if (cat === 'transport') return 'km';
  if (cat === 'energy') return 'kWh';
  if (cat === 'shopping') return 'items';
  if (cat === 'food') return 'kg/items';
  if (cat === 'travel') return type === 'Hotel Stay' ? 'nights' : 'km';
  return '';
}

function LogActivityForm() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const initialCat = categoryParam && categoryParam in CATEGORY_OPTIONS ? categoryParam : "transport";
  const initialType = CATEGORY_OPTIONS[initialCat as keyof typeof CATEGORY_OPTIONS][0];
  
  const [selectedOpt, setSelectedOpt] = useState<{category: string, type: string}>({ category: initialCat, type: initialType });
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState<{id: string, activity_type: string, co2e_kg: number, date: string, category: string}[]>([]);

  // OSM Auto-calc state
  const [useAutoCalc, setUseAutoCalc] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    async function fetchRecent() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try {
        const res = await fetch(`${API_URL}/activities`, {
          headers: { "Authorization": `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
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
          category: selectedOpt.category,
          activity_type: selectedOpt.type,
          quantity: parseFloat(amount),
          notes: ""
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to log activity: ${errorText}`);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestDistance = async () => {
    if (!origin || !destination) return;
    setIsCalculating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API_URL}/activities/suggest-transport?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&vehicle_type=${encodeURIComponent(selectedOpt.type)}`, {
        headers: { "Authorization": `Bearer ${session?.access_token}` }
      });
      if (!res.ok) {
        throw new Error("Failed to calculate distance");
      }
      const data = await res.json();
      setAmount(data.distance_km.toFixed(1));
      setUseAutoCalc(false);
    } catch {
      alert("Could not calculate distance. Please try again or enter manually.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 max-w-md mx-auto w-full">
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Log Activity</h1>
        <p className="text-sm text-muted-foreground mt-2">Select an activity, enter the amount, and tap log.</p>
      </header>

      <form onSubmit={handleLog} className="space-y-6">
        {/* Flat Grid Selection */}
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 max-h-[40vh] overflow-y-auto pb-2 px-1">
          {FLAT_OPTIONS.map((opt) => {
            const isSelected = selectedOpt.category === opt.category && selectedOpt.type === opt.type;
            return (
              <button
                key={`${opt.category}-${opt.type}`}
                type="button"
                onClick={() => {
                  setSelectedOpt({ category: opt.category, type: opt.type });
                  setAmount("");
                  setUseAutoCalc(false);
                }}
                className={`flex flex-col items-center p-3 rounded-xl border transition-colors ${
                  isSelected 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border bg-card hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                }`}
              >
                <opt.Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-primary' : ''}`} />
                <span className="text-[10px] font-semibold text-center leading-tight">{opt.type}</span>
              </button>
            );
          })}
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Amount ({getUnit(selectedOpt.category, selectedOpt.type)})
            </label>
            {selectedOpt.category === 'transport' && (
              <button 
                type="button" 
                onClick={() => setUseAutoCalc(!useAutoCalc)}
                className="text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                {useAutoCalc ? "Enter manually" : "Auto-calculate distance"}
              </button>
            )}
          </div>
          
          {useAutoCalc && selectedOpt.category === 'transport' ? (
            <div className="space-y-3 bg-muted/50 p-4 rounded-xl border border-border">
              <Input placeholder="Origin (e.g. London)" value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-12 bg-background rounded-xl" />
              <Input placeholder="Destination (e.g. Paris)" value={destination} onChange={(e) => setDestination(e.target.value)} className="h-12 bg-background rounded-xl" />
              <Button type="button" onClick={handleSuggestDistance} disabled={isCalculating || !origin || !destination} className="w-full h-12 rounded-xl">
                {isCalculating ? "Calculating..." : "Suggest Distance"}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Input 
                id="activity-amount"
                type="text" 
                inputMode="decimal" 
                placeholder="0" 
                className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                aria-describedby="amount-unit"
              />
              <span id="amount-unit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {getUnit(selectedOpt.category, selectedOpt.type)}
              </span>
            </div>
          )}
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full h-14 text-lg rounded-xl mt-4">
          {isLoading ? "Logging..." : "Log Activity"}
        </Button>
      </form>

      {/* Recent Logs Section */}
      <section className="mt-8">
        <h2 className="text-lg font-bold mb-3">Recent Logs</h2>
        <div className="space-y-3">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activities.</p>
          ) : (
            recentLogs.map((log) => {
              const Icon = ICONS[log.category] || Car;
              return (
                <Card key={log.id} className="shadow-sm border-none">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${
                          log.category === 'food' ? 'text-orange-500' :
                          log.category === 'transport' ? 'text-blue-500' :
                          log.category === 'energy' ? 'text-yellow-500' :
                          log.category === 'shopping' ? 'text-purple-500' :
                          'text-indigo-500'
                        }`} />
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
              );
            })
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
