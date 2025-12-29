import React from "react";

const HeroVideo = () => {
  return (
    <section className="w-full flex justify-center py-16 bg-white">
      <div className="w-full max-w-5xl px-4">
        <video
          className="w-full rounded-xl shadow-lg"
          src="https://res.cloudinary.com/zapier-media/video/upload/f_auto,q_auto/v1706042175/Homepage%20ZAP%20Jan%2024/012324_Homepage_Hero1_1920x1080_pwkvu4.mp4"   // put video in /public
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  );
};

export default HeroVideo;
