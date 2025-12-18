"use client";

import { motion } from "framer-motion";
import { MapPin, FileCheck, Globe, Truck } from "lucide-react";

export function LogisticsVis() {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {/* Abstract Map Background */}
            <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div className="relative w-full max-w-md h-64">
                {/* Route Path SVG */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <motion.path
                        d="M50 150 Q 150 50, 250 100 T 400 80"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                    <motion.path
                        d="M50 150 Q 150 50, 250 100 T 400 80"
                        fill="none"
                        stroke="#00f0ff"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </svg>

                {/* Nodes */}
                {[
                    { x: 50, y: 150, label: "Origin", icon: Globe },
                    { x: 250, y: 100, label: "Customs", icon: FileCheck },
                    { x: 400, y: 80, label: "Delivery", icon: MapPin }
                ].map((node, i) => (
                    <motion.div
                        key={node.label}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                        style={{ left: node.x, top: node.y }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 1 }}
                    >
                        <div className="w-10 h-10 rounded-full bg-black/80 border border-accent/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                            <node.icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="px-2 py-1 rounded bg-black/50 border border-white/10 text-[10px] font-mono text-white/80 backdrop-blur-md">
                            {node.label}
                        </div>
                    </motion.div>
                ))}

                {/* Moving Truck/Package */}
                <motion.div
                    className="absolute top-0 left-0"
                    animate={{
                        offsetDistance: "100%"
                    }}
                    style={{
                        offsetPath: "path('M50 150 Q 150 50, 250 100 T 400 80')",
                        offsetRotate: "auto"
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="w-8 h-8 -ml-4 -mt-4 bg-accent text-black rounded-full flex items-center justify-center shadow-lg z-20 relative">
                        <Truck className="w-4 h-4" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 bg-accent/20 rounded-full animate-ping" />
                </motion.div>

                {/* Status Indicators */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 }}
                        className="flex items-center gap-2 text-xs font-mono text-green-400"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Docs Verified
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.5 }}
                        className="flex items-center gap-2 text-xs font-mono text-accent"
                    >
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        On Schedule
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
