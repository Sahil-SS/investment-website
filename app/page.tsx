// eslint-disable-next-line @typescript-eslint/no-explicit-any

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
    pan: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!phoneRegex.test(formData.phone)) return alert("Invalid phone number!");
    if (!panRegex.test(formData.pan.toUpperCase()))
      return alert("Invalid PAN format (ABCDE1234F)");
    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match!");

    setLoading(true);

    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("email, phone, pan")
      .or(
        `email.eq.${formData.email},phone.eq.${formData.phone},pan.eq.${formData.pan}`
      )
      .maybeSingle();

    if (checkError) {
      alert("Error checking existing users.");
      setLoading(false);
      return;
    }

    if (existingUser) {
      if (existingUser.email === formData.email)
        alert("Email already registered.");
      else if (existingUser.phone === formData.phone)
        alert("Phone already registered.");
      else if (existingUser.pan === formData.pan)
        alert("PAN already registered.");
      setLoading(false);
      return;
    }

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          pan: formData.pan,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const userId = signUpData.user?.id;
    if (userId) {
      await supabase.from("profiles").insert([
        {
          id: userId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          pan: formData.pan.toUpperCase(),
        },
      ]);
    }

    setSuccess(true);
    setTimeout(() => router.push("/sign-in"), 2500);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* 🏙 Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/mumbai.jpg"
          alt="Finance Background"
          fill
          className="object-cover brightness-[0.35]"
          priority
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-[0_0_50px_-10px_rgba(219,7,29,0.8)] overflow-hidden bg-white/10 backdrop-blur-xl border border-[#db071d]/60"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* LEFT SIDE */}
        <div className="md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-[#db071d] to-[#7a0010] p-8 text-white">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={2000}
            height={2000}
            className="mb-4 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]"
          />
          <h2 className="text-2xl font-bold mb-3 text-yellow-300">
            Online Registration
          </h2>
          {/* <p className="text-white/90 text-sm text-center max-w-sm mb-3">
            Please fill out all fields carefully. Ensure your PAN, email, and
            phone number are accurate — duplicate entries will not be accepted.
          </p>

          <ul className="list-disc list-inside text-white/80 text-sm space-y-1 text-left max-w-sm">
            <li>Use your official name as per ID proof.</li>
            <li>Enter a valid 10-digit phone number.</li>
            <li>Use correct PAN format (ABCDE1234F).</li>
            <li>Choose a strong password (min 6 characters).</li>
          </ul> */}

          <p className="text-xs text-yellow-300 mt-6 text-center italic">
            “Your details are safe and encrypted with us.”
          </p>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="md:w-1/2 bg-white p-8 text-gray-800 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-center text-[#db071d] mb-6">
            Registration
          </h1>

          {success && (
            <p className="text-green-600 text-center font-medium mb-2">
              ✅ Successfully registered! Redirecting...
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name", type: "text" },
              { name: "phone", placeholder: "Phone Number", type: "tel" },
              { name: "email", placeholder: "Email Address", type: "email" },
              { name: "pan", placeholder: "PAN Number", type: "text" },
              { name: "location", placeholder: "Location", type: "text" },
              { name: "password", placeholder: "Password", type: "password" },
              {
                name: "confirmPassword",
                placeholder: "Confirm Password",
                type: "password",
              },
            ].map((f) => (
              <input
                key={f.name}
                {...f}
                value={(formData as any)[f.name]}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#db071d]/80 transition-all duration-300"
              />
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#db071d] to-[#a80a1a] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition"
            >
              {loading ? "Creating..." : "Sign Up"}
            </motion.button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/sign-in")}
                className="text-[#db071d] font-semibold cursor-pointer hover:underline"
              >
                Log In
              </span>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
