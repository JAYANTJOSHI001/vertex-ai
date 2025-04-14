"use client"

import Aurora from "@/blocks/Backgrounds/Aurora/Aurora"
import GooeyNav from "@/blocks/Components/GooeyNav/GooeyNav"
import Stack from "@/blocks/Components/Stack/Stack";

export default function AboutUs(){

    const items = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about-us" },
        { label: "Contact", href: "/contact" },
    ];

    const images = [
        { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format" },
        { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format" },
        { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format" },
        { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format" }
      ];

    return(
        <div className="flex flex-col">
            <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
                {/* Background effect */}
                <div className="absolute inset-0 z-0 h-[200px]">
                    <Aurora
                        colorStops={["#00D8FF", "#7CFF67", "#00D8FF"]}
                        blend={0.5}
                        amplitude={1.0}
                        speed={0.5}
                    />
                </div>
                
                {/* Content container */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center flex-grow">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Unleashing AI, Empowering Innovation
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80">
                            Empowering creators, unlocking innovation, and shaping the future of AI—because the next breakthrough shouldn't be locked behind closed doors.
                        </p>
                    </div>
                </div>
                
                {/* Navigation at bottom */}
                <div className="relative z-10 w-full mt-auto mb-8">  
                    <div className="w-full max-w-sm mx-auto h-[50px] relative">
                        <GooeyNav
                            items={items}
                            animationTime={600}
                            particleCount={15}
                            particleDistances={[20, 42]}
                            particleR={8}
                            timeVariance={300}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                            initialActiveIndex={1}
                        />
                    </div>
                </div>
            </div>
            {/* What is vertex */}
            <div className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-black to-zinc-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/2 space-y-6">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                            What is Vertex-AI?
                        </h2>
                        <p className="text-lg text-zinc-300 leading-relaxed">
                            VertexAI is a cutting-edge Web2 platform revolutionizing how artificial intelligence models are accessed, distributed, and monetized. We are building an open, collaborative AI model marketplace that empowers developers and creators to deploy, showcase, and earn from their AI innovations—while enabling users to explore, experiment with, and integrate these models seamlessly into their workflows.
                        </p>
                        <p className="text-lg text-zinc-300 leading-relaxed">
                            Our mission is simple yet powerful: to close the gap between AI creators and AI consumers by providing an intuitive, scalable, and developer-first ecosystem. Whether you're an independent researcher, a tech startup, or a large enterprise, VertexAI gives you the tools to discover, rent, and test AI models—all from one unified platform.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]">
                            <Stack
                                randomRotation={true}
                                sensitivity={180}
                                sendToBackOnClick={false}
                                cardDimensions={{ width: 400, height: 400 }}
                                cardsData={images}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </div>
    )
}