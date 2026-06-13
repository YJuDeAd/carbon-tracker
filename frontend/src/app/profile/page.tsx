"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Moon, LogOut, Activity, Award, Settings, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [metricUnits, setMetricUnits] = useState(true);
  const [userName, setUserName] = useState("Eco Warrior");
  const [userJoined, setUserJoined] = useState("");
  const [totalLogs, setTotalLogs] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const user = session.user;
      if (user.user_metadata?.name) {
        setUserName(user.user_metadata.name);
      }
      const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      setUserJoined(`Joined ${joinedDate}`);

      try {
        const res = await fetch(`${API_URL}/users/me/gamification`, {
          headers: { "Authorization": `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTotalLogs(data.total_logs || 0);
          setBestStreak(data.current_streak || 0); // Displaying current streak as best streak for MVP
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 space-y-6">
      <header className="pt-8 pb-4">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      </header>

      {/* User Avatar & Info */}
      <Card className="border-none shadow-sm bg-primary/10">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">{userJoined || "Joined recently"}</p>
          </div>
        </CardContent>
      </Card>

      {/* All Time Stats */}
      <section>
        <h3 className="text-lg font-bold mb-3">All-Time Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Activity className="w-6 h-6 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{totalLogs}</div>
              <div className="text-xs text-muted-foreground font-medium">Total Logs</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Award className="w-6 h-6 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold">{bestStreak}</div>
              <div className="text-xs text-muted-foreground font-medium">Best Streak</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Education Hub */}
      <section>
        <Card className="border-none shadow-sm bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-10">
            <BookOpen className="w-32 h-32 -mt-4 -mr-4" />
          </div>
          <CardContent className="p-6 relative z-10 flex flex-col items-start space-y-3">
            <div>
              <h3 className="font-bold text-lg">Education Hub</h3>
              <p className="text-primary-foreground/80 text-sm">Micro-lessons and terminology</p>
            </div>
            <Link href="/education" className={cn(buttonVariants({ variant: "secondary" }), "bg-background text-primary hover:bg-background/90 font-bold px-6")}>
              Explore
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Settings List */}
      <section>
        <h3 className="text-lg font-bold mb-3">Settings</h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Notifications</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Dark Mode</span>
              </div>
              <Switch 
                checked={mounted ? theme === "dark" : false} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Metric Units (kg)</span>
              </div>
              <Switch checked={metricUnits} onCheckedChange={setMetricUnits} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Logout */}
      <div className="pt-4 pb-12">
        <Button 
          variant="outline" 
          className="w-full h-14 text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
