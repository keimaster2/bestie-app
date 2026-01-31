"use client";

import React from 'react';

// Custom hook for smooth number transition
const useAnimatedCounter = (targetValue: number, duration: number = 2000) => {
    const [displayValue, setDisplayValue] = React.useState(targetValue);
    const startTimeRef = React.useRef<number | null>(null);
    const startValueRef = React.useRef(targetValue);

    React.useEffect(() => {
        startValueRef.current = displayValue;
        startTimeRef.current = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);

            // Ease-out expo for "rolling" feel
            const easeOut = (x: number) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x);

            const current = startValueRef.current + (targetValue - startValueRef.current) * easeOut(percentage);
            setDisplayValue(current);

            if (percentage < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [targetValue, duration]);

    return Math.floor(displayValue);
};

export function LionGreeting() {
    const [activeUsers, setActiveUsers] = React.useState(30);

    // Smoothly animate to the new random value
    const animatedUsers = useAnimatedCounter(activeUsers);

    React.useEffect(() => {
        // Initial start near the target
        setActiveUsers(40 + Math.floor(Math.random() * 20));

        const interval = setInterval(() => {
            setActiveUsers(prev => {
                // 1. Calculate gravity (tendency to return to 50)
                const distance = prev - 50;
                let direction = 0; // 0 = random, 1 = up, -1 = down

                // If far from 50, strong pull back
                if (Math.abs(distance) > 20) {
                    direction = distance > 0 ? -1 : 1;
                } else {
                    // Slight bias even when close
                    direction = Math.random() > 0.4 ? (distance > 0 ? -1 : 1) : (Math.random() > 0.5 ? 1 : -1);
                }

                // 2. Generate magnitude (5 to 20)
                const magnitude = 5 + Math.floor(Math.random() * 16);

                // 3. Apply change
                let next = prev + (magnitude * direction);

                // 4. Hard Clamp (10 - 100)
                if (next < 10) next = 10 + Math.floor(Math.random() * 10);
                if (next > 100) next = 100 - Math.floor(Math.random() * 10);

                return next;
            });
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm">
            {/* Animated Lion Avatar */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-indigo-500/10 rounded-full overflow-hidden pt-2.5">
                <span className="text-lg filter drop-shadow-[0_0_5px_rgba(165,180,252,0.5)] animate-bounce" style={{ animationDuration: '3s' }}>
                    🦁
                </span>
                <div className="absolute inset-0 border border-indigo-400/20 rounded-full animate-pulse"></div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--foreground)] opacity-80 leading-none font-mono tracking-tighter tabular-nums">
                        {animatedUsers.toLocaleString()}人と
                    </span>
                    <span className="text-[8px] text-indigo-500 dark:text-indigo-300 font-medium leading-none px-1 py-0.5 bg-indigo-500/10 rounded">
                        いっしょ
                    </span>
                </div>
                <p className="text-[7px] text-[var(--foreground)] opacity-40 tracking-[0.05em] mt-0.5 font-bold">
                    ここを選んでくれて、ありがとう
                </p>
            </div>

            {/* Soft Breathing Indicator */}
            <div className="ml-1 w-1.5 h-1.5 bg-green-400/40 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.3)]"></div>
        </div>
    );
}
