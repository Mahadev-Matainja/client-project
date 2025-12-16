"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const DoctorCarousel = () => {
  const SliderItem = [
    {
      title: "Find Doctors Near You",
      description:
        "Our app helps you find doctors nearby based on your location. No more long searches—quickly discover the right specialist!",
    },
    {
      title: "Browse Clinic Availability",
      description:
        "View the availability of doctors and clinics, ensuring you can get an appointment when it's most convenient for you.",
    },
    {
      title: "Specialty Wise Doctors Search",
      description:
        "Search doctors based on specialty. Cardiologist? Dermatologist? Just type and search.",
    },
    {
      title: "Transform Your Healthcare Experience",
      description:
        "Book appointments, manage your health, and connect with top doctors—all from your phone!",
    },
    {
      title: "Expert Health Tips Just for You",
      description:
        "Receive useful health tips for you and your loved ones from trusted doctors.",
    },
  ];

  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const autoplayIntervalMs = 3000; // change this value to speed up/slow down
  const isHoveringRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Start autoplay loop
  useEffect(() => {
    if (!emblaApi) return;

    // helper to start timer
    const start = () => {
      // clear first
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = window.setInterval(() => {
        if (isHoveringRef.current) return;
        // If the carousel has an API, advance it. If loop is enabled this always works.
        emblaApi?.scrollNext();
      }, autoplayIntervalMs);
    };

    // stop timer
    const stop = () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // pause when document hidden (tab change)
    function handleVisibilityChange() {
      if (document.hidden) stop();
      else start();
    }

    // start initially
    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // cleanup
    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [emblaApi]);

  // Pause on hover
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
  };

  return (
    <div className="w-full mx-auto py-5">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={(api) => setEmblaApi(api)}
        className="relative"
      >
        <div
          // these handlers pause/resume autoplay while hovering the slides area
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CarouselContent>
            {SliderItem.map((item, index) => (
              <CarouselItem key={index}>
                <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 h-50 flex flex-col justify-center items-center text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-600">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mt-3 text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </div>
  );
};

export default DoctorCarousel;
