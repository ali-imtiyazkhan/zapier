"use client";

import Appbar from "@/component/Appbar";
import HeroSection from "@/component/Hero";
import HeroVideo from "@/component/HeroVideo";

const Page = () => {
  return (
    <div className="bg-white min-h-screen w-full text-black">

      <div className="absolute top-0 left-0 w-full z-50">
        <Appbar />
      </div>

      <HeroSection />

      <HeroVideo />

    </div>
  );
};

export default Page;
