"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, Zap, Utensils, ShoppingBag, Plane } from "lucide-react";

function LogActivityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeTab, setActiveTab] = useState(categoryParam || "transport");
  const [amount, setAmount] = useState("");

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend submission
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Log Activity</h1>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-14 bg-white border border-border rounded-xl">
          <TabsTrigger value="food"><Utensils className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="transport"><Car className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="energy"><Zap className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="shopping"><ShoppingBag className="w-5 h-5" /></TabsTrigger>
          <TabsTrigger value="travel"><Plane className="w-5 h-5" /></TabsTrigger>
        </TabsList>

        <TabsContent value="transport" className="mt-6 focus-visible:outline-none">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <label htmlFor="vehicle" className="text-sm font-medium">Vehicle Type</label>
                  <select 
                    id="vehicle" 
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="gasoline">Gasoline Car</option>
                    <option value="electric">Electric Vehicle (EV)</option>
                    <option value="hybrid">Hybrid Car</option>
                    <option value="bus">Public Bus</option>
                    <option value="train">Subway / Train</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="distance" className="text-sm font-medium">Distance</label>
                  <div className="relative">
                    <Input 
                      id="distance"
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      miles
                    </span>
                  </div>
                </div>

                <Button type="button" onClick={handleLog} className="w-full h-14 text-lg rounded-xl mt-4">
                  Log Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="food" className="mt-6 focus-visible:outline-none">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="meal" className="text-sm font-medium">Meal Type</label>
                  <select id="meal" className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="beef">Beef / Lamb Meal</option>
                    <option value="chicken">Chicken / Fish Meal</option>
                    <option value="vegetarian">Vegetarian Meal</option>
                    <option value="vegan">Vegan Meal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="servings" className="text-sm font-medium">Servings</label>
                  <div className="relative">
                    <Input id="servings" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="1" className="h-16 text-3xl font-bold pl-4 pr-24 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">meals</span>
                  </div>
                </div>
                <Button type="button" onClick={handleLog} className="w-full h-14 text-lg rounded-xl mt-4">Log Food</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="mt-6 focus-visible:outline-none">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="energyType" className="text-sm font-medium">Energy Source</label>
                  <select id="energyType" className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="electricity">Electricity (kWh)</option>
                    <option value="natural_gas">Natural Gas (therms)</option>
                    <option value="heating_oil">Heating Oil (gallons)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="energyAmount" className="text-sm font-medium">Usage Amount</label>
                  <div className="relative">
                    <Input id="energyAmount" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">units</span>
                  </div>
                </div>
                <Button type="button" onClick={handleLog} className="w-full h-14 text-lg rounded-xl mt-4">Log Energy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping" className="mt-6 focus-visible:outline-none">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="purchaseType" className="text-sm font-medium">Purchase Category</label>
                  <select id="purchaseType" className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="clothing">Clothing & Apparel</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="general">General Goods</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="spent" className="text-sm font-medium">Amount Spent</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input id="spent" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="h-16 text-3xl font-bold pl-8 pr-4 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                  </div>
                </div>
                <Button type="button" onClick={handleLog} className="w-full h-14 text-lg rounded-xl mt-4">Log Purchase</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel" className="mt-6 focus-visible:outline-none">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="flightType" className="text-sm font-medium">Flight Type</label>
                  <select id="flightType" className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="domestic">Domestic (Short-haul)</option>
                    <option value="international">International (Long-haul)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="hours" className="text-sm font-medium">Flight Duration</label>
                  <div className="relative">
                    <Input id="hours" type="text" inputMode="numeric" pattern="[0-9]*" placeholder="0" className="h-16 text-3xl font-bold pl-4 pr-16 rounded-xl" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">hours</span>
                  </div>
                </div>
                <Button type="button" onClick={handleLog} className="w-full h-14 text-lg rounded-xl mt-4">Log Flight</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
