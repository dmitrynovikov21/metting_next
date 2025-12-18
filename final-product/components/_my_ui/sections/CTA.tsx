"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/_my_ui/ui/Button";

interface CTAProps {
    onOpenProject?: () => void;
    onOpenAudit?: () => void;
}

export function CTA({ onOpenProject, onOpenAudit }: CTAProps) {
    return (
        <section className="py-24 bg-surface/30" id="contacts">
            <div className="container max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Готовы обсудить проект</h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <Button size="lg" className="gap-2" onClick={onOpenProject}>
                            <FileText className="w-4 h-4" />
                            Заполнить бриф
                        </Button>
                        <Button variant="outline" size="lg" className="gap-2" onClick={onOpenAudit}>
                            <Calendar className="w-4 h-4" />
                            Назначить созвон
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-foreground/60">
                        <a href="mailto:hello@futurist.agency" className="hover:text-accent transition-colors">
                            hello@futurist.agency
                        </a>
                        <div className="hidden md:block w-1 h-1 bg-foreground/20 rounded-full" />
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-accent transition-colors">WhatsApp</a>
                            <a href="#" className="hover:text-accent transition-colors">Telegram</a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
