import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Users, Zap, Layout, ArrowRight, User } from 'lucide-react';

interface Template {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    blocks: string[];
}

export const TEMPLATES: Template[] = [
    {
        id: 'internal',
        title: 'Internal Sync',
        description: 'Status updates, blockers, and team sync.',
        icon: Zap,
        color: 'text-blue-400',
        blocks: ['Done/Doing', 'Blockers', 'Action Items']
    },
    {
        id: 'client',
        title: 'Client Meeting',
        description: 'Requirements, negotiations, and next steps.',
        icon: Briefcase,
        color: 'text-green-400',
        blocks: ['Client Needs', 'Agreements', 'Objections', 'Next Steps']
    },
    {
        id: 'strategy',
        title: 'Strategy Session',
        description: 'Long-term planning, key decisions, and strategic goals.',
        icon: Target,
        color: 'text-purple-400',
        blocks: ['Strategic Goals', 'Key Decisions', 'Risks & Mitigation', 'Growth Points']
    },
    {
        id: 'partner',
        title: 'Partner Sync',
        description: 'Joint opportunities, roadmap, and terms.',
        icon: Users,
        color: 'text-orange-400',
        blocks: ['Joint Opps', 'Terms', 'Roadmap', 'Action Items']
    },
    {
        id: 'interview',
        title: 'Interview',
        description: 'Candidate evaluation, strengths, and fit.',
        icon: User,
        color: 'text-pink-400',
        blocks: ['Strengths', 'Weaknesses', 'Culture Fit', 'Decision']
    },
    {
        id: 'custom',
        title: 'Custom Builder',
        description: 'Build your protocol from scratch using blocks.',
        icon: Layout,
        color: 'text-white',
        blocks: []
    }
];

interface TemplateSelectorProps {
    onSelect: (templateId: string, blocks: string[]) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {TEMPLATES.map((template) => (
                <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(template.id, template.blocks)}
                    className="flex flex-col items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-left group"
                >
                    <div className={`p-3 rounded-lg bg-white/5 mb-4 ${template.color}`}>
                        <template.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-primary transition-colors">
                        {template.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                        {template.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-xs text-text-muted">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                            {template.blocks.length > 0 ? `${template.blocks.length} blocks` : 'Empty'}
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
