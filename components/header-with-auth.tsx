"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "@/components/auth/auth-modal";
import { User, Settings, LogOut, Heart } from "lucide-react";

export default function HeaderWithAuth({
  setIsPrescription,
}: {
  setIsPrescription?: (value: boolean) => void;
}) {
  const { data: session, status } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const openSignIn = () => {
    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  // const openSignUp = () => {
  //   setAuthMode("signup");
  //   setAuthModalOpen(true);
  // };

  // Extract customer info safely
  const customer = session?.user?.data?.customer;
  const fullName = customer
    ? `${customer.first_name} ${customer.last_name}`
    : "User";
  const avatarLetter = customer?.first_name?.charAt(0).toUpperCase() ?? "U";
  const email = customer?.email ?? "";

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/predicker-logo.png"
                alt="Abhipsita Care Logo"
                className="w-2/3"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              {/* <Link
                href="#services"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Services
              </Link> */}
              <Link
                href="/about-us"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>

              {status === "loading" ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={""} alt={fullName} />
                        <AvatarFallback>{avatarLetter}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Health Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={openSignIn}
                    className="bg-transparent cursor-pointer"
                  >
                    Sign In
                  </Button>
                  {/* <Button onClick={openSignUp}>
                    {" "}
                    Get Your Basic Health Score
                  </Button> */}
                  <Button
                    className="cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://www.myhealthscore.com/healthquiz",
                        "_blank"
                      )
                    }
                  >
                    Get Your Basic Health Score
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        updateInitialMode={(value) => setAuthMode(value)}
      />
    </>
  );
}
