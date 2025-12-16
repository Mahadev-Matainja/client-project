"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import UserSidebar from "@/components/common/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className=" h-screen overflow-scroll">
      {/* Sidebar */}
      <UserSidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile ? (sidebarOpen ? "ml-72" : "ml-20") : "ml-0"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4 flex-1 overflow-auto dark:bg-gray-800 dark:text-white bg-[#F3F4F6]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
