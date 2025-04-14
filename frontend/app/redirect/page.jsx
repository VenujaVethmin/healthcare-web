"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";

const LoadingDot = ({ delay }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      delay,
    }}
    className="w-2 h-2 rounded-full bg-[#3a99b7]"
  />
);

export default function Redirect() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        
  const token = Cookies.get("token");

   if (!token) {
      router.push("/login");
      return
   }
        const response = await axiosInstance.get("/me");

        if (!response.status === 200) {
          router.push("/login");
          return;
        }
        

        const userData = await response.data;
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "PATIENT":
          router.push("/user/dashboard");
          break;
        case "DOCTOR":
          router.push("/doctor/dashboard");
          break;
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
           case "PHARMACIST":
          router.push("/pharmacist/dashboard");
          break;
        default:
          router.push("/login");
      }
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#eafefa] to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Spinner Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#3a99b7] border-r-[#3a99b7]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#2d7a93] border-l-[#2d7a93]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 rounded-full border-4 border-transparent border-b-[#3a99b7] border-r-[#3a99b7]"
        />

        {/* Center Circle */}
        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#3a99b7] to-[#2d7a93] shadow-lg flex items-center justify-center">
          <Activity className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-2xl font-bold text-[#232323]"
      >
        Welcome to Healthi
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-[#82889c]"
      >
        Redirecting you to your dashboard
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex gap-1.5 mt-4"
      >
        {[0, 0.2, 0.4].map((delay, index) => (
          <LoadingDot key={index} delay={delay} />
        ))}
      </motion.div>
    </div>
  );
}
