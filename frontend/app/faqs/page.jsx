"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "How do I book an appointment?",
          a: "You can book an appointment through our online platform by visiting the 'Find a Doctor' page, selecting your preferred doctor, and choosing an available time slot. You can also call our helpline for assistance.",
        },
        {
          q: "What insurance plans do you accept?",
          a: "We accept most major insurance plans. Please contact our insurance department or check with your insurance provider for specific coverage details.",
        },
        {
          q: "How can I access my medical records?",
          a: "You can access your medical records through your patient portal account. If you haven't set up an account, please contact our support team for assistance.",
        },
      ],
    },
    {
      category: "Appointments",
      questions: [
        {
          q: "How early should I arrive for my appointment?",
          a: "Please arrive 15 minutes before your scheduled appointment time to complete any necessary paperwork and check-in procedures.",
        },
        {
          q: "What should I bring to my appointment?",
          a: "Please bring a valid ID, your insurance card, a list of current medications, and any relevant medical records or test results.",
        },
        {
          q: "How do I cancel or reschedule an appointment?",
          a: "You can cancel or reschedule through your patient portal or by calling our office at least 24 hours in advance.",
        },
      ],
    },
    {
      category: "Online Services",
      questions: [
        {
          q: "How do I create a patient portal account?",
          a: "You can create an account by clicking the 'Sign Up' button and following the registration process. You'll need your patient ID which you can get from our reception.",
        },
        {
          q: "Is my health information secure?",
          a: "Yes, we use advanced encryption and security measures to protect your health information in compliance with HIPAA regulations.",
        },
        {
          q: "Can I request prescriptions online?",
          a: "Yes, registered patients can request prescription refills through the patient portal or by contacting their healthcare provider.",
        },
      ],
    },
    {
      category: "Billing & Insurance",
      questions: [
        {
          q: "How can I pay my bill?",
          a: "We accept payments online through our patient portal, by phone, mail, or in person. We accept most major credit cards and payment plans are available.",
        },
        {
          q: "What if I don't have insurance?",
          a: "We offer self-pay options and financial assistance programs for eligible patients. Please contact our billing department to discuss your options.",
        },
        {
          q: "How do I update my insurance information?",
          a: "You can update your insurance information through your patient portal or by contacting our billing department directly.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eafefa] to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our services, appointments,
            and healthcare procedures.
          </p>
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-2xl font-semibold text-[#232323] mb-4">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq, index) => {
                  const isOpen = openIndex === `${sectionIndex}-${index}`;

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <button
                        onClick={() =>
                          setOpenIndex(
                            isOpen ? null : `${sectionIndex}-${index}`
                          )
                        }
                        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-medium text-[#232323]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center bg-[#3a99b7]/5 rounded-xl p-8"
        >
          <h2 className="text-xl font-semibold text-[#232323] mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Please contact our support
            team.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-[#3a99b7] text-white rounded-lg font-medium hover:bg-[#2d7a93] transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}
