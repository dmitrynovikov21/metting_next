"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileAudio, X, Loader2, Mic, Music, Video, ArrowUp, CheckCircle2, FileText, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BentoCard from "@/components/_my_ui/ui/BentoCard";

interface TranscriptResult {
    id: string;
    text?: string;
    tokens?: Array<{ text: string; start_ms: number; end_ms: number }>;
}

export default function UploadZone() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [recordingId, setRecordingId] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
    const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Poll for transcription status (only if not redirected to processing page)
    useEffect(() => {
        if (!recordingId || status !== "processing") return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/v1/recordings/${recordingId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "completed") {
                        setStatus("completed");
                        setTranscript(data.transcript);
                        clearInterval(pollInterval);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 2000);

        return () => clearInterval(pollInterval);
    }, [recordingId, status]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        if (selectedFile.type.startsWith("audio/") || selectedFile.type.startsWith("video/")) {
            setFile(selectedFile);
            setStatus("idle");
            setTranscript(null);
            setRecordingId(null);
        } else {
            alert("Please upload an audio or video file.");
        }
    };

    const uploadFile = async () => {
        if (!file) return;
        setUploading(true);
        setStatus("uploading");
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", "ru");

        try {
            // Use XMLHttpRequest for real progress tracking
            // Upload directly to port 8001 (upload server) for large files
            const xhr = new XMLHttpRequest();

            const uploadPromise = new Promise<{ recording_id: string }>((resolve, reject) => {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setProgress(percent);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Network error"));
                xhr.ontimeout = () => reject(new Error("Upload timeout"));

                // Upload directly to backend to bypass Next.js proxy limits
                xhr.open("POST", "http://localhost:8000/api/v1/recordings");
                xhr.timeout = 600000; // 10 minutes for large files
                xhr.send(formData);
            });

            const data = await uploadPromise;
            setProgress(100);
            setRecordingId(data.recording_id);

            // Redirect to processing page
            router.push(`/dashboard/processing?id=${data.recording_id}&name=${encodeURIComponent(file.name)}`);

        } catch (error: any) {
            console.error("Upload error:", error);
            setStatus("error");
            alert(`Upload failed: ${error.message}. Please check if the backend is running on port 8000.`);
            setUploading(false);
        }
    };

    const copyTranscript = () => {
        if (transcript?.text) {
            navigator.clipboard.writeText(transcript.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setStatus("idle");
        setTranscript(null);
        setRecordingId(null);
        setProgress(0);
    };

    return (
        <BentoCard className={`
      relative overflow-hidden transition-all duration-300
      ${isDragging ? 'border-accent-primary bg-accent-primary/5' : ''}
    `}>
            <div
                className="h-full flex flex-col justify-between"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="audio/*,video/*"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                />

                {!file ? (
                    <>
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-bg-elevated rounded-xl text-white border border-glass-border">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                                {[Mic, Music, Video].map((Icon, i) => (
                                    <div key={i} className="p-1.5 rounded-lg bg-glass-white-5 text-text-muted">
                                        <Icon className="w-3 h-3" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">Upload File</h3>
                            <p className="text-text-secondary mb-6 text-sm">Drag & drop audio/video or click to browse.</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-ghost w-full flex items-center justify-center gap-2 border-dashed"
                            >
                                Select File <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Drag Overlay - Breathing Animation */}
                        <AnimatePresence>
                            {isDragging && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{
                                        opacity: 1,
                                        scale: [1, 1.02, 1],
                                    }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            ease: "easeInOut"
                                        }
                                    }}
                                    className="absolute inset-0 z-20 rounded-[28px] overflow-hidden"
                                >
                                    {/* Gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-accent-primary/20 to-purple-500/20" />

                                    {/* Pulsing border */}
                                    <motion.div
                                        className="absolute inset-0 rounded-[28px] border-2 border-accent-primary"
                                        animate={{
                                            boxShadow: [
                                                "0 0 20px rgba(59, 130, 246, 0.3)",
                                                "0 0 40px rgba(59, 130, 246, 0.5)",
                                                "0 0 20px rgba(59, 130, 246, 0.3)"
                                            ]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
                                        <motion.div
                                            animate={{ y: [0, -8, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-16 h-16 rounded-2xl bg-accent-primary/20 border border-accent-primary/50 flex items-center justify-center mb-4"
                                        >
                                            <Upload className="w-8 h-8 text-accent-primary" />
                                        </motion.div>
                                        <p className="text-accent-primary font-bold text-xl">Drop to upload</p>
                                        <p className="text-text-secondary text-sm mt-1">Audio or video file</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : status === "completed" && transcript ? (
                    /* Completed - Show Transcript */
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-sm">Transcription Complete</h4>
                                    <p className="text-xs text-text-secondary">{file.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={copyTranscript}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-secondary hover:text-white"
                                title="Copy transcript"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto bg-bg-elevated rounded-xl p-4 border border-glass-border">
                            <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                                {transcript.text || "No text content"}
                            </p>
                        </div>

                        <button
                            onClick={resetUpload}
                            className="mt-4 btn-ghost w-full text-sm"
                        >
                            Upload Another File
                        </button>
                    </div>
                ) : (
                    /* File Selected - Ready to Upload or Processing */
                    <div className="h-full flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status === "processing"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-accent-primary/20 text-accent-primary"
                                }`}>
                                {status === "processing" ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <FileAudio className="w-6 h-6" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium truncate">{file.name}</h4>
                                <p className="text-xs text-text-secondary">
                                    {status === "processing" ? "Transcribing..." : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                                </p>
                            </div>
                            {status === "idle" && (
                                <button onClick={resetUpload} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-4 h-4 text-text-secondary" />
                                </button>
                            )}
                        </div>

                        {uploading || status === "processing" ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-accent-primary">
                                    <span>{status === "processing" ? "Transcribing..." : "Uploading..."}</span>
                                    {uploading && <span>{progress}%</span>}
                                </div>
                                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: status === "processing" ? "100%" : `${progress}%` }}
                                        transition={status === "processing" ? { repeat: Infinity, duration: 2 } : undefined}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={uploadFile}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                Process Recording <ArrowUp className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </BentoCard>
    );
}
