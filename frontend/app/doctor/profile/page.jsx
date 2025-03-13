"use client";

import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Clock,
  Stethoscope
} from "lucide-react";
import Link from "next/link";

export default function DoctorProfilePage() {
  const doctorDetails = {
    name: "Dr. Sarah Connor",
    specialty: "Cardiologist",
    email: "sarah.connor@healthcare.com",
    phone: "+1 234-567-8900",
    location: "Medical Center, New York",
    experience: "15 years",
    education: "MD - Cardiology",
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Main Content */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full bg-[#3a99b7] flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl font-medium">SC</span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md">
                <Camera className="w-4 h-4 text-[#3a99b7]" />
              </button>
            </div>
            <div className="space-y-2">
              <h2 className="text-[#434966] text-lg font-semibold">
                {doctorDetails.name}
              </h2>
              <p className="text-[#82889c] text-sm">{doctorDetails.specialty}</p>
              <p className="text-[#82889c] text-xs">{doctorDetails.location}</p>
            </div>
          </div>
          <Link
            href="/doctor/profile/edit"
            className="px-4 py-2 rounded-lg border border-[#434966] flex items-center gap-2"
          >
            <span className="text-[#434966] text-sm font-semibold">Edit</span>
            <Edit2 className="w-4 h-4 text-[#434966]" />
          </Link>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-[#434966] text-lg font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Specialty</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.specialty}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Experience</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.experience}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Education</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.education}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Phone Number</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.phone}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Email Address</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.email}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[#82889c] text-sm">Availability</p>
              <p className="text-[#434966] text-base font-medium">
                {doctorDetails.availability}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}