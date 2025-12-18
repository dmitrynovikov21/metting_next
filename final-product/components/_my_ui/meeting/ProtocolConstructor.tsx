import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Plus, X, Wand2, Save, Sparkles } from 'lucide-react';

interface Block {
    id: string;
    type: string;
    title: string;
    instruction: string;
}

const AVAILABLE_BLOCKS: Block[] = [
    // Standard Blocks
    { id: 'decisions', type: 'decisions', title: 'Key Decisions', instruction: 'Extract final agreements.' },
    { id: 'risks', type: 'risks', title: 'Risks & Mitigation', instruction: 'Identify risks (Cause -> Solution).' },
    { id: 'tasks', type: 'tasks', title: 'Action Items', instruction: 'List tasks with owner/deadline.' },
    { id: 'growth', type: 'growth', title: 'Growth Points', instruction: 'Identify opportunities.' },
    { id: 'blockers', type: 'blockers', title: 'Blockers', instruction: 'What is stopping progress.' },
    { id: 'mood', type: 'mood', title: 'Mood & Vibe', instruction: 'Analyze emotional tone.' },
    { id: 'agenda', type: 'agenda', title: 'Agenda', instruction: 'List topics discussed.' },

    // Internal Sync
    { id: 'done_doing', type: 'custom', title: 'Done/Doing', instruction: 'List completed items and work in progress.' },

    // Client Meeting
    { id: 'client_needs', type: 'custom', title: 'Client Needs', instruction: 'Extract specific client requirements and pain points.' },
    { id: 'agreements', type: 'decisions', title: 'Agreements', instruction: 'List formal agreements and informal understandings.' },
    { id: 'objections', type: 'custom', title: 'Objections', instruction: 'List raised objections and how they were handled.' },
    { id: 'next_steps', type: 'tasks', title: 'Next Steps', instruction: 'Immediate next steps for both parties.' },

    // Strategy
    { id: 'strategic_goals', type: 'custom', title: 'Strategic Goals', instruction: 'Extract high-level strategic goals and vision.' },

    // Partner
    { id: 'joint_opps', type: 'growth', title: 'Joint Opps', instruction: 'Identify joint business opportunities and synergies.' },
    { id: 'terms', type: 'custom', title: 'Terms', instruction: 'List commercial terms and conditions discussed.' },
    { id: 'roadmap', type: 'agenda', title: 'Roadmap', instruction: 'Outline the agreed timeline and milestones.' },

    // Interview
    { id: 'strengths', type: 'custom', title: 'Strengths', instruction: 'List candidate strengths and advantages.' },
    { id: 'weaknesses', type: 'risks', title: 'Weaknesses', instruction: 'List candidate weaknesses and red flags.' },
    { id: 'culture_fit', type: 'mood', title: 'Culture Fit', instruction: 'Analyze cultural fit and behavioral usage.' },
    { id: 'decision', type: 'decisions', title: 'Decision', instruction: 'Hire/No Hire recommendation and reasoning.' }
];

interface ProtocolConstructorProps {
    templateId: string;
    initialBlocks?: string[]; // IDs of blocks
    onGenerate: (blocks: Block[]) => void;
    onCancel: () => void;
}

export function ProtocolConstructor({ templateId, initialBlocks = [], onGenerate, onCancel }: ProtocolConstructorProps) {
    const [isCustomBlockModalOpen, setIsCustomBlockModalOpen] = useState(false);
    const [customBlockTitle, setCustomBlockTitle] = useState("");
    const [customBlockInstruction, setCustomBlockInstruction] = useState("");
    // Initialize active blocks based on template
    const [activeBlocks, setActiveBlocks] = useState<Block[]>(() => {
        if (initialBlocks.length > 0) {
            return initialBlocks
                .map(id => AVAILABLE_BLOCKS.find(b => b.title === id || b.id === id))
                .filter(Boolean) as Block[];
        }
        return [];
    });

    const addBlock = (block: Block) => {
        // Generate unique ID for custom blocks to allow multiple
        const newBlock = block.id === 'custom'
            ? { ...block, id: `custom - ${Date.now()} ` }
            : block;

        if (!activeBlocks.find(b => b.id === newBlock.id)) {
            setActiveBlocks([...activeBlocks, newBlock]);
        }
    };

    const handleAddCustomBlock = () => {
        if (customBlockTitle && customBlockInstruction) {
            addBlock({
                id: 'custom',
                type: 'custom',
                title: customBlockTitle,
                instruction: customBlockInstruction
            });
            setCustomBlockTitle("");
            setCustomBlockInstruction("");
            setIsCustomBlockModalOpen(false);
        }
    };

    const removeBlock = (id: string) => {
        setActiveBlocks(activeBlocks.filter(b => b.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-bg-secondary rounded-xl overflow-hidden border border-white/5 relative">
            {/* Custom Block Modal */}
            {isCustomBlockModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-bg-elevated border border-white/10 rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent-primary" />
                            Create Magic Block
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold mb-1 block">Block Title</label>
                                <input
                                    type="text"
                                    value={customBlockTitle}
                                    onChange={(e) => setCustomBlockTitle(e.target.value)}
                                    placeholder="e.g., Team Mood, Competitor Analysis"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-text-muted focus:border-accent-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary uppercase font-bold mb-1 block">Instruction for AI</label>
                                <textarea
                                    value={customBlockInstruction}
                                    onChange={(e) => setCustomBlockInstruction(e.target.value)}
                                    placeholder="e.g., Analyze the emotional tone of the meeting and identify any hidden conflicts."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-text-muted focus:border-accent-primary outline-none transition-colors h-24 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsCustomBlockModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCustomBlock}
                                disabled={!customBlockTitle || !customBlockInstruction}
                                className="px-4 py-2 rounded-lg bg-accent-primary text-black font-bold hover:bg-accent-primary/90 transition-colors text-sm disabled:opacity-50"
                            >
                                Add Block
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg-elevated">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-accent-primary" />
                        Protocol Constructor
                    </h2>
                    <p className="text-sm text-text-secondary">
                        Customize the structure for your <span className="text-accent-primary font-medium">{templateId}</span> protocol.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-text-secondary hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onGenerate(activeBlocks)}
                        disabled={activeBlocks.length === 0}
                        className="px-6 py-2 rounded-lg bg-accent-primary text-black font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Generate Protocol
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Available Blocks */}
                <div className="w-1/3 border-r border-white/5 p-6 overflow-y-auto bg-bg-secondary/50">
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                        Available Blocks
                    </h3>
                    <div className="space-y-3">
                        {/* Magic Block Button */}
                        <button
                            onClick={() => setIsCustomBlockModalOpen(true)}
                            className="w-full flex items-center justify-between p-4 rounded-lg border border-accent-primary/20 bg-accent-primary/5 hover:bg-accent-primary/10 transition-all text-left group"
                        >
                            <div>
                                <div className="font-bold text-accent-primary flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Magic Block
                                </div>
                                <div className="text-xs text-text-secondary mt-1">
                                    Create your own custom block.
                                </div>
                            </div>
                            <Plus className="w-4 h-4 text-accent-primary" />
                        </button>

                        {AVAILABLE_BLOCKS.map(block => {
                            const isActive = activeBlocks.some(b => b.id === block.id);
                            return (
                                <button
                                    key={block.id}
                                    onClick={() => addBlock(block)}
                                    disabled={isActive}
                                    className={`w - full flex items - center justify - between p - 4 rounded - lg border transition - all text - left ${isActive
                                        ? 'bg-green-500/10 border-green-500/20 opacity-50 cursor-default'
                                        : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                        } `}
                                >
                                    <div>
                                        <div className={`font - bold ${isActive ? 'text-green-400' : 'text-white'} `}>
                                            {block.title}
                                        </div>
                                        <div className="text-xs text-text-secondary mt-1">
                                            {block.instruction}
                                        </div>
                                    </div>
                                    {!isActive && <Plus className="w-4 h-4 text-text-muted" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Active Structure */}
                <div className="flex-1 p-6 overflow-y-auto bg-bg-elevated">
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">
                        Protocol Structure (Drag to Reorder)
                    </h3>

                    {activeBlocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-xl text-text-muted">
                            <Wand2 className="w-8 h-8 mb-2 opacity-50" />
                            <p>Select blocks from the left to build your protocol</p>
                        </div>
                    ) : (
                        <Reorder.Group axis="y" values={activeBlocks} onReorder={setActiveBlocks} className="space-y-3">
                            {activeBlocks.map(block => (
                                <Reorder.Item key={block.id} value={block}>
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 cursor-grab active:cursor-grabbing group hover:border-accent-primary/30 transition-colors">
                                        <GripVertical className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
                                        <div className="flex-1">
                                            <div className="font-bold text-white">{block.title}</div>
                                            <div className="text-xs text-text-secondary">{block.instruction}</div>
                                        </div>
                                        <button
                                            onClick={() => removeBlock(block.id)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-text-muted transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </div>
            </div>
        </div>
    );
}
