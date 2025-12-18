"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AIProcessingScreen from "@/components/_my_ui/upload/AIProcessingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

function ProcessingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const recordingId = searchParams.get("id");
    const fileName = searchParams.get("name") || "Recording";

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"processing" | "completed" | "error" | "long_running">("processing");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    useEffect(() => {
        if (!recordingId) {
            setErrorMessage("No recording ID provided");
            setStatus("error");
            return;
        }

        // Simulated progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const maxProgress = status === "long_running" ? 95 : 89;
                if (prev >= maxProgress) return prev;

                let increment = 0;
                if (prev < 20) increment = 0.5;
                else if (prev < 50) increment = 0.2;
                else if (prev < 80) increment = 0.05;
                else increment = 0.005;

                return Math.min(prev + increment, maxProgress);
            });
        }, 200);

        // Poll for actual status
        const pollInterval = setInterval(async () => {
            try {
                setPollCount(prev => prev + 1);
                const response = await fetch(`/api/v1/recordings/${recordingId}`);

                if (!response.ok) {
                    if (response.status === 404) return;
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();

                if (data.progress && data.progress > progress) {
                    setProgress(data.progress);
                }

                if (data.status === "completed") {
                    setProgress(100);
                    setStatus("completed");
                    clearInterval(pollInterval);
                    clearInterval(progressInterval);

                    setTimeout(() => {
                        router.push(`/dashboard/meetings/${recordingId}`);
                    }, 1500);
                } else if (data.status === "error") {
                    setStatus("error");
                    setErrorMessage(data.error || "Processing failed");
                    clearInterval(pollInterval);
                    clearInterval(progressInterval);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 1000);

        const longRunningTimeout = setTimeout(() => {
            if (status === "processing") {
                setStatus("long_running");
            }
        }, 90000);

        const timeoutId = setTimeout(() => {
            if (status === "processing" || status === "long_running") {
                fetch(`/api/v1/recordings/${recordingId}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.status === "completed") {
                            setProgress(100);
                            setStatus("completed");
                            setTimeout(() => {
                                router.push(`/dashboard/meetings/${recordingId}`);
                            }, 1500);
                        } else {
                            setStatus("error");
                            setErrorMessage("Processing timed out.");
                        }
                    })
                    .catch(() => {
                        setStatus("error");
                        setErrorMessage("Connection timed out.");
                    });
            }
        }, 600000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(pollInterval);
            clearTimeout(longRunningTimeout);
            clearTimeout(timeoutId);
        };
    }, [recordingId, router, status, progress]);

    const handleRetry = () => {
        setStatus("processing");
        setProgress(0);
        setErrorMessage(null);
    };

    if (status === "error") {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-destructive/30 rounded-3xl p-8 max-w-md text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Processing Failed</h2>
                    <p className="text-muted-foreground mb-6">{errorMessage}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={handleRetry}
                            className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background gradient effect */}
            <motion.div
                className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />

            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-foreground/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-foreground mb-2"
                    >
                        AI Processing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground"
                    >
                        {fileName}
                    </motion.p>
                </div>

                {/* Processing Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />

                    <AIProcessingScreen
                        progress={progress}
                        onComplete={() => console.log("Complete!")}
                    />

                    <AnimatePresence>
                        {status === "long_running" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 text-center"
                            >
                                <p className="text-yellow-500 text-sm flex items-center justify-center gap-2">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    Taking longer than usual...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Cancel button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-6"
                >
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Cancel and return to dashboard
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default function ProcessingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        }>
            <ProcessingContent />
        </Suspense>
    );
}
