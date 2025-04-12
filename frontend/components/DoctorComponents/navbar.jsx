"use client";

import { useState } from "react";
import { Bell, ChevronDown, User, FileText, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {useRouter } from "next/navigation";
import { logOut } from "@/hooks/auth-hooks";
import useSession from "@/hooks/session";
import Image from "next/image"; //

export default function Navbar() {
   const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

   const { user, isLoading, error } = useSession();

  const profileMenuItems = [
    {
      label: "My Profile",
      icon: User,
      href: "/doctor/profile",
    },

  ];

  const notifications = [
    { type: "appointment", message: "Upcoming appointment in 30 minutes" },
    { type: "message", message: "New message from Dr. Sarah" },
  ];

  return (
    <nav className="fixed top-0 right-0 md:left-[220px] w-full md:w-[calc(100%-220px)] z-40">
      <div className="bg-white border-b border-[#e2e2e2]">
        <div className="px-6 h-16 flex items-center justify-between md:justify-items-end">
          {/* Mobile Logo */}
          <div>

          <div className="md:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3a99b7] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#232323]">
                  Healthi
                </span>
                <span className="text-sm text-gray-500">
                  Healthcare Platform
                </span>
              </div>
            </Link>
          </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
           

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="relative w-9 h-9">
                <Image
  src={
    user?.image ||
    `https://ui-avatars.com/api/?name=User&background=3a99b7&color=fff&size=128`
  }
  alt="Profile"
  className="rounded-full object-cover"
  width={36}
  height={36}
/>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-[#232323]">
                     {user?.name}
                    </span>
                    <span className="text-xs text-[#82889c]">{user?.role}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#82889c] transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e2e2e2] overflow-hidden"
                  >
                    <div className="p-1.5">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-[#434966] hover:bg-[#f8f9fa] rounded-md transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-[#e2e2e2]">
                      <button  onClick={() => logOut(router)} className="w-full px-3 py-2 text-sm text-left text-[#fa6161] hover:bg-[#f8f9fa] rounded-md transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
