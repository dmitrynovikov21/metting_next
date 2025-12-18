"use client";

import { motion } from "framer-motion";

export default function AmbientBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <motion.div
                className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-accent-primary/5 blur-[120px]"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-accent-warning/5 blur-[100px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </div>
    );
}
