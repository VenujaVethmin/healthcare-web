"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Heart,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  UserCircle2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    path: "/doctor/calendar",
    icon: CalendarDays,
  },
  {
    title: "Profile",
    path: "/doctor/profile",
    icon: UserCircle2,
  },
 
];

const SidebarContent = ({ isMobile = false }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo - Hide on mobile bottom nav */}
      {!isMobile && (
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute rounded-lg bg-[#3a99b7] " />
              <div className="relative w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#3a99b7]" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-[#3a99b7]">Healthi</h1>
              <p className="text-[10px] text-[#3a99b7]/80">
                Healthcare Platform
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${isMobile ? "px-2" : "px-3 py-6"}`}>
        <div className={`${isMobile ? "flex justify-around" : "space-y-1"}`}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={isMobile ? "flex-1" : ""}
              >
                <motion.div
                  whileHover={{ x: isMobile ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    ${
                      isMobile
                        ? "flex flex-col items-center py-3 px-1 gap-1"
                        : "flex items-center gap-2 p-2"
                    }
                    rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] text-white shadow-lg shadow-[#3a99b7]/20"
                        : "text-[#7E7E7E] hover:bg-[#3a99b7]/5"
                    }
                  `}
                >
                  <div
                    className={`${
                      isActive ? "bg-white/20" : ""
                    } p-1.5 rounded-md`}
                  >
                    <item.icon size={18} />
                  </div>
                  <span
                    className={`font-medium ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    {item.title}
                  </span>
                  {isActive && !isMobile && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1 h-6 bg-white rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout - Hide on mobile bottom nav */}
      {!isMobile && (
        <div className="p-3 border-t border-[#e2e2e2]">
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-[#3a99b7]/5 transition-colors group"
          >
            <LogOut className="w-[18px] h-[18px] text-[#7E7E7E] group-hover:text-[#3a99b7]" />
            <span className="text-sm text-[#7E7E7E] group-hover:text-[#3a99b7]">
              Logout
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e2e2] shadow-lg z-40 md:hidden">
        <SidebarContent isMobile={true} />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[220px] bg-white shadow-lg z-50 overflow-y-auto md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-[220px] bg-white border-r border-[#e2e2e2] shadow-[2px_0px_18px_0px_rgba(0,0,0,0.05)] overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Content Spacer */}
      <div className="md:pl-[60px] pb-16 md:pb-0" />
    </>
  );
}
