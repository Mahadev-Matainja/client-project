import { useState } from "react";
import {
  User,
  Activity,
  TrendingUp,
  FileText,
  Bell,
  LogOut,
  Phone,
  Crown,
  Menu,
  Settings,
  HelpCircle,
  House,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/utils/api";

const roleColors = {
  admin: "bg-red-500",
  doctor: "bg-blue-500",
  patient: "bg-green-500",
  staff: "bg-yellow-500",
};

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  // const capitalize = (value: string = "") =>
  //   value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  const profileData = {
    name: user
      ? `${user.first_name} ${user.last_name ? user.last_name : ""}`
      : "",
    email: user?.email || "",
    role: user ? `${user.subType}` : "",
  };

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  const handleSignOut = async () => {
    const endPoints = pathname.startsWith("/doctor")
      ? "/doctor/logout"
      : "/logout";

    try {
      const response = await api.post(endPoints, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session?.data?.user?.data?.token,
        }),
      });

      // if (!response.success) {
      //   console.error("Logout API failed:", response.statusText);
      // }

      await signOut({
        callbackUrl: "/",
      });

      // clear sessionStorage
      sessionStorage.clear();
      localStorage.clear();
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 flex items-center justify-between px-4 shadow relative border-b border-gray-200 dark:border-gray-700 ">
      <Menu
        className="cursor-pointer sm:ml-4 dark:text-white"
        onClick={toggleSidebar}
      />

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        {/* Test Results Link */}
        {/* Test Results */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hidden md:flex cursor-pointer"
          onClick={() => router.push("/lab-entry")}
        >
          <FileText className="h-4 w-4" />
          <span>Report Results</span>
        </Button>

        {/* Subscription */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent hidden md:flex cursor-pointer"
          onClick={() => router.push("/subscription")}
        >
          <Crown className="h-4 w-4 text-yellow-600" />
          <span>Subscription</span>
        </Button>

        {/* Contact Us */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent hidden md:flex cursor-pointer"
          onClick={() => router.push("/contact-us")}
        >
          <Phone className="h-4 w-4" />
          <span>Contact Us</span>
        </Button>

        {/* User Info ( Dropdown) */}
        <div className="relative">
          {/* Dropdown */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                <img
                  src={
                    user?.avatar
                      ? `${BASE_URL}/${user?.avatar}`
                      : "/noProfileImage.png"
                  }
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
                {/* Name + Role visible only on large screens */}

                {/* Name + Role */}
                <div className="flex flex-col items-start leading-tight text-left">
                  {/* Name */}
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                    {profileData.name}
                  </span>

                  {/* Role Badge */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full text-white font-semibold mt-1 ${
                      roleColors[
                        user?.subType?.toLowerCase() as keyof typeof roleColors
                      ] ?? "bg-gray-500"
                    }`}
                  >
                    {profileData.role
                      ? profileData.role.charAt(0).toUpperCase() +
                        profileData.role.slice(1)
                      : ""}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/subscription")}
                className="cursor-pointer"
              >
                <Crown className="mr-2 h-4 w-4" />
                <span>Subscription</span>
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => router.push("/help")}
                className="cursor-pointer"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
