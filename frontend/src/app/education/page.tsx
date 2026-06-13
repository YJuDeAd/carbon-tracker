"use client";

import { BookOpen, Leaf, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EducationHub() {
  return (
    <div className="p-4 space-y-8 pb-20">
      <header className="pt-8 pb-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Learn.</h1>
        <p className="text-muted-foreground mt-2 text-lg">Small changes, massive impact.</p>
      </header>

      <section>
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Micro-Lessons</h2>
        </div>
        <div className="space-y-4">
          <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">The Power of Plant-Based</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Swapping just one meat meal a week for a plant-based alternative can save the equivalent emissions of driving 1,160 miles a year.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/20 dark:to-background overflow-hidden relative group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl group-hover:bg-yellow-500/20 transition-all"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">Vampire Energy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Devices plugged in but turned off still drain power. Unplugging them could reduce your energy bill and emissions by up to 10%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pt-4">
        <h2 className="text-xl font-bold tracking-tight mb-4">Glossary</h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="font-bold text-primary mb-1">CO₂e (Carbon Dioxide Equivalent)</h4>
            <p className="text-sm text-muted-foreground">The standard unit for measuring carbon footprints. It bundles different greenhouse gases into a single number based on their warming potential.</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="font-bold text-primary mb-1">Baseline</h4>
            <p className="text-sm text-muted-foreground">Your starting point. We use your baseline to show you how your daily choices are actively reducing your emissions over time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
