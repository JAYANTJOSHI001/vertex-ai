"use client";

import { useState } from "react";
import Orb from '@/blocks/Backgrounds/Orb/Orb';
import Link from "next/link";
// import { ArrowLeft, ArrowRight} from 'lucide-react'; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Testimonials remain unchanged
  // const testimonials = [
  //   {
  //     quote: "Vertex AI changed the way we access AI. Instead of subscribing to bloated APIs, we now pay only for what we use. It's fast, affordable, and perfect for startups like ours.",
  //     author: "Ritika Sharma",
  //     position: "Product Manager at NeuralNest"
  //   },
  //   {
  //     quote: "Vertex AI is your plug-and-play AI model hub. Devs upload models, users plug into them via API. No red tape. Just clean, smart access.",
  //     author: "",
  //     position: ""
  //   }
  // ];

  // const handlePrevTestimonial = () => {
  //   setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  // };

  // const handleNextTestimonial = () => {
  //   setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push("/dashboard");
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
        
        {/* Login form - centered on mobile and tablet */}
        <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10 relative">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="mb-6 text-xl font-medium text-white">Please Enter your Account Details</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-sm">
                {error}
              </div>
            )}
            
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
              
              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-zinc-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-[#34A853] hover:text-green-700">
                  Forgot Password
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#34A853] p-3 text-center font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            
            <div className="mt-6">
              <button
                type="button"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md border border-[#34A853] bg-transperent p-3 text-white hover:bg-white hover:text-black disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Sign in with Google
              </button>
            </div>
            
            <div className="mt-8 text-right">
              <Link href="/register" className="text-sm text-[#34A853] hover:text-white">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right side testimonials section remains commented out */}
      </div>
    </div>
  );
}