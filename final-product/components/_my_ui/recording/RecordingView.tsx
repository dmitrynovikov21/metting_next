"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Share2, Download, ChevronLeft, CheckSquare, MessageSquare, FileText, Clock, Calendar, Users, Zap, AlertTriangle, CheckCircle2, Edit2, ArrowRight, Link as LinkIcon, Send, Search, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/_my_ui/layout/Header";
import BentoCard from "@/components/_my_ui/ui/BentoCard";
import CursorGlow from "@/components/_my_ui/ui/CursorGlow";
import AmbientBackground from "@/components/_my_ui/ui/AmbientBackground";

export default function RecordingView() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState("tldr");

    // Sticky Nav Logic
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-bg-void text-text-primary font-body selection:bg-accent-primary selection:text-white pb-20 relative">
            <CursorGlow />
            <AmbientBackground />
            <Header />

            <div className="container pt-32 max-w-6xl relative z-10">

                {/* Top Navigation & Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/recordings" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors group">
                        <div className="p-2 rounded-full bg-glass-white-5 group-hover:bg-glass-white-8 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Back to Recordings</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button className="btn-primary text-sm flex items-center gap-2">
                            <Send className="w-4 h-4" /> Send to Team
                        </button>
                        <button className="btn-ghost text-sm flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button className="btn-ghost text-sm p-2">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Header Section */}
                <div className="mb-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="text-type-internal bg-type-internal/10 border border-type-internal/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            Internal Sync
                        </span>
                        <span className="text-text-muted text-sm font-mono">Dec 2, 2025 • 45 min • 5 participants</span>
                    </div>

                    <h1 className="text-5xl font-display font-bold text-white leading-tight">
                        Weekly Team Sync
                    </h1>

                    {/* Context Links */}
                    <div className="flex items-center gap-6 text-sm text-text-secondary">
                        <Link href="#" className="flex items-center gap-2 hover:text-accent-primary transition-colors">
                            <LinkIcon className="w-4 h-4" /> Follow-up to: Kickoff meeting (Nov 25)
                        </Link>
                        <span className="text-glass-white-8">|</span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Next: Dec 9, 14:00 (scheduled)
                        </span>
                    </div>

                    {/* Audio Player */}
                    <div className="w-full bg-bg-surface/50 backdrop-blur-md border border-glass-border rounded-2xl p-4 flex items-center gap-6 mt-6">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black flex-shrink-0"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                        </button>

                        <div className="flex-1 h-12 flex items-center gap-1 opacity-80">
                            {[...Array(60)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-300 ${i > 20 && i < 35 ? 'bg-accent-primary h-8' : 'bg-glass-white-8 h-3'}`}
                                    style={{ height: `${Math.max(10, Math.random() * 40)}px` }}
                                />
                            ))}
                        </div>

                        <span className="font-mono text-sm text-text-secondary">12:34 / 45:00</span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Main Content (Single Scroll) */}
                    <div className="col-span-8 space-y-12">

                        {/* Sticky Mini-Nav */}
                        <div className="sticky top-24 z-30 bg-bg-void/80 backdrop-blur-xl py-2 border-b border-glass-border mb-8 flex gap-6 text-sm font-medium">
                            {['tldr', 'decisions', 'risks', 'transcript'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => scrollToSection(section)}
                                    className={`uppercase tracking-wider hover:text-accent-primary transition-colors ${activeSection === section ? 'text-accent-primary' : 'text-text-muted'}`}
                                >
                                    {section}
                                </button>
                            ))}
                        </div>

                        {/* TL;DR Section */}
                        <section id="tldr" className="scroll-mt-40">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-accent-primary" /> TL;DR
                                </h2>
                                <div className="flex gap-2">
                                    <button className="text-xs text-text-secondary hover:text-white flex items-center gap-1 bg-glass-white-5 px-2 py-1 rounded">
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                            </div>
                            <BentoCard className="!p-8">
                                <p className="text-lg text-white leading-relaxed font-medium">
                                    The product team discussed the <span className="text-accent-primary bg-accent-primary/10 px-1 rounded">Q1 launch timeline</span>.
                                    Key decision was made to delay the release by 2 weeks to accommodate additional testing.
                                    Marketing budget was approved with a <span className="text-success bg-success/10 px-1 rounded">20% increase</span>.
                                </p>
                                <div className="mt-6 pt-4 border-t border-glass-border flex items-center gap-2 text-xs font-mono text-text-muted">
                                    <span className="flex items-center gap-1 text-success"><CheckCircle2 className="w-3 h-3" /> AI Confidence: High (92%)</span>
                                </div>
                            </BentoCard>
                        </section>

                        {/* Decisions Made */}
                        <section id="decisions" className="scroll-mt-40">
                            <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-success" /> Decisions Made
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Launch date moved to Jan 15th", quote: "Let's push it two weeks", time: "12:34" },
                                    { title: "Hiring freeze lifted for QA", quote: "We need more QA resources", time: "28:15" }
                                ].map((item, i) => (
                                    <BentoCard key={i} className="!p-5 border-l-4 border-l-success group">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                            <button className="opacity-0 group-hover:opacity-100 text-xs text-text-muted hover:text-white"><Edit2 className="w-3 h-3" /></button>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                                            <span className="italic">"{item.quote}"</span>
                                            <button className="flex items-center gap-1 text-accent-primary hover:underline text-xs font-mono bg-accent-primary/10 px-2 py-0.5 rounded">
                                                <Play className="w-3 h-3" /> {item.time}
                                            </button>
                                        </div>
                                    </BentoCard>
                                ))}
                            </div>
                        </section>

                        {/* Risks & Blockers */}
                        <section id="risks" className="scroll-mt-40">
                            <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-5 h-5 text-error" /> Risks & Blockers
                            </h2>
                            <BentoCard className="!p-5 border-l-4 border-l-error">
                                <h3 className="font-bold text-white mb-2">API dependency from Vendor X</h3>
                                <p className="text-sm text-text-secondary">Timeline remains unclear, potentially blocking the mobile app release.</p>
                            </BentoCard>
                        </section>

                        {/* Transcript Preview */}
                        <section id="transcript" className="scroll-mt-40">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-text-muted" /> Transcript
                                </h2>
                                <div className="flex gap-2">
                                    <button className="btn-ghost text-xs flex items-center gap-1"><Search className="w-3 h-3" /> Search</button>
                                    <button className="btn-ghost text-xs flex items-center gap-1"><ChevronDown className="w-3 h-3" /> Expand</button>
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl border border-glass-border bg-glass-white-2 text-text-secondary leading-relaxed">
                                <div className="flex gap-4 mb-4 group">
                                    <div className="w-12 text-xs font-mono text-text-muted pt-1">00:00</div>
                                    <div className="flex-1">
                                        <span className="text-accent-primary font-bold mr-2">Alex:</span>
                                        <span>Good morning everyone, let's start with the roadmap updates...</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                                        <button className="text-text-muted hover:text-white"><MessageSquare className="w-3 h-3" /></button>
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-4 group bg-accent-primary/5 -mx-2 px-2 py-1 rounded">
                                    <div className="w-12 text-xs font-mono text-accent-primary pt-1 flex items-center gap-1"><Play className="w-3 h-3 fill-current" /> 12:34</div>
                                    <div className="flex-1">
                                        <span className="text-white font-bold mr-2">Sarah:</span>
                                        <span className="text-white">Let's push it two weeks. We need to ensure quality.</span>
                                    </div>
                                </div>
                                <div className="h-12 bg-gradient-to-b from-transparent to-bg-void mt-2" />
                            </div>
                        </section>

                    </div>

                    {/* Sidebar (Action Items) */}
                    <div className="col-span-4 space-y-6">
                        <div className="sticky top-32">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Action Items</h3>
                                <button className="text-xs text-accent-primary hover:underline">Send all to Asana</button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { text: "Update roadmap slides", assignee: "Alex", due: "Tomorrow", priority: "high", quote: "Alex, can you update the slides?", time: "15:42" },
                                    { text: "Schedule vendor call", assignee: "Sarah", due: "Dec 5", priority: "medium", quote: "Sarah, please schedule that", time: "20:10" },
                                    { text: "Review budget draft", assignee: "Mike", due: "Dec 8", priority: "low", quote: "Mike will review the draft", time: "42:00" },
                                ].map((item, i) => (
                                    <BentoCard key={i} className="!p-4 group hover:border-accent-primary/50 cursor-pointer relative">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded border border-glass-border group-hover:border-accent-primary transition-colors flex items-center justify-center mt-0.5 flex-shrink-0 hover:bg-accent-primary/20">
                                                {/* Checkbox */}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium mb-2 group-hover:text-accent-primary transition-colors">{item.text}</p>
                                                <div className="flex flex-wrap gap-2 text-[10px] text-text-muted font-mono mb-2">
                                                    <span className="bg-glass-white-5 px-1.5 py-0.5 rounded">@{item.assignee}</span>
                                                    <span className="bg-glass-white-5 px-1.5 py-0.5 rounded">{item.due}</span>
                                                    {item.priority === 'high' && <span className="text-error bg-error/10 px-1.5 py-0.5 rounded">High</span>}
                                                </div>
                                                <div className="text-xs text-text-muted italic flex items-center gap-1">
                                                    "{item.quote}" <Play className="w-2 h-2" /> {item.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                                            <button className="p-1 hover:bg-glass-white-10 rounded"><Edit2 className="w-3 h-3 text-text-secondary" /></button>
                                            <button className="p-1 hover:bg-glass-white-10 rounded"><Send className="w-3 h-3 text-text-secondary" /></button>
                                        </div>
                                    </BentoCard>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
