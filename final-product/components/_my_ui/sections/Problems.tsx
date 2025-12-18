"use client";

import { motion } from "framer-motion";
import { AlertTriangle, FileText, Lock, Database, Mic, CheckSquare, Users, FileJson } from "lucide-react";

const problems = [
    {
        title: "80% of info lost",
        description: "Within 48 hours, most details from a meeting are forgotten forever.",
        animation: "audio-fade"
    },
    {
        title: "Tasks vanish",
        description: "Action items get buried in Slack threads or mental notes.",
        animation: "tasks-vanish"
    },
    {
        title: "Invisible Risks",
        description: "Critical blockers mentioned in passing are ignored until it's too late.",
        animation: "radar-pulse"
    },
    {
        title: "No Single Source",
        description: "Notes are scattered across Notion, Google Docs, and notebooks.",
        animation: "scattered-nodes"
    },
    {
        title: "Broken Telephone",
        description: "Team members leave with different understandings of the same decision.",
        animation: "broken-signal"
    },
    {
        title: "Compliance Gaps",
        description: "No audit trail of what was actually agreed upon with clients.",
        animation: "shield-pulse"
    }
];

export function Problems() {
    return (
        <section className="py-24 bg-bg-void relative overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                        Why companies lose money <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">on meetings?</span>
                    </h2>
                    <p className="text-lg text-text-secondary">
                        Chaos, lost tasks, and forgotten agreements are the silent killers of productivity.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-glass-white-5 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors h-[200px] flex items-center"
                        >
                            {/* Flex Container for Strict Alignment */}
                            <div className="flex items-center justify-between w-full h-full gap-4">

                                {/* Text Content (Left - 55%) */}
                                <div className="w-[55%] flex flex-col justify-center">
                                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Animation Content (Right - 45%) */}
                                <div className="w-[45%] h-full flex items-center justify-end">
                                    <div className="relative w-full h-full flex items-center justify-end">

                                        {/* 1. Audio Fade (Red Bars) */}
                                        {item.animation === "audio-fade" && (
                                            <div className="flex items-center gap-1.5 h-12">
                                                {[0.4, 0.8, 1, 0.6, 0.3].map((scale, j) => (
                                                    <motion.div
                                                        key={j}
                                                        animate={{
                                                            opacity: [0.3, 1, 0.3],
                                                            height: ["30%", "100%", "30%"]
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            delay: j * 0.1,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="w-1.5 bg-error rounded-full"
                                                        style={{ height: `${scale * 100}% ` }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* 2. Tasks Vanish (Brown/Orange Lines) - Even Smaller & Strictly Right */}
                                        {item.animation === "tasks-vanish" && (
                                            <div className="flex flex-col gap-2 w-14 opacity-80">
                                                {[...Array(3)].map((_, j) => (
                                                    <motion.div
                                                        key={j}
                                                        animate={{ opacity: [1, 0.2] }}
                                                        transition={{
                                                            duration: 2.5,
                                                            repeat: Infinity,
                                                            delay: j * 0.8,
                                                            repeatDelay: 0.5
                                                        }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-[1px] border border-warning/40 shrink-0" />
                                                        <div className="h-0.5 bg-warning/20 rounded-full w-full" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 3. Invisible Risks (Radar) */}
                                        {item.animation === "radar-pulse" && (
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <div className="absolute w-1.5 h-1.5 bg-error rounded-full z-10 shadow-[0_0_10px_red]" />
                                                {[...Array(2)].map((_, j) => (
                                                    <motion.div
                                                        key={j}
                                                        animate={{
                                                            scale: [1, 2.2],
                                                            opacity: [0.4, 0],
                                                            borderWidth: ["1px", "0px"]
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            delay: j * 1.5,
                                                            ease: "easeOut"
                                                        }}
                                                        className="absolute inset-0 border border-error/30 rounded-full"
                                                    />
                                                ))}
                                                <div className="absolute top-6 right-6 opacity-80">
                                                    <AlertTriangle className="w-3 h-3 text-error animate-pulse" />
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. No Single Source (Nodes) */}
                                        {item.animation === "scattered-nodes" && (
                                            <div className="relative w-24 h-24">
                                                {/* Central Node */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent-primary/10 border border-accent-primary/30 rounded-lg flex items-center justify-center z-10">
                                                    <Database className="w-4 h-4 text-accent-primary" />
                                                </div>
                                                {/* Satellites */}
                                                <motion.div
                                                    animate={{ x: [15, 25, 15], y: [-15, -25, -15] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute top-1/4 right-1/4 w-6 h-6 bg-info/10 border border-info/30 rounded flex items-center justify-center"
                                                >
                                                    <FileJson className="w-3 h-3 text-info" />
                                                </motion.div>
                                                <motion.div
                                                    animate={{ x: [-15, -25, -15], y: [15, 25, 15] }}
                                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-success/10 border border-success/30 rounded-full flex items-center justify-center"
                                                >
                                                    <Users className="w-3 h-3 text-success" />
                                                </motion.div>
                                                {/* Lines */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                                                    <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                                                    <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* 5. Broken Telephone (Waveform) */}
                                        {item.animation === "broken-signal" && (
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(10)].map((_, j) => (
                                                    <motion.div
                                                        key={j}
                                                        animate={{
                                                            height: ["8px", "32px", "8px"],
                                                            opacity: [0.3, 1, 0.3]
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            repeat: Infinity,
                                                            delay: j * 0.05,
                                                            repeatType: "mirror"
                                                        }}
                                                        className={`w - 1 rounded - full ${j > 5 ? 'bg-error/80' : 'bg-white/80'} `}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* 6. Compliance Gaps (Shield) */}
                                        {item.animation === "shield-pulse" && (
                                            <div className="relative flex items-center justify-center">
                                                <div className="relative">
                                                    <Lock className="w-10 h-10 text-success" />
                                                    <motion.div
                                                        animate={{ opacity: [0, 0.4, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute inset-0 bg-success/20 blur-lg rounded-full"
                                                    />
                                                </div>
                                                {/* Scan line */}
                                                <motion.div
                                                    animate={{ top: ["0%", "100%"] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute left-0 right-0 h-[1px] bg-success/80 shadow-[0_0_8px_#10B981]"
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
