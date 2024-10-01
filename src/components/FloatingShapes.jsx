import React from "react";
import { motion } from "framer-motion";

const shapes = Array.from({ length: 12 }); // Change this number to adjust the amount of floating shapes

const FloatingShapes = () => {
  return (
    <div className="shape-container">
      {shapes.map((_, index) => (
        <motion.div
          key={index}
          className="shape"
          initial={{
            opacity: 0,
            y: "100vh",
          }}
          animate={{
            opacity: 1,
            y: ["100vh", Math.random() * -200 - 100],
          }}
          transition={{
            duration: Math.random() * 3 + 2, // Random duration between 2-5 seconds
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%", // Randomly decide if it's a circle or square
            width: Math.random() * 40 + 20, // Random width between 20 and 60px
            height: Math.random() * 40 + 20, // Random height between 20 and 60px
            position: "absolute",
            left: `${Math.random() * 100}vw`, // Random horizontal position
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
