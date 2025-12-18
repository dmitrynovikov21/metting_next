"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart3, Layers, AlertCircle } from "lucide-react";
import { MagneticButton } from "@/components/_my_ui/ui/MagneticButton";
import { cn } from "@/lib/utils";

const projects = [
    {
        id: "logistics",
        title: "Global Logistics Portal",
        category: "Logistics / VED",
        story: [
            {
                stage: "Problem",
                icon: AlertCircle,
                title: "Хаос в заявках",
                description: "Менеджеры тонули в Excel и почте. Клиенты не видели статус груза и уходили к конкурентам с трекингом.",
                visual: "bg-red-500/10 border-red-500/20"
            },
            {
                stage: "Solution",
                icon: Layers,
                title: "Цифровое ядро",
                description: "Спроектировали личный кабинет с интеграцией 1С и трекингом морских линий в реальном времени.",
                visual: "bg-blue-500/10 border-blue-500/20"
            },
            {
                stage: "Result",
                icon: BarChart3,
                title: "Рост заявок +300%",
                description: "Автоматизация освободила 40% времени менеджеров. Конверсия в заказ выросла в 3 раза.",
                visual: "bg-green-500/10 border-green-500/20"
            }
        ],
        tags: ["React", "Python", "PostgreSQL"],
    },
    {
        id: "manufacturing",
        title: "Heavy Machinery Catalog",
        category: "Manufacturing",
        story: [
            {
                stage: "Problem",
                icon: AlertCircle,
                title: "Сложный выбор",
                description: "Клиенты не могли сами подобрать комплектацию станка. Цикл сделки затягивался на месяцы.",
                visual: "bg-orange-500/10 border-orange-500/20"
            },
            {
                stage: "Solution",
                icon: Layers,
                title: "Конфигуратор",
                description: "Разработали 3D-конфигуратор, который проверяет совместимость узлов и формирует КП автоматически.",
                visual: "bg-blue-500/10 border-blue-500/20"
            },
            {
                stage: "Result",
                icon: BarChart3,
                title: "Сделка в 2 раза быстрее",
                description: "Инженеры получают уже готовые спецификации. Время на пресейл сократилось на 50%.",
                visual: "bg-green-500/10 border-green-500/20"
            }
        ]
    }
];

export function Projects() {
    const [activeProject, setActiveProject] = useState(0);
    const [activeStage, setActiveStage] = useState(0);

    const nextProject = () => {
        setActiveProject((prev) => (prev + 1) % projects.length);
        setActiveStage(0);
    };

    const prevProject = () => {
        setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
        setActiveStage(0);
    };

    return (
        <section className="py-32 bg-background relative overflow-hidden" id="projects">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold mb-6"
                        >
                            Истории <br />
                            <span className="text-accent">трансформации</span>
                        </motion.h2>
                        <p className="text-foreground-secondary text-lg max-w-xl">
                            Как мы превращаем бизнес-проблемы в точки роста с помощью технологий.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <MagneticButton variant="outline" onClick={prevProject} className="w-12 h-12 p-0 flex items-center justify-center rounded-full">
                            ←
                        </MagneticButton>
                        <MagneticButton variant="outline" onClick={nextProject} className="w-12 h-12 p-0 flex items-center justify-center rounded-full">
                            →
                        </MagneticButton>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Project Info & Story Nav */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeProject}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider text-foreground/60">
                                        {projects[activeProject].category}
                                    </span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                                    {projects[activeProject].title}
                                </h3>

                                {/* Story Stages Navigation */}
                                <div className="flex flex-col gap-4 mb-10">
                                    {projects[activeProject].story.map((step, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setActiveStage(index)}
                                            className={cn(
                                                "p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group",
                                                activeStage === index
                                                    ? "bg-surface border-accent/50"
                                                    : "bg-surface/30 border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            {activeStage === index && (
                                                <motion.div
                                                    layoutId="active-glow"
                                                    className="absolute inset-0 bg-accent/5"
                                                />
                                            )}
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                                    activeStage === index ? "bg-accent text-white" : "bg-white/10 text-foreground/40"
                                                )}>
                                                    <step.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold uppercase tracking-wider text-foreground/40 mb-1">
                                                        {step.stage}
                                                    </div>
                                                    <div className={cn(
                                                        "font-bold transition-colors",
                                                        activeStage === index ? "text-foreground" : "text-foreground/60"
                                                    )}>
                                                        {step.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <MagneticButton className="gap-2 w-fit">
                                    Смотреть кейс целиком <ArrowUpRight className="w-4 h-4" />
                                </MagneticButton>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Visual Stage Display */}
                    <div className="lg:col-span-7">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-surface/50 backdrop-blur-sm">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${activeProject}-${activeStage}`}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className={cn(
                                        "absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center",
                                        projects[activeProject].story[activeStage].visual
                                    )}
                                >
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                                        {(() => {
                                            const Icon = projects[activeProject].story[activeStage].icon;
                                            return <Icon className="w-10 h-10 text-foreground" />;
                                        })()}
                                    </div>
                                    <h4 className="text-2xl font-bold mb-4">
                                        {projects[activeProject].story[activeStage].title}
                                    </h4>
                                    <p className="text-lg text-foreground-secondary max-w-md leading-relaxed">
                                        {projects[activeProject].story[activeStage].description}
                                    </p>

                                    {/* Metric Animation for Result Stage */}
                                    {activeStage === 2 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className="mt-8 px-6 py-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold"
                                        >
                                            Growth Confirmed
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
