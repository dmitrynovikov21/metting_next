"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileText, CheckSquare, Zap, AlertTriangle } from "lucide-react";

export function HeroScheme() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity, scale, y }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end justify-center pb-20"
        >
            <div className="relative w-full max-w-[1400px] h-[600px] perspective-1000">

                {/* HORIZON LINE */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent blur-[1px]" />

                {/* 1. INPUT STREAM (Left) - Audio Particles */}
                <div className="absolute top-1/2 left-0 w-1/3 h-20 -translate-y-1/2 overflow-hidden">
                    <div className="flex items-center gap-1 absolute right-0 top-1/2 -translate-y-1/2 translate-x-10">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={`stream-${i}`}
                                animate={{
                                    height: ["2px", "40px", "2px"],
                                    opacity: [0.3, 0.8, 0.3],
                                    scaleY: [1, 1.5, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.05,
                                    ease: "easeInOut"
                                }}
                                className="w-1 bg-gradient-to-t from-transparent via-accent-primary to-transparent rounded-full shadow-[0_0_10px_rgba(255,107,53,0.5)]"
                                style={{
                                    height: Math.random() * 40 + 10
                                }}
                            />
                        ))}
                    </div>
                    {/* Flow Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                        <motion.path
                            d="M 0 40 Q 200 40 400 40"
                            stroke="url(#stream-grad)"
                            strokeWidth="1"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="stream-grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="100%" stopColor="white" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* 2. THE PRISM (Center) - Processing Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10">
                    {/* Glass Cube/Prism Effect */}
                    <motion.div
                        animate={{ rotateY: 360, rotateX: 15 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full relative preserve-3d"
                    >
                        <div className="absolute inset-0 border border-accent-primary/50 bg-accent-primary/10 backdrop-blur-sm rounded-xl transform rotate-45 shadow-[0_0_30px_rgba(255,107,53,0.2)]" />
                        <div className="absolute inset-2 border border-white/40 rounded-lg transform -rotate-12" />
                    </motion.div>

                    {/* Energy Pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-20 h-20 bg-accent-primary/30 rounded-full blur-xl"
                        />
                    </div>
                </div>

                {/* 3. OUTPUT STREAM (Right) - Crystallized Cards */}
                <div className="absolute top-1/2 right-0 w-1/2 h-64 -translate-y-1/2 perspective-500">
                    {/* Floating Cards Stream */}
                    <div className="relative w-full h-full transform-style-3d rotate-y-12 rotate-x-6">

                        {/* Card 1: Protocol */}
                        <motion.div
                            animate={{
                                x: [-50, 200],
                                y: [0, -20],
                                opacity: [0, 1, 0],
                                scale: [0.8, 1.2]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 0 }}
                            className="absolute top-1/2 left-0 w-40 h-24 bg-glass-white-5 border border-accent-primary/30 rounded-lg p-3 backdrop-blur-md transform -translate-y-1/2 shadow-[0_0_15px_rgba(255,107,53,0.1)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-accent-primary" />
                                <div className="h-1.5 w-12 bg-white/30 rounded" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1 w-full bg-white/20 rounded" />
                                <div className="h-1 w-full bg-white/20 rounded" />
                                <div className="h-1 w-2/3 bg-white/20 rounded" />
                            </div>
                        </motion.div>

                        {/* Card 2: Tasks */}
                        <motion.div
                            animate={{
                                x: [-50, 250],
                                y: [20, 40],
                                opacity: [0, 1, 0],
                                scale: [0.8, 1.1]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
                            className="absolute top-1/2 left-10 w-36 h-20 bg-glass-white-5 border border-warning/40 rounded-lg p-3 backdrop-blur-md transform -translate-y-1/2 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <CheckSquare className="w-3 h-3 text-warning" />
                                <div className="h-1.5 w-10 bg-white/30 rounded" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 border border-white/30 rounded-[2px]" />
                                    <div className="h-1 w-16 bg-white/20 rounded" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Decisions */}
                        <motion.div
                            animate={{
                                x: [-50, 300],
                                y: [-20, -60],
                                opacity: [0, 1, 0],
                                scale: [0.8, 1.3]
                            }}
                            transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 4 }}
                            className="absolute top-1/2 left-20 w-32 h-16 bg-glass-white-5 border border-success/40 rounded-lg p-3 backdrop-blur-md transform -translate-y-1/2 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-3 h-3 text-success" />
                                <div className="h-1.5 w-10 bg-white/30 rounded" />
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>

            {/* Cinematic Vignette & Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-transparent to-bg-void/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-void via-transparent to-bg-void pointer-events-none" />
        </motion.div>
    );
}

