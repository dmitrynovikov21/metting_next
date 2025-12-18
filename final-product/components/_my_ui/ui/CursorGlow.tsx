"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CursorGlow() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 100 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 300);
            cursorY.set(e.clientY - 300);
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed pointer-events-none z-0 mix-blend-screen"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                width: 600,
                height: 600,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, rgba(255,107,53,0.01) 40%, transparent 70%)",
            }}
        />
    );
}
