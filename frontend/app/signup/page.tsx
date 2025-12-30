"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const token = response.data.token;
      console.log("token is " + token)

      localStorage.setItem("token", token);

      console.log("Signup success:", response.data);

      router.push("/DashBoard")


    } catch (err: any) {
      console.log(err);
      console.log("somthing happend ");
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#fffdf8] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            Join millions worldwide who automate their work using Zapier
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            Build workflows, connect your apps, and let automation do the heavy lifting —
            no code required.
          </p>

          <ul className="mt-6 space-y-3 text-gray-700">
            <li> No credit card required</li>
            <li> Free forever for core features</li>
            <li> Trusted by teams worldwide</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-black">
            Get started free
          </h2>

          <p className="text-gray-600 mt-2">
            Create your account in seconds
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border text-black border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg text-black border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg text-black border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-full transition"
            >
              Get started free
            </button>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to Zapier’s Terms and Privacy Policy.
            </p>

            <button
              onClick={() => router.push("/login")}
              className=" border border-zinc-300 text-orange-500 hover:underline px-6 py-3  rounded-full  bg-white  hover:bg-zinc-200 cursor-pointer  hover:border-zinc-400 transition duration-200"   >
              Account already exists? Log in
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Page;
