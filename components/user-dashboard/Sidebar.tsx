"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, LogOut } from "lucide-react";

interface UserProfile {
  name?: string;
  email?: string;
  username?: string;
}

export default function Sidebar({ active }: { active: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/sign-in");
      } else {
        setUser({
          name: user.user_metadata?.name || "Anonymous",
          username: user.user_metadata?.username || "user",
          email: user.email || "no-email",
        });
      }
      setLoading(false);
    };

    checkSession();

    // Optional: Listen for logout/login in other tabs
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) router.replace("/sign-in");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  if (loading) {
    return (
      <div className="w-64 h-screen flex items-center justify-center bg-black text-gray-500">
        Checking session...
      </div>
    );
  }

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-[#060807] border-r border-gray-800 p-6 flex flex-col justify-between text-white"
    >
      <div>
        <h1 className="text-2xl font-bold text-green-400 mb-8">InvestWise</h1>

        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="mt-2 text-lg font-medium">{user?.name}</p>
          <p className="text-gray-500 text-sm">@{user?.username}</p>
          <p className="text-gray-600 text-xs mt-1">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <button
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition ${
              active === "home"
                ? "bg-green-600/20 text-green-400"
                : "hover:bg-gray-800/40"
            }`}
          >
            <Home className="w-5 h-5" /> Home
          </button>
          <button
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition ${
              active === "profile"
                ? "bg-green-600/20 text-green-400"
                : "hover:bg-gray-800/40"
            }`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-900/30 transition cursor-pointer"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </motion.aside>
  );
}
