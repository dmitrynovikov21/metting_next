"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const locations = [
    { city: "Dubai", country: "UAE", time: "UTC+4", type: "HQ", x: 65, y: 45 },
    { city: "Moscow", country: "Russia", time: "UTC+3", type: "R&D", x: 55, y: 25 },
    { city: "Almaty", country: "Kazakhstan", time: "UTC+5", type: "Sales", x: 70, y: 35 },
    { city: "Belgrade", country: "Serbia", time: "UTC+1", type: "Dev", x: 48, y: 30 },
];

export function Geography() {
    return (
        <section className="py-24 bg-surface/20 border-t border-white/5 overflow-hidden">
            <div className="container">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <span className="text-accent text-sm font-medium tracking-wider uppercase mb-4 block">
                            География
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Работаем по всему миру
                        </h2>
                        <p className="text-foreground-secondary text-lg mb-8 leading-relaxed">
                            Мы строим распределенную команду, чтобы собирать лучшие таланты и быть на связи с клиентами в разных часовых поясах.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            {locations.map((loc, index) => (
                                <div key={index} className="p-4 rounded-xl bg-surface border border-white/5 flex flex-col gap-2 group hover:border-accent/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <span className="text-lg font-bold group-hover:text-accent transition-colors">{loc.city}</span>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-foreground/60">
                                            {loc.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/40">
                                        <MapPin className="w-3 h-3" />
                                        <span>{loc.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-foreground/40 mt-auto pt-2">
                                        <Clock className="w-3 h-3" />
                                        <span>{loc.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
                        {/* Abstract Map Visualization */}
                        <div className="absolute inset-0 w-full h-full">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                                {/* Background Grid */}
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-white/5" />
                                </pattern>
                                <rect width="100" height="100" fill="url(#grid)" />

                                {/* Connections */}
                                {locations.map((start, i) => (
                                    locations.map((end, j) => {
                                        if (i >= j) return null; // Avoid duplicate lines
                                        return (
                                            <motion.path
                                                key={`${i}-${j}`}
                                                d={`M${start.x},${start.y} Q${(start.x + end.x) / 2},${(start.y + end.y) / 2 - 10} ${end.x},${end.y}`}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="0.2"
                                                className="text-accent/30"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                whileInView={{ pathLength: 1, opacity: 1 }}
                                                transition={{ duration: 2, delay: 0.5 + i * 0.2 }}
                                            />
                                        );
                                    })
                                ))}

                                {/* Active Pulses on Lines */}
                                {locations.map((start, i) => (
                                    locations.map((end, j) => {
                                        if (i >= j) return null;
                                        return (
                                            <motion.circle
                                                key={`pulse-${i}-${j}`}
                                                r="0.5"
                                                fill="currentColor"
                                                className="text-accent"
                                            >
                                                <animateMotion
                                                    dur={`${3 + i + j}s`}
                                                    repeatCount="indefinite"
                                                    path={`M${start.x},${start.y} Q${(start.x + end.x) / 2},${(start.y + end.y) / 2 - 10} ${end.x},${end.y}`}
                                                />
                                            </motion.circle>
                                        );
                                    })
                                ))}

                                {/* Location Nodes */}
                                {locations.map((loc, index) => (
                                    <g key={index}>
                                        {/* Ripple Effect */}
                                        <motion.circle
                                            cx={loc.x}
                                            cy={loc.y}
                                            r="1"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="0.2"
                                            className="text-accent"
                                            initial={{ scale: 1, opacity: 0.8 }}
                                            animate={{ scale: 4, opacity: 0 }}
                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                                        />
                                        {/* Core Dot */}
                                        <circle cx={loc.x} cy={loc.y} r="1.5" fill="currentColor" className="text-surface" />
                                        <circle cx={loc.x} cy={loc.y} r="0.8" fill="currentColor" className="text-accent" />

                                        {/* Label */}
                                        <text x={loc.x} y={loc.y + 4} textAnchor="middle" fontSize="3" fill="currentColor" className="text-foreground/60 font-medium">
                                            {loc.city}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
