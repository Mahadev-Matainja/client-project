"use client";
import AuthModal from "@/components/auth/auth-modal";
import BannerWithoutAuth from "@/components/banner-without-auth";
import FooterWithoutAuth from "@/components/footer-without-auth";
import HeaderWithAuth from "@/components/header-with-auth";
import ServiceCard from "@/components/ServiceCard";
import { FileText, Smartphone, UserCheck } from "lucide-react";
import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const page = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const openSignUp = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const serviceData = [
    {
      title: "Contacts Location Wise",
      description:
        "Find contact information and services available based on location.",
      icon: "/landing-page/location.svg",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-300",
      features: [
        "Search by city or area",
        "Verified contact information",
        "Emergency location-based contacts",
        "Nearby service availability",
      ],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      btnIcon: FileText,
      redirect: "",
      openSignup: false, // NORMAL REDIRECT
    },
    {
      title: "Booking Facility",
      description:
        "Book services quickly and conveniently with real-time availability.",
      icon: "/landing-page/booking facility.svg",
      iconBg: "bg-green-200 group-hover:bg-green-300",
      iconColor: "text-green-600",
      borderHover: "hover:border-green-300",
      features: [
        "Instant booking confirmation",
        "Multiple service categories",
        "Secure payment options",
        "Easy cancellation policy",
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      btnIcon: Smartphone,
      openSignup: true, // OPEN SIGNUP MODAL
    },
    {
      title: "Service Provider Details Portfolio",
      description: "View complete profile and portfolio of service providers.",
      icon: "/landing-page/contacts.svg",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-300",
      features: [
        "Provider experience details",
        "Verified documents",
        "Previous work portfolio",
        "Ratings & authenticity check",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      btnIcon: UserCheck,
      openSignup: true, // OPEN SIGNUP MODAL
    },
    {
      title: "Customer Review",
      description:
        "Check genuine customer reviews and ratings before choosing a service.",
      icon: "/landing-page/customer review.svg",
      iconBg: "bg-orange-200 group-hover:bg-orange-300",
      iconColor: "text-orange-600",
      borderHover: "hover:border-orange-300",
      features: [
        "Verified customer feedback",
        "Ratings & comments",
        "Experience-based testimonials",
        "Trusted service insights",
      ],
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      btnIcon: FileText,
      openSignup: true, // OPEN SIGNUP MODAL
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      <HeaderWithAuth />
      <BannerWithoutAuth />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-10 px-6">
        {serviceData.map((item, index) => (
          <ServiceCard key={index} {...item} onOpenSignup={openSignUp} />
        ))}
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image
              src={"/landing-page/location.svg"}
              alt="ECG"
              width={40}
              height={40}
            />
            Contacts Location Wise
          </CardTitle>
          <CardDescription>
            Find contact information and services available based on location.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6"></CardContent>
      </Card> */}

      <FooterWithoutAuth />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        updateInitialMode={(value) => setAuthMode(value)}
      />
    </div>
  );
};

export default page;
