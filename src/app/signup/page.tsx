"use client";

import { useState } from "react";
import Orb from '@/blocks/Backgrounds/Orb/Orb';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
          user_type: "consumer" // Default to consumer, can be changed later
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      // Redirect to login page on success
      router.push("/login?registered=true");
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
        
        <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 md:p-8 z-10 relative">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="mb-6 text-xl font-medium text-white">Create Your Account</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm text-zinc-200">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-zinc-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="mb-2 block text-sm text-zinc-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm text-zinc-200">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-md border border-[#8AEA92] p-3 focus:border-green-500 focus:outline-none focus:ring-green-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#34A853] p-3 text-center font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
            
            <div className="mt-6">
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-[#34A853] bg-transparent p-3 text-white hover:bg-white hover:text-black"
              >
                Sign up with Google
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-[#34A853] hover:text-white">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}