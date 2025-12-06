'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

export default function AnimatedCounter({
    end,
    duration = 2,
    suffix = '',
    prefix = '',
    className = '',
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isInView && !hasAnimated.current) {
            hasAnimated.current = true;
            
            const startTime = Date.now();
            const endTime = startTime + duration * 1000;

            const animate = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / (duration * 1000), 1);
                
                // Easing function for smooth animation
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOut * end);
                
                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [isInView, end, duration]);

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            {prefix}{count.toLocaleString()}{suffix}
        </motion.span>
    );
}



