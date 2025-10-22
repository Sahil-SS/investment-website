"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting signup form:", formData);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          username: formData.username,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    } else {
      console.log("Signup success:", data);
      alert("Signup successful! Check your email to verify your account.");
      router.push("/sign-in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">Create Account</h1>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded font-semibold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
