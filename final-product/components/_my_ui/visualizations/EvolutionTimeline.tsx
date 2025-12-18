"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface Stage {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    color: string;
}

interface EvolutionTimelineProps {
    stages: Stage[];
    activeStage: number;
    onChangeStage: (index: number) => void;
}

export function EvolutionTimeline({ stages, activeStage, onChangeStage }: EvolutionTimelineProps) {
    return (
        <div className="relative py-12">
            {/* Timeline Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-white/10 hidden md:block">
                <motion.div
                    className="h-full bg-accent origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (activeStage / (stages.length - 1)) }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {stages.map((stage, index) => {
                    const isActive = index === activeStage;
                    const isPast = index < activeStage;

                    return (
                        <div
                            key={stage.id}
                            className={cn(
                                "relative group cursor-pointer transition-all duration-300",
                                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                            )}
                            onClick={() => onChangeStage(index)}
                        >
                            {/* Node Point */}
                            <div className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-background border-2 border-white/20 absolute -top-[2.5rem] left-1/2 -translate-x-1/2 transition-colors duration-300 z-20"
                                style={{
                                    borderColor: isActive || isPast ? stage.color : 'rgba(255,255,255,0.2)',
                                    backgroundColor: isActive ? stage.color : 'var(--background)'
                                }}
                            >
                                {(isActive || isPast) && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>

                            {/* Content Card */}
                            <div className={cn(
                                "p-6 rounded-2xl border transition-all duration-500 h-full flex flex-col",
                                isActive
                                    ? "bg-surface border-accent/50 shadow-lg shadow-accent/5 scale-105"
                                    : "bg-surface/30 border-white/5 hover:border-white/10"
                            )}>
                                <div className="mb-4">
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-widest mb-2 block",
                                        isActive ? "text-accent" : "text-foreground/40"
                                    )}>
                                        Stage 0{index + 1}
                                    </span>
                                    <h3 className="text-xl font-bold mb-1">{stage.title}</h3>
                                    <p className="text-sm text-foreground/60">{stage.subtitle}</p>
                                </div>

                                <p className="text-sm text-foreground-secondary mb-6 leading-relaxed">
                                    {stage.description}
                                </p>

                                <ul className="space-y-2 mt-auto">
                                    {stage.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                                            <CheckCircle2 className={cn("w-3 h-3", isActive ? "text-accent" : "text-foreground/20")} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-accent rounded-t-full blur-sm"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
