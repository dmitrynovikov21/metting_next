"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface AppleIntelligenceLoaderProps {
    phase?: string;
    subtext?: string;
}

// Floating text fragments that appear inside the sphere
const thinkingTexts = [
    "analysis",
    "understanding",
    "decisions",
    "insights",
    "meaning",
    "patterns"
];

export default function AppleIntelligenceLoader({
    phase = "Thinking...",
    subtext = "Processing data"
}: AppleIntelligenceLoaderProps) {
    const [visibleTexts, setVisibleTexts] = useState<Array<{ id: number, text: string, x: number, y: number }>>([]);

    // Rotate through thinking texts
    useEffect(() => {
        const interval = setInterval(() => {
            const newText = {
                id: Date.now(),
                text: thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)],
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
            };
            setVisibleTexts(prev => [...prev.slice(-3), newText]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Subtle Dark Flowing Background - Blue tones */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background Blob 1 - Very subtle deep blue */}
                <motion.div
                    className="absolute w-[1000px] h-[1000px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(30, 58, 138, 0.12) 0%, transparent 50%)',
                        filter: 'blur(100px)',
                        left: '-30%',
                        top: '-30%'
                    }}
                    animate={{
                        x: [0, 150, 80, 0],
                        y: [0, 80, 150, 0],
                        scale: [1, 1.3, 0.95, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Background Blob 2 - Very subtle indigo */}
                <motion.div
                    className="absolute w-[800px] h-[800px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(67, 56, 202, 0.08) 0%, transparent 45%)',
                        filter: 'blur(90px)',
                        right: '-20%',
                        bottom: '-20%'
                    }}
                    animate={{
                        x: [0, -100, -50, 0],
                        y: [0, -80, 50, 0],
                        scale: [1, 0.9, 1.2, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Background Blob 3 - Very subtle cyan hint */}
                <motion.div
                    className="absolute w-[600px] h-[600px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 40%)',
                        filter: 'blur(80px)',
                        left: '50%',
                        top: '60%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    animate={{
                        x: [-80, 80, 0, -80],
                        y: [40, -40, 60, 40],
                        scale: [0.9, 1.15, 1, 0.9]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Main Sphere Container */}
            <div className="relative w-[320px] h-[320px] flex items-center justify-center">

                {/* Glass Sphere */}
                <motion.div
                    className="relative w-[280px] h-[280px] rounded-full"
                    style={{
                        // Glass effect
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.1) 100%)',
                        boxShadow: `
                            inset 0 0 80px rgba(0,0,0,0.3),
                            inset 0 -20px 60px rgba(0,0,0,0.4),
                            0 0 60px rgba(59, 130, 246, 0.15),
                            0 0 120px rgba(99, 102, 241, 0.1)
                        `,
                        border: '1px solid rgba(255,255,255,0.08)',
                        overflow: 'hidden'
                    }}
                    animate={{
                        scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Inner Flowing Gradient - Blue tones */}
                    <motion.div
                        className="absolute inset-[15%] rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 35%, #8b5cf6 60%, #06b6d4 100%)',
                            filter: 'blur(20px)',
                            opacity: 0.85
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />

                    {/* Morphing Blob 1 - Blue */}
                    <motion.div
                        className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%]"
                        style={{
                            background: 'radial-gradient(ellipse 40% 50% at 50% 50%, rgba(59, 130, 246, 0.9) 0%, transparent 60%)',
                            filter: 'blur(25px)'
                        }}
                        animate={{
                            x: [0, 60, -30, 0],
                            y: [0, -40, 50, 0],
                            scale: [1, 0.8, 1.2, 1],
                            rotate: [0, 45, -30, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Morphing Blob 2 - Indigo */}
                    <motion.div
                        className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%]"
                        style={{
                            background: 'radial-gradient(ellipse 50% 40% at 60% 60%, rgba(99, 102, 241, 0.85) 0%, transparent 55%)',
                            filter: 'blur(22px)'
                        }}
                        animate={{
                            x: [-30, 50, -20, -30],
                            y: [40, -30, 60, 40],
                            scale: [1.1, 0.85, 1, 1.1],
                            rotate: [0, -60, 30, 0]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Morphing Blob 3 - Cyan */}
                    <motion.div
                        className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%]"
                        style={{
                            background: 'radial-gradient(ellipse 45% 45% at 40% 70%, rgba(6, 182, 212, 0.8) 0%, transparent 50%)',
                            filter: 'blur(20px)'
                        }}
                        animate={{
                            x: [40, -40, 30, 40],
                            y: [-20, 40, -30, -20],
                            scale: [0.9, 1.2, 0.95, 0.9],
                            rotate: [30, -40, 60, 30]
                        }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Morphing Blob 4 - Purple */}
                    <motion.div
                        className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%]"
                        style={{
                            background: 'radial-gradient(ellipse 35% 40% at 55% 35%, rgba(139, 92, 246, 0.75) 0%, transparent 50%)',
                            filter: 'blur(22px)'
                        }}
                        animate={{
                            x: [-20, 45, -35, -20],
                            y: [25, -35, 45, 25],
                            scale: [1, 1.15, 0.9, 1],
                            rotate: [-20, 50, -40, -20]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Glass Edge Highlight - Top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[45%] rounded-t-full"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
                        }}
                    />

                    {/* Glass Specular Highlight */}
                    <motion.div
                        className="absolute top-[12%] left-[18%] w-[35%] h-[20%] rounded-full"
                        style={{
                            background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                            transform: 'rotate(-25deg)'
                        }}
                        animate={{
                            opacity: [0.25, 0.45, 0.25],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Secondary Highlight */}
                    <div
                        className="absolute bottom-[20%] right-[15%] w-[15%] h-[8%] rounded-full opacity-15"
                        style={{
                            background: 'radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)',
                            filter: 'blur(4px)',
                            transform: 'rotate(25deg)'
                        }}
                    />

                    {/* Floating Text Inside Sphere */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {visibleTexts.map((item) => (
                                <motion.span
                                    key={item.id}
                                    className="absolute text-white/40 font-extralight text-sm tracking-widest select-none pointer-events-none"
                                    style={{
                                        textShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
                                    }}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.5,
                                        x: 0,
                                        y: 0,
                                        filter: 'blur(8px)'
                                    }}
                                    animate={{
                                        opacity: [0, 0.7, 0],
                                        scale: [0.5, 1, 0.7],
                                        x: item.x,
                                        y: item.y,
                                        filter: ['blur(8px)', 'blur(0px)', 'blur(6px)']
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.3,
                                        filter: 'blur(10px)'
                                    }}
                                    transition={{
                                        duration: 4,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {item.text}
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Subtle Outer Glow */}
                <motion.div
                    className="absolute w-[340px] h-[340px] rounded-full -z-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 60%)',
                        filter: 'blur(30px)'
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.7, 0.4]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Text Content */}
            <motion.div
                className="mt-16 text-center z-10 px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={phase}
                        className="text-3xl md:text-4xl font-extralight tracking-wider text-white/80 mb-4"
                        style={{
                            textShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
                        }}
                        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                        transition={{ duration: 0.5 }}
                    >
                        {phase}
                    </motion.h2>
                </AnimatePresence>

                <motion.p
                    className="text-sm text-white/25 tracking-[0.25em] uppercase font-light"
                    animate={{ opacity: [0.25, 0.5, 0.25] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    {subtext}
                </motion.p>

                {/* Minimal Progress Dots */}
                <div className="flex justify-center gap-3 mt-10">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-500/50"
                            animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.25,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
