"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Shield,
  Clock,
  Smartphone,
  Database,
  UserCheck,
  Activity,
  Calendar,
  Stethoscope,
  ChevronRight,
  Star,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import HealthRiskCalculator from "@/components/health-risk-calculator";
import HeaderWithAuth from "@/components/header-with-auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import InstrumentIcon from "@/public/landing-page/doctor-instrument-rental.svg";
import BannerWithoutAuth from "@/components/banner-without-auth";
import ServiceCard from "@/components/ServiceCard";

export default function HomePageDashboard() {
  const [isPrescription, setIsPrescription] = useState(false);
  const router = useRouter();

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
      <HeaderWithAuth setIsPrescription={setIsPrescription} />

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

            {/* Simple Challenge & Solution Grid */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Healthcare Challenges Today
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Unhealthy Modern Lifestyles
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Processed foods, sedentary routines, and high stress
                        levels
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Limited Healthcare Access
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Expensive treatments and lack of local screening
                        facilities
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Reactive Healthcare
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Treatment after illness instead of prevention and early
                        detection
                      </p>
                    </div>
                  </div>
                </div>
              </div>

      
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Solutions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Community Health Programs
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Local screening camps and doorstep health monitoring
                        services
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Preventive Healthcare Focus
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Early detection, regular check-ups, and lifestyle
                        guidance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Digital Health Innovation
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Technology-enabled monitoring and data-driven health
                        insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

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

            {/* Simple CTA */}
            {/* <div className="text-center">
              <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Experience Better Healthcare?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join our mission to make quality healthcare accessible to
                  everyone, everywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Started Today
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More About Our Mission
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* Main Features Section */}
        {/* <section id="services" className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Healthcare Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive healthcare solutions designed to meet all your
                medical needs in one integrated platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    Point-of-Care Health Monitoring
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Real-time health monitoring and instant diagnostic
                    capabilities at your fingertips
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Real-time vital signs monitoring
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Instant diagnostic results
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Mobile health tracking
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Emergency alert system
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    Learn More
                    <Smartphone className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

           
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    Health Record Management
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Secure, comprehensive digital health records accessible
                    anytime, anywhere
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Secure cloud storage
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Complete medical history
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Easy sharing with doctors
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Prescription management
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                    Learn More
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

            
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Stethoscope className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    Medical & Lifestyle Consultancy
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Expert medical advice and personalized lifestyle
                    recommendations from certified professionals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Expert medical consultations
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Personalized health plans
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Lifestyle optimization
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        24/7 support availability
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Learn More
                    <UserCheck className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}

        {/* Key Healthcare Services Section */}
        {/* <section className="py-20 px-4 bg-linear-to-br from-blue-50 via-white to-teal-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-4 bg-teal-100 text-teal-800"
              >
                Specialized Services
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Health Monitoring & Consultation Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced monitoring technologies and expert consultations to
                ensure your complete well-being
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-red-200">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Holter Monitoring
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  24-hour continuous heart rhythm monitoring to detect irregular
                  heartbeats and cardiac abnormalities
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-blue-200">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Continuous BP Monitoring
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Real-time blood pressure tracking throughout the day to manage
                  hypertension effectively
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-green-200">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Blood Sugar & Lipid Profile
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Regular monitoring of glucose levels and lipid profiles for
                  diabetes and cardiovascular health
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-purple-200">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Sleep Monitoring
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Comprehensive sleep pattern analysis to improve sleep quality
                  and overall health
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-orange-200">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <svg
                    className="h-8 w-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Dietician Consultation
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Personalized nutrition plans and dietary guidance from
                  certified nutrition experts
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-indigo-200">
                <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Psychological Counselling
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Mental health support and counselling services for emotional
                  well-being and stress management
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-pink-200">
                <div className="bg-pink-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                  <Stethoscope className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Cardiologist Consultation
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Expert cardiac care and consultation from experienced
                  cardiologists for heart health
                </p>
              </div>

              <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-teal-200">
                <div className="bg-teal-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <Users className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  Lifestyle Management
                </h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Comprehensive lifestyle coaching to promote healthy habits and
                  sustainable wellness practices
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Experience Comprehensive Healthcare?
                </h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Get access to all these specialized services through our
                  integrated healthcare platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Book Consultation
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                  >
                    Learn More About Services
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-10 right-10 w-24 h-24 bg-teal-200 rounded-full opacity-10"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-10"></div>
        </section> */}

        {/* Health Risk Assessment Calculator Section */}
        {/* <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-4 bg-blue-100 text-blue-800"
              >
                Free Health Assessment
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Health Risk Factors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a personalized health risk assessment based on your
                lifestyle, medical history, and current health status. This free
                tool helps identify potential health concerns early.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <HealthRiskCalculator />
            </div>
          </div>
        </section> */}

        {/* <section className="py-20 px-4  bg-linear-to-br from-teal-50 via-blue-50 to-purple-50 relative overflow-hidden">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 mb-4"
                  >
                    World Health Organization
                  </Badge>
                </div>

                <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                  "Health is a state of complete physical, mental and social
                  well-being and not merely the absence of disease or
                  infirmity."
                </blockquote>

                <cite className="text-lg text-gray-600 font-medium">
                  — Constitution of WHO
                </cite>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    At Abhipsita Care, we embrace this comprehensive definition
                    of health. We understand that true wellness extends far
                    beyond treating symptoms—it encompasses your complete
                    physical vitality, mental clarity, and social connections.
                  </p>

                  <p className="text-lg">
                    Our integrated healthcare platform is designed to support
                    every dimension of your well-being. From real-time health
                    monitoring that tracks your physical state, to personalized
                    consultancy that addresses your mental and lifestyle needs,
                    we're committed to helping you achieve optimal health in its
                    truest sense.
                  </p>

                  <p className="text-lg font-semibold text-teal-700">
                    Because your health is more than just the absence of
                    illness—it's the presence of complete well-being.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Discover Holistic Care
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                  >
                    Learn Our Approach
                  </Button>
                </div>
              </div>

           
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/social-well-being.jpg"
                    alt="Holistic health and wellness - people engaging in physical, mental, and social well-being activities"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-br from-black/20 to-transparent"></div>
                </div>

                
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <Activity className="h-8 w-8 text-teal-600" />
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>

                <div className="absolute top-1/2 -left-6 bg-white rounded-full p-3 shadow-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                  iu87
                </div>
              </div>
            </div>

          
            <div className="absolute top-10 right-10 w-20 h-20 bg-teal-200 rounded-full opacity-20"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-20"></div>
          </div>
        </section> */}

        {/* <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Abhipsita Care?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We combine cutting-edge technology with compassionate care to
                deliver exceptional healthcare experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  HIPAA compliant with end-to-end encryption
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  24/7 Available
                </h3>
                <p className="text-gray-600">
                  Round-the-clock monitoring and support
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expert Team
                </h3>
                <p className="text-gray-600">
                  Certified medical professionals and specialists
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Proven Results
                </h3>
                <p className="text-gray-600">98% patient satisfaction rate</p>
              </div>
            </div>
          </div>
        </section> */}

        {/* Holistic Cardiovascular Health Monitoring and Guidance Section */}
        {/* <section className="py-20 px-4 bg-linear-to-br from-red-50 via-white to-pink-50 relative overflow-hidden">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <Badge
                variant="secondary"
                className="mb-4 bg-red-100 text-red-800"
              >
                Cardiovascular Excellence
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Holistic Cardiovascular Health Monitoring and Guidance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive heart health solutions combining advanced
                monitoring technology with expert cardiology guidance for
                complete cardiovascular wellness
              </p>
            </div>

            <div className="mb-16">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/risk-of-premature.jpg"
                  alt="Advanced cardiovascular monitoring technology with ECG, heart rate monitoring, and cardiologist consultation"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-red-900/80 to-pink-900/60"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white max-w-4xl px-8">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                      Your Heart Health, Our Priority
                    </h3>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">
                      From continuous monitoring to expert guidance -
                      comprehensive cardiovascular care at your fingertips
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        size="lg"
                        className="bg-white text-red-900 hover:bg-gray-100"
                      >
                        Start Heart Health Assessment
                        <Activity className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-red-900 bg-transparent"
                      >
                        Consult Cardiologist
                        <Stethoscope className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Heart Rate: 72 BPM
                    </span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">
                      BP: 120/80 mmHg
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">
                      24/7 Monitoring Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                  <div className="bg-linear-to-br from-red-500 to-pink-500 rounded-full p-3 mr-4">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  Advanced Monitoring Technologies
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  State-of-the-art medical devices and AI-powered analytics for
                  comprehensive cardiovascular health monitoring
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group relative">
                  <div className="absolute inset-0 bg-linear-to-br from-red-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-red-200">
                    <div className="text-center mb-6">
                      <div className="bg-linear-to-br from-red-100 to-pink-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="h-10 w-10 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        Holter ECG Monitoring
                      </h4>
                      <div className="w-16 h-1 bg-linear-to-br from-red-500 to-pink-500 rounded-full mx-auto mb-4"></div>
                    </div>

                    <p className="text-gray-600 text-center leading-relaxed mb-6">
                      24-48 hour continuous ECG recording to detect arrhythmias,
                      irregular heartbeats, and cardiac abnormalities with
                      precision accuracy.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Continuous heart rhythm analysis</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Arrhythmia detection & alerts</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Detailed cardiac event logging</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Monitoring Duration
                        </span>
                        <span className="font-semibold text-red-600">
                          24-48 Hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                    <div className="text-center mb-6">
                      <div className="bg-linear-to-br from-blue-100 to-cyan-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="h-10 w-10 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        Ambulatory BP Monitoring
                      </h4>
                      <div className="w-16 h-1 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4"></div>
                    </div>

                    <p className="text-gray-600 text-center leading-relaxed mb-6">
                      Continuous BP tracking throughout daily activities to
                      identify hypertension patterns and optimize treatment
                      protocols.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>24/7 blood pressure tracking</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Hypertension pattern analysis</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Treatment optimization insights</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Measurement Frequency
                        </span>
                        <span className="font-semibold text-blue-600">
                          Every 15-30 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-green-200">
                    <div className="text-center mb-6">
                      <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="h-10 w-10 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">
                        Cardiac Biomarker Analysis
                      </h4>
                      <div className="w-16 h-1 bg-linear-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4"></div>
                    </div>

                    <p className="text-gray-600 text-center leading-relaxed mb-6">
                      Regular monitoring of cardiac enzymes, lipid profiles, and
                      inflammatory markers for early detection and prevention.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Cardiac enzyme monitoring</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Lipid profile analysis</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Inflammatory marker tracking</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Testing Frequency</span>
                        <span className="font-semibold text-green-600">
                          Monthly
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-linear-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">99.9%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">
                      Continuous Monitoring
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      AI-Powered
                    </div>
                    <div className="text-sm text-gray-600">Analysis Engine</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">
                      Real-time
                    </div>
                    <div className="text-sm text-gray-600">Alert System</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/bp.jpg"
                  alt="Advanced cardiovascular monitoring dashboard showing real-time ECG, blood pressure, and biomarker data"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-black/60 via-transparent to-transparent"></div>

                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <Activity className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        ECG Monitoring
                      </div>
                      <div className="text-xs text-green-600">● Active</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        BP Tracking
                      </div>
                      <div className="text-xs text-green-600">
                        ● Normal Range
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        All Systems Operational
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: 2 min ago
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Integrated Monitoring Dashboard
                  </h4>
                  <p className="text-white/90 text-lg">
                    Real-time visualization of all cardiovascular health metrics
                    in one comprehensive interface
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="bg-pink-100 rounded-full p-2 mr-3">
                        <Stethoscope className="h-6 w-6 text-pink-600" />
                      </div>
                      Expert Cardiology Guidance
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Our team of experienced cardiologists provides
                      personalized guidance based on your monitoring data,
                      ensuring optimal heart health management and prevention
                      strategies.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Personalized Treatment Plans
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Customized cardiac care protocols based on your
                          specific condition and risk factors
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Lifestyle Modification Guidance
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Evidence-based recommendations for diet, exercise, and
                          stress management
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Medication Management
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Optimal medication selection and dosing with regular
                          monitoring and adjustments
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Emergency Response Protocol
                        </h4>
                        <p className="text-gray-600 text-sm">
                          24/7 cardiac emergency support with immediate
                          intervention capabilities
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      Book Cardiology Consultation
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-pink-600 text-pink-600 hover:bg-pink-50 bg-transparent"
                    >
                      View Cardiologist Profiles
                      <Users className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="/Cardiology-1.png"
                    alt="Cardiologist consulting with patient using digital health monitoring data"
                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Early Detection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Identify cardiovascular issues before symptoms appear,
                  enabling proactive treatment and better outcomes
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Improved Outcomes
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Continuous monitoring and expert guidance lead to better
                  cardiovascular health management and quality of life
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Prevention Focus
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive prevention strategies to reduce cardiovascular
                  risk and maintain optimal heart health
                </p>
              </div>
            </div>

            <div className="mt-16 bg-linear-to-br from-red-600 to-pink-600 rounded-3xl p-8 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Take Control of Your Heart Health Today
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands who trust Abhipsita Care for comprehensive
                cardiovascular monitoring and expert guidance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  Start Cardiovascular Assessment
                  <Activity className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
                >
                  Schedule Heart Health Consultation
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute top-20 right-20 w-32 h-32 bg-red-200 rounded-full opacity-10"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-red-300 rounded-full opacity-10"></div>
        </section> */}

        {/* CTA Section */}
        {/* <section className="py-20 px-4 bg-linear-to-br from-blue-600 to-purple-600">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Experience with Abhipsita Care?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust Abhipsita Care for their
              comprehensive healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started Today
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Schedule Consultation
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section> */}
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
