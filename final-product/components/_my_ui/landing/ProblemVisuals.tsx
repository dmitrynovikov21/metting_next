"use client";

import { motion } from "framer-motion";
import { AlertTriangle, FileText, CheckSquare, Clock, Users, Shield, X, Database, Lock } from "lucide-react";

// 1. Info Lost: Horizontal data stream fading
export function InfoLostVisual() {
    return (
        <div className="w-full h-full flex items-center justify-end pr-10 relative overflow-hidden">
            <div className="flex gap-2 items-center h-full">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [1, 0.1, 1],
                            height: ["60%", "20%", "60%"]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut"
                        }}
                        className="w-2 bg-blue-500/80 rounded-full"
                        style={{ height: `${40 + (i % 3) * 20}%` }}
                    />
                ))}
            </div>
            {/* Fading Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg-void via-transparent to-transparent" />
        </div>
    );
}

// 2. Tasks Vanish: Horizontal sliding items
export function TasksVanishVisual() {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-3 pl-10 pr-4 relative overflow-hidden">
            {[1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    animate={{ x: [0, 20, 0], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                    className="flex items-center gap-3"
                >
                    <div className={`w-4 h-4 rounded border border-cyan-500/50 flex items-center justify-center ${i === 2 ? 'opacity-50' : ''}`}>
                        {i === 1 && <div className="w-2 h-2 bg-cyan-500 rounded-sm" />}
                    </div>
                    <div className={`h-1.5 rounded bg-cyan-500/30 ${i === 2 ? 'w-1/2' : 'w-3/4'}`} />
                </motion.div>
            ))}
        </div>
    );
}

// 3. Invisible Risks: Radar sweep
export function InvisibleRisksVisual() {
    return (
        <div className="w-full h-full flex items-center justify-end pr-12 relative overflow-hidden">
            <div className="relative w-32 h-32">
                {/* Radar Circles */}
                <div className="absolute inset-0 border border-blue-500/20 rounded-full" />
                <div className="absolute inset-8 border border-blue-500/10 rounded-full" />

                {/* Sweep */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent rounded-full"
                    style={{ transformOrigin: "center" }}
                />

                {/* Blip */}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute top-6 right-8"
                >
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                </motion.div>
            </div>
        </div>
    );
}

// 4. No Single Source: Connecting nodes horizontally
export function NoSingleSourceVisual() {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="relative w-full max-w-[200px] h-20">
                <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-accent/10 border border-accent/30 rounded-lg"
                >
                    <Database className="w-5 h-5 text-accent" />
                </motion.div>

                <motion.div
                    animate={{ x: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute right-4 top-0 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                    <FileText className="w-5 h-5 text-blue-500" />
                </motion.div>

                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute right-12 bottom-0 p-2 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                    <Users className="w-5 h-5 text-green-500" />
                </motion.div>

                {/* Connecting lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    <path d="M40 40 L140 20" stroke="currentColor" strokeWidth="1" className="text-white" strokeDasharray="4 4" />
                    <path d="M40 40 L120 60" stroke="currentColor" strokeWidth="1" className="text-white" strokeDasharray="4 4" />
                </svg>
            </div>
        </div>
    );
}

// 5. Broken Telephone: Waveform distortion
export function BrokenTelephoneVisual() {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="flex items-center gap-1 h-12">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: i > 6 ? ["20%", "80%", "20%"] : ["40%", "60%", "40%"],
                            backgroundColor: i > 8 ? ["#ffffff", "#ef4444", "#ffffff"] : "#ffffff"
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                        className={`w-1.5 rounded-full ${i > 8 ? 'bg-error' : 'bg-white/50'}`}
                        style={{ height: "40%" }}
                    />
                ))}
            </div>
        </div>
    );
}

// 6. Compliance Gaps: Scanning lock
export function ComplianceGapsVisual() {
    return (
        <div className="w-full h-full flex items-center justify-end pr-16 relative overflow-hidden">
            <div className="relative">
                <Shield className="w-16 h-16 text-success/10" />
                <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Lock className="w-8 h-8 text-success" />
                </motion.div>

                {/* Horizontal Scan */}
                <motion.div
                    animate={{ left: ["-20%", "120%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-1 bg-success/50 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                />
            </div>
        </div>
    );
}

