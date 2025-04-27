"use client";

import { motion } from "framer-motion";
import { Shield, Users, ClipboardCheck, Scale } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Agreement",
      content: [
        "By accessing our platform, you agree to these terms and conditions.",
        "Users must be 18 years or older to create an account.",
        "You are responsible for maintaining the confidentiality of your account.",
        "Multiple accounts for a single user are not permitted.",
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy & Data",
      content: [
        "We collect and process personal data as described in our Privacy Policy.",
        "Your medical information is protected under applicable healthcare laws.",
        "We implement industry-standard security measures to protect your data.",
        "You have the right to request access to your personal data.",
      ],
    },
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Medical Services",
      content: [
        "Our platform facilitates healthcare service delivery but does not provide medical advice.",
        "Always consult healthcare professionals for medical decisions.",
        "Emergency services should be accessed through traditional emergency channels.",
        "Appointment schedules are subject to healthcare provider availability.",
      ],
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Legal Disclaimers",
      content: [
        "Services are provided 'as is' without any warranties.",
        "We reserve the right to modify these terms at any time.",
        "Users agree to indemnify us against any claims arising from their use.",
        "These terms are governed by applicable local laws.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eafefa] to-white">
      {/* Header Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-6">
              Terms of Service
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Please read these terms carefully before using our healthcare
              platform. By using our services, you agree to be bound by these
              terms.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-gray-500">Last Updated: April 27, 2024</p>
        </motion.div>
      </div>

      {/* Terms Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#3a99b7]/10 flex items-center justify-center text-[#3a99b7]">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#232323] mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <span className="text-[#3a99b7] mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500"
        >
          <p>
            If you have any questions about these terms, please contact us at{" "}
            <a
              href="mailto:legal@healthi.com"
              className="text-[#3a99b7] hover:underline"
            >
              legal@healthi.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
