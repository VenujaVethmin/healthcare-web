"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  Activity,
  AlertCircle,
  Camera,
  Edit2,
  Heart,
  Mail,
  MapPin,
  Phone,
  Pill as Pills,
  User,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR("/user/profile", fetcher);
  const [activeTab, setActiveTab] = useState("general");

  // Example medical history data - replace with actual data from API
  const medicalHistory = {
    conditions: [
      { name: "Diabetes Type 2", diagnosis: "2020", status: "Ongoing" },
      { name: "Hypertension", diagnosis: "2019", status: "Controlled" },
    ],
    allergies: ["Penicillin", "Peanuts", "Latex"],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    ],
    bloodType: "A+",
    emergencyContact: {
      name: "John Doe",
      relationship: "Spouse",
      phone: "+1 234-567-8900",
      email: "john@example.com",
    },
  };

  const calculateAge = (dob) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a99b7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        Error loading profile
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header for mobile */}
      <div className="sm:hidden">
        <h1 className="text-xl font-semibold text-[#232323]">Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="relative">
              {data?.user.image ? (
                <Image
                  src={data?.user.image}
                  alt="profile"
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full bg-[#3a99b7] flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl font-medium">
                    {data?.user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md">
                <Camera className="w-4 h-4 text-[#3a99b7]" />
              </button>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h2 className="text-[#434966] text-lg sm:text-xl font-semibold">
                {data?.user.name}
              </h2>
              <p className="text-[#82889c] text-sm">{data?.user.role}</p>
              <p className="text-[#82889c] text-xs">
                {data?.user?.userProfile?.address}
              </p>
            </div>
          </div>
          <Link
            href={"/user/profile/edit"}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg border border-[#434966] flex items-center justify-center sm:justify-start gap-2.5 hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#434966] text-sm font-semibold">
              Edit Profile
            </span>
            <Edit2 className="w-4 h-4 text-[#434966]" />
          </Link>
        </div>

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-[#434966] text-lg font-semibold flex items-center">
            <User className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Existing personal information grid items */}
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Name</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.name}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Date Of Birth</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user?.userProfile?.dob
                  ? new Date(data?.user?.userProfile?.dob).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )
                  : "Not set"}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Age</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user?.userProfile?.dob
                  ? `${calculateAge(data?.user?.userProfile?.dob)} years old`
                  : "DOB not set"}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Phone Number</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user?.userProfile?.phone}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Email Address</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user?.email}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Location</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user?.userProfile?.address}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8">
            <h3 className="text-[#434966] text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-[#3a99b7]" />
              Bio
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-[#434966] text-base">
                {data?.user?.userProfile?.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <h3 className="text-[#434966] text-lg font-semibold mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-[#3a99b7]" />
          Medical History
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medications */}
          <div className="space-y-4">
            <h4 className="text-[#434966] font-medium flex items-center">
              <Pills className="w-4 h-4 mr-2 text-[#3a99b7]" />
              Current Medications
            </h4>
            <div className="space-y-3">
              {data?.user?.prescriptions?.map((prescription, pIndex) => (
                <div key={pIndex} className="mb-4">
                  <p className="font-semibold text-lg text-[#2f3e76] mb-2">
                    Prescription Date:{" "}
                    {new Date(
                      prescription.prescriptionDate
                    ).toLocaleDateString()}
                  </p>
                  {prescription.medicine.map((medication, mIndex) => (
                    <div
                      key={mIndex}
                      className="p-3 bg-gray-50 rounded-lg mb-2"
                    >
                      <p className="text-[#434966] font-medium">
                        {medication.name}
                      </p>
                      <p className="text-sm text-[#82889c]">
                        {medication.dosage} - {medication.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <h4 className="text-[#434966] font-medium flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 text-[#3a99b7]" />
              Allergies
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                <ul className="list-disc list-inside text-gray-700">
                  {data?.user?.userProfile?.allergies
                    ?.split(",")
                    .map((allergy, index) => (
                      <li key={index}>{allergy.trim()}</li>
                    ))}
                </ul>
              </span>
            </div>
          </div>

          {/* Blood Type */}
          <div className="space-y-4">
            <h4 className="text-[#434966] font-medium flex items-center">
              <Heart className="w-4 h-4 mr-2 text-[#3a99b7]" />
              Blood Type
            </h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[#434966] text-xl font-medium">
                {data?.user?.userProfile?.bloodType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <h3 className="text-[#434966] text-lg font-semibold mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-[#3a99b7]" />
          Emergency Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-[#82889c] text-sm">Name</p>
            <p className="text-[#434966] text-base font-medium">
              {data?.user?.userProfile?.emergencyContact?.name}
            </p>
          </div>

          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#82889c]" />
              <p className="text-[#82889c] text-sm">Phone Number</p>
            </div>
            <p className="text-[#434966] text-base font-medium">
              {data?.user?.userProfile?.emergencyContact?.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
