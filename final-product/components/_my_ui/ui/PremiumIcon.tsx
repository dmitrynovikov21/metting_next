"use client";

import { LucideIcon } from "lucide-react";

interface PremiumIconProps {
    icon: LucideIcon;
    color?: "error" | "warning" | "success" | "primary" | "white";
    className?: string;
}

export default function PremiumIcon({ icon: Icon, color = "primary", className = "" }: PremiumIconProps) {

    const colorMap = {
        error: {
            bg: "bg-error/10",
            border: "border-error/20",
            text: "text-error",
            glow: "shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]",
            gradient: "from-error/20 to-transparent"
        },
        warning: {
            bg: "bg-warning/10",
            border: "border-warning/20",
            text: "text-warning",
            glow: "shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]",
            gradient: "from-warning/20 to-transparent"
        },
        success: {
            bg: "bg-success/10",
            border: "border-success/20",
            text: "text-success",
            glow: "shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]",
            gradient: "from-success/20 to-transparent"
        },
        primary: {
            bg: "bg-accent-primary/10",
            border: "border-accent-primary/20",
            text: "text-accent-primary",
            glow: "shadow-[0_0_20px_-5px_rgba(255,107,0,0.3)]",
            gradient: "from-accent-primary/20 to-transparent"
        },
        white: {
            bg: "bg-white/5",
            border: "border-white/10",
            text: "text-white",
            glow: "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            gradient: "from-white/10 to-transparent"
        }
    };

    const styles = colorMap[color];

    return (
        <div className={`relative group ${className}`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${styles.bg}`} />

            {/* Main Container */}
            <div className={`
        relative w-14 h-14 rounded-2xl flex items-center justify-center
        border ${styles.border} ${styles.bg} ${styles.glow}
        transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1
      `}>
                {/* Inner Gradient Overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.gradient} opacity-50`} />

                {/* Icon */}
                <Icon className={`w-7 h-7 relative z-10 ${styles.text}`} strokeWidth={1.5} />
            </div>
        </div>
    );
}
