"use client";

import ServiceCard from "@/components/ServiceCard";
import { Smartphone } from "lucide-react";
import React from "react";

const page = () => {
  const serviceData = [
    {
      title: "Society or Club",
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
      title: "Head of Family",
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
      title: "Tourist or Traveller",
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
      title: "Healthy Individual ",
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
      title: "Patients",
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
      title: "Guardian of a Patient",
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
      title: "Organization",
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
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900">
          Digital Services for Health Care Consumers
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {serviceData.map((item, index) => (
          <ServiceCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default page;
