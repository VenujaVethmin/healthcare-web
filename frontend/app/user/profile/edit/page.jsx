"use client";

import { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    name: "Stevan dux",
    
    email: "stevan@gmail.com",
    phone: "+ 1 2387428345",
    location: "United States",
    dob: "1996-04-03",
    age: "56",
    bio: "Gastro Doctor",
    diseases: {
      speech: "None",
      hearing: "None",
      physical: "None",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/user/profile"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#434966]" />
        </Link>
        <h1 className="text-xl font-semibold text-[#232323]">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 sm:w-[100px] sm:h-[100px] rounded-full bg-[#3a99b7] flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl font-medium">
                  SD
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md">
                <Camera className="w-4 h-4 text-[#3a99b7]" />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="text-[#434966] text-sm font-medium">
                Profile Photo
              </h3>
              <p className="text-[#82889c] text-sm">
                Update your profile picture
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 space-y-6">
          <h3 className="text-[#434966] text-lg font-semibold">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

          

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="dob">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

           

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="location">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 space-y-4">
          <h3 className="text-[#434966] text-lg font-semibold">Bio</h3>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7] text-[#434966] resize-none"
          />
        </div>

        

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#3a99b7] text-white hover:bg-[#2d7a93] transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/user/profile"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gray-200 text-[#434966] hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
