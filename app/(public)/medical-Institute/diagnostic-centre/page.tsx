"use client";
import BannerWithoutAuth from "@/components/banner-without-auth";
import FooterWithoutAuth from "@/components/footer-without-auth";
import HeaderWithAuth from "@/components/header-with-auth";
import React, { useState } from "react";
import { CheckCircle, FileText, Smartphone, UserCheck } from "lucide-react";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import AuthModal from "@/components/auth/auth-modal";

const page = () => {
  const [isPrescription, setIsPrescription] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const openSignup = () => {
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
      title: "Displayservice portfolio details",
      description:
        "Secure, comprehensive digital health records accessible anytime, anywhere",
      iconBg: "bg-green-200 group-hover:bg-green-300",
      iconColor: "text-green-600",
      borderHover: "hover:border-green-200",
      features: [
        "Secure cloud storage",
        "Complete medical history",
        "Easy sharing with doctors",
        "Prescription management",
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      icon: "/landing-page/medical-service-provider.svg",
      btnIcon: FileText,
      redirect: "",
      openSignup: false,
    },
    {
      title: (
        <>
          Customer Registration
          <br />
          (Track customer pool)
        </>
      ),
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/madical-service-institute.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Display Doctors Pool",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: false,
    },
    {
      title: "Test Report Input",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Slot booking by patient through advance payment",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: false,
    },
    {
      title: "Medicine Input ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Doctor Digital Prescription ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: false,
    },
    {
      title: "Share patient medical history to doctor audio-visually.  ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Prescription Upload   ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: false,
    },
    {
      title: "Telemedicine service",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Test Report Upload ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: false,
    },
    {
      title: "Family medical history creation option",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
    {
      title: "Medical History Report Download/Share ",
      description:
        "Expert medical advice and personalized lifestyle recommendations from certified professionals",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-200",
      features: [
        "Expert medical consultations",
        "Personalized health plans",
        "Lifestyle optimization",
        "24/7 support availability",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      icon: "/landing-page/medical-logistics.svg",
      btnIcon: UserCheck,
      redirect: "",
      openSignup: true,
    },
  ];
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth setIsPrescription={setIsPrescription} />
      <BannerWithoutAuth />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-10 px-6">
        {serviceData.map((item, index) => (
          <ServiceCard key={index} {...item} onOpenSignup={openSignup} />
        ))}
      </div>

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
