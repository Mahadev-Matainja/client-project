import React from "react";
import Image from "next/image";

const BannerWithoutAuth = () => {
  return (
    <section className="relative">
      <Image
        src="/landing-page/banner.png"
        alt="Landing banner"
        width={800}
        height={400}
        className="w-full h-[90px] md:h-[110px] lg:h-[228px] object-cover"
      />

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      {/* Responsive Text */}
      {/* <span
        className="
        absolute inset-0 
        flex items-center justify-center 
        text-white 
        text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
        font-bold text-center px-4
      "
      >
        The Care We Desire
      </span> */}
    </section>
  );
};

export default BannerWithoutAuth;
