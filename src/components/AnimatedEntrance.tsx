import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedEntranceProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  delay?: number;
}

const AnimatedEntrance: React.FC<AnimatedEntranceProps> = ({
  children,
  index = 0,
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.4,
      delay: delay + index * 0.06,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    {children}
  </motion.div>
);

export default AnimatedEntrance;
