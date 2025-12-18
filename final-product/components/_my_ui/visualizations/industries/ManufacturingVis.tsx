"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, FileText, Database, LayoutTemplate, Calculator, ShoppingCart } from "lucide-react";

export function ManufacturingVis() {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-white/5">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="relative w-full max-w-md h-64 flex items-center justify-between px-8">

                {/* Left: Chaos (Excel/PDFs) */}
                <div className="relative w-24 h-full flex flex-col justify-center items-center">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={`file-${i}`}
                            initial={{ opacity: 0, x: -50, y: -20 }}
                            animate={{
                                opacity: [0, 1, 0],
                                x: [0, 20, 40],
                                y: [0, (i - 1) * 30, 0],
                                scale: [0.8, 1, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 1,
                                ease: "easeInOut"
                            }}
                            className="absolute"
                        >
                            {i % 2 === 0 ? (
                                <FileSpreadsheet className="w-8 h-8 text-green-400/60" />
                            ) : (
                                <FileText className="w-8 h-8 text-red-400/60" />
                            )}
                        </motion.div>
                    ))}
                    <div className="absolute bottom-4 text-[10px] text-white/40 uppercase tracking-widest">Legacy Data</div>
                </div>

                {/* Center: Processing Node */}
                <div className="relative z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border border-accent/30 border-t-accent border-r-accent/50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <Database className="w-6 h-6 text-accent" />
                    </motion.div>

                    {/* Connecting Lines */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 pointer-events-none overflow-visible">
                        <motion.path
                            d="M-40 1 L40 1"
                            stroke="url(#grad1)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, -8] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#00f0ff" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Right: Structured UI */}
                <div className="relative w-32 h-full flex flex-col justify-center gap-3">
                    {[
                        { icon: LayoutTemplate, label: "Catalog", color: "bg-blue-500/20 border-blue-500/40" },
                        { icon: Calculator, label: "Configurator", color: "bg-purple-500/20 border-purple-500/40" },
                        { icon: ShoppingCart, label: "Order System", color: "bg-green-500/20 border-green-500/40" }
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.2 }}
                            className={`flex items-center gap-3 p-2 rounded-lg border ${item.color} backdrop-blur-sm`}
                        >
                            <item.icon className="w-4 h-4 text-white/80" />
                            <span className="text-xs font-mono text-white/90">{item.label}</span>
                        </motion.div>
                    ))}
                    <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-white/40 uppercase tracking-widest">Digital Platform</div>
                </div>

            </div>

            {/* Floating Particles */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="absolute w-1 h-1 bg-accent/30 rounded-full"
                    initial={{
                        x: Math.random() * 400,
                        y: Math.random() * 300,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, Math.random() * -50],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    );
}
