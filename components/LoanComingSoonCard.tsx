"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const LoanComingSoonCard = () => {
  const [timer, setTimer] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const launchDate = new Date("2026-01-15T10:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimer({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/10 backdrop-blur-lg border border-[#db071d]/40 rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl mx-auto text-white"
    >
      <div className="flex flex-col md:flex-row min-h-[700px]">
        {/* LEFT - RED SIDE */}
        <div className="md:w-1/2 flex flex-col justify-between bg-[#db071d] p-10 md:p-14 text-center relative">
          {/* Logo */}
          <div className="w-40 md:w-52 mx-auto">
            <Image
              src="/images/logo_white.png"
              alt="Company Logo"
              width={200}
              height={200}
              className="object-contain mx-auto"
            />
          </div>

          {/* People waiting image */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/images/people-placeholder.png"
              alt="People waiting"
              width={600}
              height={400}
              className="object-contain w-4/5 max-w-[400px] mx-auto"
            />
          </motion.div>

          <p className="text-white/80 text-sm mt-6">
            Faster approvals. Seamless experience.
          </p>
        </div>

        {/* RIGHT - WHITE SIDE */}
        <div className="md:w-1/2 bg-white flex flex-col justify-center items-center text-center p-10 relative">
          {/* COMING SOON text (smaller now) */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-[#db071d] mb-8 tracking-wide"
          >
            COMING&nbsp;SOON!
          </motion.h1>

          {/* Phone Image */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <Image
              src="/images/phone.png"
              alt="Phone mockup"
              width={250}
              height={400}
              className="object-contain w-2/3 max-w-[250px] mx-auto"
            />
          </motion.div>

          {/* Launch Date - Signature Red */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-10 px-8 py-3 rounded-full bg-[#db071d] text-white text-lg md:text-xl font-semibold shadow-md"
          >
            Launching on <span className="text-yellow-300 font-bold">January 15, 2026</span>
          </motion.div>

          {/* Countdown Timer */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(timer).map(([unit, value]) => (
              <div
                key={unit}
                className="flex flex-col items-center bg-[#db071d]/10 rounded-xl px-5 py-4 border border-[#db071d]/30 hover:scale-105 transition-transform"
              >
                <span className="text-3xl font-extrabold text-[#db071d]">
                  {value}
                </span>
                <span className="text-sm text-gray-700 capitalize">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoanComingSoonCard;
