import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ANIMATION_EASE = [0.16, 1, 0.3, 1];
const ANIMATION_DURATION = 0.9;

export function ScrollReveal({
  children,
  className = "",
  staggerDelay = 0.15,
}) {
  const childrenArray = React.Children.toArray(children);
  const isMultiple = childrenArray.length > 1;

  if (isMultiple) {
    const listVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
        },
      },
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={listVariants}
        className={className}
      >
        {childrenArray.map((child, i) => (
          <motion.div key={i} variants={itemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: ANIMATION_DURATION, ease: ANIMATION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
