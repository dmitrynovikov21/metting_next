"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Compass, Code2, Rocket, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "01",
        title: "Диагностика",
        icon: Search,
        duration: "1 неделя",
        description: "Погружаемся в бизнес-процессы. Интервью с отделом продаж, анализ конкурентов и текущей воронки.",
        result: "Отчет с точками роста и ТЗ",
        animation: "heatmap"
    },
    {
        id: "02",
        title: "Стратегия и UX",
        icon: Compass,
        duration: "2-3 недели",
        description: "Проектируем структуру, которая будет продавать. Создаем интерактивный прототип всех страниц.",
        result: "Кликабельный прототип",
        animation: "blueprint"
    },
    {
        id: "03",
        title: "Продакшн",
        icon: Code2,
        duration: "4-8 недель",
        description: "Дизайн-концепция, верстка, интеграции с CRM/ERP. Наполняем контентом и тестируем.",
        result: "Готовый сайт на dev-сервере",
        animation: "kanban"
    },
    {
        id: "04",
        title: "Запуск",
        icon: Rocket,
        duration: "1 неделя",
        description: "Перенос на боевой домен, настройка аналитики, обучение команды работе с админкой.",
        result: "Работающий инструмент продаж",
        animation: "launch"
    },
    {
        id: "05",
        title: "Поддержка",
        icon: HeartHandshake,
        duration: "Ongoing",
        description: "Не бросаем после запуска. Техническая поддержка, развитие функционала, A/B тесты.",
        result: "SLA 99.9% и развитие",
        animation: "pulse"
    },
];

export function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    return (
        <section className="py-32 bg-surface/30 overflow-hidden" ref={containerRef} id="process">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 md:text-center max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Путь к <span className="text-accent">системному результату</span>
                    </h2>
                    <p className="text-foreground-secondary text-lg">
                        Прозрачный процесс с четкими артефактами на каждом этапе.
                        Вы всегда знаете, что происходит и за что платите.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="absolute top-12 left-0 right-0 h-0.5 bg-white/10 hidden lg:block" />

                    <div className="grid lg:grid-cols-5 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative group"
                            >
                                {/* Step Number & Visualization */}
                                <div className="flex items-center gap-4 lg:block mb-6 relative z-10">
                                    <div className="w-24 h-24 rounded-2xl bg-surface border border-white/10 flex items-center justify-center group-hover:border-accent/50 group-hover:shadow-[0_0_30px_-10px_var(--color-accent)] transition-all duration-500 mb-6 relative overflow-hidden">

                                        {/* Background Animation based on type */}
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                                            {step.animation === 'heatmap' && (
                                                <div className="grid grid-cols-3 gap-1 p-2 h-full">
                                                    {[...Array(9)].map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                                            className="bg-accent rounded-sm"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {step.animation === 'blueprint' && (
                                                <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                                                    <motion.path
                                                        d="M10,10 L90,10 L90,90 L10,90 Z"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="text-accent"
                                                        initial={{ pathLength: 0 }}
                                                        whileInView={{ pathLength: 1 }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                    <motion.line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" className="text-accent" strokeWidth="1" />
                                                    <motion.line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" className="text-accent" strokeWidth="1" />
                                                </svg>
                                            )}
                                            {step.animation === 'kanban' && (
                                                <div className="flex gap-1 p-4 h-full items-center justify-center">
                                                    <motion.div
                                                        animate={{ y: [-5, 5, -5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="w-4 h-12 bg-accent/50 rounded-sm"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [5, -5, 5] }}
                                                        transition={{ duration: 2.5, repeat: Infinity }}
                                                        className="w-4 h-8 bg-accent/30 rounded-sm"
                                                    />
                                                    <motion.div
                                                        animate={{ y: [-3, 3, -3] }}
                                                        transition={{ duration: 1.8, repeat: Infinity }}
                                                        className="w-4 h-10 bg-accent/70 rounded-sm"
                                                    />
                                                </div>
                                            )}
                                            {step.animation === 'launch' && (
                                                <div className="relative w-full h-full flex items-center justify-center">
                                                    <motion.div
                                                        animate={{ y: [10, -20] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }}
                                                        className="w-2 h-2 bg-accent rounded-full"
                                                    />
                                                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-accent/20 to-transparent" />
                                                </div>
                                            )}
                                            {step.animation === 'pulse' && (
                                                <div className="flex items-center justify-center h-full">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="w-10 h-10 rounded-full border-2 border-accent"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <step.icon className="w-8 h-8 text-foreground/80 relative z-10" />
                                    </div>
                                    <div className="lg:absolute lg:top-8 lg:left-28 lg:right-0">
                                        <span className="text-4xl font-bold text-white/5 select-none lg:static lg:text-6xl lg:-z-10 lg:opacity-20">
                                            {step.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-baseline mb-3">
                                        <h3 className="text-xl font-bold">{step.title}</h3>
                                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                                            {step.duration}
                                        </span>
                                    </div>

                                    <p className="text-foreground-secondary text-sm leading-relaxed mb-4 min-h-[80px]">
                                        {step.description}
                                    </p>

                                    <div className="pt-4 border-t border-white/5">
                                        <span className="text-xs text-foreground/40 uppercase tracking-wider block mb-1">
                                            Результат:
                                        </span>
                                        <span className="text-sm font-medium text-foreground/90">
                                            {step.result}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
