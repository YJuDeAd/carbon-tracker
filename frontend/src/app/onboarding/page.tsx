"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [diet, setDiet] = useState<string | null>(null);
  const [commute, setCommute] = useState<number[]>([100]);
  const [energy, setEnergy] = useState<string | null>(null);

  const handleNext = async () => {
    if (step < 3) setStep(step + 1);
    else {
      try {
        const supabase = await import("@/utils/supabase/client").then(m => m.createClient());
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
          await fetch(`${API_URL}/users/me/baseline`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              diet: diet || "Average",
              commute_miles: commute[0],
              energy_source: energy || "Mixed"
            })
          });
        }
      } catch (err) {
        console.error("Failed to save baseline", err);
      }
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <div className="flex-1 mt-12">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-primary/20"}`}
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {step === 1 && "What's your typical diet?"}
            {step === 2 && "Weekly driving distance?"}
            {step === 3 && "Home energy source?"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {step === 1 && "This helps us estimate your food footprint."}
            {step === 2 && "Estimate how many miles you drive per week."}
            {step === 3 && "What primarily powers your home?"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            {["Meat Lover", "Average", "Vegetarian", "Vegan"].map((type) => (
              <Card 
                key={type} 
                className={`cursor-pointer transition-colors ${diet === type ? "border-primary bg-secondary/30" : "hover:border-primary/50"}`}
                onClick={() => setDiet(type)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{type}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${diet === type ? "border-primary" : "border-muted-foreground"}`}>
                    {diet === type && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 mt-12">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{commute[0]}</span>
              <span className="text-muted-foreground ml-2">miles</span>
            </div>
            <Slider
              value={commute}
              onValueChange={(val) => setCommute(Array.isArray(val) ? val : [val as number])}
              max={500}
              step={10}
              className="w-full"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {["Grid Electricity", "Solar Panels", "Natural Gas", "Mixed"].map((type) => (
              <Card 
                key={type} 
                className={`cursor-pointer transition-colors ${energy === type ? "border-primary bg-secondary/30" : "hover:border-primary/50"}`}
                onClick={() => setEnergy(type)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{type}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${energy === type ? "border-primary" : "border-muted-foreground"}`}>
                    {energy === type && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-background pt-4 pb-8">
        <Button 
          className="w-full h-14 text-lg rounded-xl" 
          onClick={handleNext}
          disabled={((step === 1 && diet === null) || (step === 3 && energy === null)) ? true : undefined}
        >
          {step === 3 ? "Complete Profile" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
