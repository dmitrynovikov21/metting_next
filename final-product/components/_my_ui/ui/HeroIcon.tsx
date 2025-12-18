"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface HeroIconProps {
    icon: LucideIcon;
    color?: "error" | "warning" | "success" | "primary" | "white";
    className?: string;
}

export default function HeroIcon({ icon: Icon, color = "primary", className = "" }: HeroIconProps) {

    const colorMap = {
        error: {
            bg: "bg-error/10",
            border: "border-error/20",
            text: "text-error",
            glow: "shadow-[0_0_30px_-5px_rgba(239,68,68,0.4)]",
            gradient: "from-error/20 to-transparent"
        },
        warning: {
            bg: "bg-warning/10",
            border: "border-warning/20",
            text: "text-warning",
            glow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)]",
            gradient: "from-warning/20 to-transparent"
        },
        success: {
            bg: "bg-success/10",
            border: "border-success/20",
            text: "text-success",
            glow: "shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]",
            gradient: "from-success/20 to-transparent"
        },
        primary: {
            bg: "bg-accent-primary/10",
            border: "border-accent-primary/20",
            text: "text-accent-primary",
            glow: "shadow-[0_0_30px_-5px_rgba(255,107,0,0.4)]",
            gradient: "from-accent-primary/20 to-transparent"
        },
        white: {
            bg: "bg-white/5",
            border: "border-white/10",
            text: "text-white",
            glow: "shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]",
            gradient: "from-white/10 to-transparent"
        }
    };

    const styles = colorMap[color];

    return (
        <div className={`relative ${className}`}>
            {/* Animated Background Blob */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full blur-2xl ${styles.bg}`}
            />

            {/* Main Container */}
            <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className={`
          relative w-20 h-20 rounded-3xl flex items-center justify-center
          border ${styles.border} ${styles.bg} ${styles.glow}
          backdrop-blur-sm
        `}
            >
                {/* Inner Gradient Overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${styles.gradient} opacity-50`} />

                {/* Icon with Floating Animation */}
                <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon className={`w-10 h-10 relative z-10 ${styles.text}`} strokeWidth={1.5} />
                </motion.div>
            </motion.div>
        </div>
    );
}
