"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function BentoCard({ children, className = "", delay = 0 }: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`
        bg-bg-surface/40 backdrop-blur-xl border border-glass-border 
        rounded-[28px] p-6 relative overflow-hidden group
        hover:border-glass-border-hover hover:shadow-2xl hover:-translate-y-1
        transition-all duration-500
        ${className}
      `}
        >
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
