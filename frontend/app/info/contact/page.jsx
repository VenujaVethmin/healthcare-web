"use client";

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone",
      details: [
        { label: "Emergency Hotline", value: "1800-123-4567" },
        { label: "General Inquiries", value: "+94 123 456 789" },
      ],
      color: "bg-blue-500/10 text-blue-600",
      href: "tel:18001234567",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email",
      details: [
        { label: "Support", value: "support@healthi.com" },
        { label: "Info", value: "info@healthi.com" },
      ],
      color: "bg-purple-500/10 text-purple-600",
      href: "mailto:support@healthi.com",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location",
      details: [
        { label: "Main Hospital", value: "123 Healthcare Ave" },
        { label: "City", value: "Medical District, 10001" },
      ],
      color: "bg-red-500/10 text-red-600",
      href: "https://maps.google.com",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Working Hours",
      details: [
        { label: "Monday - Friday", value: "9:00 AM - 6:00 PM" },
        { label: "Weekend", value: "10:00 AM - 4:00 PM" },
      ],
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eafefa] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We're here to help. Contact us
            through any of the following channels.
          </p>
        </motion.div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all
                ${item.href ? "cursor-pointer hover:scale-105" : ""}
              `}
              onClick={() => item.href && window.open(item.href, "_blank")}
            >
              <div
                className={`w-16 h-16 rounded-xl ${item.color} flex items-center justify-center mb-6`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#232323] mb-4">
                {item.title}
              </h3>
              <div className="space-y-3">
                {item.details.map((detail, idx) => (
                  <div key={idx}>
                    <p className="text-sm text-gray-500">{detail.label}</p>
                    <p className="text-[#3a99b7] font-medium">{detail.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 rounded-xl overflow-hidden shadow-sm"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d990.3926631867058!2d80.04021301567931!3d6.821956281694675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2523b05555555%3A0x546c34cd99f6f488!2sNSBM%20Green%20University!5e0!3m2!1sen!2slk!4v1746000770438!5m2!1sen!2slk"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
