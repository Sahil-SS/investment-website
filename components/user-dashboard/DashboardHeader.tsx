"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardHeader() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.name || "Investor");
      }
    };
    fetchUser();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-white mb-2">
        Welcome back, {name} 👋
      </h1>
      <p className="text-gray-500">
        Manage your investments and track your portfolio
      </p>
    </motion.div>
  );
}
