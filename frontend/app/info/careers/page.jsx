"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Microscope,
  Heart,
  Brain,
  Pill as Pills,
  Users,
  Code,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Careers() {
  const departments = [
    {
      title: "Medical Staff",
      icon: <Stethoscope className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-600",
      positions: ["Senior Doctor", "Registered Nurse", "Medical Assistant"],
    },
    {
      title: "Laboratory",
      icon: <Microscope className="w-6 h-6" />,
      color: "bg-purple-500/10 text-purple-600",
      positions: ["Lab Technician", "Pathologist", "Research Assistant"],
    },
    {
      title: "Patient Care",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-500/10 text-red-600",
      positions: [
        "Care Coordinator",
        "Patient Advocate",
        "Healthcare Navigator",
      ],
    },
    {
      title: "Mental Health",
      icon: <Brain className="w-6 h-6" />,
      color: "bg-green-500/10 text-green-600",
      positions: [
        "Psychiatrist",
        "Clinical Psychologist",
        "Mental Health Counselor",
      ],
    },
    {
      title: "Pharmacy",
      icon: <Pills className="w-6 h-6" />,
      color: "bg-yellow-500/10 text-yellow-600",
      positions: [
        "Clinical Pharmacist",
        "Pharmacy Technician",
        "Pharmaceutical Researcher",
      ],
    },
    {
      title: "Administration",
      icon: <Users className="w-6 h-6" />,
      color: "bg-indigo-500/10 text-indigo-600",
      positions: [
        "Healthcare Administrator",
        "Office Manager",
        "Medical Secretary",
      ],
    },
    {
      title: "Technology",
      icon: <Code className="w-6 h-6" />,
      color: "bg-pink-500/10 text-pink-600",
      positions: ["Health IT Specialist", "Software Developer", "Data Analyst"],
    },
    {
      title: "Management",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-600",
      positions: [
        "Department Manager",
        "Clinical Director",
        "Operations Manager",
      ],
    },
  ];

  const benefits = [
    "Competitive salary packages",
    "Health and dental insurance",
    "Professional development opportunities",
    "Flexible working hours",
    "Performance bonuses",
    "Paid time off",
    "Career advancement paths",
    "Modern work environment",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eafefa] to-white">
      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-6">
              Join Our Healthcare Team
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Be part of a dynamic healthcare organization committed to
              innovation, excellence, and improving people's lives.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {departments.map((dept, index) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${dept.color} flex items-center justify-center mb-4`}
                >
                  {dept.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#232323] mb-3">
                  {dept.title}
                </h3>
                <ul className="space-y-2">
                  {dept.positions.map((position) => (
                    <li
                      key={position}
                      className="flex items-center text-gray-600 text-sm"
                    >
                      <ChevronRight className="w-4 h-4 text-[#3a99b7] mr-2" />
                      {position}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#232323] mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600">
              We offer comprehensive benefits and a supportive work environment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#3a99b7]/5 rounded-lg p-4 text-center"
              >
                <p className="text-[#3a99b7] font-medium">{benefit}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#3a99b7] rounded-xl p-8 sm:p-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join our team of healthcare professionals and contribute to
              improving people's lives through quality healthcare services.
            </p>
            <Link
              href="mailto:careers@healthi.com"
              className="inline-flex items-center px-6 py-3 bg-white text-[#3a99b7] rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
