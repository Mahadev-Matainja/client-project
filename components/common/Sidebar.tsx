import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Activity,
  TrendingUp,
  FileText,
  Crown,
  Search,
  Ambulance,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { menuMap } from "@/config/menuMap";

interface UserSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, isMobile, onClose }: UserSidebarProps) => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace("/api", "") || "";

  // const capitalize = (value: string = "") =>
  //   value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  const profileData = {
    name: user
      ? `${user.first_name} ${user.last_name ? user.last_name : ""}`
      : "",
    email: user?.email || "",
  };

  //  Generate Dynamic Sidebar Menu Based on Role + Permissions
  interface SidebarMenuItem {
    path: string;
    label: string;
    icon: any;
    permission: string;
  }

  const cleanSubType = user?.subType?.trim();

  const roleMenus = (() => {
    const userTypeMenu = menuMap[user?.type as keyof typeof menuMap];
    if (!userTypeMenu || !cleanSubType || !(cleanSubType in userTypeMenu)) {
      return [];
    }
    return (
      (userTypeMenu[
        cleanSubType as keyof typeof userTypeMenu
      ] as SidebarMenuItem[]) || []
    );
  })();

  const navItems = roleMenus;

  const defaultActivePath = roleMenus[0]?.path;
  const isActive = (path: string) =>
    pathname === path || pathname === defaultActivePath;

  return (
    <aside
      className={`
        bg-white shadow-lg border-r border-gray-200
        fixed top-0 left-0 h-full z-50 flex flex-col
        transition-all duration-300 pt-2 pb-6
        ${isMobile ? "w-72" : isOpen ? "w-72" : "w-20"}
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
      `}
    >
      {/* Close Icon (mobile only) */}
      <div
        className="h-5 w-5 cursor-pointer absolute top-4 right-3 z-50 sm:hidden text-gray-800"
        onClick={onClose}
      >
        X
      </div>

      {/* Logo */}
      <div className="flex items-center px-4 mb-8 justify-center">
        <img
          src="/predicker-logo.png"
          alt="logo"
          className={`transition-all duration-300 dark:bg-white cursor-pointer ${
            isOpen ? "w-2/3" : "w-full"
          }`}
          onClick={() => redirect("/dashboard")}
        />
      </div>

      {/* Menu Items */}
      <div className={`flex-1 overflow-y-auto  ${isOpen ? "px-6" : "px-2"}`}>
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }, index) =>
            isOpen ? (
              <li key={index}>
                <Link
                  href={path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors
            ${
              pathname === path
                ? "bg-[#aa0000] text-white"
                : "hover:bg-[#00aad4] hover:text-white text-gray-700"
            }
          `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{label}</span>
                </Link>
              </li>
            ) : (
              <li key={index}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={path}
                        className={`flex items-center justify-center px-2 py-2 rounded transition-all
                  ${
                    pathname === path
                      ? "bg-[#aa0000] text-white"
                      : "hover:bg-[#00aad4] hover:text-white text-gray-700"
                  }
              `}
                      >
                        <Icon className="h-6 w-6" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Profile Section (Sticky Bottom) */}
      <div
        className={`border-t border-gray-200 transition-all duration-300
          ${
            isOpen
              ? "flex items-center gap-3 p-4"
              : "flex flex-col items-center justify-center py-6"
          }
        `}
      >
        <Avatar className={`${isOpen ? "h-8 w-8" : "h-12 w-12"}`}>
          <AvatarImage
            src={
              user?.avatar
                ? `${BASE_URL}/${user?.avatar}`
                : "/noProfileImage.png"
            }
            alt="User Avatar"
          />
          <img
            src={
              user?.avatar
                ? `${BASE_URL}/${user?.avatar}`
                : "/noProfileImage.png"
            }
            alt="user"
            className="w-8 h-8 rounded-full"
          />
        </Avatar>
        {isOpen && (
          <div>
            <h3 className="font-semibold">{profileData.name}</h3>
            <p className="text-sm text-gray-500">
              {user?.subType === "ambulance" || user?.subType === "oxygen"
                ? `Provider ID:#${user?.id}`
                : `${
                    (user?.subType ?? "").charAt(0).toUpperCase() +
                    (user?.subType ?? "").slice(1)
                  } ID:#${user?.id}`}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
