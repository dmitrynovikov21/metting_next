"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    {
        id: "content",
        question: "Кто занимается контентом?",
        answer: "Мы помогаем со структурой и редактурой, но фактуру и экспертизу ожидаем от вас. Если нужно, подключим профильных копирайтеров.",
    },
    {
        id: "design",
        question: "Что, если не устроит дизайн?",
        answer: "Мы работаем итерациями. Сначала утверждаем структуру, потом прототип, потом концепцию. Вы видите результат на каждом этапе, сюрпризов не будет.",
    },
    {
        id: "langs",
        question: "Как работаете с несколькими языками?",
        answer: "Закладываем мультиязычность на уровне архитектуры. Используем Next.js i18n routing. Контент переводим с носителями или через бюро.",
    },
    {
        id: "support",
        question: "Можно ли дорабатывать сайт после запуска?",
        answer: "Да, мы передаём исходный код и документацию. Вы можете развивать сайт с нами или своей командой.",
    },
    {
        id: "geo",
        question: "Работаете с Gulf / Европой?",
        answer: "Да, у нас есть опыт адаптации под международные рынки, понимание специфики и требований к контенту.",
    },
    {
        id: "payment",
        question: "Как выглядит договор и оплата?",
        answer: "Работаем по договору оказания услуг. Оплата обычно 50/50 или разбита на 3-4 этапа для крупных проектов.",
    },
];

interface Message {
    id: string;
    role: "user" | "assistant";
    text: string;
}

export function FAQ() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            text: "Привет! Я цифровой помощник Gravity. Готов ответить на любые вопросы о том, как мы работаем. Что вас интересует?"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleAsk = async (faq: typeof faqs[0]) => {
        if (isTyping) return;

        // Add user question
        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text: faq.question
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                text: faq.answer
            };
            setMessages(prev => [...prev, assistantMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container max-w-4xl">
                <div className="text-center mb-12">
                    <span className="text-accent text-sm font-medium tracking-wider uppercase mb-4 block">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-accent" />
                        Futurist Assistant
                    </h2>
                    <p className="text-foreground-secondary text-lg">
                        Задайте вопрос нашему AI-ассистенту
                    </p>
                </div>

                <div className="bg-surface/30 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex gap-4 max-w-[80%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    msg.role === "assistant" ? "bg-accent text-white" : "bg-white/10 text-foreground"
                                )}>
                                    {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === "assistant"
                                        ? "bg-surface border border-white/5 rounded-tl-none"
                                        : "bg-accent text-white rounded-tr-none"
                                )}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4 max-w-[80%]"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-surface border border-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center h-12">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                        className="w-2 h-2 bg-foreground/40 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                        className="w-2 h-2 bg-foreground/40 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                        className="w-2 h-2 bg-foreground/40 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area (Suggestions) */}
                    <div className="p-4 border-t border-white/10 bg-surface/50 backdrop-blur-sm">
                        <p className="text-xs text-foreground/40 uppercase tracking-wider mb-3 px-2">
                            Популярные вопросы:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {faqs.map((faq) => (
                                <button
                                    key={faq.id}
                                    onClick={() => handleAsk(faq)}
                                    disabled={isTyping}
                                    className="text-sm px-4 py-2 rounded-full bg-white/5 hover:bg-accent/20 hover:text-accent border border-white/5 hover:border-accent/30 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {faq.question}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
