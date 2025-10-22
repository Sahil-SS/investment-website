"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Sidebar from "@/components/user-dashboard/Sidebar";
import Navbar from "@/components/user-dashboard/Navbar";
import OrderSection from "@/components/user-dashboard/OrderSection";
import { supabase } from "@/lib/supabaseClient";


export default function DashboardPage() {
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/sign-in"; // redirect to login
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />
        <main className="flex flex-col items-center p-8 space-y-8">
          <OrderSection user={user} />
        </main>
      </div>
    </div>
  );
}
