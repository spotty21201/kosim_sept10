"use client";

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardStepProps {
  children: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  stepNumber: number;
  totalSteps: number;
}

export function WizardStep({ 
  children, 
  title, 
  description, 
  isActive,
  stepNumber,
  totalSteps 
}: WizardStepProps) {
  if (!isActive) return null;
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <AnimatePresence
      mode="wait"
      custom={stepNumber > 2 ? 1 : -1}
    >
      <motion.div
        key={stepNumber}
        custom={stepNumber > 2 ? 1 : -1}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        className="space-y-6"
      >
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <motion.span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                  delay: 0.4
                }}
              >
                {stepNumber}
              </motion.span>
              <span>Step {stepNumber} of {totalSteps}</span>
            </motion.div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </motion.div>
        <motion.div 
          className="space-y-4 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {children}
          
          <motion.div 
            className="flex justify-between mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {stepNumber > 1 && (
              <motion.div 
                className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous step</span>
              </motion.div>
            )}
            {stepNumber < totalSteps && (
              <motion.div 
                className="flex items-center gap-1 ml-auto cursor-pointer hover:text-foreground transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next step</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
