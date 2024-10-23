import React from "react";
import { motion } from "framer-motion";

const VoiceAssistant = () => {
  // Larger wave animation for sound visualization
  const waveVariants = {
    animate: {
      scale: [1, 2, 1],
      opacity: [0.7, 0, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Microphone movement (representing "talking")
  const micVariants = {
    animate: {
      y: [0, -5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="voice-assistant-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        {/* Robot head */}
        <rect x="100" y="80" width="100" height="100" fill="#4e77f0" rx="15" />

        {/* Robot eyes */}
        <circle cx="125" cy="110" r="10" fill="#fff" />
        <circle cx="175" cy="110" r="10" fill="#fff" />

        {/* Pupils */}
        <motion.circle
          cx="125"
          cy="110"
          r="5"
          fill="#39fdd2"
          animate={{ x: [0, 1, -1, 0], y: [0, 1, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="175"
          cy="110"
          r="5"
          fill="#39fdd2"
          animate={{ x: [0, 1, -1, 0], y: [0, 1, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Robot headphones */}
        <rect x="90" y="70" width="20" height="60" fill="#39fdd2" rx="10" />
        <rect x="190" y="70" width="20" height="60" fill="#39fdd2" rx="10" />

        {/* Microphone (mouth area) */}
        <motion.rect
          x="135"
          y="150"
          width="30"
          height="40"
          fill="#fff"
          rx="10"
          variants={micVariants}
          animate="animate"
        />
        <motion.rect
          x="140"
          y="190"
          width="20"
          height="10"
          fill="#4e77f0"
          variants={micVariants}
          animate="animate"
        />

        {/* Continuous Sound Waves */}
        <motion.circle
          cx="150"
          cy="150"
          r="70"
          stroke="#39fdd2"
          strokeWidth="4"
          fill="transparent"
          variants={waveVariants}
          animate="animate"
        />
        <motion.circle
          cx="150"
          cy="150"
          r="90"
          stroke="#4e77f0"
          strokeWidth="4"
          fill="transparent"
          variants={waveVariants}
          animate="animate"
        />
        <motion.circle
          cx="150"
          cy="150"
          r="110"
          stroke="#39fdd2"
          strokeWidth="4"
          fill="transparent"
          variants={waveVariants}
          animate="animate"
        />
      </svg>
    </div>
  );
};

export default VoiceAssistant;
