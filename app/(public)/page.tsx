"use client";

import Link from "next/link";

import { Smartphone, CheckCircle } from "lucide-react";
import HealthRiskCalculator from "@/components/health-risk-calculator";
import HeaderWithAuth from "@/components/header-with-auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import BannerWithoutAuth from "@/components/banner-without-auth";
import ServiceCard from "@/components/ServiceCard";

export default function HomePageDashboard() {
  const serviceData = [
    {
      title: "Point of Care Health Monitoring",
      description: "",

      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "/instrumentRent",
    },
    {
      title: "Medical Record Management",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "/instrumentRent",
    },
    {
      title: "Remote Health Consultancy",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "/instrumentRent",
    },
    {
      title: "Health Screening and Data Analysis",
      description: "",
      iconBg: "bg-blue-200 group-hover:bg-blue-300",
      iconColor: "text-blue-600",
      borderHover: "hover:border-blue-200",
      features: [],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      icon: "",
      btnIcon: Smartphone,
      redirect: "/instrumentRent",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth />

      <>
        {/* banner Section */}

        <BannerWithoutAuth />
        {/* Modern Healthcare Solutions Section */}
        <section className="py-5 px-4 bg-white">
          <div className="container mx-auto">
            {/* Section Header */}
            {/* <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Abhipsita Care: Symbol of Services
              </h2>
            </div> */}

            <section className="w-full py-2">
              <div className="max-w-9xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                  {/* LEFT CARD */}
                  <div className="border-2 border-pink-300 rounded-2xl p-6 bg-pink-50 text-center h-full flex flex-col">
                    <p className="italic text-red-500 mb-2">for</p>

                    <h2 className="text-2xl font-bold mb-6">
                      Health Care Service{" "}
                      <span className="text-red-600">Consumers</span>
                    </h2>

                    <div className="flex">
                      <ul className="space-y-3 text-sm text-gray-700 text-left">
                        {[
                          "Healthy Individuals",
                          "Patients",
                          "Guardians",
                          "Organizations",
                          "Societies and Others",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CENTER IMAGE */}
                  <div className="flex justify-center items-center">
                    <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                      <Image
                        src="/landing-page/home-health.png"
                        alt="Health model diagram"
                        fill
                        priority
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* RIGHT CARD */}
                  <div className="border-2 border-blue-300 rounded-2xl p-6 bg-blue-50 text-center h-full flex flex-col">
                    <p className="italic text-blue-500 mb-2">for</p>

                    <h2 className="text-2xl font-bold mb-6">
                      Health Care Service{" "}
                      <span className="text-blue-600">Providers</span>
                    </h2>

                    <div className="flex ">
                      <ul className="space-y-3 text-sm text-gray-700 text-left">
                        {[
                          "Medical Practitioners",
                          "Dietitians",
                          "Physiotherapists",
                          "Diagnostic Centres and Others",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Simple Stats */}
            <div className=" p-8 mb-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Our Core Digital Health Care Services
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {serviceData.map((item, index) => (
                  <ServiceCard key={index} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/predicker-logo.png"
                  alt="Abhipsita Care Logo"
                  className="w-2/3"
                />
                {/* <span className="text-xl font-bold">Abhipsita Care</span> */}
              </div>
              <p className="text-gray-400">
                Comprehensive healthcare solutions with personalized care for a
                healthier tomorrow.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Health Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Record Management
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Medical Consultancy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Abhipsita Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
