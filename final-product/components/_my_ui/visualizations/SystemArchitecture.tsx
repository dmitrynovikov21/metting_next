"use client";

import { useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface SystemArchitectureProps {
    hoverState: string | null;
}

export function SystemArchitecture({ hoverState }: SystemArchitectureProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Animation state refs
    const progressRef = useRef(0);
    const timeRef = useRef(0);
    const nodesRef = useRef<any[]>([]);
    const connectionsRef = useRef<any[]>([]);
    const packetsRef = useRef<any[]>([]);

    // Configuration
    const GRID_SIZE = 60;
    const NODE_COUNT = 40;
    const CONNECTION_DISTANCE = 150;

    useEffect(() => {
        // Initialize nodes
        const nodes: any[] = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                targetX: 0,
                targetY: 0,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 2 + 2,
                type: Math.random() > 0.8 ? 'hub' : 'node', // 20% hubs
            });
        }
        nodesRef.current = nodes;

        // Initialize packets
        const packets: any[] = [];
        for (let i = 0; i < 10; i++) {
            packets.push({
                active: false,
                path: [],
                currentPathIndex: 0,
                progress: 0,
                speed: 0.05 + Math.random() * 0.05
            });
        }
        packetsRef.current = packets;

    }, []);

    // Sync scroll progress
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        progressRef.current = latest;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            if (containerRef.current && canvas) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;

                // Recalculate grid targets
                const cols = Math.floor(canvas.width / GRID_SIZE);
                const rows = Math.floor(canvas.height / GRID_SIZE);

                nodesRef.current.forEach((node, i) => {
                    // Assign a random grid point as target
                    const col = Math.floor(Math.random() * cols);
                    const row = Math.floor(Math.random() * rows);
                    node.targetX = col * GRID_SIZE + GRID_SIZE / 2;
                    node.targetY = row * GRID_SIZE + GRID_SIZE / 2;
                });
            }
        };

        window.addEventListener("resize", resize);
        resize();

        const render = () => {
            timeRef.current += 0.01;
            const scroll = progressRef.current;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Grid (Fades in with scroll)
            const gridOpacity = Math.min(Math.max((scroll - 0.1) * 2, 0), 0.15);
            if (gridOpacity > 0) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
                ctx.lineWidth = 1;

                // Vertical lines
                for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }

                // Horizontal lines
                for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }

            // 2. Update and Draw Nodes
            // Transition factor: 0 = Chaos, 1 = Structure
            // Starts at 0, becomes 1 at scroll 0.3
            let structureFactor = Math.min(Math.max(scroll * 3, 0), 1);

            // Hover effects
            let hoverHighlight = false;
            if (hoverState) hoverHighlight = true;

            nodesRef.current.forEach((node, i) => {
                // Movement Logic
                if (structureFactor < 1) {
                    // Chaos Movement
                    node.x += node.vx * (1 - structureFactor);
                    node.y += node.vy * (1 - structureFactor);

                    // Bounce off walls
                    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                }

                // Lerp to Target (Structure)
                const targetX = node.targetX;
                const targetY = node.targetY;

                const currentX = node.x + (targetX - node.x) * structureFactor * 0.1;
                const currentY = node.y + (targetY - node.y) * structureFactor * 0.1;

                node.x = currentX;
                node.y = currentY;

                // Draw Node
                ctx.fillStyle = node.type === 'hub' ? '#00F0FF' : '#ffffff';
                const baseOpacity = 0.3 + structureFactor * 0.4;
                ctx.globalAlpha = baseOpacity;

                // Hover Highlight Logic
                if (hoverState === 'projects' && node.type === 'hub') {
                    ctx.fillStyle = '#00F0FF';
                    ctx.globalAlpha = 1;
                } else if (hoverState === 'process' && i % 3 === 0) {
                    ctx.fillStyle = '#3D8BFF';
                    ctx.globalAlpha = 1;
                }

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. Draw Connections
            // Only draw if close enough
            ctx.lineWidth = 1;
            nodesRef.current.forEach((nodeA, i) => {
                nodesRef.current.slice(i + 1).forEach(nodeB => {
                    const dx = nodeA.x - nodeB.x;
                    const dy = nodeA.y - nodeB.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.2 * (0.5 + structureFactor * 0.5);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(nodeA.x, nodeA.y);
                        ctx.lineTo(nodeB.x, nodeB.y);
                        ctx.stroke();
                    }
                });
            });

            // 4. Flow Packets (Data) - Only when structured
            if (structureFactor > 0.8) {
                ctx.fillStyle = '#00F0FF';
                const packetTime = Date.now() * 0.001;

                // Simulate packets moving along grid lines
                // For simplicity, just moving dots horizontally/vertically on grid
                const packetCount = 10;
                for (let i = 0; i < packetCount; i++) {
                    const offset = i * 1000;
                    const t = (packetTime * 100 + offset) % (canvas.width + canvas.height);

                    let px, py;
                    if (t < canvas.width) {
                        // Horizontal move
                        px = t;
                        py = (i % (canvas.height / GRID_SIZE)) * GRID_SIZE + GRID_SIZE / 2;
                    } else {
                        // Vertical move
                        px = (i % (canvas.width / GRID_SIZE)) * GRID_SIZE + GRID_SIZE / 2;
                        py = t - canvas.width;
                    }

                    ctx.globalAlpha = 0.8;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [hoverState]); // Re-bind if hoverState changes, or handle inside ref

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full" />
            {/* Gradient Overlay to blend with content */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>
    );
}
