"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-black relative overflow-hidden">
      {/* Subtle Glow Behind Card */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.95 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-96 h-96 bg-green-500 rounded-2xl blur-3xl z-0"
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-96 p-10 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-white tracking-wide">
          Sign In
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
        />

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-semibold text-white tracking-wide transition"
        >
          Sign In
        </motion.button>

        {/* Bottom message */}
        <p className="text-center text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/sign-up")}
            className="text-green-500 font-semibold cursor-pointer hover:underline"
          >
            Create one
          </span>
        </p>
      </motion.form>
    </div>
  );
}
