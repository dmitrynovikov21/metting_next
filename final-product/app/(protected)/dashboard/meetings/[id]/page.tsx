"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    Users,
    FileText,
    Brain,
    CheckCircle2,
    ListTodo,
    Download,
    FileDown,
    Search,
    Bell,
    User,
    ChevronDown,
    Share2,
    Send,
    MoreHorizontal,
    RefreshCw,
    Play,
    Pause,
    Calendar,
    Pencil,
    Plus,
    X,
    Sparkles,
    Zap,
    Target,
    AlertTriangle,
    TrendingUp,
    Quote,
    Flag,
    Layout,
    Hash,
    Copy,
    Edit3,
    Check,
    ArrowRight,
    RotateCcw, // Added
    ChevronRight, // Added
    Wand2 // Added
} from "lucide-react";
import { TemplateSelector, TEMPLATES } from "@/components/_my_ui/meeting/TemplateSelector"; // Added
import { ProtocolConstructor } from "@/components/_my_ui/meeting/ProtocolConstructor"; // Added
import WaveformPlayer from "@/components/_my_ui/meeting/WaveformPlayer";
import AppleIntelligenceLoader from "@/components/_my_ui/ui/AppleIntelligenceLoader";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface PageProps {
    params: Promise<{ id: string }>;
}

interface TranscriptData {
    id: string;
    text?: string;
    tokens?: Array<{
        text: string;
        start_ms: number;
        end_ms: number;
    }>;
    filename?: string;
}

interface Participant {
    name: string;
    role: string;
    avatar?: string;
}

interface ActionItem {
    id: string;
    text: string;
    owner: string;
    due: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
    inSidebar?: boolean;
}

interface Insight {
    type: "decision" | "risk" | "idea";
    text: string;
    icon: any;
    color: string;
}

interface AgendaSubtopic {
    title: string;
    detail: string;
}

interface AgendaTopic {
    id: string;
    title: string;
    subtopics: AgendaSubtopic[];
}

interface ProtocolBlock {
    title: string;
    level1_management?: {
        status?: string;
        key_results?: string[];
        key_problems?: string[];
        decisions?: string[];
    };
    level2_operations?: {
        done?: string[];
        not_done?: string[];
        bottlenecks?: string[];
        blockers?: string[]; // Added
        conflicts?: string[];
        dependencies?: string[];
    };
    tasks?: Array<{
        text: string;
        owner: string;
        deadline: string;
        kpi?: string;
    }>;
    risks?: Array<{
        text: string;
        probability?: string;
        consequence?: string;
        controller?: string;
        owner?: string; // Added
    }>;
    growth_points?: string[]; // Added
}

interface FinalSummary {
    top_decisions: string[];
    top_blockers: string[];
    growth_points: string[];
    attention_before_next: string[];
    kpis_to_change: string[];
}

interface MeetingHeader {
    number: string;
    date: string;
    participants: string[];
    duration: string;
    goal: string;
}

const MEETING_TYPES = [
    { id: "internal", label: "INTERNAL", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    { id: "client", label: "CLIENT", color: "bg-green-500/20 text-green-400 border-green-500/30" },
    { id: "strategy", label: "STRATEGY", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    { id: "partner", label: "PARTNER", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    { id: "interview", label: "INTERVIEW", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
];

export default function MeetingPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();

    // State
    const [transcript, setTranscript] = useState<TranscriptData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"transcript" | "summary" | "protocol">("transcript");
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showTypeMenu, setShowTypeMenu] = useState(false);
    const [meetingType, setMeetingType] = useState(MEETING_TYPES[2]); // Default to Strategy
    const [isRegenerating, setIsRegenerating] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);
    const typeMenuRef = useRef<HTMLDivElement>(null);

    // Audio state
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);

    // Participants state
    const [participants, setParticipants] = useState<Participant[]>([
        { name: "Denis", role: "CEO" },
        { name: "Alex", role: "Advisor" }
    ]);
    const [showParticipantForm, setShowParticipantForm] = useState(false);
    const [newParticipant, setNewParticipant] = useState({ name: "", role: "" });

    // AI Analysis state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [analysisPhase, setAnalysisPhase] = useState(0);

    // Data populated after analysis
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [summaryText, setSummaryText] = useState("");
    const [keyDecisions, setKeyDecisions] = useState<string[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);

    // Protocol specific state
    const [agendaTopics, setAgendaTopics] = useState<AgendaTopic[]>([]);
    const [protocolBlocks, setProtocolBlocks] = useState<ProtocolBlock[]>([]);
    const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);
    const [meetingHeader, setMeetingHeader] = useState<MeetingHeader | null>(null);

    // Collapsible sections state
    const [expandedIdeas, setExpandedIdeas] = useState(false);
    const [expandedRisks, setExpandedRisks] = useState(false);
    const [expandedDecisions, setExpandedDecisions] = useState(true);

    // Protocol Constructor State
    const [constructorMode, setConstructorMode] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    // Text Interaction State
    const [isEditingText, setIsEditingText] = useState(false);
    const [editableText, setEditableText] = useState("");
    const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Generate meeting title with date/time format
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).replace(/\//g, ".");
    const formattedTime = currentDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });

    // Smart Title Logic
    const displayTitle = transcript?.filename && !transcript.filename.includes("_transcript.json")
        ? transcript.filename
        : `[${formattedDate}] [${formattedTime}] - Strategy Session`;

    useEffect(() => {
        const fetchTranscript = async () => {
            try {
                const response = await fetch(`/api/v1/recordings/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setTranscript(data.transcript);
                }

                // Try to load saved analysis
                try {
                    const analysisResponse = await fetch(`/api/v1/recordings/${id}/analysis`);
                    if (analysisResponse.ok) {
                        const analysis = await analysisResponse.json();

                        // Populate state from saved analysis
                        if (analysis.summary) setSummaryText(analysis.summary);
                        if (analysis.key_decisions) setKeyDecisions(analysis.key_decisions);

                        // Map action items
                        if (analysis.action_items) {
                            const mappedActions = analysis.action_items.map((item: any, idx: number) => ({
                                id: String(idx + 1),
                                text: item.text,
                                owner: item.owner || "Team",
                                due: item.due || "This Week",
                                completed: false,
                                priority: (item.priority || "medium") as "high" | "medium" | "low"
                            }));
                            setActionItems(mappedActions);
                        }

                        // Map insights with icons
                        if (analysis.insights) {
                            const insightIcons: Record<string, any> = {
                                decision: CheckCircle2,
                                risk: AlertTriangle,
                                idea: Zap
                            };
                            const insightColors: Record<string, string> = {
                                decision: "text-green-400",
                                risk: "text-yellow-400",
                                idea: "text-purple-400"
                            };
                            const mappedInsights = analysis.insights.map((item: any) => ({
                                type: item.type,
                                text: item.text,
                                icon: insightIcons[item.type] || Target,
                                color: insightColors[item.type] || "text-blue-400"
                            }));
                            setInsights(mappedInsights);
                        }

                        // Map new protocol structure
                        if (analysis.blocks) {
                            setProtocolBlocks(analysis.blocks);
                        }
                        if (analysis.final_summary) {
                            setFinalSummary(analysis.final_summary);
                        }
                        if (analysis.meeting_header) {
                            setMeetingHeader(analysis.meeting_header);
                        }

                        // --- PROTOCOL GENERATION ---
                        const handleGenerateProtocol = async (blocks: any[]) => {
                            setIsAnalyzing(true);
                            setAnalysisPhase(0);
                            setConstructorMode(false);

                            // Start analysis animation
                            const phaseInterval = setInterval(() => {
                                setAnalysisPhase(prev => (prev + 1) % analysisPhases.length);
                            }, 3000);

                            try {
                                // Call backend with selected blocks
                                const response = await fetch(`/api/v1/recordings/${id}/analyze`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        language: "ru",
                                        blocks: blocks // Sending blocks to backend
                                    })
                                });
                                if (response.ok) {
                                    // Poll for completion
                                    const pollInterval = setInterval(async () => {
                                        const statusRes = await fetch(`/api/v1/recordings/${id}`);
                                        if (statusRes.ok) {
                                            const data = await statusRes.json();
                                            if (data.status === "completed") {
                                                clearInterval(pollInterval);
                                                clearInterval(phaseInterval);
                                                setIsAnalyzed(true);
                                                // Reload page to fetch new analysis
                                                window.location.reload();
                                            }
                                        }
                                    }, 2000);
                                }
                            } catch (error) {
                                console.error("Failed to generate protocol:", error);
                                clearInterval(phaseInterval);
                                setIsAnalyzing(false);
                            }
                        };
                        // --- POPULATE SUMMARY TAB DATA FROM PROTOCOL BLOCKS ---
                        if (analysis.blocks && analysis.blocks.length > 0) {
                            // 1. Extract Decisions
                            const allDecisions: string[] = [];
                            analysis.blocks.forEach((block: any) => {
                                if (block.level1_management?.decisions) {
                                    allDecisions.push(...block.level1_management.decisions);
                                }
                            });
                            if (analysis.final_summary?.top_decisions) {
                                allDecisions.push(...analysis.final_summary.top_decisions);
                            }
                            // Deduplicate and set
                            setKeyDecisions(Array.from(new Set(allDecisions)));

                            // 2. Extract Insights (Risks & Ideas)
                            const newInsights: Insight[] = [];

                            // Risks from blocks
                            analysis.blocks.forEach((block: any) => {
                                if (block.risks) {
                                    block.risks.forEach((risk: any) => {
                                        newInsights.push({
                                            type: "risk",
                                            text: risk.text,
                                            icon: AlertTriangle,
                                            color: "text-red-400"
                                        });
                                    });
                                }
                            });

                            // Growth points as Ideas from final summary
                            if (analysis.final_summary?.growth_points) {
                                analysis.final_summary.growth_points.forEach((point: string) => {
                                    newInsights.push({
                                        type: "idea",
                                        text: point,
                                        icon: Sparkles,
                                        color: "text-purple-400"
                                    });
                                });
                            }
                            setInsights(newInsights);

                            // 3. Extract Action Items
                            const newActionItems: ActionItem[] = [];
                            analysis.blocks.forEach((block: any) => {
                                if (block.tasks) {
                                    block.tasks.forEach((task: any, index: number) => {
                                        newActionItems.push({
                                            id: `task-${Date.now()}-${Math.random()}`,
                                            text: task.text,
                                            owner: task.owner || "Unassigned",
                                            due: task.deadline || "No date",
                                            completed: false,
                                            priority: "medium",
                                            inSidebar: true
                                        });
                                    });
                                }
                            });
                            setActionItems(newActionItems);

                            // 4. Generate Agenda Topics from Blocks
                            let newAgendaTopics: AgendaTopic[] = [];

                            if (analysis.blocks && analysis.blocks.length > 0) {
                                newAgendaTopics = analysis.blocks.map((block: any, index: number) => ({
                                    id: `topic-${index}`,
                                    title: block.title,
                                    subtopics: block.level1_management?.key_results?.map((result: string) => ({
                                        title: "Key Result",
                                        detail: result
                                    })) || []
                                }));
                            }

                            // Fallback if no blocks found but we have summary/decisions
                            if (newAgendaTopics.length === 0 && (analysis.summary || analysis.final_summary)) {
                                const fallbackSubtopics: AgendaSubtopic[] = [];

                                if (analysis.summary) {
                                    fallbackSubtopics.push({
                                        title: "Executive Summary",
                                        detail: analysis.summary
                                    });
                                }

                                if (analysis.final_summary?.top_decisions && analysis.final_summary.top_decisions.length > 0) {
                                    fallbackSubtopics.push({
                                        title: "Key Decisions",
                                        detail: analysis.final_summary.top_decisions.join(". ")
                                    });
                                }

                                if (fallbackSubtopics.length > 0) {
                                    newAgendaTopics.push({
                                        id: "fallback-topic",
                                        title: "Meeting Overview",
                                        subtopics: fallbackSubtopics
                                    });
                                }
                            }

                            setAgendaTopics(newAgendaTopics);
                        }

                        // Mark as analyzed if we have data
                        if (analysis.summary) {
                            setIsAnalyzed(true);
                        }
                    }
                } catch (e) {
                    // Mock Agenda Topics for demonstration
                    setAgendaTopics([
                        {
                            id: "1",
                            title: "Marketing Strategy",
                            subtopics: [
                                { title: "1.1. Q4 Digital Campaign", detail: "Focus on Instagram and LinkedIn ads with a budget of $50k. Target audience: SMB owners." },
                                { title: "1.2. Influencer Partnerships", detail: "Collaborate with 5 key tech influencers to review the new features." }
                            ]
                        },
                        {
                            id: "2",
                            title: "Financial Review",
                            subtopics: [
                                { title: "2.1. Q3 Results", detail: "Revenue up by 15% QoQ. Operating expenses within budget." },
                                { title: "2.2. Budget Planning", detail: "Allocating resources for the new R&D team expansion in Q1." }
                            ]
                        }
                    ]);

                    setIsAnalyzed(true);
                    setAnalysisPhase(3);
                    setIsAnalyzing(false);
                }

            } catch (error) {
                console.error("Error fetching transcript:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranscript();
    }, [id]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setShowExportMenu(false);
            }
            if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
                setShowTypeMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Audio playback handled by WaveformPlayer

    const updateActionItem = (id: string, field: keyof ActionItem, value: any) => {
        setActionItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleExport = async (format: string) => {
        const text = transcript?.text || "";
        const title = `Meeting Protocol - ${formattedDate}`;
        const filename = `meeting-${id}`;

        try {
            switch (format) {
                case "pdf": {
                    const pdf = new jsPDF();

                    // Load Cyrillic font
                    let fontLoaded = false;
                    try {
                        const fontResponse = await fetch('/fonts/Roboto-Regular.ttf');
                        if (fontResponse.ok) {
                            const fontBlob = await fontResponse.blob();
                            const fontBase64 = await new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(fontBlob);
                            });

                            const base64data = fontBase64.split(',')[1];
                            pdf.addFileToVFS("Roboto-Regular.ttf", base64data);
                            pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
                            pdf.setFont("Roboto");
                            fontLoaded = true;
                        } else {
                            console.error("Font file not found");
                            pdf.setFont("helvetica");
                        }
                    } catch (e) {
                        console.error("Failed to load font:", e);
                        pdf.setFont("helvetica");
                    }

                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const margin = 20;
                    const maxWidth = pageWidth - margin * 2;

                    // Title
                    pdf.setFontSize(18);
                    if (fontLoaded) {
                        pdf.setFont("Roboto", "normal");
                    } else {
                        pdf.setFont("helvetica", "bold");
                    }
                    pdf.text(title, margin, 25);

                    // Summary if available
                    let yPos = 40;
                    if (summaryText) {
                        pdf.setFontSize(14);
                        pdf.text("Summary", margin, yPos);
                        yPos += 8;
                        pdf.setFontSize(12); // Slightly smaller for body
                        const summaryLines = pdf.splitTextToSize(summaryText, maxWidth);
                        pdf.text(summaryLines, margin, yPos);
                        yPos += summaryLines.length * 6 + 10;
                    }

                    // Transcript
                    pdf.setFontSize(14);
                    pdf.text("Transcript", margin, yPos);
                    yPos += 8;
                    pdf.setFontSize(12);
                    const textLines = pdf.splitTextToSize(text, maxWidth);

                    // Handle pagination
                    const lineHeight = 6;
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    for (let i = 0; i < textLines.length; i++) {
                        if (yPos > pageHeight - margin) {
                            pdf.addPage();
                            yPos = margin;
                        }
                        pdf.text(textLines[i], margin, yPos);
                        yPos += lineHeight;
                    }

                    pdf.save(`${filename}.pdf`);
                    break;
                }

                case "docx": {
                    const children: Paragraph[] = [
                        new Paragraph({
                            text: title,
                            heading: HeadingLevel.TITLE,
                            spacing: { after: 400 }
                        })
                    ];

                    // Summary
                    if (summaryText) {
                        children.push(
                            new Paragraph({
                                text: "Summary",
                                heading: HeadingLevel.HEADING_1,
                                spacing: { before: 400, after: 200 }
                            }),
                            new Paragraph({
                                children: [new TextRun({ text: summaryText, size: 28 })],
                                spacing: { after: 400 }
                            })
                        );
                    }

                    // Transcript
                    children.push(
                        new Paragraph({
                            text: "Transcript",
                            heading: HeadingLevel.HEADING_1,
                            spacing: { before: 400, after: 200 }
                        })
                    );

                    // Split text into paragraphs
                    const paragraphs = text.split("\n").filter(p => p.trim());
                    paragraphs.forEach(para => {
                        children.push(
                            new Paragraph({
                                children: [new TextRun({ text: para, size: 28 })], // 28 half-points = 14pt
                                spacing: { after: 200 }
                            })
                        );
                    });

                    const doc = new Document({
                        sections: [{ properties: {}, children }]
                    });

                    const blob = await Packer.toBlob(doc);
                    saveAs(blob, `${filename}.docx`);
                    break;
                }

                case "txt": {
                    let content = `${title}\n${'='.repeat(title.length)}\n\n`;
                    if (summaryText) {
                        content += `SUMMARY\n${'-'.repeat(7)}\n${summaryText}\n\n`;
                    }
                    content += `TRANSCRIPT\n${'-'.repeat(10)}\n${text}`;

                    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                    saveAs(blob, `${filename}.txt`);
                    break;
                }

                case "json": {
                    const jsonData = {
                        id: id,
                        title: title,
                        date: formattedDate,
                        participants: participants.map(p => p.name),
                        summary: summaryText,
                        transcript: text,
                        key_decisions: keyDecisions,
                        action_items: actionItems.map(a => ({
                            text: a.text,
                            owner: a.owner,
                            priority: a.priority
                        })),
                        protocol_blocks: protocolBlocks
                    };

                    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
                    saveAs(blob, `${filename}.json`);
                    break;
                }

                default: {
                    // Fallback to markdown
                    let content = `# ${title}\n\n`;
                    if (summaryText) {
                        content += `## Summary\n\n${summaryText}\n\n`;
                    }
                    content += `## Transcript\n\n${text}`;

                    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
                    saveAs(blob, `${filename}.md`);
                }
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Export failed. Please try again.");
        }

        setShowExportMenu(false);
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsRegenerating(false);
    };

    const handleTypeChange = (type: typeof MEETING_TYPES[0]) => {
        setMeetingType(type);
        setShowTypeMenu(false);
        handleRegenerate();
    };

    // Add participant
    const addParticipant = () => {
        if (newParticipant.name.trim()) {
            setParticipants([...participants, { ...newParticipant }]);
            setNewParticipant({ name: "", role: "" });
            setShowParticipantForm(false);
        }
    };

    const removeParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleCopyText = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Premium AI Analysis - Uses Real Backend
    const startAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisPhase(0);

        const phases = [
            "Загрузка транскрипции...",
            "Анализ контекста...",
            "Извлечение ключевых решений...",
            "Формирование задач...",
            "Генерация протокола..."
        ];

        // Show progress phases
        for (let i = 0; i < phases.length; i++) {
            setAnalysisPhase(i);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        try {
            // Call real AI analysis endpoint
            const response = await fetch(`/api/v1/recordings/${id}/analyze`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const analysis = await response.json();

            // Set real data from AI
            setSummaryText(analysis.summary || "Анализ недоступен");
            setKeyDecisions(analysis.key_decisions || []);

            // Map action items with proper structure
            const mappedActions = (analysis.action_items || []).map((item: any, idx: number) => ({
                id: String(idx + 1),
                text: item.text,
                owner: item.owner || "Team",
                due: item.due || "This Week",
                completed: false,
                priority: (item.priority || "medium") as "high" | "medium" | "low"
            }));
            setActionItems(mappedActions);

            // Map insights with icons
            const insightIcons: Record<string, any> = {
                decision: CheckCircle2,
                risk: AlertTriangle,
                idea: Zap
            };
            const insightColors: Record<string, string> = {
                decision: "text-green-400",
                risk: "text-yellow-400",
                idea: "text-purple-400"
            };
            const mappedInsights = (analysis.insights || []).map((item: any) => ({
                type: item.type,
                text: item.text,
                icon: insightIcons[item.type] || Target,
                color: insightColors[item.type] || "text-blue-400"
            }));
            setInsights(mappedInsights);

        } catch (error) {
            console.error("AI analysis error:", error);
            // Fallback to transcript-based summary if AI fails
            setSummaryText("Не удалось выполнить AI анализ. Пожалуйста, попробуйте еще раз.");
            setKeyDecisions([]);
            setActionItems([]);
            setInsights([]);
        }

        setIsAnalyzing(false);
        setIsAnalyzed(true);
    };

    const toggleActionItem = (itemId: string) => {
        setActionItems(items =>
            items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );
    };

    const exportOptions = [
        { id: "pdf", label: "PDF Document", icon: FileDown, desc: "Formatted protocol (14pt)" },
        { id: "docx", label: "Word Document", icon: FileText, desc: "Editable .docx (14pt)" },
        { id: "txt", label: "Plain Text", icon: FileDown, desc: "Raw transcript" },
        { id: "json", label: "JSON Data", icon: FileDown, desc: "Structured data" },
    ];

    const tabs = [
        { id: "transcript", label: "TRANSCRIPT", icon: Users },
        { id: "summary", label: "SUMMARY", icon: Brain },
        { id: "protocol", label: "PROTOCOL", icon: FileText },
    ] as const;

    const analysisPhases = [
        "Transcribing audio...",
        "Identifying speakers...",
        "Extracting key points...",
        "Analyzing decisions...",
        "Generating action items...",
        "Compiling protocol..."
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* AI Analysis Animation - Premium Fullscreen Loader */}
            <AnimatePresence>
                {isAnalyzing && (
                    <AppleIntelligenceLoader
                        phase={analysisPhases[analysisPhase]}
                        subtext="Analyzing meeting data"
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <div className="glass-elevated rounded-full p-2 flex items-center gap-2 pointer-events-auto">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-glass-white-5 transition-colors group">
                        <span className="font-display font-bold text-lg tracking-tight text-white hidden md:flex items-center gap-1">
                            Futurist <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded leading-none">OS</span>
                        </span>
                    </Link>

                    <div className="w-px h-6 bg-glass-border mx-2" />

                    <nav className="flex items-center gap-1">
                        {[
                            { name: "Dashboard", href: "/dashboard" },
                            { name: "Meetings", href: "/meetings", active: true },
                            { name: "Protocols", href: "/insights" }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${item.active
                                    ? "text-white bg-glass-white-8"
                                    : "text-text-secondary hover:text-white hover:bg-glass-white-8"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="w-px h-6 bg-glass-border mx-2" />

                    <div className="flex items-center gap-2 pr-2">
                        <button className="p-2 text-text-secondary hover:text-white hover:bg-glass-white-8 rounded-full transition-colors relative group">
                            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-2 text-text-secondary hover:text-white hover:bg-glass-white-8 rounded-full transition-colors relative group">
                            <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-primary rounded-full shadow-glow-primary" />
                        </button>
                        <button className="w-9 h-9 rounded-full bg-glass-white-5 border border-glass-border flex items-center justify-center hover:border-accent-primary/50 transition-colors ml-2">
                            <User className="w-4 h-4 text-text-secondary" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 pt-32 pb-12">
                {/* Back + Actions Row */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Meetings
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="btn-ghost flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="btn-primary flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Send to Team
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* Meeting Header */}
                <div className="mb-8">
                    {/* Type badge + Date */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative" ref={typeMenuRef}>
                            <button
                                onClick={() => setShowTypeMenu(!showTypeMenu)}
                                className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${meetingType.color}`}
                            >
                                {meetingType.label}
                                <Pencil className="w-3 h-3 opacity-50" />
                            </button>

                            <AnimatePresence>
                                {showTypeMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-glass-border rounded-xl shadow-2xl overflow-hidden z-[100]"
                                    >
                                        <div className="p-1">
                                            {MEETING_TYPES.map((type) => (
                                                <button
                                                    key={type.id}
                                                    onClick={() => handleTypeChange(type)}
                                                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition-colors ${meetingType.id === type.id
                                                        ? type.color
                                                        : "text-text-secondary hover:text-white hover:bg-white/10"
                                                        }`}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                            <Clock className="w-4 h-4" />
                            {formattedTime}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                        {displayTitle}
                    </h1>

                    {/* Participants */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {participants.map((p, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 bg-glass-white-5 rounded-full text-sm text-white border border-glass-border flex items-center gap-2 group"
                            >
                                {p.name}
                                {p.role && <span className="text-text-muted text-xs">({p.role})</span>}
                                <button
                                    onClick={() => removeParticipant(i)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3 text-text-muted hover:text-white" />
                                </button>
                            </span>
                        ))}

                        <div className="relative">
                            <button
                                onClick={() => setShowParticipantForm(!showParticipantForm)}
                                className="px-3 py-1 border border-dashed border-glass-border rounded-full text-sm text-text-secondary hover:text-white hover:border-white/30 transition-colors flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Participant
                            </button>

                            <AnimatePresence>
                                {showParticipantForm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.96 }}
                                        className="absolute left-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-glass-border rounded-xl shadow-2xl p-4 z-50"
                                    >
                                        <input
                                            type="text"
                                            value={newParticipant.name}
                                            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                                            placeholder="Name"
                                            className="w-full px-3 py-2 bg-bg-elevated border border-glass-border rounded-lg text-white placeholder:text-text-muted text-sm mb-2 focus:border-accent-primary focus:outline-none"
                                        />
                                        <input
                                            type="text"
                                            value={newParticipant.role}
                                            onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
                                            placeholder="Role (e.g. CEO, Designer)"
                                            className="w-full px-3 py-2 bg-bg-elevated border border-glass-border rounded-lg text-white placeholder:text-text-muted text-sm mb-3 focus:border-accent-primary focus:outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowParticipantForm(false)}
                                                className="flex-1 py-2 text-sm text-text-secondary hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={addParticipant}
                                                className="flex-1 py-2 bg-accent-primary text-white text-sm rounded-lg hover:bg-accent-primary/80 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="mb-8">
                    <WaveformPlayer audioUrl={`/api/v1/recordings/${id}/audio`} />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="col-span-2">
                        {/* Tabs */}
                        <div className="flex items-center gap-6 mb-6 border-b border-glass-border">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab.id
                                        ? "text-accent-primary"
                                        : "text-text-secondary hover:text-white"
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary"
                                        />
                                    )}
                                </button>
                            ))}

                            <div className="ml-auto flex items-center gap-3 pb-3">
                                {activeTab !== "transcript" && (
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={isRegenerating}
                                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                                        {isRegenerating ? "Regenerating..." : "Regenerate"}
                                    </button>
                                )}

                                <div className="relative" ref={exportMenuRef}>
                                    <button
                                        onClick={() => setShowExportMenu(!showExportMenu)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary hover:bg-accent-primary/80 text-white text-xs font-medium rounded-lg transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Export
                                        <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showExportMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-glass-border rounded-xl shadow-2xl overflow-hidden z-[100]"
                                            >
                                                <div className="p-1.5">
                                                    {exportOptions.map((option) => (
                                                        <button
                                                            key={option.id}
                                                            onClick={() => handleExport(option.id)}
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
                                                        >
                                                            <option.icon className="w-4 h-4 text-text-muted" />
                                                            <div>
                                                                <p className="text-sm text-white">{option.label}</p>
                                                                <p className="text-xs text-text-muted">{option.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-bg-card border border-glass-border rounded-2xl p-6 relative min-h-[400px]"
                        >
                            {activeTab === "transcript" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white">Transcript</h3>
                                        <button
                                            onClick={() => {
                                                setIsEditingText(!isEditingText);
                                                if (!isEditingText) setEditableText(transcript?.text || "");
                                            }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isEditingText ? "bg-accent-primary text-white" : "text-text-secondary hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            {isEditingText ? "Save Changes" : "Edit Text"}
                                        </button>
                                    </div>

                                    {isEditingText ? (
                                        <textarea
                                            value={editableText}
                                            onChange={(e) => setEditableText(e.target.value)}
                                            className="w-full h-[500px] bg-bg-elevated border border-glass-border rounded-xl p-4 text-text-secondary font-mono text-sm focus:border-accent-primary focus:outline-none resize-none"
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {(transcript?.text || "").split("\n\n").map((paragraph, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group rounded-xl transition-all duration-300 hover:bg-white/5 p-4 -mx-4 cursor-pointer"
                                                    onMouseEnter={() => setHoveredParagraph(idx)}
                                                    onMouseLeave={() => setHoveredParagraph(null)}
                                                    onClick={() => handleCopyText(paragraph, idx)}
                                                >
                                                    <p className={`text-text-secondary leading-relaxed transition-all duration-300 ${hoveredParagraph === idx ? "text-white blur-[1px]" : ""
                                                        }`}>
                                                        {paragraph}
                                                    </p>

                                                    {hoveredParagraph === idx && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-2xl"
                                                            >
                                                                {copiedIndex === idx ? (
                                                                    <Check className="w-6 h-6 text-green-400" />
                                                                ) : (
                                                                    <Copy className="w-6 h-6" />
                                                                )}
                                                            </motion.div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === "summary" || activeTab === "protocol") && (
                                <>
                                    {!isAnalyzed ? (
                                        /* Premium Analyze Button */
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            {/* Subtle background pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5 rounded-2xl" />

                                            {/* Floating icons */}
                                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                                {[Brain, Zap, Target, Sparkles].map((Icon, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="absolute text-white/5"
                                                        style={{
                                                            left: `${20 + i * 20}%`,
                                                            top: `${30 + (i % 2) * 40}%`,
                                                        }}
                                                        animate={{
                                                            y: [0, -20, 0],
                                                            opacity: [0.05, 0.1, 0.05],
                                                        }}
                                                        transition={{
                                                            duration: 3,
                                                            repeat: Infinity,
                                                            delay: i * 0.5,
                                                        }}
                                                    >
                                                        <Icon className="w-16 h-16" />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="relative z-10">
                                                {/* Premium Button */}
                                                <motion.button
                                                    onClick={startAnalysis}
                                                    className="group relative"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {/* Animated border gradient */}
                                                    <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-75 blur-sm group-hover:opacity-100 transition-opacity"
                                                        style={{ backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }}
                                                    />
                                                    <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                                                        style={{ backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }}
                                                    />

                                                    {/* Button content */}
                                                    <div className="relative px-12 py-6 rounded-2xl bg-[#0a0a15] flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                                            <Brain className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xl font-bold text-white mb-0.5">
                                                                Analyze with AI
                                                            </p>
                                                            <p className="text-sm text-white/50">
                                                                Extract insights, decisions & tasks
                                                            </p>
                                                        </div>
                                                        <motion.div
                                                            animate={{ x: [0, 4, 0] }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                        >
                                                            <Sparkles className="w-5 h-5 text-purple-400 ml-4" />
                                                        </motion.div>
                                                    </div>
                                                </motion.button>

                                                <p className="text-center text-text-muted text-sm mt-6">
                                                    Powered by Futurist AI
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Content after analysis */
                                        <>
                                            {activeTab === "summary" && (
                                                <motion.div
                                                    className="space-y-4"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    {/* Executive Summary Card */}
                                                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
                                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                            <Brain className="w-5 h-5 text-purple-400" />
                                                            Executive Summary
                                                        </h3>
                                                        <p className="text-text-secondary leading-relaxed text-base">
                                                            {summaryText}
                                                        </p>
                                                    </div>

                                                    {/* Vertical Collapsible Sections: DECISIONS, IDEAS, RISKS */}
                                                    <div className="flex flex-col gap-3">
                                                        {/* DECISIONS Section - First */}
                                                        <motion.div
                                                            className="bg-bg-elevated rounded-xl border border-green-500/20 overflow-hidden cursor-pointer"
                                                            whileHover={{ scale: 1.005 }}
                                                            onClick={() => setExpandedDecisions(!expandedDecisions)}
                                                        >
                                                            <div className="p-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-green-400 uppercase font-bold tracking-wider">DECISIONS</p>
                                                                        <p className="text-lg font-bold text-white">{keyDecisions.length}</p>
                                                                    </div>
                                                                </div>
                                                                <motion.div
                                                                    animate={{ rotate: expandedDecisions ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronDown className="w-5 h-5 text-text-muted" />
                                                                </motion.div>
                                                            </div>
                                                            <AnimatePresence>
                                                                {expandedDecisions && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="border-t border-green-500/10"
                                                                    >
                                                                        <ol className="p-4 space-y-3">
                                                                            {keyDecisions.map((decision, idx) => (
                                                                                <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                                                                                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                                                                        {idx + 1}
                                                                                    </span>
                                                                                    {decision}
                                                                                </li>
                                                                            ))}
                                                                            {keyDecisions.length === 0 && (
                                                                                <li className="text-sm text-text-muted">Нет решений</li>
                                                                            )}
                                                                        </ol>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>

                                                        {/* IDEAS Section - Second */}
                                                        <motion.div
                                                            className="bg-bg-elevated rounded-xl border border-purple-500/20 overflow-hidden cursor-pointer"
                                                            whileHover={{ scale: 1.005 }}
                                                            onClick={() => setExpandedIdeas(!expandedIdeas)}
                                                        >
                                                            <div className="p-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                                        <Zap className="w-5 h-5 text-purple-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-purple-400 uppercase font-bold tracking-wider">IDEAS</p>
                                                                        <p className="text-lg font-bold text-white">{insights.filter(i => i.type === "idea").length}</p>
                                                                    </div>
                                                                </div>
                                                                <motion.div
                                                                    animate={{ rotate: expandedIdeas ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronDown className="w-5 h-5 text-text-muted" />
                                                                </motion.div>
                                                            </div>
                                                            <AnimatePresence>
                                                                {expandedIdeas && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="border-t border-purple-500/10"
                                                                    >
                                                                        <ul className="p-4 space-y-3">
                                                                            {insights.filter(i => i.type === "idea").map((idea, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                                                                    {idea.text}
                                                                                </li>
                                                                            ))}
                                                                            {insights.filter(i => i.type === "idea").length === 0 && (
                                                                                <li className="text-sm text-text-muted">Нет идей</li>
                                                                            )}
                                                                        </ul>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>

                                                        {/* RISKS Section - Third */}
                                                        <motion.div
                                                            className="bg-bg-elevated rounded-xl border border-yellow-500/20 overflow-hidden cursor-pointer"
                                                            whileHover={{ scale: 1.005 }}
                                                            onClick={() => setExpandedRisks(!expandedRisks)}
                                                        >
                                                            <div className="p-4 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                                                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-yellow-400 uppercase font-bold tracking-wider">RISKS</p>
                                                                        <p className="text-lg font-bold text-white">{insights.filter(i => i.type === "risk").length}</p>
                                                                    </div>
                                                                </div>
                                                                <motion.div
                                                                    animate={{ rotate: expandedRisks ? 180 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronDown className="w-5 h-5 text-text-muted" />
                                                                </motion.div>
                                                            </div>
                                                            <AnimatePresence>
                                                                {expandedRisks && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="border-t border-yellow-500/10"
                                                                    >
                                                                        <ul className="p-4 space-y-3">
                                                                            {insights.filter(i => i.type === "risk").map((risk, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                                                    {risk.text}
                                                                                </li>
                                                                            ))}
                                                                            {insights.filter(i => i.type === "risk").length === 0 && (
                                                                                <li className="text-sm text-text-muted">Нет рисков</li>
                                                                            )}
                                                                        </ul>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {activeTab === "protocol" && (
                                                <motion.div
                                                    className="space-y-6 print:space-y-4"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    {/* Protocol Header - Clean for print */}
                                                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-white/10 flex justify-between items-start print:border-black print:bg-white print:text-black">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center print:hidden">
                                                                <FileText className="w-6 h-6 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h2 className="text-xl font-bold text-white tracking-wide uppercase print:text-black">MEETING PROTOCOL</h2>
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20 print:border-black print:text-black">
                                                                        INTERNAL
                                                                    </span>
                                                                </div>
                                                                <h1 className="text-3xl font-bold text-white mb-4 print:text-black">Meeting {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>

                                                                <div className="flex gap-6 text-sm text-text-secondary print:text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4" />
                                                                        {new Date().toLocaleDateString('en-GB')}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-4 h-4" />
                                                                        ~45 min
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Users className="w-4 h-4" />
                                                                        {participants.map(p => p.name).join(", ")}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Executive Summary Block */}
                                                    <div className="bg-bg-elevated rounded-xl border-l-4 border-purple-500 p-6 print:border print:border-gray-300 print:bg-white">
                                                        <h3 className="text-purple-400 font-bold uppercase tracking-wider mb-4 text-sm flex items-center gap-2 print:text-purple-700">
                                                            EXECUTIVE SUMMARY
                                                        </h3>
                                                        <p className="text-text-secondary leading-relaxed print:text-black">
                                                            {summaryText || "Analysis in progress..."}
                                                        </p>
                                                    </div>

                                                    {/* Protocol Blocks */}
                                                    {protocolBlocks.length > 0 ? (
                                                        protocolBlocks.map((block, blockIdx) => (
                                                            <div key={blockIdx} className="bg-bg-elevated rounded-xl border border-white/10 overflow-hidden print:border-gray-300 print:bg-white">
                                                                {/* Block Header */}
                                                                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 border-b border-white/10">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="font-bold text-white text-lg flex items-center gap-3 print:text-black">
                                                                            <span className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-400 flex items-center justify-center text-sm font-bold">
                                                                                {blockIdx + 1}
                                                                            </span>
                                                                            {block.title}
                                                                        </h3>
                                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${block.level1_management?.status?.includes('норма') ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                            block.level1_management?.status?.includes('риск') ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                                                            }`}>
                                                                            {block.level1_management?.status}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="p-6 space-y-6">
                                                                    {/* Level 1: Management */}
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                                                            🔹 Уровень 1 — Управленческая суть
                                                                        </h4>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                                                                                <h5 className="text-green-400 text-xs font-bold uppercase mb-2">Ключевые результаты</h5>
                                                                                <ul className="space-y-1">
                                                                                    {block.level1_management?.key_results?.map((r, i) => (
                                                                                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                                                            <span className="text-green-400">✓</span> {r}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                                                                                <h5 className="text-red-400 text-xs font-bold uppercase mb-2">Ключевые проблемы</h5>
                                                                                <ul className="space-y-1">
                                                                                    {block.level1_management?.key_problems?.map((p, i) => (
                                                                                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                                                            <span className="text-red-400">✗</span> {p}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                        {block.level1_management?.decisions && block.level1_management.decisions.length > 0 && (
                                                                            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                                                                                <h5 className="text-purple-400 text-xs font-bold uppercase mb-2">Принятые решения</h5>
                                                                                <ul className="space-y-1">
                                                                                    {block.level1_management.decisions.map((d, i) => (
                                                                                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                                                            <span className="text-purple-400">→</span> {d}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Level 2: Operations */}
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                                                            🔹 Уровень 2 — Операционные детали
                                                                        </h4>
                                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                                            {block.level2_operations?.done && block.level2_operations.done.length > 0 && (
                                                                                <div>
                                                                                    <span className="text-text-muted text-xs uppercase">Что сделано:</span>
                                                                                    <ul>{block.level2_operations.done.map((d, i) => <li key={i} className="text-text-secondary">• {d}</li>)}</ul>
                                                                                </div>
                                                                            )}
                                                                            {block.level2_operations?.not_done && block.level2_operations.not_done.length > 0 && (
                                                                                <div>
                                                                                    <span className="text-text-muted text-xs uppercase">Что не сделано:</span>
                                                                                    <ul>{block.level2_operations.not_done.map((d, i) => <li key={i} className="text-text-secondary">• {d}</li>)}</ul>
                                                                                </div>
                                                                            )}
                                                                            {block.level2_operations?.bottlenecks && block.level2_operations.bottlenecks.length > 0 && (
                                                                                <div>
                                                                                    <span className="text-text-muted text-xs uppercase">Узкие места:</span>
                                                                                    <ul>{block.level2_operations.bottlenecks.map((d, i) => <li key={i} className="text-text-secondary">• {d}</li>)}</ul>
                                                                                </div>
                                                                            )}
                                                                            {block.level2_operations?.dependencies && block.level2_operations.dependencies.length > 0 && (
                                                                                <div>
                                                                                    <span className="text-text-muted text-xs uppercase">Зависимости:</span>
                                                                                    <ul>{block.level2_operations.dependencies.map((d, i) => <li key={i} className="text-text-secondary">• {d}</li>)}</ul>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Tasks Table */}
                                                                    {block.tasks && block.tasks.length > 0 && (
                                                                        <div className="space-y-2">
                                                                            <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider">✅ Задачи</h4>
                                                                            <table className="w-full text-sm border-collapse">
                                                                                <thead>
                                                                                    <tr className="text-xs text-text-muted uppercase border-b border-white/10">
                                                                                        <th className="text-left p-2">Задача</th>
                                                                                        <th className="text-left p-2 w-32">Ответственный</th>
                                                                                        <th className="text-left p-2 w-32">Дедлайн</th>
                                                                                        <th className="text-left p-2">KPI</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-white/5">
                                                                                    {block.tasks.map((t, i) => (
                                                                                        <tr key={i}>
                                                                                            <td className="p-2 text-text-secondary">{t.text}</td>
                                                                                            <td className="p-2 text-blue-400">{t.owner}</td>
                                                                                            <td className="p-2 text-yellow-400">{t.deadline}</td>
                                                                                            <td className="p-2 text-text-muted">{t.kpi}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}

                                                                    {/* Risks Table */}
                                                                    {block.risks && block.risks.length > 0 && (
                                                                        <div className="space-y-2">
                                                                            <h4 className="text-yellow-400 font-bold text-sm uppercase tracking-wider">⚠️ Риски</h4>
                                                                            <table className="w-full text-sm border-collapse">
                                                                                <thead>
                                                                                    <tr className="text-xs text-text-muted uppercase border-b border-white/10">
                                                                                        <th className="text-left p-2">Риск</th>
                                                                                        <th className="text-left p-2 w-28">Вероятность</th>
                                                                                        <th className="text-left p-2">Последствие</th>
                                                                                        <th className="text-left p-2 w-32">Контролёр</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-white/5">
                                                                                    {block.risks.map((r, i) => (
                                                                                        <tr key={i}>
                                                                                            <td className="p-2 text-text-secondary">{r.text}</td>
                                                                                            <td className="p-2">
                                                                                                <span className={`px-2 py-0.5 rounded text-xs ${r.probability?.includes('высо') ? 'bg-red-500/20 text-red-400' :
                                                                                                    r.probability?.includes('средн') ? 'bg-yellow-500/20 text-yellow-400' :
                                                                                                        'bg-green-500/20 text-green-400'
                                                                                                    }`}>{r.probability}</span>
                                                                                            </td>
                                                                                            <td className="p-2 text-text-muted">{r.consequence}</td>
                                                                                            <td className="p-2 text-blue-400">{r.controller}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        /* Fallback to old Agenda view */
                                                        <div className="bg-bg-elevated rounded-xl border-l-4 border-green-500 p-6 print:border print:border-gray-300 print:bg-white">
                                                            <h3 className="text-green-400 font-bold uppercase tracking-wider mb-6 text-sm flex items-center gap-2 print:text-green-700">
                                                                <ListTodo className="w-4 h-4" />
                                                                AGENDA & TOPICS
                                                            </h3>
                                                            <div className="space-y-8">
                                                                {agendaTopics.length > 0 ? (
                                                                    agendaTopics.map((topic, index) => (
                                                                        <div key={topic.id} className="space-y-4">
                                                                            <h4 className="text-white font-bold text-lg flex items-center gap-3 print:text-black">
                                                                                <span className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold print:border print:border-green-700 print:text-green-700">
                                                                                    {index + 1}
                                                                                </span>
                                                                                {topic.title}
                                                                            </h4>
                                                                            <div className="h-full overflow-y-auto pr-2 space-y-6">
                                                                                {/* Dynamic Protocol View */}
                                                                                <div className="space-y-6">
                                                                                    {protocolBlocks.map((block, index) => (
                                                                                        <div key={index} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                                                                            {/* Block Header */}
                                                                                            <div className="bg-white/5 p-4 border-b border-white/5 flex items-center gap-3">
                                                                                                <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                                                                                                    <Layout className="w-4 h-4" />
                                                                                                </div>
                                                                                                <h3 className="font-bold text-white uppercase tracking-wider text-sm">
                                                                                                    {block.title}
                                                                                                </h3>
                                                                                            </div>

                                                                                            {/* Block Content */}
                                                                                            <div className="p-4 space-y-4">
                                                                                                {/* Management Level */}
                                                                                                {block.level1_management && (
                                                                                                    <div className="space-y-4">
                                                                                                        {/* Status Badge */}
                                                                                                        {block.level1_management.status && (
                                                                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${block.level1_management.status.includes("норма") || block.level1_management.status.includes("normal") ? "bg-green-500/20 text-green-400" :
                                                                                                                block.level1_management.status.includes("риск") || block.level1_management.status.includes("risk") ? "bg-yellow-500/20 text-yellow-400" :
                                                                                                                    "bg-red-500/20 text-red-400"
                                                                                                                }`}>
                                                                                                                {block.level1_management.status}
                                                                                                            </div>
                                                                                                        )}

                                                                                                        {/* Key Results */}
                                                                                                        {block.level1_management.key_results && block.level1_management.key_results.length > 0 && (
                                                                                                            <div className="space-y-2">
                                                                                                                <h4 className="text-xs font-bold text-text-muted uppercase">Key Results</h4>
                                                                                                                <ul className="space-y-1">
                                                                                                                    {block.level1_management.key_results.map((r: string, i: number) => (
                                                                                                                        <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                                                                                            <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                                                                                                            {r}
                                                                                                                        </li>
                                                                                                                    ))}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        )}

                                                                                                        {/* Key Problems */}
                                                                                                        {block.level1_management.key_problems && block.level1_management.key_problems.length > 0 && (
                                                                                                            <div className="space-y-2">
                                                                                                                <h4 className="text-xs font-bold text-text-muted uppercase">Key Problems</h4>
                                                                                                                <ul className="space-y-1">
                                                                                                                    {block.level1_management.key_problems.map((p: string, i: number) => (
                                                                                                                        <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                                                                                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                                                                                                            {p}
                                                                                                                        </li>
                                                                                                                    ))}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        )}

                                                                                                        {/* Decisions */}
                                                                                                        {block.level1_management.decisions && block.level1_management.decisions.length > 0 && (
                                                                                                            <div className="space-y-2">
                                                                                                                <h4 className="text-xs font-bold text-text-muted uppercase">Decisions</h4>
                                                                                                                <ul className="space-y-1">
                                                                                                                    {block.level1_management.decisions.map((d: string, i: number) => (
                                                                                                                        <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                                                                                            <CheckCircle2 className="w-4 h-4 text-accent-primary mt-0.5 shrink-0" />
                                                                                                                            {d}
                                                                                                                        </li>
                                                                                                                    ))}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Risks */}
                                                                                                {block.risks && block.risks.length > 0 && (
                                                                                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                                                                                        <h4 className="text-xs font-bold text-text-muted uppercase">Risks</h4>
                                                                                                        <div className="space-y-2">
                                                                                                            {block.risks.map((r: any, i: number) => (
                                                                                                                <div key={i} className="bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                                                                                                                    <div className="text-sm text-white mb-2">{r.text}</div>
                                                                                                                    <div className="flex items-center justify-between text-xs">
                                                                                                                        <span className="text-red-400 font-bold uppercase">{r.probability} Probability</span>
                                                                                                                        <span className="text-text-secondary">{r.controller}</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Tasks */}
                                                                                                {/* Tasks */}
                                                                                                {block.tasks && block.tasks.length > 0 && (
                                                                                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                                                                                        <h4 className="text-xs font-bold text-blue-400 uppercase">Action Items</h4>
                                                                                                        <ul className="space-y-2">
                                                                                                            {block.tasks.map((task: any, i: number) => (
                                                                                                                <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                                                                                    <div className="w-4 h-4 rounded border border-blue-400/50 mt-0.5 shrink-0" />
                                                                                                                    <div className="flex-1">
                                                                                                                        <div>{task.text}</div>
                                                                                                                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                                                                                                                            <span className="text-blue-300">{task.owner}</span>
                                                                                                                            <span>•</span>
                                                                                                                            <span>{task.deadline}</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </li>
                                                                                                            ))}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Operations Level */}
                                                                                                {block.level2_operations && (
                                                                                                    <div className="space-y-3">
                                                                                                        {block.level2_operations.blockers && block.level2_operations.blockers.length > 0 && (
                                                                                                            <div className="space-y-2">
                                                                                                                <h4 className="text-xs font-bold text-yellow-400 uppercase">Blockers</h4>
                                                                                                                <ul className="space-y-1">
                                                                                                                    {block.level2_operations.blockers.map((b: string, i: number) => (
                                                                                                                        <li key={i} className="text-sm text-text-secondary">• {b}</li>
                                                                                                                    ))}
                                                                                                                </ul>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                )}

                                                                                                {/* Growth Points */}
                                                                                                {block.growth_points && block.growth_points.length > 0 && (
                                                                                                    <div className="space-y-2">
                                                                                                        <h4 className="text-xs font-bold text-purple-400 uppercase">Growth Points</h4>
                                                                                                        <ul className="space-y-2">
                                                                                                            {block.growth_points.map((p: string, i: number) => (
                                                                                                                <li key={i} className="flex items-start gap-2 text-sm text-white">
                                                                                                                    <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                                                                                                                    {p}
                                                                                                                </li>
                                                                                                            ))}
                                                                                                        </ul>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>

                                                                                {/* Re-generate Button */}
                                                                                <div className="flex justify-center pt-8 pb-4">
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setIsAnalyzed(false);
                                                                                            setConstructorMode(false);
                                                                                        }}
                                                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary transition-colors text-sm"
                                                                                    >
                                                                                        <RefreshCw className="w-4 h-4" />
                                                                                        Regenerate Protocol
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-text-muted italic pl-4">No topics defined.</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Final Summary Block */}
                                                    {finalSummary && (
                                                        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 p-6">
                                                            <h3 className="text-purple-400 font-bold uppercase tracking-wider mb-6 text-sm">
                                                                📊 Итоговая сводка
                                                            </h3>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <h5 className="text-green-400 text-xs font-bold uppercase">✅ Топ решений</h5>
                                                                    <ul className="space-y-1">{finalSummary.top_decisions.map((d, i) => <li key={i} className="text-sm text-text-secondary">• {d}</li>)}</ul>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <h5 className="text-red-400 text-xs font-bold uppercase">🚫 Главные блокеры</h5>
                                                                    <ul className="space-y-1">{finalSummary.top_blockers.map((d, i) => <li key={i} className="text-sm text-text-secondary">• {d}</li>)}</ul>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <h5 className="text-cyan-400 text-xs font-bold uppercase">📈 Точки роста</h5>
                                                                    <ul className="space-y-1">{finalSummary.growth_points.map((d, i) => <li key={i} className="text-sm text-text-secondary">• {d}</li>)}</ul>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <h5 className="text-yellow-400 text-xs font-bold uppercase">⚠️ Внимание до следующей встречи</h5>
                                                                    <ul className="space-y-1">{finalSummary.attention_before_next.map((d, i) => <li key={i} className="text-sm text-text-secondary">• {d}</li>)}</ul>
                                                                </div>
                                                            </div>
                                                            {finalSummary.kpis_to_change.length > 0 && (
                                                                <div className="mt-4 pt-4 border-t border-white/10">
                                                                    <h5 className="text-blue-400 text-xs font-bold uppercase mb-2">📊 KPI для изменения</h5>
                                                                    <ul className="flex flex-wrap gap-2">
                                                                        {finalSummary.kpis_to_change.map((k, i) => (
                                                                            <li key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400">{k}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Plan Block - Editable */}
                                                    <div className="bg-bg-elevated rounded-xl border border-white/5 overflow-hidden print:border-gray-300 print:bg-white">
                                                        <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between print:bg-gray-100 print:border-gray-300">
                                                            <h3 className="font-bold text-white flex items-center gap-2 print:text-black">
                                                                <Target className="w-5 h-5 text-blue-400" />
                                                                ACTION PLAN
                                                            </h3>
                                                            <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-md">
                                                                {actionItems.length} tasks
                                                            </span>
                                                        </div>
                                                        <div className="p-2 space-y-2">
                                                            {actionItems.map((item, idx) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="group flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all"
                                                                >
                                                                    {/* Number */}
                                                                    <div className="text-xs font-mono text-text-muted pt-3 w-6">
                                                                        {String(idx + 1).padStart(2, '0')}
                                                                    </div>

                                                                    {/* Task Content */}
                                                                    <div className="flex-1 space-y-3">
                                                                        <textarea
                                                                            value={item.text}
                                                                            onChange={(e) => updateActionItem(item.id, 'text', e.target.value)}
                                                                            className="w-full bg-transparent border-none text-white focus:ring-0 p-0 placeholder-white/20 text-sm leading-relaxed resize-none min-h-[24px]"
                                                                            placeholder="Describe the task..."
                                                                            rows={1}
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLTextAreaElement;
                                                                                target.style.height = 'auto';
                                                                                target.style.height = target.scrollHeight + 'px';
                                                                            }}
                                                                        />

                                                                        <div className="flex items-center gap-3">
                                                                            {/* Owner Input */}
                                                                            <div className="flex items-center gap-2 bg-black/20 rounded-md px-2 py-1 border border-white/5 focus-within:border-blue-500/50 transition-colors">
                                                                                <User className="w-3 h-3 text-text-muted" />
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.owner}
                                                                                    onChange={(e) => updateActionItem(item.id, 'owner', e.target.value)}
                                                                                    className="bg-transparent border-none text-xs text-text-secondary w-24 focus:ring-0 p-0"
                                                                                    placeholder="Assignee"
                                                                                />
                                                                            </div>

                                                                            {/* Priority Badge */}
                                                                            <button
                                                                                onClick={() => {
                                                                                    const next = item.priority === 'high' ? 'medium' : item.priority === 'medium' ? 'low' : 'high';
                                                                                    updateActionItem(item.id, 'priority', next);
                                                                                }}
                                                                                className={`
                                                                                    inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border transition-colors
                                                                                    ${item.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' :
                                                                                        item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' :
                                                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'}
                                                                                `}
                                                                            >
                                                                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                                                            </button>

                                                                            {/* Due Date (Optional placeholder for now) */}
                                                                            <div className="flex items-center gap-1.5 text-xs text-text-muted px-2">
                                                                                <Calendar className="w-3 h-3" />
                                                                                <span>{item.due || "No date"}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => updateActionItem(item.id, 'inSidebar', !item.inSidebar)}
                                                                            className={`p-2 rounded-lg transition-colors ${item.inSidebar
                                                                                ? "text-green-400 bg-green-500/10"
                                                                                : "text-text-muted hover:text-white hover:bg-white/10"
                                                                                }`}
                                                                            title={item.inSidebar ? "Added to Sidebar" : "Add to Sidebar"}
                                                                        >
                                                                            {item.inSidebar ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <button
                                                                onClick={() => {
                                                                    const newItem: ActionItem = {
                                                                        id: String(Date.now()),
                                                                        text: "",
                                                                        owner: "",
                                                                        due: "",
                                                                        completed: false,
                                                                        priority: "medium",
                                                                        inSidebar: false
                                                                    };
                                                                    setActionItems([...actionItems, newItem]);
                                                                }}
                                                                className="w-full py-4 border-2 border-dashed border-white/5 rounded-lg text-sm text-text-muted hover:text-white hover:border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 mt-4"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add New Task
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Footer for Print */}
                                                    <div className="hidden print:flex justify-between items-center mt-8 pt-8 border-t border-gray-200 text-xs text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-black">FUTURIST OS</span>
                                                            <span>|</span>
                                                            <span>Meeting Protocol</span>
                                                        </div>
                                                        <div>
                                                            Generated by Gravity AI
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar - Action Items */}
                    <div className="col-span-1">
                        <div className="bg-bg-card border border-glass-border rounded-2xl p-5 sticky top-32">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <ListTodo className="w-4 h-4" />
                                    Action Items
                                </h3>
                                <span className="text-xs text-text-muted">
                                    {actionItems.filter(i => i.inSidebar).length} tasks
                                </span>
                            </div>

                            {actionItems.filter(i => i.inSidebar).length === 0 ? (
                                <div className="text-center py-8 text-text-muted text-sm border border-dashed border-white/10 rounded-xl">
                                    <p>No tasks moved yet.</p>
                                    <p className="text-xs mt-1">Move tasks from the Action Plan.</p>
                                </div>
                            ) : (
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {actionItems.filter(i => i.inSidebar).map((item, i) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`p-3 rounded-xl border transition-all cursor-pointer ${item.completed
                                                ? "bg-green-500/10 border-green-500/20"
                                                : "bg-glass-white-5 border-glass-border hover:border-white/20"
                                                }`}
                                            onClick={() => toggleActionItem(item.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${item.completed
                                                    ? "bg-green-500 border-green-500"
                                                    : "border-white/30"
                                                    }`}>
                                                    {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${item.completed ? "text-white/50 line-through" : "text-white"}`}>
                                                        {item.text}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-text-muted">{item.owner}</span>
                                                        <span className="text-xs text-glass-border">•</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${item.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                                                            item.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                'bg-blue-500/10 text-blue-400'
                                                            }`}>
                                                            {item.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            <button className="w-full mt-4 py-2 bg-accent-primary text-white text-sm rounded-xl hover:bg-accent-primary/80 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                                <Zap className="w-4 h-4" />
                                Sync to Asana
                            </button>
                        </div>
                    </div>
                </div>
            </main >

            {/* CSS for shimmer animation */}
            < style jsx > {`
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `}</style >
        </div >
    );
}
