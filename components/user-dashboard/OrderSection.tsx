"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function OrderSection() {
  const [amount, setAmount] = useState<number | "">("");
  const [minLimit] = useState(1000);
  const [maxLimit] = useState(5000);

  const isWithinLimit =
    typeof amount === "number" && amount >= minLimit && amount <= maxLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 shadow-lg max-w-2xl"
    >
      <h2 className="text-2xl font-semibold mb-2 text-green-400">
        $ Place New Order
      </h2>
      <p className="text-gray-500 mb-6">
        Enter an amount between {minLimit}$ and {maxLimit}$
      </p>

      <input
        type="number"
        placeholder={`Limit: Min ${minLimit} - Max ${maxLimit}`}
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value ? parseInt(e.target.value) : "")
        }
        className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 placeholder-gray-500 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition mb-6"
      />

      <motion.button
        whileHover={isWithinLimit ? { scale: 1.03 } : {}}
        whileTap={isWithinLimit ? { scale: 0.97 } : {}}
        disabled={!isWithinLimit}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isWithinLimit
            ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:shadow-green-500/20"
            : "bg-gray-800 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isWithinLimit ? "Place Order & Pay Now" : "Enter Valid Amount to Pay"}
      </motion.button>
    </motion.div>
  );
}
