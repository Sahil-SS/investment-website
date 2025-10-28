"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

// Define types
type SupabaseUser = {
  name: string;
  email: string;
  phone: string;
};

type FormData = {
  name: string;
  phone: string;
  amount: string;
  utr: string;
};

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "loan">("home");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    amount: "",
    utr: "",
  });
  const [status, setStatus] = useState("");

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/sign-in");
      } else {
        setUser({
          name: (user.user_metadata?.name as string) || "Investor",
          email: user.email ?? "",
          phone: (user.user_metadata?.phone as string) || "Not Provided",
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/sign-in");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    // Get current user first
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || !user) {
      setStatus("❌ Not logged in");
      return;
    }

    // Insert into Supabase with user_id
    const { error } = await supabase.from("payments").insert([
      {
        name: form.name,
        phone: form.phone,
        amount: form.amount,
        utr: form.utr,
        email: user.email,
        user_id: currentUser.id,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("❌ Error submitting payment");
    } else {
      setStatus("✅ Investment submitted successfully!");
      setForm({ name: "", phone: "", amount: "", utr: "" });
      setTimeout(() => setStatus(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a] text-white flex flex-col">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-gray-800 bg-black/60 backdrop-blur-xl sticky top-0 z-20">
        {/* Left side user info */}
        <div>
          <h1 className="text-xl font-bold text-green-400">{user?.name}</h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <p className="text-sm text-gray-400">{user?.phone}</p>
        </div>

        {/* Center Nav Links */}
        <div className="flex gap-8">
          {["home", "profile", "loan"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "home" | "profile" | "loan")}
              className={`capitalize text-sm font-medium px-4 py-2 rounded-lg transition ${
                activeTab === tab
                  ? "bg-green-600/20 text-green-400"
                  : "hover:text-green-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      {/* MAIN SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        {activeTab === "home" && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-10 text-center"
            >
              Welcome back, {user?.name} 👋 <br />
              <span className="text-green-400">Your Investment Dashboard</span>
            </motion.h1>

            {/* Payment Card */}
            <motion.div
              className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-[0_0_50px_-10px_rgba(16,185,129,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-green-500/60"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* LEFT QR SIDE */}
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-green-700 to-green-900 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2 text-yellow-300">
                  EAST INDIA PROMOTER
                </h2>
                <p className="text-lg font-semibold mb-3">THE ARCHITIZER</p>

                <h3 className="text-xl font-semibold mb-3">Scan & Pay</h3>
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <Image
                    src="/images/qr.jpg"
                    alt="GPay QR"
                    width={180}
                    height={180}
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm text-white/80 mt-3 text-center">
                  Scan and pay securely using your preferred app.
                </p>
                <p className="mt-2 text-sm font-semibold text-yellow-300">
                  UPI ID:{" "}
                  <span className="text-white">
                    msthearchitizer.eazypay1@icici
                  </span>
                </p>
                <p className="text-xs text-white mt-3 text-center">
                  Once verified by our team, you’ll receive a confirmation email.
                </p>
              </div>

              {/* RIGHT FORM SIDE */}
              <div className="md:w-1/2 bg-white p-8 text-gray-800 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
                  Your Investment
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(
                    [
                      { name: "name", placeholder: "Full Name", type: "text" },
                      {
                        name: "phone",
                        placeholder: "Phone Number",
                        type: "tel",
                      },
                      {
                        name: "amount",
                        placeholder: "Investment Amount (₹)",
                        type: "number",
                      },
                      {
                        name: "utr",
                        placeholder: "Transaction ID / UTR Number",
                        type: "text",
                      },
                    ] as const
                  ).map((field) => (
                    <input
                      key={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      type={field.type}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                      required
                    />
                  ))}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    Submit Investment
                  </motion.button>

                  {status && (
                    <p
                      className={`text-center text-sm mt-2 ${
                        status.includes("✅")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status}
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "profile" && (
          <div className="text-center text-gray-400">
            <h2 className="text-2xl mb-3 font-bold text-green-400">Profile</h2>
            <p>Profile page coming soon...</p>
          </div>
        )}

        {activeTab === "loan" && (
          <div className="text-center text-gray-400">
            <h2 className="text-2xl mb-3 font-bold text-green-400">Loan</h2>
            <p>Loan section coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
