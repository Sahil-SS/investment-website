"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  const [activeTab, setActiveTab] = useState<
    "home" | "profile" | "loan" | "payment"
  >("payment");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    amount: "",
    utr: "",
  });
  const [status, setStatus] = useState("");
  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  const triggerConfetti = async () => {
    if (typeof window === "undefined") return;
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#db071d", "#ffffff", "#facc15"],
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Submitting...");

    const phonePattern = /^[0-9]{10}$/;
    const utrPattern = /^[0-9]{12}$/;

    if (!phonePattern.test(form.phone)) {
      setPopup({
        type: "error",
        message: "📞 Phone number must be exactly 10 digits.",
      });
      return;
    }

    if (!utrPattern.test(form.utr)) {
      setPopup({
        type: "error",
        message: "💳 Transaction ID must be exactly 12 digits.",
      });
      return;
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || !user) {
      setPopup({ type: "error", message: "You are not logged in!" });
      return;
    }

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
      console.error("❌ Payment insert error:", error);
      setPopup({
        type: "error",
        message: "❌ Payment submission failed. Please try again.",
      });
    } else {
      console.log("✅ Payment inserted successfully!");
    }

    if (error) {
      setPopup({
        type: "error",
        message: "❌ Payment submission failed. Please try again.",
      });
    } else {
      setForm({ name: "", phone: "", amount: "", utr: "" });
      setPopup({
        type: "success",
        message:
          "🎉 Your payment has been registered successfully! Once your payment is verified by our admin team, they will contact you. Your ID will be activated within 24–48 hours after verification.",
      });
      triggerConfetti();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex bg-black text-gray-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/mumbai.jpg"
          alt="Luxury Property"
          fill
          className="object-cover brightness-[0.35]"
          priority
        />
      </div>

      {/* SIDEBAR */}
      <aside className="relative z-20 w-60 sm:w-64 bg-black/40 backdrop-blur-md border-r border-[#db071d]/60 flex flex-col justify-between py-8 px-4 sm:px-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/80">{user?.email}</p>
          <p className="text-xs sm:text-sm text-white/80 mb-6">{user?.phone}</p>

          <div className="flex flex-col gap-2 sm:gap-3">
            {["home", "profile", "payment", "loan"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "home" | "loan" | "profile" | "payment")
                }
                className={`capitalize cursor-pointer text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition text-left ${
                  activeTab === tab
                    ? "bg-[#db071d]/80 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 w-full px-3 sm:px-4 py-2 bg-[#db071d]/80 hover:bg-[#b40618]/90 text-white rounded-lg transition text-sm sm:text-base"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-white">
        {activeTab === "home" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            🏠 Your Dashboard, Coming Soon...
          </h2>
        )}
        {activeTab === "loan" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            💰 Loan Section, Coming Soon...
          </h2>
        )}
        {activeTab === "profile" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            👤 Profile Section, Coming Soon...
          </h2>
        )}

        {/* PAYMENT TAB */}
        {activeTab === "payment" && (
          <motion.div
            className="relative z-10 flex flex-col md:flex-row w-full max-w-3xl md:max-w-4xl rounded-2xl shadow-[0_0_40px_-10px_rgba(219,7,29,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]/60"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* LEFT SIDE */}
            <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#7a0010] p-6 sm:p-8 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-yellow-300">
                EAST INDIA PROMOTER
              </h2>
              <p className="text-base sm:text-lg font-semibold mb-3">
                THE ARCHITIZER
              </p>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">
                Scan & Pay
              </h3>
              <div className="bg-white p-3 rounded-xl shadow-md">
                <Image
                  src="/images/qr.jpg"
                  alt="GPay QR"
                  width={160}
                  height={160}
                  className="rounded-md"
                />
              </div>
              <p className="text-xs sm:text-sm text-white/80 mt-3 text-center px-3">
                Scan and pay securely using your preferred app.
              </p>
              <p className="text-xs sm:text-sm text-white mt-3 text-center px-3">
                Once your payment is verified, our team will contact you.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="md:w-1/2 bg-white text-gray-800 flex flex-col justify-start rounded-r-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={220}
                    height={180}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-center text-[#db071d] mb-6">
                  Your Investment
                </h3>

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
                      className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#db071d]/80 transition-all duration-300"
                      required
                    />
                  ))}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition text-sm sm:text-base"
                  >
                    Submit
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* POPUP */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 flex items-center justify-center z-50 ${
              popup.type === "success" ? "bg-black/60" : "bg-black/40"
            }`}
          >
            <div
              className={`px-6 py-5 sm:px-8 sm:py-6 rounded-2xl text-center shadow-lg max-w-sm sm:max-w-md w-[90%] ${
                popup.type === "success" ? "bg-green-600" : "bg-red-600"
              } text-white`}
            >
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {popup.message}
              </h3>
              <button
                onClick={() => {
                  setPopup(null);
                  if (popup.type === "success") setActiveTab("home");
                }}
                className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
