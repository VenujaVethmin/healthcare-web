"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Lock,
  UserCheck,
  Database,
  Share2,
  Cookie,
  AlertCircle,
} from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, email address, phone number)",
        "Health and medical information",
        "Insurance and billing information",
        "Device and usage information",
        "Communication records between you and our healthcare providers",
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "End-to-end encryption for all sensitive data",
        "Regular security audits and updates",
        "Secure storage systems compliant with healthcare standards",
        "Limited access to authorized personnel only",
        "Automated threat detection and prevention systems",
      ],
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Access your personal health information",
        "Request corrections to your data",
        "Withdraw consent for data processing",
        "Request data deletion (where applicable)",
        "Receive a copy of your data in a portable format",
      ],
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Storage",
      content: [
        "Secure servers located in compliant facilities",
        "Regular data backups and disaster recovery",
        "Data retention periods as required by law",
        "Secure disposal of outdated information",
        "Monitoring of data access and usage",
      ],
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Information Sharing",
      content: [
        "Sharing with healthcare providers involved in your care",
        "Legal requirements and law enforcement requests",
        "With your explicit consent",
        "For payment processing and insurance claims",
        "Anonymous data for research and analytics",
      ],
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "Cookies and Tracking",
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve our services",
        "User preference cookies",
        "Third-party service provider cookies",
        "Option to manage cookie preferences",
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
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-[#3a99b7]/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#3a99b7]" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We are committed to protecting your privacy and ensuring the
              security of your personal and medical information.
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

      {/* Policy Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
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

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#3a99b7]/5 rounded-xl p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#3a99b7]" />
            <div>
              <h3 className="text-lg font-semibold text-[#232323] mb-2">
                Questions About Our Privacy Policy?
              </h3>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please
                contact our Data Protection Officer at{" "}
                <a
                  href="mailto:privacy@healthi.com"
                  className="text-[#3a99b7] hover:underline"
                >
                  privacy@healthi.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
