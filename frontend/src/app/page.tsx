"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Activity, Sparkles, Target, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "demo@carbontracker.app",
        password: "Demo1234!"
      });
      if (error) {
        alert("Demo login failed: " + error.message);
        setIsDemoLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      
      {/* Navbar */}
      <header className="px-6 py-4 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Leaf className="w-6 h-6" />
          <span>CarbonTracker</span>
        </div>
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-semibold")}>
          Sign In
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pb-20">
        
        {/* Hero Section */}
        <section className="py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
            Open Source Sustainability
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground">
            Understand, track, and reduce your <span className="text-primary bg-primary/10 px-2 rounded-lg">carbon footprint</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Take control of your environmental impact with personalized insights, daily logging, and community goals. Small changes make a big difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 font-bold text-base h-12 shadow-lg shadow-primary/25")}>
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 font-bold text-base h-12 border-2"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
            >
              {isDemoLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              View Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-10">Everything you need to track impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Baseline Calculator</h3>
                <p className="text-muted-foreground">Discover your starting point with our quick onboarding assessment.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Activity Logging</h3>
                <p className="text-muted-foreground">Log daily emissions across food, transport, energy, and more.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">AI Insights</h3>
                <p className="text-muted-foreground">Get personalized, actionable tips powered by Groq and LLaMA 3.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 text-orange-600 dark:text-orange-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-2">Goal Tracking</h3>
                <p className="text-muted-foreground">Set emission reduction goals and climb the community leaderboard.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-2xl font-black text-primary shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-lg">Log your activities</h3>
                <p className="text-sm text-muted-foreground">Quickly record your meals, commutes, and energy usage in seconds.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-2xl font-black text-primary shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-lg">Get AI insights</h3>
                <p className="text-sm text-muted-foreground">Our AI analyzes your patterns and generates personalized reduction tips.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-2xl font-black text-primary shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-lg">Reduce your footprint</h3>
                <p className="text-sm text-muted-foreground">Act on insights, hit your goals, and track your progress over time.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Leaf className="w-5 h-5" />
            <span>CarbonTracker</span>
          </div>
          <a 
            href="https://github.com/YJuDeAd/carbon-tracker" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            View on GitHub
          </a>
        </div>
      </footer>

    </div>
  );
}
