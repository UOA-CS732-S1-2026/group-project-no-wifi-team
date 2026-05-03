import { AnimatePresence, motion } from "motion/react";

export function FloatingScore({ points }: { points: number | string }) {
  return (
    <AnimatePresence>
      {points && (
        <motion.div
          key={points}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: -20, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="floating-score"
        >
          +{points}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
