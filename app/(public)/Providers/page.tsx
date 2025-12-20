"use client";

import ServiceCard from "@/components/ServiceCard";
import { Smartphone } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const [type, setType] = useState("individual");

  const serviceData = [
    {
      title: "Medical Practitioner",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Dietitian",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Physiotherapist",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Others",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Diagnostic Centre",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Emergency Service Provider",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Aya or Nurse",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
    {
      title: "Diagnostic Sample Collector",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "",
    },
  ];

  return (
    <div className="p-8 mb-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900">
          Digital Services for Health Care Providers
        </h3>
      </div>

      {/* Radio Selection (Left aligned) */}
      <div className="flex gap-16 mb-12">
        <label className="flex items-center gap-3 text-2lg cursor-pointer font-semibold">
          <input
            type="radio"
            name="providerType"
            value="individual"
            checked={type === "individual"}
            onChange={() => setType("individual")}
            className="w-5 h-5 accent-blue-600"
          />
          Individual
        </label>

        <label className="flex items-center gap-3 text-2lg cursor-pointer font-semibold">
          <input
            type="radio"
            name="providerType"
            value="institution"
            checked={type === "institution"}
            onChange={() => setType("institution")}
            className="w-5 h-5 accent-blue-600"
          />
          Institution
        </label>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {serviceData.map((item, index) => (
          <ServiceCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Page;
