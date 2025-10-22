"use client";

import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface OrderFormProps {
  userId: string;
}

export default function OrderForm({ userId }: OrderFormProps) {
  const supabase = useSupabaseClient();
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("orders").insert([{ user_id: userId, amount }]);
    if (!error) {
      setSuccess(true);
      setAmount("");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Place Order</h2>
      {success && <p className="text-green-500 mb-3">Order placed successfully!</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
