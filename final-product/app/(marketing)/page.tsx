"use client";

import Link from "next/link";
import BentoCard from "@/components/_my_ui/ui/BentoCard";
import CursorGlow from "@/components/_my_ui/ui/CursorGlow";
import AmbientBackground from "@/components/_my_ui/ui/AmbientBackground";
import {
  ArrowRight, Play, CheckCircle2, AlertTriangle,
  Brain, Shield, Zap, FileText, Mic, Layers,
  Lock, Users, BarChart3, ChevronRight, Clock, CheckSquare
} from "lucide-react";
import { SmartTranscriptionVisual, CorporateMemoryVisual, PrivacyVisual, DecisionsRisksVisual } from "@/components/_my_ui/landing/FeatureVisuals";
import {
  InfoLostVisual, TasksVanishVisual, InvisibleRisksVisual,
  NoSingleSourceVisual, BrokenTelephoneVisual, ComplianceGapsVisual
} from "@/components/_my_ui/landing/ProblemVisuals";

import { HeroScheme } from "@/components/_my_ui/landing/HeroScheme";
import { Hero } from "@/components/_my_ui/sections/Hero";

export default function LandingPage() {
  return (
    <>
      <CursorGlow />
      <AmbientBackground />

      {/* Landing Header (Floating Pill) */}
      <header className="fixed top-6 left-0 right-0 z-[9999] flex justify-center px-6">
        <div className="bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center gap-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <span className="text-lg font-display font-bold text-white tracking-tight">Futurist</span>
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none">OS</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <a href="#problem" className="hover:text-white transition-colors">Problem</a>
            <a href="#solution" className="hover:text-white transition-colors">Solution</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </nav>

          {/* CTA */}
          <Link href="/dashboard" className="px-5 py-2 bg-white/10 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-bg-void font-body selection:bg-accent selection:text-white pb-20 relative">

        <main>
          {/* 1. Hero Section */}
          <Hero />

          {/* 2. Problem Section */}
          <section id="problem" className="py-20 container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-6">
                Why companies lose money <br />on meetings?
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Chaos, lost tasks, and forgotten agreements are the silent killers of productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. Info Lost */}
              <BentoCard delay={0.1} className="group hover:border-error/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <InfoLostVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">80% of info lost</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Within 48 hours, most details from a meeting are forgotten forever.</p>
                </div>
              </BentoCard>

              {/* 2. Tasks Vanish */}
              <BentoCard delay={0.2} className="group hover:border-warning/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <TasksVanishVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">Tasks vanish</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Action items get buried in Slack threads or mental notes.</p>
                </div>
              </BentoCard>

              {/* 3. Invisible Risks */}
              <BentoCard delay={0.3} className="group hover:border-error/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <InvisibleRisksVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">Invisible Risks</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Critical blockers mentioned in passing are ignored until it's too late.</p>
                </div>
              </BentoCard>

              {/* 4. No Single Source */}
              <BentoCard delay={0.4} className="group hover:border-accent/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <NoSingleSourceVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">No Single Source</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Notes are scattered across Notion, Google Docs, and notebooks.</p>
                </div>
              </BentoCard>

              {/* 5. Broken Telephone */}
              <BentoCard delay={0.5} className="group hover:border-white/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <BrokenTelephoneVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">Broken Telephone</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">Team members leave with different understandings of the same decision.</p>
                </div>
              </BentoCard>

              {/* 6. Compliance Gaps */}
              <BentoCard delay={0.6} className="group hover:border-success/30 transition-colors !p-0 overflow-hidden relative h-[200px] flex flex-col justify-center">
                <div
                  className="absolute right-0 top-0 bottom-0 w-3/4 opacity-100 pointer-events-none"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 50%)' }}
                >
                  <ComplianceGapsVisual />
                </div>
                <div className="p-6 relative z-10 w-2/3">
                  <h3 className="text-xl font-bold text-white mb-3">Compliance Gaps</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">No audit trail of what was actually agreed upon with clients.</p>
                </div>
              </BentoCard>
            </div>
          </section>

          {/* 3. Solution Section (Deep Dive Showcases) */}
          <section id="solution" className="py-32 container mx-auto px-6 space-y-32">

            {/* Showcase 1: Corporate Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold text-accent uppercase tracking-wider mb-6">
                  <Brain className="w-3 h-3" /> Corporate Brain
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 leading-tight">
                  Stop losing your <br />best ideas.
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  Futurist Speech creates a searchable index of your company's entire spoken history.
                  Ask questions like "What did we decide about the Q4 budget?" and get instant answers linked to the exact moment in the meeting.
                </p>
                <ul className="space-y-4">
                  {[
                    'Semantic Search across all meetings',
                    'Instant Recall of decisions and risks',
                    'Cross-reference between teams'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 lg:order-2">
                <CorporateMemoryVisual />
              </div>
            </div>

            {/* Showcase 2: Smart Transcription */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-1">
                <SmartTranscriptionVisual />
              </div>
              <div className="order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider mb-6">
                  <Mic className="w-3 h-3" /> Global Understanding
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 leading-tight">
                  Perfect transcription. <br />In any language.
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  Record directly or upload files. Our engine identifies speakers, filters noise, and translates in real-time.
                  It's like having a professional interpreter in every call.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['100+ Languages', 'Speaker ID', 'Noise Cancellation', 'Auto-Translation'].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Showcase 3: Structured Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider mb-6">
                  <Layers className="w-3 h-3" /> Structured Data
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 leading-tight">
                  Turn talk into <br />action items.
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  Don't let risks bury themselves in hour-long recordings.
                  We automatically extract Decisions, Risks, and Tasks, categorizing them by severity and priority.
                </p>
                <button className="btn-ghost flex items-center gap-2 border border-white/10 hover:bg-white/5">
                  View Protocol Example <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="order-1 lg:order-2">
                <DecisionsRisksVisual />
              </div>
            </div>

            {/* Showcase 4: Privacy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-1">
                <PrivacyVisual />
              </div>
              <div className="order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white uppercase tracking-wider mb-6">
                  <Lock className="w-3 h-3" /> Enterprise Grade
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-semibold text-white mb-6 leading-tight">
                  Your secrets stay <br />secret.
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-8">
                  We don't train our models on your data. Everything is encrypted at rest and in transit.
                  Deploy on your own private cloud or use our secure EU/US regions.
                </p>
                <ul className="grid grid-cols-2 gap-4">
                  {[
                    'SOC2 Compliant', 'GDPR Ready',
                    'Private Cloud', 'SAML SSO'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                      <Shield className="w-4 h-4 text-white" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </section>
          {/* 4. How It Works */}
          <section id="how-it-works" className="py-20 container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-6">
                From chaos to order in 3 steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-glass-border to-transparent z-0" />

              {[
                { step: "01", title: "Record or Upload", desc: "Connect Zoom/Meet or upload a file. We handle the rest.", icon: Mic },
                { step: "02", title: "AI Decodes", desc: "Our engine extracts decisions, risks, and tasks instantly.", icon: Brain },
                { step: "03", title: "Corporate Memory", desc: "Insights flow into your Dashboard and CRM automatically.", icon: Zap },
              ].map((item, i) => (
                <div key={i} className="relative z-10 text-center group">
                  <div className="w-24 h-24 mx-auto bg-bg-void border border-glass-border rounded-full flex items-center justify-center mb-6 group-hover:border-accent transition-colors shadow-glow-blue">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Step {item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-text-secondary px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Interface Demo (Mockup) */}
          <section id="demo" className="py-20 container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-semibold text-white mb-6">
                The interface your team <br />will actually use
              </h2>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0C] max-w-5xl mx-auto group">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none z-20" />

              {/* Mock UI Header - macOS style */}
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-[#1a1a1d]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-5 w-48 bg-white/5 rounded-md flex items-center justify-center">
                    <span className="text-[10px] text-white/30">futurist.app/dashboard</span>
                  </div>
                </div>
              </div>

              {/* Mock UI Body */}
              <div className="flex h-[400px]">
                {/* Sidebar */}
                <div className="w-56 border-r border-white/10 p-4 flex flex-col gap-3 bg-[#0f0f11]">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs text-white font-medium">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-xs text-white/60">Meetings</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-xs text-white/60">Protocols</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-xs text-white/60">Tasks</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      <span className="text-xs text-white/70">Alex CEO</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg text-white font-semibold">Corporate Memory</h3>
                      <p className="text-xs text-white/40">12 meetings analyzed</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg">
                      + New Recording
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Recording Card */}
                    <div className="col-span-1 p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/20">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center mb-3">
                        <Mic className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xs text-white/60 mb-1">Record</p>
                      <p className="text-sm text-white font-medium">Start Recording</p>
                    </div>

                    {/* Upload Card */}
                    <div className="col-span-1 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                        <FileText className="w-4 h-4 text-white/60" />
                      </div>
                      <p className="text-xs text-white/60 mb-1">Upload</p>
                      <p className="text-sm text-white font-medium">Drop files here</p>
                    </div>

                    {/* Bot Card */}
                    <div className="col-span-1 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                        <Brain className="w-4 h-4 text-white/60" />
                      </div>
                      <p className="text-xs text-white/60 mb-1">AI Bot</p>
                      <p className="text-sm text-white font-medium">Join Meeting</p>
                    </div>
                  </div>

                  {/* Recent Meeting */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">Strategy Meeting Q4</p>
                          <p className="text-xs text-white/40">Today at 14:30 • 45 min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded text-[10px] bg-green-500/20 text-green-400 font-medium">Ready</span>
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Overlay CTA */}
              <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40">
                <Link href="/dashboard" className="px-8 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 transform hover:scale-105">
                  Explore Live Demo
                </Link>
              </div>
            </div>
          </section>



          {/* Footer CTA */}


          <footer className="border-t border-white/5 py-12 bg-bg-void">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-accent-primary flex items-center justify-center text-white font-bold text-xs">F</div>
                <span className="font-bold text-white">Futurist Speech</span>
              </div>
              <div className="text-text-secondary text-sm">
                © 2025 Futurist Speech. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
