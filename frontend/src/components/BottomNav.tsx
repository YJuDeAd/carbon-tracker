"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, BarChart2, User, Target } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on onboarding, login, and signup screens
  if (pathname.startsWith("/onboarding") || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/log" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === "/log" ? "text-primary" : "text-muted-foreground"}`}>
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Log</span>
        </Link>
        <Link href="/insights" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === "/insights" ? "text-primary" : "text-muted-foreground"}`}>
          <BarChart2 className="w-6 h-6" />
          <span className="text-[10px] font-medium">Insights</span>
        </Link>
        <Link href="/goals" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === "/goals" ? "text-primary" : "text-muted-foreground"}`}>
          <Target className="w-6 h-6" />
          <span className="text-[10px] font-medium">Goals</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname === "/profile" ? "text-primary" : "text-muted-foreground"}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
