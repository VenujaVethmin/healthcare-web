"use client";

import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      number: "24/7",
      label: "Medical Support",
      image:
        "https://images.unsplash.com/photo-1587556590582-927ced50c126?q=80&w=500&auto=format&fit=crop",
      description: "Round-the-clock medical assistance at your fingertips",
    },
    {
      number: "100%",
      label: "Patient Privacy",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=500&auto=format&fit=crop",
      description: "Your data is secure and confidential",
    },
    {
      number: "Fast",
      label: "Online Booking",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=500&auto=format&fit=crop",
      description: "Schedule appointments with just a few clicks",
    },
    {
      number: "Expert",
      label: "Healthcare",
      image:
        "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=500&auto=format&fit=crop",
      description: "Professional medical care from qualified doctors",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eafefa] to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-10">
                <Link href="/about" className="nav-link">
                  About
                </Link>

                <Link href="/help-support" className="nav-link">
                  Help & Support
                </Link>
                <div className="flex items-center gap-4 ml-4">
                  <Link
                    href="/login"
                    className="px-6 py-2.5 text-[#3a99b7] font-medium hover:text-[#2d7a93] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/redirect"
                    className="px-6 py-2.5 text-white bg-[#3a99b7] rounded-xl font-medium hover:bg-[#2d7a93] transition-colors shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-4">
                <Link href="/about" className="mobile-nav-link">
                  About
                </Link>
                <Link href="/services" className="mobile-nav-link">
                  Services
                </Link>
                <Link href="/doctors" className="mobile-nav-link">
                  Find Doctors
                </Link>
                <Link href="/support" className="mobile-nav-link">
                  Help & Support
                </Link>
                <div className="pt-4 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full px-4 py-3 text-center text-[#3a99b7] border-2 border-[#3a99b7] rounded-xl font-medium hover:bg-[#3a99b7] hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/redirect"
                    className="block w-full px-4 py-3 text-center text-white bg-[#3a99b7] rounded-xl font-medium hover:bg-[#2d7a93] transition-colors shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#232323] leading-tight"
              >
                Your Health is Our
                <span className="text-[#3a99b7]"> Priority</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0"
              >
                Experience healthcare that puts you first. Book appointments,
                consult with experts, and manage your health journey all in one
                place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/redirect"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#3a99b7] rounded-xl hover:bg-[#2d7a93] transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-[#3a99b7] bg-[#eafefa] rounded-xl hover:bg-[#d7f7f7] transition-colors duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#3a99b7]">
                    {feature.number}
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.label}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
