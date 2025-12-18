"use client";

import { motion } from "framer-motion";
import {
    Mic, Globe, Lock, Search, CheckCircle2,
    FileText, MoreHorizontal, Mail, MessageSquare,
    AlertTriangle, CheckSquare, Play, Pause
} from "lucide-react";
import { useState, useEffect } from "react";

// 1. Smart Transcription Visual (Dark Mode)
export function SmartTranscriptionVisual() {
    return (
        <div className="relative w-full h-[320px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden flex flex-col p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xs font-bold text-white/60 uppercase tracking-wider">Live Recording</div>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white/20" />)}
                </div>
            </div>

            {/* Waveform & Text */}
            <div className="space-y-4 relative z-0">
                {/* Animated Waveform */}
                <div className="flex items-center gap-1 h-8 mb-4 opacity-50">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 24, 8, 16, 10] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                            className="w-1 bg-accent rounded-full"
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="h-2 w-3/4 bg-white/10 rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                    className="h-2 w-full bg-white/10 rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="h-2 w-5/6 bg-white/10 rounded-full"
                />
            </div>

            {/* Floating Action Menu (Dark Glass) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 2.5, type: "spring" }}
                className="absolute right-6 bottom-6 bg-[#1A1A1A]/90 backdrop-blur-xl rounded-xl border border-white/10 p-2 w-48 z-10 shadow-2xl"
            >
                <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                    <FileText className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    <span className="text-xs font-medium text-white/80 group-hover:text-white">Generate Summary</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg cursor-pointer border border-white/5">
                    <Globe className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium text-white">Translate to Spanish</span>
                </div>
            </motion.div>
        </div>
    );
}

// 2. Corporate Memory Visual (Search - Dark Mode)
export function CorporateMemoryVisual() {
    return (
        <div className="relative w-full h-[320px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
            {/* Search Bar */}
            <motion.div
                initial={{ width: "40%", opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="bg-[#151515] rounded-xl border border-white/10 h-14 flex items-center px-4 gap-3 mb-6 w-full max-w-md shadow-inner"
            >
                <Search className="w-5 h-5 text-white/30" />
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-white/80 font-medium"
                >
                    What was the budget for Q4?
                </motion.span>
            </motion.div>

            {/* AI Answer Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="bg-[#1A1A1A] rounded-xl border border-white/10 p-5 w-full max-w-md relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Answer from "Strategy Session"</div>
                        <p className="text-sm text-white/90 leading-relaxed">
                            The approved budget is <span className="bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono text-xs">$50,000</span> for the pilot phase.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// 3. Privacy Visual (Dark Mode)
export function PrivacyVisual() {
    const [isLocked, setIsLocked] = useState(true);

    return (
        <div
            className="relative w-full h-[320px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden p-8 group shadow-2xl"
            onMouseEnter={() => setIsLocked(false)}
            onMouseLeave={() => setIsLocked(true)}
        >
            {/* Content that gets blurred */}
            <motion.div
                animate={{ filter: isLocked ? "blur(12px)" : "blur(0px)", opacity: isLocked ? 0.5 : 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-white/10 rounded" />
                        <div className="h-3 w-20 bg-white/5 rounded" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-3/4 bg-white/5 rounded" />
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-4">
                    <div className="h-3 w-1/2 bg-white/10 rounded mb-3" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                </div>
            </motion.div>

            {/* Lock Overlay */}
            <motion.div
                animate={{ opacity: isLocked ? 1 : 0, scale: isLocked ? 1 : 1.1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center z-10"
            >
                <div className="bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">End-to-End Encrypted</span>
                </div>
            </motion.div>
        </div>
    );
}

// 4. Decisions & Risks Visual (New - Dark Mode Lists)
export function DecisionsRisksVisual() {
    return (
        <div className="relative w-full h-[400px] bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-4">
                    <div className="text-sm font-bold text-white border-b-2 border-accent pb-1">Decisions</div>
                    <div className="text-sm font-bold text-white/40">Risks</div>
                </div>
            </div>

            <div className="space-y-4 relative">
                {/* Decision Card 1 */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-[#151515] border-l-4 border-l-cyan-500 border-y border-r border-y-white/5 border-r-white/5 group hover:bg-white/5 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium text-sm">Pivot to Enterprise-first strategy</h4>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">Final</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>Q4 Strategy Session</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Nov 28</span>
                    </div>
                </motion.div>

                {/* Decision Card 2 */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-[#151515] border-l-4 border-l-cyan-500 border-y border-r border-y-white/5 border-r-white/5 group hover:bg-white/5 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium text-sm">Pilot will run on-premise</h4>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">Final</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>Acme Corp Discovery</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Dec 1</span>
                    </div>
                </motion.div>

                {/* Risk Card (Alert) */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="p-4 rounded-xl bg-[#151515] border-l-4 border-l-blue-500 border-y border-r border-y-white/5 border-r-white/5 mt-8"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium text-sm">Legacy Oracle DB access</h4>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">High Risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                        <AlertTriangle className="w-3 h-3 text-blue-500" />
                        <span>Blocker identified</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
