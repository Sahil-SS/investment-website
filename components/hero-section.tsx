"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const backgrounds = [
  "/images/finance1.jpg",
  "/images/finance2.jpg",
  "/images/finance3.jpg",
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % backgrounds.length),
      5000 // change every 5 seconds
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      
      {/* Background images */}
      <AnimatePresence>
        {backgrounds.map((src, index) =>
          index === current ? (
            <motion.img
              key={index}
              src={src}
              alt="finance background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null
        )}
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Text */}
      <motion.div
        className="z-10 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Empower Your Financial Future
        </motion.h1>
        <motion.p
          className="text-gray-300 mb-8 text-lg md:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Join the most advanced investment ecosystem designed for smart traders and investors.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(0,123,255,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 px-8 py-3 rounded-lg font-semibold text-white hover:bg-blue-700 transition"
        >
          Join Now
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
