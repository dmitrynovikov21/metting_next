"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, Loader2, Plus, Clock, ChevronRight, Search
} from "lucide-react";

interface Recording {
    id: string;
    filename: string;
    status: string;
    created_at: string;
}

export default function MeetingsListPage() {
    const [meetings, setMeetings] = useState<Recording[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await fetch("/api/v1/recordings");
                if (response.ok) {
                    const data = await response.json();
                    setMeetings(data);
                }
            } catch (error) {
                console.error("Error fetching meetings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeetings();
    }, []);

    const filteredMeetings = meetings.filter(m =>
        m.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">All Meetings</h1>
                    <p className="text-muted-foreground text-sm">
                        {meetings.length} total recordings
                    </p>
                </div>
                <Link href="/dashboard">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <Plus className="w-4 h-4" /> New Meeting
                    </button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
            </div>

            {/* Meetings List */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : filteredMeetings.length === 0 ? (
                    <div className="text-center py-20 bg-card border border-border rounded-xl">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No meetings found</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredMeetings.map((meeting, index) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/dashboard/meetings/${meeting.id}`}>
                                    <div className="group bg-card border border-border p-4 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-muted rounded-lg">
                                                    <FileText className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                        {meeting.filename}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(meeting.created_at).toLocaleDateString("ru-RU", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric"
                                                            })}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${meeting.status === "completed"
                                                                ? "bg-green-500/20 text-green-500"
                                                                : meeting.status === "processing"
                                                                    ? "bg-yellow-500/20 text-yellow-500"
                                                                    : "bg-muted text-muted-foreground"
                                                            }`}>
                                                            {meeting.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
