import React from "react";
import { motion } from "framer-motion";
import './Bubbles.css';

const bubbles = Array.from({ length: 10 }); // Adjust the number of bubbles as needed

const RandomBubbles = () => {
  return (
    <div className="bubble-container">
      {bubbles.map((_, index) => (
        <motion.div
          key={index}
          className="bubble"
          initial={{
            opacity: 0,
            x: `${Math.random() * 100}vw`, // Start at a random horizontal position
            y: `${Math.random() * 100}vh`, // Start at a random vertical position
          }}
          animate={{
            opacity: 1,
            x: [
              `${Math.random() * 100}vw`, // Move to another random position
              `${Math.random() * 100}vw`,
              `${Math.random() * 100}vw`,
            ],
            y: [
              `${Math.random() * 100}vh`, // Move to another random position
              `${Math.random() * 100}vh`,
              `${Math.random() * 100}vh`,
            ],
          }}
          transition={{
            duration: Math.random() * 4 + 2, // Random duration between 2-6 seconds
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            backgroundColor: `rgba(0, 150, 255, 0.5)`, // Bubble color
            borderRadius: "50%", // Circular shape
            width: Math.random() * 30 + 20, // Random width between 20 and 50px
            height: Math.random() * 30 + 20, // Random height between 20 and 50px
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
};

export default RandomBubbles;
