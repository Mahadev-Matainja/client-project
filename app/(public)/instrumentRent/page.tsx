"use client";
import BannerWithoutAuth from "@/components/banner-without-auth";
import FooterWithoutAuth from "@/components/footer-without-auth";
import HeaderWithAuth from "@/components/header-with-auth";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, FileText, Smartphone, UserCheck } from "lucide-react";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";

const page = () => {
  const [isPrescription, setIsPrescription] = useState(false);
  const serviceData = [
    {
      title: "ECG",
      description:
        "Real-time health monitoring and instant diagnostic capabilities at your fingertips",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [
        "Real-time vital signs monitoring",
        "Instant diagnostic results",
        "Mobile health tracking",
        "Emergency alert system",
      ],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "/landing-page/ecg.svg",
      btnIcon: Smartphone,
      redirect: "/instrumentRent/ECG",
    },
    {
      title: "EMG",
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
      icon: "/landing-page/emg.svg",
      btnIcon: FileText,
      redirect: "",
    },
    {
      title: "HOLTER",
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
      icon: "/landing-page/holter.svg",
      btnIcon: UserCheck,
      redirect: "",
    },
    {
      title: "EEG",
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
      icon: "/landing-page/eeg.svg",
      btnIcon: UserCheck,
      redirect: "",
    },
    {
      title: "Oxygen Cylinder Rental",
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
      icon: "/landing-page/oxygen.svg",
      btnIcon: UserCheck,
      redirect: "",
    },
  ];
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth setIsPrescription={setIsPrescription} />
      <BannerWithoutAuth />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-10 px-6">
        {serviceData.map((item, index) => (
          <ServiceCard key={index} {...item} />
        ))}
      </div>

      <FooterWithoutAuth />
    </div>
  );
};

export default page;
