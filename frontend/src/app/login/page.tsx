import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Log in to track your footprint.</p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <Link 
          href="/onboarding" 
          className={buttonVariants({ variant: "default" }) + " w-full h-14 text-lg rounded-xl flex items-center justify-center"}
        >
          Go to Onboarding (Demo)
        </Link>
      </div>
    </div>
  );
}
