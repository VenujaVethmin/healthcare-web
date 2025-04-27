"use client";

import {
  ChevronRight, // Corrected from LinkedIn
  Clock,
  Facebook, // Use X instead of Twitter for lucide-react
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  X
} from "lucide-react";
import Link from "next/link";

const FooterStaff = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "News & Media", href: "/news" },
      { label: "Contact Us", href: "/contact" },
    ],
    resources: [
      { label: "Health Blog", href: "/blog" },
      { label: "FAQs", href: "/faqs" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Support Center", href: "/help-support" },
    ],
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Emergency Hotline",
      value: "1800-123-4567",
      href: "tel:18001234567",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Us",
      value: "care@healthi.com",
      href: "mailto:care@healthi.com",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "123 Healthcare Ave, Medical District",
      href: "https://maps.google.com",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Working Hours",
      value: "Mon - Sun: 24/7",
      href: null,
    },
  ];

  const socialIcons = [
    { Icon: Facebook, href: "https://facebook.com" },
    { Icon: X, href: "https://x.com" },
    { Icon: Instagram, href: "https://instagram.com" },
    { Icon: Linkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className="max-w-7xl  mx-auto bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
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
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Providing quality healthcare services and innovative solutions for
              a healthier tomorrow. Your wellness is our priority.
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#3a99b7] hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                {title.charAt(0).toUpperCase() + title.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-[#3a99b7] flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact Us
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 text-gray-600 hover:text-[#3a99b7]"
                      target={item.label === "Location" ? "_blank" : undefined}
                      rel={
                        item.label === "Location"
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <span className="text-[#3a99b7]">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm">{item.value}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 text-gray-600">
                      <span className="text-[#3a99b7]">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm">{item.value}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Healthi. All rights reserved.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterStaff;
