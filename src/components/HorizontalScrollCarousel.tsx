'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Target, Search, CheckCircle, Zap, TrendingUp, Clock, Users, LucideIcon } from "lucide-react";

// Throttle utility for resize handler
function throttle(fn: (...args: any[]) => any, wait: number) {
    let shouldWait = false;
    return function throttledFunction(this: any, ...args: any[]) {
        if (!shouldWait) {
            fn.apply(this, args);
            shouldWait = true;
            setTimeout(() => (shouldWait = false), wait);
        }
    };
}

// Hook to get element's scroll position range
function useElementViewportPosition(ref: React.RefObject<HTMLElement | null>) {
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        if (!ref || !ref.current) return;

        const updatePosition = () => {
            if (!ref.current) return;
            const pageHeight = document.body.scrollHeight - window.innerHeight;
            const start = ref.current.offsetTop;
            const end = start + ref.current.offsetHeight - window.innerHeight;
            
            // Clamp values between 0 and 1
            const startRatio = Math.max(0, Math.min(1, start / pageHeight));
            const endRatio = Math.max(0, Math.min(1, end / pageHeight));
            
            setPosition([startRatio, endRatio]);
        };

        // Initial calculation
        updatePosition();
        
        // Recalculate on resize
        window.addEventListener('resize', updatePosition);
        
        // Recalculate after DOM settles
        const timeouts = [
            setTimeout(updatePosition, 100),
            setTimeout(updatePosition, 500),
            setTimeout(updatePosition, 1000),
        ];
        
        return () => {
            window.removeEventListener('resize', updatePosition);
            timeouts.forEach(clearTimeout);
        };
    }, [ref]);

    return { position };
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Briefcase,
    Target,
    Search,
    CheckCircle,
    Zap,
    TrendingUp,
    Clock,
    Users,
};

interface CarouselItem {
    id: number;
    step: number;
    title: string;
    description: string;
    icon: string;
}

interface HorizontalScrollCarouselProps {
    items: CarouselItem[];
}

export default function HorizontalScrollCarousel({ items }: HorizontalScrollCarouselProps) {
    const mainRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const { position } = useElementViewportPosition(mainRef);
    const [carouselEndPosition, setCarouselEndPosition] = useState(0);
    const { scrollYProgress } = useScroll();

    // Transform scroll progress to horizontal position
    const x = useTransform(scrollYProgress, position, [0, carouselEndPosition]);

    // Calculate how far the carousel needs to move
    useEffect(() => {
        if (!carouselRef.current) return;

        const parent = carouselRef.current.parentElement;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        const calculateEndPosition = () => {
            if (carouselRef.current && parent) {
                const carouselWidth = carouselRef.current.scrollWidth;
                const viewportWidth = window.innerWidth;
                const parentOffset = (parent as HTMLElement).offsetLeft;
                
                // End position = how far left we need to scroll to see the last card
                const endPosition = carouselWidth - viewportWidth + scrollbarWidth + parentOffset * 2;
                setCarouselEndPosition(-endPosition);
            }
        };

        calculateEndPosition();

        const handleResize = throttle(calculateEndPosition, 10);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [items]);

    return (
        <section ref={mainRef}>
            {/* Container with scroll height - this creates the scroll distance */}
            <div className="w-full mx-auto" style={{ height: '300vh' }}>
                {/* Sticky container - stays in view while scrolling */}
                <div className="sticky top-0 h-screen w-full flex flex-col items-start justify-center overflow-hidden bg-[#e8eef5]">
                    {/* Header */}
                    <div className="absolute top-16 sm:top-20 left-0 right-0 text-center z-10 px-4">
                        <h2 className="text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
                            How It Works
                        </h2>
                        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#4a4e69] sm:text-xl">
                            Simple steps to your next dream job.
                        </p>
                    </div>

                    {/* Horizontal Carousel */}
                    <motion.div
                        ref={carouselRef}
                        className="flex gap-10"
                        style={{ x }}
                    >
                        {items.map((item) => {
                            const IconComponent = iconMap[item.icon] || Briefcase;
                            return (
                                <motion.div
                                    key={item.id}
                                    className="group shrink-0"
                                    initial={{ opacity: 0.5, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ amount: 0.8, once: false }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                >
                                    <Card className="w-[300px] sm:w-[320px] h-[380px] sm:h-[400px] flex flex-col justify-center hover:-translate-y-2 transition-all duration-300 bg-white border-[#b8c5d6]/30 shadow-xl hover:shadow-2xl">
                                        <CardHeader className="text-center">
                                            <div className="flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#5b6fa3] text-white text-3xl sm:text-4xl font-bold mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-2 border-[#5b6fa3] relative overflow-hidden">
                                                <span className="absolute inset-0 flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity">
                                                    {item.step}
                                                </span>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#22223b]">
                                                    <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl sm:text-2xl mb-3 sm:mb-4 text-[#22223b]">
                                                {item.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm sm:text-base text-[#4a4e69] px-2">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex justify-center">
                        <div className="text-sm text-[#22223b] flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg border border-[#b8c5d6]/30">
                            <motion.span
                                animate={{ x: [-4, 4, -4] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-[#5b6fa3]"
                            >
                                ←
                            </motion.span>
                            <span className="text-xs sm:text-sm">Scroll to explore</span>
                            <motion.span
                                animate={{ x: [4, -4, 4] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                className="text-[#5b6fa3]"
                            >
                                →
                            </motion.span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
