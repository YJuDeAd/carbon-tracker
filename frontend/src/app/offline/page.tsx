"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
        <Leaf className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">You're Offline</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          It looks like you've lost your internet connection. We can't reach the servers right now.
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 py-6 text-lg")}>
        Try Again
      </Link>
    </div>
  );
}
