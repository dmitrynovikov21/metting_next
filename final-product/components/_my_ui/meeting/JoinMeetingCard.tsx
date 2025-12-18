"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Video,
    Link2,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Bot
} from "lucide-react";

interface JoinMeetingCardProps {
    onJoin?: (url: string, platform: string) => Promise<void>;
}

export function JoinMeetingCard({ onJoin }: JoinMeetingCardProps) {
    const [meetingUrl, setMeetingUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const detectPlatform = (url: string): string | null => {
        if (url.includes("zoom.us") || url.includes("zoom.com")) return "zoom";
        if (url.includes("meet.google.com")) return "google_meet";
        if (url.includes("teams.microsoft.com") || url.includes("teams.live.com")) return "teams";
        return null;
    };

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return detectPlatform(url) !== null;
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!meetingUrl.trim()) {
            setErrorMessage("Please enter a meeting link");
            setStatus("error");
            return;
        }

        if (!validateUrl(meetingUrl)) {
            setErrorMessage("Invalid meeting link. Supported: Zoom, Google Meet, Teams");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        try {
            const platform = detectPlatform(meetingUrl)!;

            if (onJoin) {
                await onJoin(meetingUrl, platform);
            } else {
                // Default API call
                const response = await fetch("/api/v1/recordings/join-meeting", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        meeting_url: meetingUrl,
                        platform: platform
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || "Failed to join meeting");
                }
            }

            setStatus("success");
            setMeetingUrl("");

            // Reset after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to send agent");
            setStatus("error");
        }
    };

    const platform = detectPlatform(meetingUrl);

    return (
        <div className="bg-bg-elevated border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-primary/20 rounded-full blur-3xl" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative">
                <div className="w-10 h-10 rounded-xl bg-accent-primary/20 flex items-center justify-center">
                    <Video className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Join Meeting</h3>
                    <p className="text-sm text-text-secondary">Paste meeting link to send AI agent</p>
                </div>
            </div>

            {/* Input */}
            <div className="relative mb-4">
                <input
                    type="url"
                    value={meetingUrl}
                    onChange={(e) => {
                        setMeetingUrl(e.target.value);
                        if (status === "error") setStatus("idle");
                    }}
                    placeholder="https://zoom.us/j/... or meet.google.com/..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-text-muted focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/20 outline-none transition-all"
                    disabled={status === "loading"}
                />
                <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            </div>

            {/* Send Button */}
            <motion.button
                onClick={handleSubmit}
                disabled={status === "loading" || status === "success"}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === "success"
                        ? "bg-green-500 text-white"
                        : status === "error"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-accent-primary text-black hover:bg-accent-primary/90"
                    } disabled:opacity-70`}
                whileHover={status === "idle" ? { scale: 1.01 } : {}}
                whileTap={status === "idle" ? { scale: 0.99 } : {}}
            >
                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending Agent...
                        </motion.div>
                    )}
                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Agent Sent!
                        </motion.div>
                    )}
                    {status === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {errorMessage}
                        </motion.div>
                    )}
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Bot className="w-5 h-5" />
                            Send Agent
                            <ArrowRight className="w-4 h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Supported Platforms */}
            <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-xs text-text-muted mb-3">Supported platforms</p>
                <div className="flex items-center gap-3">
                    {/* Zoom */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${platform === "zoom" ? "bg-blue-500 ring-2 ring-blue-400/50" : "bg-white/10"
                        }`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                            <path d="M4.5 4.5h10.8c.8 0 1.5.7 1.5 1.5v7.5c0 .8-.7 1.5-1.5 1.5H4.5c-.8 0-1.5-.7-1.5-1.5V6c0-.8.7-1.5 1.5-1.5zm14.3 2.1l3.7-2.7c.3-.2.5-.1.5.3v11.6c0 .4-.2.5-.5.3l-3.7-2.7V6.6z" />
                        </svg>
                    </div>

                    {/* Google Meet */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${platform === "google_meet" ? "bg-white ring-2 ring-green-400/50" : "bg-white/10"
                        }`}>
                        <svg viewBox="0 0 24 24" className={`w-6 h-6 ${platform === "google_meet" ? "" : "fill-white"}`}>
                            <path fill="#00832d" d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0z" />
                            <path fill="#0066da" d="M17.1 11.1l3.4-2.4c.2-.1.4 0 .4.3v6c0 .3-.2.4-.4.3l-3.4-2.4" />
                            <path fill="#e94235" d="M12 8c2.2 0 4 1.8 4 4s-1.8 4-4 4" />
                            <path fill="#2684fc" d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4" />
                            <path fill="#00ac47" d="M8 12c0-2.2 1.8-4 4-4v8c-2.2 0-4-1.8-4-4z" />
                        </svg>
                    </div>

                    {/* Microsoft Teams */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${platform === "teams" ? "bg-purple-600 ring-2 ring-purple-400/50" : "bg-white/10"
                        }`}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                            <path d="M19.2 6.4c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8-1.8.8-1.8 1.8.8 1.8 1.8 1.8zm-3.6 1.2h5.4c.6 0 1 .4 1 1v4.8c0 .6-.4 1-1 1h-1.2v4.2c0 .6-.4 1-1 1h-3.2v-11c0-.6.4-1 1-1zM8.4 5.2c1.4 0 2.6-1.2 2.6-2.6S9.8 0 8.4 0 5.8 1.2 5.8 2.6s1.2 2.6 2.6 2.6zM14 7.6H2.8c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h1.4v6c0 .6.4 1 1 1h6.4c.6 0 1-.4 1-1v-6H14c.6 0 1-.4 1-1v-7c0-.6-.4-1-1-1z" />
                        </svg>
                    </div>

                    {/* Webex */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">W</span>
                    </div>

                    {/* More */}
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-muted text-sm">
                        +2
                    </div>
                </div>
            </div>
        </div>
    );
}
