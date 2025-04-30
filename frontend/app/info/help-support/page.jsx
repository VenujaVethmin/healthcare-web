"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { useState } from "react";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const supportChannels = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "24/7 Emergency Support",
      contact: "+1 234-567-8900",
      availability: "Mon-Sun: 24/7",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get in touch via email",
      contact: "support@healthi.com",
      availability: "Response within 24h",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available on website",
      availability: "Mon-Fri: 9AM-6PM",
    },
  ];

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment by visiting our 'Find Doctors' page, selecting your preferred doctor, and choosing an available time slot. You'll need to be signed in to complete the booking.",
    },
    {
      question: "What should I do in case of a medical emergency?",
      answer:
        "For medical emergencies, please call our 24/7 emergency hotline immediately. If it's a life-threatening situation, call your local emergency services or visit the nearest emergency room.",
    },
    {
      question: "How can I view my medical records?",
      answer:
        "You can access your medical records through your patient dashboard after logging in. All your consultation history, prescriptions, and test results will be available there.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, insurance, and digital wallets. Payment details can be added in your account settings.",
    },
    {
      question: "How do I cancel or reschedule an appointment?",
      answer:
        "You can cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time. Please note our cancellation policy for late changes.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#3a99b7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">
              We're here to help. Find answers to common questions or reach out
              to our support team.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Support Channels */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#eafefa] rounded-lg">
                    <channel.icon className="w-6 h-6 text-[#3a99b7]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#232323]">
                      {channel.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{channel.description}</p>
                    <p className="text-[#3a99b7] font-medium mt-2">
                      {channel.contact}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{channel.availability}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-[#232323] mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50"
                >
                  <span className="font-medium text-[#232323]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    
    </div>
  );
}
