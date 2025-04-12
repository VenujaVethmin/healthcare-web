"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  AlertCircle,
  Award,
  Calendar,
  Camera,
  Clock,
  Edit2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useParams } from 'next/navigation'

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorProfilePage() {
   const params = useParams()
  const { data, error, isLoading } = useSWR(`/doctor/profile/${params.id}`, fetcher);

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

  // Get working days array
  const workingDays = data?.user?.doctorBookingDetails?.workingHours
    .filter(day => day.isWorking)
    .map(day => day.day);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header for mobile */}
      <div className="sm:hidden">
        <h1 className="text-xl font-semibold text-[#232323]">Doctor Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="relative">
              {data?.user.image ? (
                <Image
                  src={data.user.image}
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
                Dr. {data?.user.name}
              </h2>
              <p className="text-[#82889c] text-sm">{data?.user.doctorProfile?.specialty || "Specialty not set"}</p>
              <p className="text-[#82889c] text-xs">
                {data?.user.role}
              </p>
            </div>
          </div>
         
        </div>

        {/* Professional Information */}
        <div className="space-y-6">
          <h3 className="text-[#434966] text-lg font-semibold flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Professional Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Email Address</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.email}
              </p>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Education</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.doctorProfile?.education || "Not specified"}
              </p>
            </div>

            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Experience</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.doctorProfile?.experience || "Not specified"}
              </p>
            </div>

            {/* Working Hours Section */}
            <div className="col-span-full space-y-4">
              <h4 className="text-[#434966] font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2 text-[#3a99b7]" />
                Working Hours
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data?.user?.doctorBookingDetails?.workingHours
                  .filter(day => day.isWorking)
                  .map((schedule) => (
                    <div key={schedule.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-[#434966] font-medium">{schedule.day}</p>
                      <p className="text-sm text-[#82889c]">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <h3 className="text-[#434966] text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Professional Summary
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-[#434966] text-base">
              {data?.user.doctorProfile?.bio || "No professional summary available."}
            </p>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="mt-8">
          <h3 className="text-[#434966] text-lg font-semibold mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Qualifications
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-[#434966] text-base">
              {data?.user.doctorProfile?.qualifications || "No qualifications listed."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}