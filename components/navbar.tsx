"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-white">

        {/* Logo */}
        <motion.div
          animate={{ scale: scrolled ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <Link href="/" className="text-xl font-bold tracking-wide">
            InvestWise
          </Link>
        </motion.div>

        {/* Nav Links */}
        <motion.div
          className="space-x-6 hidden md:flex"
          animate={{ scale: scrolled ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {["Home", "About Us", "Opportunity", "Ecosystem", "Contact Us"].map(
            (item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="hover:text-blue-400 transition"
              >
                {item}
              </Link>
            )
          )}
        </motion.div>

        {/* Auth Buttons */}
        <motion.div
          className="space-x-4 hidden md:flex"
          animate={{ scale: scrolled ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <Link
            href="/sign-in"
            className="px-3 py-1 border border-gray-400 rounded-md hover:bg-white hover:text-black transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </motion.div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
