"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  MessageSquare,
  ChevronDown,
  Users,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { type: "appointment", message: "Upcoming appointment in 30 minutes" },
    { type: "message", message: "New message from Dr. Sarah" },
  ];

  return (
    <nav className="fixed top-0 right-0 md:left-[220px] w-full md:w-[calc(100%-220px)] z-40">
      <div className="bg-white border-b border-[#e2e2e2]">
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div>
            {/* Mobile Title */}
            <div className="md:hidden">
              <h1 className="text-lg font-bold text-[#3a99b7]">Healthi</h1>
              <p className="text-xs text-[#82889c]">Healthcare Platform</p>
            </div>
            {/* Find Doctors Button */}
            <div className="hidden md:block">
              
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
           

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-[#e2e2e2]" />

            {/* Notifications */}
            <div className="relative">
              <button className="p-2.5 rounded-full hover:bg-[#f8f9fa] text-[#82889c] hover:text-[#3a99b7] transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#fa6161] text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-full hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="relative w-9 h-9">
                  <img
                    src="https://ui-avatars.com/api/?name=Stevan+Dux&background=3a99b7&color=fff"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-[#232323]">
                      Stevan Dux
                    </span>
                    <span className="text-xs text-[#82889c]">Doctor</span>
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
                      
                    </div>
                    <div className="p-1.5  border-[#e2e2e2]">
                      <button className="w-full px-3 py-2 text-sm text-left text-[#fa6161] hover:bg-[#f8f9fa] rounded-md transition-colors">
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
