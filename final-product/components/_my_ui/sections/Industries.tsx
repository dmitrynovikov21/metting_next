"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Factory, Truck, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ManufacturingVis } from "@/components/_my_ui/visualizations/industries/ManufacturingVis";
import { LogisticsVis } from "@/components/_my_ui/visualizations/industries/LogisticsVis";
import { TradeVis } from "@/components/_my_ui/visualizations/industries/TradeVis";

export function Industries() {
    const [activeSector, setActiveSector] = useState<string | null>("manufacturing");

    const industries = [
        {
            id: "manufacturing",
            icon: Factory,
            title: "EPC & Производство",
            description: "Длинный цикл, много лиц, сложная спецификация.",
            animationName: "Digital Spec Flow",
            flow: {
                before: "Excel-прайсы и ручной просчёт",
                after: "Цифровой каталог с калькулятором"
            }
        },
        {
            id: "logistics",
            icon: Truck,
            title: "Логистика & ВЭД",
            description: "Отгрузки, документы, мультимодальные перевозки.",
            animationName: "Route Intelligence",
            flow: {
                before: "Звонки менеджеру",
                after: "Real-time трекинг"
            }
        },
        {
            id: "trade",
            icon: Building2,
            title: "Международная торговля",
            description: "Маркетплейсы, дилеры, оптовые закупки.",
            animationName: "Deal Scoring Engine",
            flow: {
                before: "Ручные заявки",
                after: "Авто-скоринг лидов"
            }
        }
    ];

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Left: Content & Cards */}
                    <div className="w-full md:w-1/2 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Каждая отрасль — <br />
                                <span className="text-accent">своя логика сделки.</span> <br />
                                Сайт должен её отражать.
                            </h2>
                            <p className="text-foreground-secondary text-lg leading-relaxed">
                                Мы не рисуем интерфейсы. Мы моделируем цифровую архитектуру процесса:
                                от лида → до сделки → до операционной части.
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-4">
                            {industries.map((industry, index) => (
                                <motion.div
                                    key={industry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    onMouseEnter={() => setActiveSector(industry.id)}
                                    className={cn(
                                        "group p-6 rounded-xl border transition-all duration-300 cursor-pointer",
                                        activeSector === industry.id
                                            ? "bg-accent/5 border-accent/50 translate-x-2"
                                            : "bg-card border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "p-3 rounded-lg transition-colors",
                                            activeSector === industry.id ? "bg-accent/20 text-accent" : "bg-white/5 text-foreground/60"
                                        )}>
                                            <industry.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold flex items-center gap-2">
                                                    {industry.title}
                                                </h3>
                                                {activeSector === industry.id && (
                                                    <span className="text-[10px] uppercase tracking-widest text-accent font-mono border border-accent/30 px-2 py-0.5 rounded bg-accent/10">
                                                        {industry.animationName}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-foreground-secondary mb-4">
                                                {industry.description}
                                            </p>

                                            {/* Flow Visualization */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-mono bg-black/20 p-3 rounded border border-white/5">
                                                <div className="flex items-center gap-2 text-red-400/80">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                                    {industry.flow.before}
                                                </div>
                                                <ArrowRight className="w-3 h-3 text-foreground/20 rotate-90 sm:rotate-0" />
                                                <div className="flex items-center gap-2 text-green-400/80">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                                    {industry.flow.after}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Abstract Visualization */}
                    <div className="w-full md:w-1/2 h-[500px] relative sticky top-24 flex items-center justify-center">

                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

                        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                            <AnimatePresence mode="wait">
                                {activeSector === "manufacturing" && (
                                    <motion.div
                                        key="manufacturing"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full"
                                    >
                                        <ManufacturingVis />
                                    </motion.div>
                                )}

                                {activeSector === "logistics" && (
                                    <motion.div
                                        key="logistics"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full"
                                    >
                                        <LogisticsVis />
                                    </motion.div>
                                )}

                                {activeSector === "trade" && (
                                    <motion.div
                                        key="trade"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full"
                                    >
                                        <TradeVis />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
