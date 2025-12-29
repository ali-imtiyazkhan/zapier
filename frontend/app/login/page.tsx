"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      console.log("Token:", token);
      localStorage.setItem("token", token);

      console.log("Login success", response.data);

      router.push("/");


    } catch (error: any) {
      console.error(
        "Login failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fffdf8] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Log in to your Zapier account
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Connect your apps, automate your workflows, and get more done —
            effortlessly.
          </p>

          <ul className="mt-6 space-y-3 text-gray-700">
            <li> Access your automations</li>
            <li> Manage workflows in one place</li>
            <li> Secure and reliable</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-black">
            Welcome back
          </h2>

          <p className="text-gray-600 mt-2">
            Log in to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-500" />
                Remember me
              </label>

              <a href="#" className="text-orange-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition"
            >
              Log in
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{" "}
              <a href="/signup" className="text-orange-500 hover:underline">
                Sign up for free
              </a>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
