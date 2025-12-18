import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface WaveformPlayerProps {
    audioUrl: string;
    onTimeUpdate?: (currentTime: number) => void;
    onEnded?: () => void;
}

export default function WaveformPlayer({ audioUrl, onTimeUpdate, onEnded }: WaveformPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [bars, setBars] = useState<number[]>([]);

    // Generate aesthetic bars for visualization
    useEffect(() => {
        // Create a mirrored pattern for a more "waveform-like" look
        const count = 50;
        const newBars = Array.from({ length: count }).map((_, i) => {
            // Use sine waves + noise for a nice shape
            const x = i / count;
            const base = Math.sin(x * Math.PI) * 0.5 + 0.3; // Arch shape
            const noise = Math.random() * 0.4;
            return Math.min(1, Math.max(0.2, base + noise));
        });
        setBars(newBars);
    }, []);

    useEffect(() => {
        if (audioRef.current) return;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration);
        });

        audio.addEventListener("timeupdate", () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
            onTimeUpdate?.(audio.currentTime);
        });

        audio.addEventListener("ended", () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            onEnded?.();
        });

        audio.addEventListener("error", (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
        });

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, [audioUrl, onTimeUpdate, onEnded]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const bounds = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const width = bounds.width;
            const percentage = Math.max(0, Math.min(1, x / width));
            const newTime = percentage * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(percentage * 100);
        }
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-lg">
            {/* Play Button */}
            <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(37,99,235,0.5)] group"
            >
                {isPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-current" />
                ) : (
                    <Play className="w-5 h-5 text-white fill-current ml-1" />
                )}
            </button>

            {/* Waveform Visualization */}
            <div
                className="flex-1 h-12 flex items-center gap-[3px] cursor-pointer group relative"
                onClick={handleSeek}
            >
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />

                {bars.map((height, i) => {
                    const isPlayed = (i / bars.length) * 100 <= progress;

                    return (
                        <motion.div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-150 ${isPlayed
                                ? "bg-gradient-to-t from-blue-500 to-cyan-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                : "bg-white/10 group-hover:bg-white/20"
                                }`}
                            style={{
                                height: isPlaying
                                    ? `${20 + (height * 80 * (0.8 + Math.random() * 0.4))}%`
                                    : `${20 + height * 60}%`,
                                minHeight: "4px"
                            }}
                            animate={isPlaying ? {
                                height: [
                                    `${20 + height * 60}%`,
                                    `${20 + height * 100}%`,
                                    `${20 + height * 60}%`
                                ]
                            } : {}}
                            transition={{
                                duration: 0.3,
                                repeat: isPlaying ? Infinity : 0,
                                delay: i * 0.01,
                                ease: "easeInOut"
                            }}
                        />
                    );
                })}
            </div>

            {/* Time */}
            <div className="text-xs font-medium text-white/50 font-mono w-12 text-right">
                {formatTime(currentTime)}
            </div>
        </div>
    );
}
