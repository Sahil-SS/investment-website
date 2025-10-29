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
  const [activeTab, setActiveTab] = useState<"home" | "profile" | "loan">(
    "home"
  );
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

    // ✅ Validation checks
    const phonePattern = /^[0-9]{10}$/;
    const utrPattern = /^[0-9]{12}$/;

    if (!phonePattern.test(form.phone)) {
      setPopup({
        type: "error",
        message: "📞 Phone number must be exactly 10 digits.",
      });
      setTimeout(() => setPopup(null), 3000);
      setStatus("❌ Invalid phone number");
      return;
    }

    if (!utrPattern.test(form.utr)) {
      setPopup({
        type: "error",
        message: "💳 Transaction ID must be exactly 12 digits.",
      });
      setTimeout(() => setPopup(null), 3000);
      setStatus("❌ Invalid Transaction ID");
      return;
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || !user) {
      setStatus("❌ Not logged in");
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
      console.error(error);
      setStatus("❌ Error submitting payment");
      setPopup({
        type: "error",
        message: "❌ Payment submission failed. Please try again.",
      });
      setTimeout(() => setPopup(null), 3000);
    } else {
      setStatus("✅ Investment submitted successfully!");
      setForm({ name: "", phone: "", amount: "", utr: "" });
      setPopup({
        type: "success",
        message:
          "🎉 Payment registered successfully! Our admin team will verify your details and contact you soon.",
      });
      triggerConfetti();
      setTimeout(() => setPopup(null), 3000);
      setTimeout(() => setStatus(""), 2000);
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
    <div className="relative min-h-screen flex flex-col bg-black text-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/mumbai.jpg"
          alt="Luxury Property"
          fill
          className="object-cover brightness-[0.35]"
          priority
        />
      </div>

{/* NAVBAR */}
<nav className="absolute top-0 left-0 w-full flex items-center justify-between px-10 h-24 z-20">
  {/* LEFT SIDE — User Name */}
  <div className="flex flex-col items-start">
    <h1 className="text-2xl font-bold text-white drop-shadow-lg">
      {user?.name}
    </h1>
    <p className="text-sm text-white/90">{user?.email}</p>
    <p className="text-sm text-white/90">{user?.phone}</p>
  </div>

  {/* CENTER — Navigation Tabs */}
  <div className="flex gap-4">
    {["home", "profile", "loan"].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as "home" | "profile" | "loan")}
        className={`capitalize text-sm font-medium px-4 py-2 rounded-lg transition ${
          activeTab === tab
            ? "bg-white/20 text-white font-semibold"
            : "text-white/90 hover:text-white"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* RIGHT SIDE — Logout Button */}
  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-[#db071d]/80 hover:bg-[#b40618]/90 text-white rounded-lg transition"
  >
    Logout
  </button>
</nav>

      {/* MAIN SECTION */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-10 mt-12">
        {activeTab === "home" && (
          <>
            <motion.div
              className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-[0_0_50px_-10px_rgba(219,7,29,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]/60"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* LEFT SIDE */}
              <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#7a0010] p-8 text-white">
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
                <p className="text-sm text-white mt-3 text-center">
                  Once your payment is verified by our team, you’ll receive a
                  confirmation email.
                </p>
                <ul className="text-xs text-white/90 mt-3 space-y-1 list-disc list-inside text-left">
                  <li>Scan the QR using any UPI app.</li>
                  <li>Complete your payment securely.</li>
                  <li>
                    Fill the form with your payment details for verification.
                  </li>
                </ul>
              </div>

              {/* RIGHT FORM */}
              <div className="md:w-1/2 bg-white text-gray-800 flex flex-col justify-start rounded-r-xl overflow-hidden">
                <div className="p-8">
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/images/logo.png" // replace with your actual logo path
                      alt="REO Logo"
                      width={300}
                      height={250}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-center text-[#db071d] mb-6">
                    Enter Your Investment Details
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {(
                      [
                        {
                          name: "name",
                          placeholder: "Full Name",
                          type: "text",
                        },
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
                      className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-[#b10018] hover:to-[#db071d] transition"
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
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl text-white shadow-lg z-50 flex items-center gap-3 ${
              popup.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <span>{popup.message}</span>
            <button
              onClick={() => setPopup(null)}
              className="text-white text-lg font-bold ml-3 hover:opacity-80"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
