"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      window.alert("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      window.alert("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      window.alert("Invalid email format");
      return;
    }

    if (!formData.password) {
      window.alert("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      window.alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      window.alert("You must accept the terms and conditions");
      return;
    }

    try {
      setIsLoading(true);

    
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );
        console.log(formData);

      if (response.status === 201) {
        window.alert("Account created successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      window.alert(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section with Medical Image */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#3a99b7] to-[#2d7a93] overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2791&auto=format&fit=crop"
            alt="Modern Healthcare"
            fill
            className="object-cover mix-blend-overlay opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a99b7]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2d7a93]/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 shadow-xl"
          >
            <Activity className="w-12 h-12" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold mb-6 text-center text-white drop-shadow-lg"
          >
            Join Healthi Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white text-center max-w-md leading-relaxed drop-shadow-md"
          >
            Your journey to better healthcare management starts here
          </motion.p>
        </div>
      </motion.div>

      {/* Right Section - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] bg-clip-text text-transparent">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#3a99b7] hover:text-[#2d7a93]"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-lg border focus:border-[#3a99b7] focus:ring-[#3a99b7]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked)}
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-[#3a99b7] hover:text-[#2d7a93]"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-[#3a99b7] hover:text-[#2d7a93]"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] text-white 
                  ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-[#2d7a93] hover:to-[#3a99b7]"
                  }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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

              <div className="grid grid-cols-1">
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <img
                    src="https://authjs.dev/img/providers/google.svg"
                    alt="Google"
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
