"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Order {
  id: number;
  user_id: string;
  min: number;
  max: number;
  created_at: string;
}

interface OrderHistoryProps {
  userId: string;
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from<Order>("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setOrders(data || []);
    };

    fetchOrders();

    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders", filter: `user_id=eq.${userId}` },
        (payload) => setOrders((prev) => [payload.new, ...prev])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  return (
    <div className="w-full max-w-md bg-gray-900 p-4 rounded text-white space-y-2">
      <h2 className="text-xl font-bold">Order History</h2>
      {orders.length === 0 && <p>No orders yet</p>}
      {orders.map((order) => (
        <div key={order.id} className="border-b border-gray-700 py-2 flex justify-between">
          <span>
            Min: {order.min}, Max: {order.max}
          </span>
          <span className="text-gray-400">{new Date(order.created_at).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
