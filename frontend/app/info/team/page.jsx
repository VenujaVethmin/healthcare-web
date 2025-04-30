"use client";

import { motion } from "framer-motion";
import { Award, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Team() {
  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940",
      specialty: "Cardiology",
      experience: "15+ years",
      education: "Harvard Medical School",
      certifications: [
        "American Board of Internal Medicine",
        "Cardiovascular Disease",
      ],
      contact: {
        email: "sarah.johnson@healthi.com",
        phone: "+1 (555) 123-4567",
      },
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Neurology",
      image:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2940",
      specialty: "Neurology",
      experience: "12+ years",
      education: "Stanford University",
      certifications: ["American Board of Psychiatry and Neurology"],
      contact: {
        email: "michael.chen@healthi.com",
        phone: "+1 (555) 234-5678",
      },
    },
   
    {
      name: "Dr. James Wilson",
      role: "Orthopedic Surgeon",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2940",
      specialty: "Orthopedics",
      experience: "18+ years",
      education: "Yale School of Medicine",
      certifications: ["American Board of Orthopedic Surgery"],
      contact: {
        email: "james.wilson@healthi.com",
        phone: "+1 (555) 456-7890",
      },
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
              Meet Our Team
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our dedicated team of healthcare professionals brings together
              expertise from various medical specialties to provide
              comprehensive care.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-64 sm:h-auto">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-semibold text-[#232323] mb-1">
                    {member.name}
                  </h2>
                  <p className="text-[#3a99b7] font-medium mb-4">
                    {member.role}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Specialty</p>
                      <p className="font-medium text-[#232323]">
                        {member.specialty}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium text-[#232323]">
                        {member.experience}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Education</p>
                      <p className="font-medium text-[#232323]">
                        {member.education}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Certifications</p>
                      <ul className="mt-1 space-y-1">
                        {member.certifications.map((cert, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#3a99b7]" />
                            <span className="text-sm text-[#232323]">
                              {cert}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <a
                        href={`mailto:${member.contact.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#3a99b7]"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{member.contact.email}</span>
                      </a>
                      <a
                        href={`tel:${member.contact.phone}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#3a99b7]"
                      >
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{member.contact.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-[#3a99b7] rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Looking to Join Our Team?
          </h2>
          <p className="max-w-2xl mx-auto mb-6">
            We're always looking for talented healthcare professionals to join
            our team. Check out our current openings and opportunities.
          </p>
          <a
            href="/careers"
            className="inline-flex items-center px-6 py-3 bg-white text-[#3a99b7] rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Career Opportunities
          </a>
        </motion.div>
      </div>
    </div>
  );
}
