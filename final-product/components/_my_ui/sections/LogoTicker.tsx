"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const clients = [
    "TechCorp", "GlobalLogistics", "FinStream", "BuildMaster",
    "AgroTech", "MedSystems", "EduFuture", "AutoDrive",
    "EnergyPlus", "RetailPro", "CyberGuard", "DataFlow"
];

export function LogoTicker() {
    return (
        <section className="py-10 bg-background border-y border-white/5 overflow-hidden">
            <div className="container mb-8 text-center">
                <p className="text-sm text-foreground/40 uppercase tracking-widest">
                    Нам доверяют лидеры рынка
                </p>
            </div>

            <div className="flex overflow-hidden mask-linear-fade">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-50%" }}
                    transition={{
                        duration: 20,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className="flex gap-16 items-center flex-nowrap whitespace-nowrap pr-16"
                >
                    {[...clients, ...clients].map((client, index) => (
                        <div
                            key={index}
                            className="text-2xl font-bold text-white/20 hover:text-white/40 transition-colors cursor-default select-none"
                        >
                            {client}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
