"use client";

import { useState } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DoctorEditProfilePage() {
  const [formData, setFormData] = useState({
    name: "Dr. Sarah Connor",
    specialty: "Cardiologist",
    email: "sarah.connor@healthcare.com",
    phone: "+1 234-567-8900",
    location: "Medical Center, New York",
    experience: "15",
    education: "MD - Cardiology",
    availability: "Mon-Fri, 9:00 AM - 5:00 PM",
    bio: "Experienced cardiologist specializing in cardiovascular health",
    consultationFee: "150",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/doctor/profile"
          className="p-2 hover:bg-[#f6f6f6] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#434966]" />
        </Link>
        <h1 className="text-xl font-semibold text-[#232323]">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full bg-[#3a99b7] flex items-center justify-center">
                <span className="text-white text-2xl font-medium">SC</span>
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

        {/* Professional Information */}
        <div className="bg-white rounded-xl border border-black/10 p-6 space-y-6">
          <h3 className="text-[#434966] text-lg font-semibold">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="specialty">
                Specialty
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
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
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="experience">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="education">
                Education
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
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
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-[#82889c] text-sm"
                htmlFor="consultationFee"
              >
                Consultation Fee ($)
              </label>
              <input
                type="number"
                id="consultationFee"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="availability">
                Availability
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-[#82889c] text-sm" htmlFor="bio">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#3a99b7] text-white hover:bg-[#2d7a93] transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/doctor/profile"
            className="px-6 py-2.5 rounded-lg border border-[#e2e2e2] text-[#434966] hover:bg-[#f6f6f6] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
