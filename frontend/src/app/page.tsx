"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeeklyTrendChart } from "@/components/WeeklyTrendChart";
import { Car, Zap, Utensils, ShoppingBag, Plus, Loader2, Share2, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StreakWidget } from "@/components/StreakWidget";
import { BadgeGrid } from "@/components/BadgeGrid";
import { createClient } from "@/utils/supabase/client";
import { ShareSummaryCard } from "@/components/ShareSummaryCard";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader } from "@/components/ui/drawer";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function DashboardPage() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [dashboardData, setDashboardData] = useState<{this_week_co2e: number, percent_diff: number, weekly_trend: {date: string, co2e_kg: number}[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Eco Warrior");
  const shareCardRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      let shouldRedirect = false;
      try {
        if (session.user.user_metadata?.name) {
          setUserName(session.user.user_metadata.name);
        }
        
        const [gamRes, dashRes] = await Promise.all([
          fetch(`${API_URL}/users/me/gamification`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${API_URL}/users/me/dashboard`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (gamRes.ok) {
          const gamData = await gamRes.json();
          setStreak(gamData.current_streak || 0);
          setUnlockedBadges(gamData.unlocked_badges || []);
        }

        if (dashRes.ok) {
          const dashData = await dashRes.json();
          if (!dashData.baseline_score || dashData.baseline_score === 0) {
            shouldRedirect = true;
          } else {
            setDashboardData(dashData);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        if (shouldRedirect) {
          router.push("/onboarding");
        } else {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const footprint = dashboardData ? Math.round(dashboardData.this_week_co2e) : 0;
  const percentDiff = dashboardData?.percent_diff ? Math.round(dashboardData.percent_diff) : 0;
  
  let headerMessage = "Let's track your footprint! 🌿";
  if (percentDiff < 0) {
    headerMessage = `You're ${Math.abs(percentDiff)}% below your baseline! 🌿`;
  } else if (percentDiff > 0) {
    headerMessage = `You're ${percentDiff}% above your baseline. ⚠️`;
  } else if (percentDiff === 0 && footprint > 0) {
    headerMessage = "You're exactly on track with your baseline. 📊";
  }

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, { cacheBust: true, pixelRatio: 2 });
      
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "carbon-score.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'My Carbon Footprint',
            text: 'Check out my progress on Carbon Footprint Tracker!',
            files: [file],
          });
          return;
        }
      } catch(e) {
        // Fallback to download
      }

      const link = document.createElement("a");
      link.download = "carbon-score.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">{headerMessage}</p>
      </header>

      {/* Hero Metric */}
      <Card className="bg-primary text-primary-foreground border-none shadow-md">
        <CardContent className="p-6 flex justify-between items-end">
          <div>
            <div className="text-sm font-medium opacity-90 mb-2">This Week&apos;s Footprint</div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{footprint}</span>
              <span className="text-lg opacity-90 pb-1">kg CO₂e</span>
            </div>
          </div>
          
          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex items-center space-x-2 bg-primary-foreground text-primary px-3 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Share Your Progress</DrawerTitle>
                <DrawerDescription>Inspire others by sharing your footprint.</DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col items-center justify-center p-4 space-y-6">
                <div className="flex justify-center w-full overflow-hidden rounded-3xl">
                  <ShareSummaryCard ref={shareCardRef} footprint={footprint} streak={streak} userName={userName} />
                </div>
                <button 
                  onClick={handleShare}
                  className="w-full max-w-[350px] bg-primary text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Save or Share Image</span>
                </button>
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>

      <StreakWidget streak={streak} />

      {/* Quick Log Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Quick Log</h2>
          <Link href="/log" className="text-sm text-primary font-medium flex items-center">
            View All <Plus className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Utensils, label: "Food", category: "food", color: "bg-orange-100 text-orange-600" },
            { icon: Car, label: "Drive", category: "transport", color: "bg-blue-100 text-blue-600" },
            { icon: Zap, label: "Energy", category: "energy", color: "bg-yellow-100 text-yellow-600" },
            { icon: ShoppingBag, label: "Shop", category: "shopping", color: "bg-purple-100 text-purple-600" },
          ].map((item, i) => (
            <Link href={`/log?category=${item.category}`} key={i} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Weekly Trend */}
      <section>
        <h2 className="text-lg font-bold mb-3">Weekly Trend</h2>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <WeeklyTrendChart trendData={dashboardData?.weekly_trend} />
          </CardContent>
        </Card>
      </section>

      <BadgeGrid unlockedBadges={unlockedBadges} />
      
      {/* Spacer for bottom nav */}
      <div className="h-4"></div>
    </div>
  );
}
