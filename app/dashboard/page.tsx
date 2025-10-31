"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoanComingSoonCard from "@/components/LoanComingSoonCard";
import Image from "next/image";
// import { FaEnvelope, FaWhatsapp } from "react-icons/fa";

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
    "home" | "profile" | "loan" | "investment" | "myteam" | "support" | "myrent"
  >("investment");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    amount: "",
    utr: "",
  });
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
      setForm({ name: "", phone: "", amount: "", utr: "" });
      setPopup({
        type: "success",
        message: `🚀 Welcome to REO!

We have successfully received your payment.

Our admin team is now verifying the transaction, which typically takes up to 72 hours. You will receive a confirmation email once your account has been activated.

Need to make an additional payment? Simply visit the Investment section on your dashboard.

Thank you for choosing REO.`,
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

      {/* MOBILE NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-[#db071d]/60 px-4 py-3 sm:hidden">
        {/* LEFT: User Info */}
        <div className="flex flex-col text-left">
          <span className="text-white font-semibold text-sm leading-tight">
            {user?.name}
          </span>
        </div>

        {/* CENTER: Nav Links */}
        <div className="flex space-x-4">
          {[
            "home",
            "loan",
            "investment",
            "profile",
            "myteam",
            "support",
            "myrent",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(
                  tab as
                    | "home"
                    | "loan"
                    | "profile"
                    | "investment"
                    | "myteam"
                    | "support"
                    | "myrent"
                )
              }
              className={`capitalize relative text-xs font-medium transition-all duration-300 ${
                activeTab === tab
                  ? "text-[#db071d]"
                  : "text-white/90 hover:text-[#db071d]"
              } after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD700] hover:after:w-full after:transition-all`}
            >
              {tab === "myteam"
                ? "My Team"
                : tab === "myrent"
                ? "My Rent"
                : tab === "support"
                ? "Support"
                : tab}
            </button>
          ))}
        </div>

        {/* RIGHT: Logout Button */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-[#db071d] text-white text-xs font-semibold rounded-lg hover:bg-[#b40618] transition"
        >
          Logout
        </button>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden sm:flex relative z-20 w-64 bg-black/40 backdrop-blur-md border-r border-[#db071d]/60 flex-col justify-between py-8 px-6">
        {/* Top Section */}
        <div>
          {/* Company Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo_white.png" // 🟢 replace with your logo path
              alt="Company Logo"
              width={120} // adjust size as needed
              height={120}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            {user?.name}
          </h1>
          <p className="text-sm text-white/80 text-center">{user?.email}</p>
          <p className="text-sm text-white/80 mb-6 text-center">
            {user?.phone}
          </p>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            {[
              "home",
              "profile",
              "investment",
              "loan",
              "myteam",
              "support",
              "myrent",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(
                    tab as
                      | "home"
                      | "loan"
                      | "profile"
                      | "investment"
                      | "myteam"
                      | "support"
                      | "myrent"
                  )
                }
                className={`capitalize cursor-pointer text-sm font-medium py-2 px-4 rounded-lg transition text-left ${
                  activeTab === tab
                    ? "bg-[#db071d]/80 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab === "myteam"
                  ? "My Team"
                  : tab === "myrent"
                  ? "My Rent"
                  : tab === "support"
                  ? "Support"
                  : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Section (Logout) */}
        <div className="flex flex-col items-center gap-4 pt-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-[#db071d]/80 hover:bg-[#b40618]/90 text-white rounded-lg transition text-base"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-white mt-28 sm:mt-0">
        {/* ✅ Trusted Seller Badge */}
        <Image
          src="/images/trust_logo.png"
          alt="Trusted Seller"
          width={150}
          height={150}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 object-contain"
          priority
        />

        {activeTab === "home" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            🏠 Your Dashboard, Coming Soon...
          </h2>
        )}
        {activeTab === "loan" && (
          <div className="flex justify-center items-center min-h-[80vh]">
            <LoanComingSoonCard />
          </div>
        )}
        {activeTab === "profile" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            👤 Profile Section, Coming Soon...
          </h2>
        )}
        {activeTab === "myteam" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            🤝 My Team Section, Coming Soon...
          </h2>
        )}
        {activeTab === "support" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center min-h-[70vh]"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-[#db071d]/30 p-8 w-full max-w-md text-center">
              <Image
                src="/images/logo_red.png"
                alt="Company Logo"
                width={160}
                height={60}
                className="mx-auto mb-4 object-contain"
              />

              <h2 className="text-2xl font-bold text-[#db071d] mb-2">
                Reach Out to Us
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                For any queries or support, feel free to contact us anytime.
              </p>

              <a
                href="mailto:Support@reodevelop.com"
                className="text-[#db071d] font-semibold hover:underline mb-6 inline-block"
              >
                Support@reodevelop.com
              </a>

              <form
                action="https://api.web3forms.com/submit"
                method="POST"
                className="space-y-4"
              >
                <input
                  type="hidden"
                  name="access_key"
                  value="2756ba83-599a-443a-b5a1-1871d615f0db"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#db071d]/70 focus:outline-none"
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition text-base"
                >
                  Send
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "myrent" && (
          <h2 className="text-2xl sm:text-3xl font-bold text-center">
            💼 My Rent Section, Coming Soon...
          </h2>
        )}

        {/* INVESTMENT TAB */}
        {activeTab === "investment" && (
          <motion.div
            className="relative z-10 flex flex-col md:flex-row w-full max-w-4xl rounded-2xl shadow-[0_0_40px_-10px_rgba(219,7,29,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]/60"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* LEFT SIDE */}
            <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#7a0010] p-6 sm:p-8 text-white">
              <h2 className="text-2xl font-bold mb-2 text-yellow-300">
                EAST INDIA PROMOTER
              </h2>
              <p className="text-lg font-semibold mb-3">THE ARCHITIZER</p>
              <h3 className="text-xl font-semibold mb-3">Scan & Invest</h3>
              <div className="bg-white p-3 rounded-xl shadow-md">
                <Image
                  src="/images/qr.jpg"
                  alt="Investment QR"
                  width={160}
                  height={160}
                  className="rounded-md"
                />
              </div>
              <p className="text-sm text-white/80 mt-3 text-center px-3">
                Scan and pay securely using your preferred app.
              </p>
              <p className="text-sm text-white mt-3 text-center px-3">
                Once your payment is verified, our team will contact you.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="md:w-1/2 bg-white text-gray-800 flex flex-col justify-start rounded-r-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/logo_red.png"
                    alt="Logo"
                    width={220}
                    height={180}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-2xl font-bold text-center text-[#db071d] mb-6">
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
                    className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition text-base"
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
              <p className="whitespace-pre-line text-center leading-relaxed text-white">
                {popup.message}
              </p>

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
