"use client";

import { User } from "@supabase/supabase-js";

interface NavbarProps {
  user: User;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <div className="text-2xl font-bold">InvestWise</div>
      <div>
        <p>
          Welcome back,{" "}
          <span className="font-semibold">{user.user_metadata?.name}</span>
        </p>
        <p className="text-sm text-gray-400">
          Ready to place your next order?
        </p>
      </div>
      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-sm">
        Msg
      </div>
    </header>
  );
}
