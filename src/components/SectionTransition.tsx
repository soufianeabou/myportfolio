import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  index: number;
  currentSection: number;
}

export default function SectionTransition({ children, index, currentSection }: SectionTransitionProps) {
  const isActive = index === currentSection;
  const isNext = index === currentSection + 1;
  const isPrev = index === currentSection - 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      animate={{
        opacity: isActive ? 1 : isNext || isPrev ? 0.5 : 0,
        y: isActive ? 0 : isNext ? 50 : isPrev ? -50 : 0,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-screen flex flex-col justify-center items-center px-8 relative"
    >
      {children}
    </motion.section>
  );
} 