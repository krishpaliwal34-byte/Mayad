'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 35 };
      case 'down':
        return { opacity: 0, y: -35 };
      case 'left':
        return { opacity: 0, x: -40 };
      case 'right':
        return { opacity: 0, x: 40 };
      case 'scale':
        return { opacity: 0, scale: 0.94 };
      default:
        return { opacity: 0, y: 35 };
    }
  };

  const getTargetState = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={getTargetState()}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1], // Custom smooth deceleration curve
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
