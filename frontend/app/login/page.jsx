"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    console.log("Google Sign-In Button Clicked"); // Debugging
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Decorative */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#3a99b7] to-[#2d7a93]"
      >
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-8"
          >
            <Activity className="w-10 h-10" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome to Healthi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/80 text-center max-w-md"
          >
            Your trusted healthcare platform for managing appointments and
            medical records
          </motion.p>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] bg-clip-text text-transparent">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#3a99b7] hover:text-[#2d7a93]"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Prevent form submission from refreshing the page */}
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#3a99b7] hover:text-[#2d7a93]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-11 bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] text-white hover:from-[#2d7a93] hover:to-[#3a99b7]">
                Sign in
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Google Login Button */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                >
                  <img
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </Button>

                {/* Apple Login Button */}
                <Button variant="outline" className="w-full">
                  <img
                    src="https://authjs.dev/img/providers/apple.svg"
                    alt="Apple"
                    className="w-5 h-5"
                  />
                </Button>

                {/* GitHub Login Button */}
                <Button variant="outline" className="w-full">
                  <img
                    src="https://authjs.dev/img/providers/github.svg"
                    alt="GitHub"
                    className="w-5 h-5"
                  />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
