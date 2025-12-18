"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Trophy, Users, BarChart, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Экспертиза в B2B",
        description: "Понимаем специфику длинных сделок, тендеров и ЛПР. Говорим на языке бизнеса, а не пикселей.",
        icon: Trophy,
        className: "lg:col-span-2 lg:row-span-2 bg-surface/50",
    },
    {
        title: "Скорость",
        description: "Запускаем MVP за 4 недели. Используем готовые наработки и компоненты.",
        icon: Zap,
        className: "lg:col-span-1 bg-surface/30",
    },
    {
        title: "Надежность",
        description: "SLA 99.9%, юридические гарантии, прозрачная отчетность.",
        icon: ShieldCheck,
        className: "lg:col-span-1 bg-surface/30",
    },
    {
        title: "Команда",
        description: "Senior-разработчики и арт-директора с опытом в энтерпрайзе.",
        icon: Users,
        className: "lg:col-span-1 bg-surface/30",
    },
    {
        title: "Результат",
        description: "Фокус на метриках: конверсия, стоимость лида, ROI.",
        icon: BarChart,
        className: "lg:col-span-1 bg-surface/30",
    },
];

export function WhyUs() {
    return (
        <section className="py-32 bg-background relative overflow-hidden" id="why-us">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="text-accent text-sm font-medium tracking-wider uppercase mb-4 block">
                        Преимущества
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Почему выбирают нас
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-8 rounded-2xl border border-white/5 hover:border-accent/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between",
                                feature.className
                            )}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <feature.icon className="w-24 h-24" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-foreground-secondary text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
