"use client";

import BannerWithoutAuth from "@/components/banner-without-auth";
import HeaderWithAuth from "@/components/header-with-auth";
import ServiceCard from "@/components/ServiceCard";
import { Smartphone } from "lucide-react";
import Link from "next/link";
import React from "react";

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

const page = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth />

      {/* banner Section */}
      <BannerWithoutAuth />
      <div className="max-w-7xl mx-auto mt-8">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using 'Content here, content here', making it
        look like readable English. Many desktop publishing packages and web
        page editors now use Lorem Ipsum as their default model text, and a
        search for 'lorem ipsum' will uncover many web sites still in their
        infancy. Various versions have evolved over the years, sometimes by
        accident, sometimes on purpose (injected humour and the like).
      </div>
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
                  <Link
                    href="/about-us"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
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
};

export default page;
