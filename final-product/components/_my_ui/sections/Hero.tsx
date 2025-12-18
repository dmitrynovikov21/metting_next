"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { ProtocolGenerationVisual } from "@/components/_my_ui/visualizations/ProtocolGenerationVisual";

interface HeroProps {
    onOpenProject?: () => void;
    onOpenAudit?: () => void;
    hoverState?: string | null;
}

import Link from "next/link";

export function Hero({ onOpenProject }: HeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="relative min-h-[700px] pt-32 pb-20 overflow-hidden bg-void font-display">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex justify-center lg:justify-start"
                    >
                        <div className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm text-xs font-bold tracking-widest text-blue-400 uppercase flex items-center gap-2">
                            <span>✨</span> AI PROTOCOL ASSISTANT
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 tracking-tight text-white">
                            Your meetings turn <br />
                            into decisions and <br />
                            tasks — <span className="text-blue-500">automatically.</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="mb-12"
                    >
                        <p className="text-xl text-gray-300 font-light max-w-xl mx-auto lg:mx-0 tracking-wide leading-relaxed">
                            AI records your meetings and delivers clean protocols with decisions, tasks
                            and risks — straight to your team.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
                    >
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        >
                            Start Free Trial <span className="text-xs font-normal opacity-80">— no credit card</span> <ArrowRight className="w-5 h-5" />
                        </Link>

                        <button
                            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-lg font-medium text-lg hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                            <Play className="w-5 h-5 fill-current" /> Watch 60s demo
                        </button>
                    </motion.div>
                </div>

                {/* Visual Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    <ProtocolGenerationVisual />

                    {/* Decorative Abstract Shapes */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
