import Link from "next/link";
import { Search, Bell, User, Command } from "lucide-react";

interface HeaderProps {
    onOpenProject?: () => void;
    onHoverNav?: (nav: string | null) => void;
}

export default function Header({ onOpenProject, onHoverNav }: HeaderProps) {
    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="glass-elevated rounded-full p-2 flex items-center gap-2 pointer-events-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-glass-white-5 transition-colors group">
                    <span className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                        Futurist <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-[0_0_12px_rgba(59,130,246,0.5)]">OS</span>
                    </span>
                </Link>

                <div className="w-px h-6 bg-glass-border mx-2" />

                {/* Navigation */}
                <nav className="flex items-center gap-1">
                    {[
                        { name: "Dashboard", href: "/dashboard" },
                        { name: "Meetings", href: "/meetings" },
                        { name: "Protocols", href: "/insights" }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-white hover:bg-glass-white-8 transition-all duration-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="w-px h-6 bg-glass-border mx-2" />

                {/* Actions */}
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
    );
}
