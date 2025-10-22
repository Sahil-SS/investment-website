"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

interface OrderSectionProps {
  user: User;
}

export default function OrderSection({ user }: OrderSectionProps) {
  const [min, setMin] = useState<number | "">("");
  const [max, setMax] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!min || !max) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .insert([{ user_id: user.id, min, max }]);
    if (error) console.error(error);
    else console.log("Order placed:", data);
    setLoading(false);
    setMin("");
    setMax("");
  };

  return (
    <div className="bg-gray-800 p-6 rounded text-white space-y-4 w-full max-w-md">
      <h2 className="text-xl font-bold">Place Order</h2>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        className="p-2 rounded w-full text-black"
      />
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        className="p-2 rounded w-full text-black"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Placing..." : "Pay Now"}
      </button>
    </div>
  );
}
