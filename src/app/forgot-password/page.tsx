"use client";

import { useState } from "react";
import Orb from '@/blocks/Backgrounds/Orb/Orb';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Password reset request failed");
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-zinc-100">Vertex</h1>
      </div>
      <div className="flex flex-1 w-full relative">
        {/* Orb background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={60} 
            forceHoverState={true}
          />
        </div>
        
        {/* Forgot password form - centered on mobile and tablet */}
        <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10 relative">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="mb-6 text-xl font-medium text-white">Reset your password</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-sm">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-200 text-sm">
                  Password reset instructions have been sent to your email.
                </div>
                <Link href="/login" className="text-[#34A853] hover:text-white">
                  Return to login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-zinc-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                    required
                    disabled={loading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-[#34A853] p-3 text-center font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
                
                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-[#34A853] hover:text-white">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}