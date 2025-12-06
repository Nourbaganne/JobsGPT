'use client';

import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef } from 'react';
import { Brain, Building2, Mail, Bell, FileText, LayoutDashboard, LucideIcon } from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Job Matching',
    description:
      'Smart algorithms analyze your skills, experience, and preferences to find jobs that are a perfect fit for your career goals. No more endless scrolling through irrelevant listings.',
    icon: Brain,
    color: '#22223b',
  },
  {
    title: 'Company Intel',
    description:
      'Get insider access to CEO contacts, hiring managers, and recruiter details. Know exactly who to reach out to and make connections that matter. Skip the application black hole.',
    icon: Building2,
    color: '#5b6fa3',
  },
  {
    title: 'AI Email Generator',
    description:
      'Generate personalized outreach emails to HR and recruiters. Stand out with tailored messages that get responses. Our AI crafts compelling emails that highlight your unique value.',
    icon: Mail,
    color: '#6b7db3',
  },
  {
    title: 'Real-time Alerts',
    description:
      'Instant notifications when new matching jobs are posted. Be the first to apply and beat the competition. Never miss an opportunity that matches your criteria.',
    icon: Bell,
    color: '#5b6fa3',
  },
  {
    title: 'Resume Analysis',
    description:
      'AI-powered resume optimization. Get insights on how to improve your resume for each specific role. Understand what employers are looking for and tailor your application.',
    icon: FileText,
    color: '#22223b',
  },
  {
    title: 'Application Tracker',
    description:
      'Track all your applications in one place. Never lose track of where you applied, interview schedules, or follow-up dates. Stay organized throughout your job search journey.',
    icon: LayoutDashboard,
    color: '#2d3047',
  },
];

export default function StackingCards() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={container} className="relative bg-white">
      {/* Header - Sticky at top */}
      <div className="sticky top-0 z-10 bg-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-[#22223b] sm:text-4xl lg:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-[#4a4e69] sm:text-xl max-w-3xl mx-auto">
            Our platform provides comprehensive tools and insights to give you an unfair advantage in your job search.
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="relative">
        {features.map((feature, i) => {
          const targetScale = 1 - (features.length - i) * 0.05;
          return (
            <Card
              key={`feature_${i}`}
              i={i}
              title={feature.title}
              description={feature.description}
              Icon={feature.icon}
              color={feature.color}
              progress={scrollYProgress}
              range={[i * 0.15, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  Icon: LucideIcon;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  Icon,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 30}px)`,
        }}
        className="relative -top-[10%] w-[90%] max-w-4xl origin-top"
      >
        <motion.div
          style={{ opacity }}
          className="rounded-3xl p-8 md:p-12 shadow-2xl border border-[#c9ada7]/20"
          initial={{ backgroundColor: '#ffffff' }}
        >
          {/* Gradient Background */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-10"
            style={{ backgroundColor: color }}
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            {/* Icon */}
            <div 
              className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: color }}
            >
              <Icon className="h-10 w-10 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="text-sm font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[#22223b]">
                  {title}
                </h3>
              </div>
              <p className="text-lg text-[#4a4e69] leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div 
            className="absolute top-4 right-4 w-24 h-24 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: color }}
          />
          <div 
            className="absolute bottom-4 left-4 w-32 h-32 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: color }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

