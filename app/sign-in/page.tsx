"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-950 relative overflow-hidden">
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
        className="relative z-10 w-[22rem] p-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-white tracking-wide">
          Sign In
        </h1>

        {errorMsg && (
          <p className="text-red-400 text-center text-sm">{errorMsg}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 outline-none"
        />

        <motion.button
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 8px 20px rgba(16, 185, 129, 0.4)",
          }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-semibold text-white tracking-wide transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>

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
