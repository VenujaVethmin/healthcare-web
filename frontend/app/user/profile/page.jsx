"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  Camera,
  Edit2,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);



export default function ProfilePage() {

   const { data, error, isLoading } = useSWR("/user/profile", fetcher);
  //  console.log(data?.user.name);


  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState(true);

  const userDetails = {
    name: "Stevan dux",
    role: "Gastro Doctor",
    email: "stevan@gmail.com",
    phone: "+ 1 2387428345",
    location: "United States",
    dob: "03/04/1996",
    age: "56",
    bio: "Gastro Doctor",
   
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header for mobile */}
      <div className="sm:hidden">
        <h1 className="text-xl font-semibold text-[#232323]">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="relative">
              {data?.user.image ? (
                <img
                  src={data?.user.image}  
                  alt="profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full bg-[#3a99b7] flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl font-medium">
                  SD
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
              <p className="text-[#82889c] text-xs">{data?.location}</p>
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
          <h3 className="text-[#434966] text-lg font-semibold">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Name</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.name}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Date Of Birth</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.dob}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-[#82889c] text-sm">Age</p>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.age}
              </p>
            </div>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Phone Number</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.user.phone}
              </p>
            </div>
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
                <MapPin className="w-4 h-4 text-[#82889c]" />
                <p className="text-[#82889c] text-sm">Location</p>
              </div>
              <p className="text-[#434966] text-base font-medium">
                {data?.location}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8">
            <h3 className="text-[#434966] text-lg font-semibold mb-4">Bio</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-[#434966] text-base">{data?.bio}</p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
