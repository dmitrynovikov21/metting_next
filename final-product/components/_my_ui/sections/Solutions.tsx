"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/_my_ui/ui/MagneticButton";
import { EvolutionTimeline } from "@/components/_my_ui/visualizations/EvolutionTimeline";

const stages = [
    {
        id: "mvp",
        title: "Landing Page",
        subtitle: "Test & Launch",
        description: "Быстрый запуск для проверки гипотез. Идеально для стартапов и вывода новых продуктов.",
        features: ["Высокая конверсия", "Быстрая сборка (2-3 недели)", "A/B тесты офферов"],
        color: "#00F0FF"
    },
    {
        id: "corporate",
        title: "Corporate Site",
        subtitle: "Demand Management",
        description: "Полноценное представительство компании. Работает на доверие, HR-бренд и SEO.",
        features: ["Каталог продукции", "Блог и кейсы", "Интеграция с CRM"],
        color: "#3D8BFF"
    },
    {
        id: "ecosystem",
        title: "Digital Ecosystem",
        subtitle: "Operations & Automation",
        description: "Цифровая платформа, автоматизирующая бизнес-процессы. Личные кабинеты, API, сервисы.",
        features: ["Личные кабинеты дилеров", "Автоматизация документооборота", "Сквозная аналитика"],
        color: "#7000FF"
    }
];

interface SolutionsProps {
    onOpenProject?: () => void;
}

export function Solutions({ onOpenProject }: SolutionsProps) {
    const [activeStage, setActiveStage] = useState(1);

    return (
        <section id="solutions" className="py-32 bg-background relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6"
                    >
                        Эволюция вашего <br />
                        <span className="text-accent">цифрового присутствия</span>
                    </motion.h2>
                    <p className="text-foreground-secondary text-lg">
                        Мы не просто делаем сайты. Мы строим цифровой путь развития вашей компании: от первого теста до автоматизированной экосистемы.
                    </p>
                </div>

                <EvolutionTimeline
                    stages={stages}
                    activeStage={activeStage}
                    onChangeStage={setActiveStage}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <MagneticButton size="lg" onClick={onOpenProject} className="gap-2 px-8">
                        Начать эволюцию <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                </motion.div>
            </div>
        </section>
    );
}
