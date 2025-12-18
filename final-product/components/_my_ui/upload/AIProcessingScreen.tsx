"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Mic, Sparkles } from "lucide-react";

interface AIProcessingScreenProps {
    progress: number;
    onComplete?: () => void;
}

const PHRASES = [
    "Listening...",
    "Processing audio stream...",
    "Detecting voice patterns...",
    "Converting to text...",
    "Finalizing transcript..."
];

const PREVIEW_TEXT = "TRANSCRIPTION_ACTIVE_STREAM_01";

export default function AIProcessingScreen({ progress, onComplete }: AIProcessingScreenProps) {
    const [showComplete, setShowComplete] = useState(false);
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                setShowComplete(true);
                onComplete?.();
            }, 800);
        }
    }, [progress, onComplete]);

    useEffect(() => {
        const index = Math.min(Math.floor((progress / 100) * PHRASES.length), PHRASES.length - 1);
        setPhraseIndex(index);
    }, [progress]);

    if (showComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-24"
            >
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-medium text-white mb-2 tracking-tight">Complete</h2>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-24 px-8">
            {/* Main Container - "The Neural Interface" */}
            <div className="relative h-80 mb-16 overflow-hidden rounded-[3rem] bg-[#020204] border border-white/10 shadow-2xl flex flex-col items-center justify-center group">

                {/* Ambient Glows */}
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none opacity-60" />
                <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-40" />

                {/* The Hybrid Visualization */}
                <div className="relative z-10 w-full px-12 flex items-center justify-center gap-12">
                    <HybridVisualizer />
                </div>

                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-30" />
                {/* Scanline Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
            </div>

            {/* Info Section */}
            <div className="flex flex-col items-center gap-8 max-w-md mx-auto">
                <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                    <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={phraseIndex}
                            initial={{ opacity: 0, filter: "blur(4px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(4px)" }}
                            className="text-xs font-semibold text-white/90 tracking-widest uppercase"
                        >
                            {PHRASES[phraseIndex]}
                        </motion.span>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 20 }}
                    />
                    <motion.div
                        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-md"
                        style={{ left: `${progress}%`, x: "-50%" }}
                    />
                </div>

                <div className="flex justify-between w-full text-[10px] font-bold text-white/20 tracking-[0.2em] uppercase">
                    <span>Audio Input</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    );
}

function HybridVisualizer() {
    return (
        <div className="flex items-center w-full h-40">
            {/* Left: The Liquid Audio Wave */}
            <div className="flex-1 h-full relative flex items-center justify-center">
                <SiriWave />
            </div>

            {/* Center: The Connection / Transformation */}
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-4" />

            {/* Right: The Text Stream */}
            <div className="flex-1 h-full relative flex items-center justify-start overflow-hidden mask-linear-fade">
                <TextStream />
            </div>

            <style jsx>{`
                .mask-linear-fade {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </div>
    );
}

function SiriWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phaseRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);

            phaseRef.current += 0.15; // Speed

            // Draw 3 overlapping sine waves
            const colors = ['rgba(59, 130, 246, 0.5)', 'rgba(147, 51, 234, 0.5)', 'rgba(255, 255, 255, 0.8)'];

            colors.forEach((color, i) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = i === 2 ? 2 : 1.5;

                const amplitude = i === 2 ? 30 : 40; // White line is tighter
                const frequency = i === 2 ? 0.02 : 0.015;
                const offset = i * 2; // Phase offset between lines

                for (let x = 0; x < width; x++) {
                    // Complex wave function: Main sine + secondary sine for "liquid" feel
                    // Also dampened at edges
                    const y = height / 2 +
                        Math.sin(x * frequency + phaseRef.current + offset) * amplitude * Math.sin(phaseRef.current * 0.5) *
                        Math.sin(x / width * Math.PI); // Dampen edges

                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}

function TextStream() {
    // A stream of characters that "stabilize"
    const [chars, setChars] = useState<Array<{ char: string, stable: boolean }>>([]);
    const frameRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            frameRef.current++;

            // Update chars
            setChars(prev => {
                // Shift logic or just random updates?
                // Let's make it look like typing/decoding

                const target = PREVIEW_TEXT;
                const newChars = target.split('').map((targetChar, i) => {
                    // Probability of being stable increases with index (left to right)? 
                    // No, usually left is stable.
                    // Let's make right side "raw" and left side "stable".

                    // Actually, let's just animate a "cursor" of instability
                    const time = frameRef.current * 0.1;
                    const noise = Math.sin(i * 0.5 + time);

                    const isStable = noise > 0.5;

                    if (isStable) return { char: targetChar, stable: true };

                    // Random char
                    const random = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)];
                    return { char: random, stable: false };
                });

                return newChars;
            });
        }, 50); // 20fps for text update is enough for "tech" feel

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-wrap gap-1 w-full">
            {chars.map((item, i) => (
                <span
                    key={i}
                    className={`font-mono text-lg transition-colors duration-100 ${item.stable ? "text-white" : "text-blue-400 opacity-70"
                        }`}
                >
                    {item.char}
                </span>
            ))}
        </div>
    );
}
