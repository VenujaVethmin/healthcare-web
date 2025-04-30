"use client";

import { motion } from "framer-motion";
import { Shield, Users, Award, Clock } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    {
      icon: Users,
      number: "10K+",
      label: "Patients Served",
    },
    {
      icon: Award,
      number: "100+",
      label: "Expert Doctors",
    },
    {
      icon: Shield,
      number: "99%",
      label: "Success Rate",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support",
    },
  ];

  const team = [
    {
      name: "Dr. Sarah Wilson",
      role: "Medical Director",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Dr. Michael Chen",
      role: "Chief of Medicine",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
    },
    {
      name: "Dr. Emily Thompson",
      role: "Head of Cardiology",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-r from-[#3a99b7] to-[#2d7a93]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Healthi
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl">
              Transforming healthcare through innovation and compassion
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-[#232323] mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6">
                At Healthi, we believe that quality healthcare should be
                accessible to everyone. Our mission is to bridge the gap between
                patients and healthcare providers through innovative technology
                and personalized care solutions.
              </p>
              <p className="text-gray-600">
                We strive to create a seamless healthcare experience by
                connecting you with the best medical professionals, providing
                convenient booking solutions, and ensuring your health
                information is secure and readily available.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[400px] rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop"
                alt="Healthcare professionals"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>

     

    
      
    </div>
  );
}
