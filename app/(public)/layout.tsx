"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";

import Loader from "@/components/ui/loader";

import Link from "next/link";
import HeaderWithAuth from "@/components/header-with-auth";
import BannerWithoutAuth from "@/components/banner-without-auth";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { status } = useSession();

  // 🔄 While checking auth
  if (status === "loading") {
    return <Loader />;
  }

  // ⛔ Optional: block logged-in users from public pages
  // if (status === "authenticated") {
  //   notFound();
  // }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <HeaderWithAuth />

      {/* Banner */}
      <BannerWithoutAuth />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img
                src="/predicker-logo.png"
                alt="Abhipsita Care Logo"
                className="w-2/3 mb-4"
              />
              <p className="text-gray-400">
                Comprehensive healthcare solutions with personalized care for a
                healthier tomorrow.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#">Health Monitoring</Link>
                </li>
                <li>
                  <Link href="#">Record Management</Link>
                </li>
                <li>
                  <Link href="#">Medical Consultancy</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#">About Us</Link>
                </li>
                <li>
                  <Link href="#">Careers</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#">Help Center</Link>
                </li>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Abhipsita Care. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
