"use client";

import { motion } from "framer-motion";

export function FuturistChatInterface() {
    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Glass Card Container */}
            <div className="relative bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-6 font-mono text-sm">

                    {/* User Message */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-end items-start gap-4"
                    >
                        <div className="bg-[#111114] border border-white/5 text-gray-300 px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                            It's my first day at the company. Where do I start?
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#111114] border border-white/10 flex items-center justify-center text-xs text-gray-500">
                            U
                        </div>
                    </motion.div>

                    {/* Bot Message */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex justify-start items-start gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            F
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg shadow-blue-900/20">
                            Hi! I'm Futurist OS Chat. <br />
                            I'll walk you through onboarding and key processes.
                        </div>
                    </motion.div>

                    {/* User Message 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 3.0 }}
                        className="flex justify-end items-start gap-4"
                    >
                        <div className="bg-[#111114] border border-white/5 text-gray-300 px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                            I need to understand how to request vacation and business trips.
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#111114] border border-white/10 flex items-center justify-center text-xs text-gray-500">
                            U
                        </div>
                    </motion.div>

                    {/* Bot Message 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 4.5 }}
                        className="flex justify-start items-start gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                            F
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-lg shadow-blue-900/20">
                            Here are the policies for vacation and travel. <br />
                            Want me to build a checklist for your role?
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
