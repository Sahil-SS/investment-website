"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4 sm:px-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-[url('/images/mumbai.jpg')] bg-cover bg-center brightness-[0.35]"
        aria-hidden="true"
      ></div>

      {/* Animated Glow */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] bg-[#db071d]/40 rounded-full blur-3xl z-0"
      />

      {/* Main Card */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-[0_0_50px_-10px_rgba(219,7,29,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]/60"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#7a0010] p-6 sm:p-8 text-white text-center">
          {/* 🏢 Company Logo */}
          <div className="flex justify-center mb-4 w-40 sm:w-52 md:w-72">
            <Image
              src="/images/logo_white.png"
              alt="Company Logo"
              width={2000}
              height={1000}
              className="w-full drop-shadow-[0_0_25px_rgba(250,204,21,0.6)] hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-yellow-300">Welcome</h2>

          <p className="text-xs sm:text-sm text-yellow-300 mt-4 italic">
            “Your access is protected with end-to-end encryption.”
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-8 text-gray-800 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center text-[#db071d] mb-6">
            Log In
          </h1>

          {errorMsg && (
            <p className="text-red-600 text-center font-medium mb-2 text-sm">
              ❌ {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#db071d]/80 transition-all duration-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#db071d]/80 transition-all duration-300"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-[#b10018] hover:to-[#db071d] transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>

            <p
              onClick={() => router.push("/")}
              className="text-center text-sm text-gray-600 mt-3 cursor-pointer"
            >
              Don’t have an account?{" "}
              <span className="text-[#db071d] font-semibold cursor-pointer hover:underline">
                Register
              </span>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
