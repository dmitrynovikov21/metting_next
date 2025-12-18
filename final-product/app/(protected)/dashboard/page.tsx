"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UploadZone from "@/components/_my_ui/upload/UploadZone";
import BentoCard from "@/components/_my_ui/ui/BentoCard";
import CursorGlow from "@/components/_my_ui/ui/CursorGlow";
import AmbientBackground from "@/components/_my_ui/ui/AmbientBackground";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, ArrowRight, FileText, Loader2,
  Link as LinkIcon, Clock, Video, Calendar, Square
} from "lucide-react";
import Link from "next/link";

interface Recording {
  id: string;
  filename: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [meetingLink, setMeetingLink] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [meetings, setMeetings] = useState<Recording[]>([]);
  const [meetingsCount, setMeetingsCount] = useState(0);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  // Audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Days since registration (placeholder - would need to extend session type)
  const daysSinceRegistration = 1;

  // Fetch real meetings from API
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("/api/v1/recordings");
        if (response.ok) {
          const data = await response.json();
          setMeetings(data.slice(0, 3)); // Only show 3 recent
          setMeetingsCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, []);

  // Start/Stop recording
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" });

          // Upload the recording
          const formData = new FormData();
          formData.append("file", file);
          formData.append("duration", recordingTime.toString());
          formData.append("language", "ru");

          try {
            const response = await fetch("/api/v1/recordings", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              router.push(`/dashboard/processing?id=${data.recording_id}&name=${encodeURIComponent(file.name)}`);
            }
          } catch (error) {
            console.error("Error uploading recording:", error);
          }

          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          setRecordingTime(0);
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("Error starting recording:", error);
        alert("Не удалось получить доступ к микрофону");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleJoinMeeting = async () => {
    if (!meetingLink.trim()) return;

    // Detect platform
    let platform = "unknown";
    if (meetingLink.includes("zoom.us") || meetingLink.includes("zoom.com")) platform = "zoom";
    else if (meetingLink.includes("meet.google.com")) platform = "google_meet";
    else if (meetingLink.includes("teams.microsoft.com") || meetingLink.includes("teams.live.com")) platform = "teams";

    if (platform === "unknown") {
      alert("Неподдерживаемая платформа. Поддерживаются: Zoom, Google Meet, Teams");
      return;
    }

    try {
      const response = await fetch("/api/v1/recordings/join-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_url: meetingLink,
          platform: platform,
          bot_name: "Futurist AI Notetaker"
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ AI агент присоединяется к встрече!\n\nBot ID: ${data.bot_id}\nСтатус: ${data.status}`);
        setMeetingLink("");
      } else {
        const error = await response.json();
        alert(`❌ Ошибка: ${error.detail || "Не удалось отправить агента"}`);
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("❌ Ошибка подключения к серверу");
    }
  };

  return (
    <>
      <CursorGlow />
      <AmbientBackground />

      {/* Hero / Status Summary */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
          {/* Total meetings analyzed */}
          <span className="flex items-center gap-2 text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <FileText className="w-4 h-4 text-accent-primary" />
            <span className="font-bold">{meetingsCount}</span> meetings analyzed
          </span>
          {/* Days since registration */}
          <span className="flex items-center gap-2 text-white bg-gradient-to-r from-orange-500/20 to-red-500/20 px-3 py-1.5 rounded-full border border-orange-500/30">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="font-medium">{daysSinceRegistration} days with Futurist</span>
          </span>
        </div>
      </div>

      {/* Action Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Record Meeting Card */}
        <BentoCard className="relative overflow-hidden group cursor-pointer border-blue-500/30 hover:border-blue-500/60 md:col-span-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Animated Sphere */}
            <div className="flex justify-center py-6">
              <motion.div
                className="relative w-32 h-32"
                animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 blur-xl opacity-30 ${isRecording ? "animate-pulse" : ""}`} />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 shadow-lg"
                  style={{
                    boxShadow: isRecording
                      ? "0 0 60px rgba(59, 130, 246, 0.5), inset 0 -10px 30px rgba(0,0,0,0.3)"
                      : "0 0 30px rgba(59, 130, 246, 0.3), inset 0 -10px 30px rgba(0,0,0,0.3)"
                  }}
                />
                <div className="absolute top-3 left-6 w-8 h-8 rounded-full bg-white/30 blur-md" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {isRecording ? (
                    <Square className="w-8 h-8 text-white fill-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </div>
                <AnimatePresence>
                  {isRecording && (
                    <>
                      <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                      />
                      <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                      />
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">
                {isRecording ? formatTime(recordingTime) : "Record Meeting"}
              </h3>
              <p className="text-text-secondary mb-4 text-sm">
                {isRecording ? "Recording in progress..." : "Capture audio and generate protocol"}
              </p>
              <button
                onClick={toggleRecording}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
              >
                {isRecording ? (
                  <>Stop Recording</>
                ) : (
                  <>Start Recording <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </BentoCard>

        {/* Quick Upload Card */}
        <div className="md:col-span-1">
          <UploadZone />
        </div>

        {/* Join Meeting Card */}
        <BentoCard className="md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-glass-white-5 rounded-lg text-white">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Join Meeting</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Paste meeting link to send AI agent
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/... or meet.google.com/..."
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            <button
              onClick={handleJoinMeeting}
              disabled={!meetingLink.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Send Agent <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Supported platforms */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Supported platforms</p>
            <div className="flex items-center gap-3">
              {/* Zoom */}
              <div className="w-10 h-10 rounded-lg bg-[#2D8CFF] flex items-center justify-center" title="Zoom">
                <svg viewBox="0 0 512 512" className="w-6 h-6" fill="white">
                  <path d="M336 256c0-13.3 10.7-24 24-24h80c13.3 0 24 10.7 24 24v160c0 13.3-10.7 24-24 24h-80c-13.3 0-24-10.7-24-24V256zM48 176h224c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V224c0-26.5 21.5-48 48-48z" />
                  <path d="M336 256l112-80v160l-112-80z" />
                </svg>
              </div>
              {/* Google Meet */}
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden" title="Google Meet">
                <svg viewBox="0 0 87.5 72" className="w-7 h-7">
                  <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
                  <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z" />
                  <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
                  <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
                  <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.84.135 4.84-2.37V11c0-2.535-2.945-3.925-4.9-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z" />
                  <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z" />
                </svg>
              </div>
              {/* Teams */}
              <div className="w-10 h-10 rounded-lg bg-[#5059C9] flex items-center justify-center" title="Microsoft Teams">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              {/* More */}
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs border border-border" title="More coming">
                +2
              </div>
            </div>
          </div>
        </BentoCard>
      </div>

      {/* Recent Meetings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Recent Meetings
          </h2>
        </div>

        <div className="space-y-4">
          {isLoadingMeetings ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : meetings.length === 0 ? (
            <BentoCard className="!p-8 text-center">
              <p className="text-muted-foreground mb-2">No meetings yet</p>
              <p className="text-muted-foreground/60 text-sm">Upload a recording or start recording to see your meetings here</p>
            </BentoCard>
          ) : (
            meetings.map((meeting) => (
              <Link key={meeting.id} href={`/dashboard/meetings/${meeting.id}`}>
                <BentoCard className="!p-4 group cursor-pointer hover:border-primary/30 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                        {meeting.filename}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded uppercase text-[10px] tracking-wider">
                          {meeting.status === "completed" ? "Ready" : meeting.status}
                        </span>
                        <span>{new Date(meeting.created_at).toLocaleDateString("ru-RU")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {meeting.status === 'processing' ? (
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Processing
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                </BentoCard>
              </Link>
            ))
          )}
        </div>

        {/* View All Button */}
        <Link href="/dashboard/meetings" className="block">
          <button className="w-full py-4 bg-card border border-border rounded-2xl text-foreground font-medium hover:border-primary/50 hover:bg-muted transition-all flex items-center justify-center gap-2">
            Open All Meetings
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </>
  );
}
