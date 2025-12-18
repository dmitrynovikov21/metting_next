"use client";

import { motion } from "framer-motion";
import { Mic, FileText, CheckSquare, AlertTriangle, Zap, ArrowRight } from "lucide-react";

export function ProtocolGenerationVisual() {
    return (
        <div className="relative w-full max-w-lg mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center">

            {/* Main Glass Container */}
            <div className="absolute inset-0 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                {/* Header / Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-mono text-red-400">RECORDING ACTIVE</span>
                    </div>
                    <div className="text-xs font-mono text-blue-400">AI PROCESSING: ON</div>
                </div>

                {/* Content Area */}
                <div className="absolute inset-0 top-12 p-8 flex flex-col justify-between">

                    {/* 1. Audio Waveform (Input) */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                            <Mic className="w-5 h-5" />
                        </div>
                        <div className="flex-1 h-12 flex items-center gap-1 overflow-hidden mask-image-linear-to-r">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: ["20%", "80%", "20%"] }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.05,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1 bg-blue-500/50 rounded-full"
                                    style={{ height: "40%" }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 2. Processing Stream (Center) */}
                    <div className="relative flex-1 flex items-center justify-center my-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-px h-full bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
                        </div>

                        {/* Extracted Items Appearing */}
                        <div className="space-y-4 w-full relative z-10">

                            {/* Card 1: Decision */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="bg-surface-highlight border border-white/10 p-4 rounded-xl flex items-start gap-3 shadow-lg"
                            >
                                <div className="mt-1 w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                                    <Zap className="w-3 h-3" />
                                </div>
                                <div>
                                    <div className="text-xs text-green-400 font-bold mb-1 uppercase tracking-wider">Decision Detected</div>
                                    <div className="text-sm text-white">Switch to Enterprise Plan for Q4.</div>
                                </div>
                            </motion.div>

                            {/* Card 2: Task */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2.5, duration: 0.5 }}
                                className="bg-surface-highlight border border-white/10 p-4 rounded-xl flex items-start gap-3 shadow-lg"
                            >
                                <div className="mt-1 w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                    <CheckSquare className="w-3 h-3" />
                                </div>
                                <div>
                                    <div className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-wider">Task Assigned</div>
                                    <div className="text-sm text-white">Alex to update security protocols by Friday.</div>
                                </div>
                            </motion.div>

                            {/* Card 3: Risk */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 4, duration: 0.5 }}
                                className="bg-surface-highlight border border-white/10 p-4 rounded-xl flex items-start gap-3 shadow-lg"
                            >
                                <div className="mt-1 w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                    <AlertTriangle className="w-3 h-3" />
                                </div>
                                <div>
                                    <div className="text-xs text-orange-400 font-bold mb-1 uppercase tracking-wider">Risk Identified</div>
                                    <div className="text-sm text-white">Potential delay in API migration.</div>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>

                {/* Background Grid inside card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10" />
            </div>

            {/* Decorative Glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full -z-10" />

        </div>
    );
}
