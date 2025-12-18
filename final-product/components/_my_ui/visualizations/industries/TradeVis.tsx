"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, CheckCircle, XCircle, FileText, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

export function TradeVis() {
    const [leads, setLeads] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLeads(prev => [...prev, Date.now()].slice(-5));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden border border-white/5">

            <div className="relative w-full max-w-md h-80 flex flex-col items-center">

                {/* Top: Incoming Leads */}
                <div className="w-full h-20 relative overflow-hidden border-b border-white/5 bg-white/5">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-white/20">
                        Incoming Leads Stream
                    </div>
                    <AnimatePresence>
                        {leads.map((lead, i) => (
                            <motion.div
                                key={lead}
                                initial={{ y: -50, x: Math.random() * 200 - 100, opacity: 0 }}
                                animate={{ y: 40, opacity: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute left-1/2 top-0"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${i % 2 === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'
                                    }`}>
                                    <User className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Center: Scoring Engine (Funnel) */}
                <div className="flex-1 w-full flex items-center justify-center relative">
                    {/* Funnel Shape */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg viewBox="0 0 100 100" className="w-48 h-48 text-accent">
                            <path d="M0 0 L40 100 L60 100 L100 0 Z" fill="currentColor" />
                        </svg>
                    </div>

                    {/* Processing Steps */}
                    <div className="flex flex-col gap-4 z-10">
                        {[
                            { label: "Qualify", icon: CheckCircle, color: "text-blue-400" },
                            { label: "Pricing", icon: DollarSign, color: "text-purple-400" },
                            { label: "Contract", icon: FileText, color: "text-green-400" }
                        ].map((step, i) => (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1, 0.9] }}
                                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                className="w-48 h-10 bg-black/60 border border-white/10 rounded-lg flex items-center justify-between px-4 backdrop-blur-md"
                            >
                                <span className="text-xs font-mono text-white/70">{step.label}</span>
                                <step.icon className={`w-4 h-4 ${step.color}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom: Output */}
                <div className="w-full h-16 flex items-center justify-center gap-8 border-t border-white/5 bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-xs text-white/40">Discarded</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-accent font-bold">Deal Ready</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
