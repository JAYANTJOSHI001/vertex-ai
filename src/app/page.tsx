"use client"

import { useRouter } from 'next/navigation';
import StarBorder from '@/blocks/Animations/StarBorder/StarBorder';

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-black">
          <h1 className="text-3xl font-bold text-white">Vertex AI</h1>
          <p className="mt-2 text-gray-400">AI Model Marketplace</p>
        <StarBorder
          as="button"
          className="custom-class"
          color="cyan"
          speed="5s"
        >
          <button
            onClick={() => router.push('/login')}
            type="button"
            className="w-full"
          >
            Login
          </button>
          </StarBorder>
        </div>
  );
}
