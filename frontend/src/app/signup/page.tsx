"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password.length <= 8) {
      setError("Password must be more than 8 characters long.");
      setIsLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      setIsLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      setIsLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one digit.");
      setIsLoading(false);
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character.");
      setIsLoading(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      // If email confirmations are disabled, we get a session immediately
      if (data.session) {
        router.push("/onboarding");
        router.refresh();
      } else {
        setSuccess(true);
      }
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Success!</h1>
        <p className="text-muted-foreground">
          Your account has been created. If email confirmations are enabled, please check your inbox.
        </p>
        <Link href="/login" className="text-primary hover:underline font-medium mt-4">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">Join us to track your footprint.</p>
      </div>
      
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">Name</label>
          <Input 
            id="name"
            type="text" 
            placeholder="Eco Warrior" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <Input 
            id="email"
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <Input 
            id="password"
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={9}
            className="h-12"
          />
          <p className="text-xs text-muted-foreground">Must be more than 8 chars, with uppercase, lowercase, number, and special char.</p>
        </div>

        {error && <p className="text-destructive text-sm font-medium text-center">{error}</p>}

        <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Log in
        </Link>
      </div>
    </div>
  );
}
