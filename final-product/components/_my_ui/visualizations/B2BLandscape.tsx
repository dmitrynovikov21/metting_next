"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface B2BLandscapeProps {
    activeSector: string | null;
}

export function B2BLandscape({ activeSector }: B2BLandscapeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            if (containerRef.current && canvas) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };
        window.addEventListener("resize", resize);
        resize();

        // Hexagon Grid Logic
        const hexSize = 40;
        const hexHeight = hexSize * 2;
        const hexWidth = Math.sqrt(3) * hexSize;
        const vertDist = hexHeight * 0.75;

        const drawHex = (x: number, y: number, color: string, opacity: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = x + hexSize * Math.cos(angle);
                const hy = y + hexSize * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 1;
            ctx.stroke();
        };

        const render = () => {
            time += 0.02;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = Math.ceil(canvas.width / hexWidth) + 1;
            const rows = Math.ceil(canvas.height / vertDist) + 1;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const xOffset = (r % 2) * (hexWidth / 2);
                    const x = c * hexWidth + xOffset;
                    const y = r * vertDist;

                    // Determine Sector based on position
                    let sector = "general";
                    if (x < canvas.width / 3) sector = "manufacturing";
                    else if (x < (canvas.width / 3) * 2) sector = "logistics";
                    else sector = "fintech";

                    // Base State
                    let color = "#1a1a1a";
                    let opacity = 0.1;

                    // Active Highlight
                    if (activeSector === sector) {
                        // Pulse effect
                        const distFromCenter = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
                        const pulse = Math.sin(time * 2 + (x + y) * 0.01) * 0.5 + 0.5;

                        if (sector === "manufacturing") color = "#00F0FF"; // Cyan
                        if (sector === "logistics") color = "#3D8BFF"; // Blue
                        if (sector === "fintech") color = "#7000FF"; // Purple (or keeping to palette: White/Grey)

                        opacity = 0.2 + pulse * 0.3;
                    } else if (activeSector) {
                        // Dim others
                        opacity = 0.05;
                    } else {
                        // Idle Animation
                        const noise = Math.sin(time + x * 0.01 + y * 0.02);
                        if (noise > 0.8) {
                            opacity = 0.2;
                            color = "#333";
                        }
                    }

                    drawHex(x, y, color, opacity);
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [activeSector]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 rounded-3xl overflow-hidden border border-white/5 bg-black/20 backdrop-blur-sm">
            <canvas ref={canvasRef} className="w-full h-full opacity-60" />

            {/* Labels Overlay */}
            <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                <div className={`transition-opacity duration-500 ${activeSector === 'manufacturing' ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-xs uppercase tracking-widest text-accent">Production</span>
                </div>
                <div className={`transition-opacity duration-500 ${activeSector === 'logistics' ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-xs uppercase tracking-widest text-accent">Supply Chain</span>
                </div>
                <div className={`transition-opacity duration-500 ${activeSector === 'fintech' ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-xs uppercase tracking-widest text-accent">Operations</span>
                </div>
            </div>
        </div>
    );
}
