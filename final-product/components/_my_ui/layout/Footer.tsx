import { Logo } from "@/components/_my_ui/ui/Logo";

export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-background">
            <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
                <Logo />
                <p className="text-sm text-foreground/40">
                    © {new Date().getFullYear()} Futurist Agency. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
