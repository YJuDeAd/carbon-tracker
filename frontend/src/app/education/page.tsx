"use client";

import { BookOpen, Leaf, Zap, Droplets, UtensilsCrossed } from "lucide-react";
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
                    Replacing just one beef burger a week with a plant-based alternative for a year saves the equivalent emissions of driving ~320 miles.
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
                    Devices plugged in but turned off still drain power. This "vampire energy" accounts for 5% to 10% of an average household's annual electricity usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background overflow-hidden relative group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">Cold Water Washing</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Heating water accounts for up to 90% of the energy used by a washing machine. Switching to cold water can eliminate up to 1,600 pounds of CO₂ emissions annually.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background overflow-hidden relative group">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-xl group-hover:bg-orange-500/20 transition-all"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0">
                  <UtensilsCrossed className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">The Scale of Food Waste</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Food loss and waste account for 8% to 10% of global greenhouse gas emissions. If food waste were a country, it would be the third-largest emitter in the world.
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
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="font-bold text-primary mb-1">Scope 1, 2, and 3 Emissions</h4>
            <p className="text-sm text-muted-foreground"><strong>Scope 1:</strong> Direct emissions from owned sources (e.g., driving a gas car).<br/><strong>Scope 2:</strong> Indirect emissions from purchased energy (e.g., electricity used at home).<br/><strong>Scope 3:</strong> All other indirect emissions in a value chain (e.g., emissions from manufacturing the products you buy).</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="font-bold text-primary mb-1">Carbon Offset vs. Carbon Credit</h4>
            <p className="text-sm text-muted-foreground">A <strong>Carbon Credit</strong> is a "permission slip" typically used by regulated companies allowing them to emit one tonne of CO₂. A <strong>Carbon Offset</strong> is a voluntary contribution to a project (like reforestation) that removes or prevents one tonne of CO₂ elsewhere.</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
            <h4 className="font-bold text-primary mb-1">Greenwashing</h4>
            <p className="text-sm text-muted-foreground">When a company spends more time and money marketing itself as environmentally friendly than on actually minimizing its environmental impact.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
