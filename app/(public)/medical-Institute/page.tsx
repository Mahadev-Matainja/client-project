"use client";
import BannerWithoutAuth from "@/components/banner-without-auth";
import FooterWithoutAuth from "@/components/footer-without-auth";
import HeaderWithAuth from "@/components/header-with-auth";
import ServiceCard from "@/components/ServiceCard";
import { FileText, Smartphone, UserCheck } from "lucide-react";
import React from "react";

const page = () => {
  const serviceData = [
    {
      title: "Aya",
      description:
        "Professional caregiver services for daily assistance and support.",
      icon: "/landing-page/nurse.svg",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-300",
      features: [
        "Skilled female attendants",
        "24/7 caregiver availability",
        "Elderly support assistance",
        "Compassionate home care",
      ],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      BtnIcon: FileText,
      redirect: "",
    },
    {
      title: "Gym",
      description:
        "Modern fitness centre equipped with advanced workout machines.",
      icon: "/landing-page/gym.svg",
      iconBg: "bg-red-200 group-hover:bg-red-300",
      iconColor: "text-red-600",
      borderHover: "hover:border-red-300",
      features: [
        "Certified trainers",
        "Advanced exercise equipment",
        "Personalized fitness sessions",
        "Diet and health monitoring",
      ],
      buttonColor: "bg-red-600 hover:bg-red-700",
      BtnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Dedicated Testing Centre (Hearing)",
      description:
        "Advanced hearing test centre for accurate auditory analysis.",
      icon: "/landing-page/madical-service-institute.svg",
      iconBg: "bg-yellow-200 group-hover:bg-yellow-300",
      iconColor: "text-yellow-600",
      borderHover: "hover:border-yellow-300",
      features: [
        "Computerized hearing tests",
        "Complete audiology evaluation",
        "Ear health inspection",
        "Specialized sound-room testing",
      ],
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      BtnIcon: UserCheck,
      redirect: "",
    },
    {
      title: "Yoga",
      description:
        "Relaxing yoga sessions to improve flexibility and mental wellness.",
      icon: "/landing-page/yoga.svg",
      iconBg: "bg-green-200 group-hover:bg-green-300",
      iconColor: "text-green-600",
      borderHover: "hover:border-green-300",
      features: [
        "Daily yoga classes",
        "Expert yoga instructors",
        "Meditation guidance",
        "Holistic health approach",
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      BtnIcon: FileText,
      redirect: "",
    },
    {
      title: "Pranayam Centre",
      description:
        "Breathing exercises to improve lung function and reduce stress.",
      icon: "/landing-page/pranayama.svg",
      iconBg: "bg-purple-200 group-hover:bg-purple-300",
      iconColor: "text-purple-600",
      borderHover: "hover:border-purple-300",
      features: [
        "Guided breathing exercises",
        "Stress reduction therapy",
        "Boost lung capacity",
        "Holistic body balance",
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      BtnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Preventive Care Centre",
      description:
        "Routine health checkups & wellness programs to prevent diseases.",
      icon: "/landing-page/preventive care center.svg",
      iconBg: "bg-indigo-200 group-hover:bg-indigo-300",
      iconColor: "text-indigo-600",
      borderHover: "hover:border-indigo-300",
      features: [
        "Complete body checkup",
        "Lifestyle counselling",
        "Stress & diet evaluation",
        "Disease prevention plans",
      ],
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      BtnIcon: UserCheck,
      redirect: "",
    },
    {
      title: "Diagnostic Centre (DC)",
      description: "High-accuracy lab tests and imaging diagnostics available.",
      icon: "/landing-page/diagnostic center.svg",
      iconBg: "bg-teal-200 group-hover:bg-teal-300",
      iconColor: "text-teal-600",
      borderHover: "hover:border-teal-300",
      features: [
        "Blood tests & reports",
        "X-ray & scanning",
        "Fast report generation",
        "Accurate test results",
      ],
      buttonColor: "bg-teal-600 hover:bg-teal-700",
      BtnIcon: FileText,
      redirect: "/medical-Institute/diagnostic-centre",
    },
    {
      title: "Blood Bank Address",
      description:
        "Find reliable and registered blood banks near your location.",
      icon: "/landing-page/blood bank address.svg",
      iconBg: "bg-pink-200 group-hover:bg-pink-300",
      iconColor: "text-pink-600",
      borderHover: "hover:border-pink-300",
      features: [
        "Verified blood bank list",
        "Availability check",
        "Emergency support",
        "Accurate blood stock info",
      ],
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      BtnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Ambulance Rental",
      description: "Fast & reliable ambulance services available 24/7.",
      icon: "/landing-page/ambulance.svg",
      iconBg: "bg-gray-200 group-hover:bg-gray-300",
      iconColor: "text-gray-600",
      borderHover: "hover:border-gray-300",
      features: [
        "24/7 emergency availability",
        "Fully equipped ambulances",
        "Trained medical staff",
        "Fast response service",
      ],
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      BtnIcon: UserCheck,
      redirect: "",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth />
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
