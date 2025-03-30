"use client";

import { useState } from "react";
import { Search, Users, MapPin, Star, Filter } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";


const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

     const { data: doctors, error, isLoading } = useSWR("/user/findDoctors", fetcher);
console.log("d "+doctors);


  const specialties = [
    "All",
    "Pediatric",
    "Cardiology",
    "Dental",
    "Dermatology",
    "Psychiatry",
    "Orthopedic",
  ];

  const availabilityOptions = [
    "All",
    "Available Today",
    "Available Tomorrow",
    "This Week",
  ];

  

  // const filteredDoctors = doctors?.filter((doctor) => {
  //   const matchesSearch =
  //     doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     doctor.location.toLowerCase().includes(searchQuery.toLowerCase());

  //   const matchesSpecialty =
  //     selectedSpecialty === "All" ||
  //     doctor.specialty.includes(selectedSpecialty);

  //   return matchesSearch && matchesSpecialty;
  // });



  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#232323]">
              Find Doctors
            </h1>
            <p className="text-[#82889c]">
              Book appointments with top specialists
            </p>
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black/10 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#82889c]" />
            <span className="text-sm text-[#82889c]">Filters:</span>
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#e2e2e2] text-sm text-[#434966] focus:outline-none focus:border-[#3a99b7]"
          >
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[#e2e2e2] text-sm text-[#434966] focus:outline-none focus:border-[#3a99b7]"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee-low">Lowest Fee</option>
            <option value="fee-high">Highest Fee</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-[#82889c]">
        Found {doctors?.doctors?.length} doctors
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.doctors?.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
          >
            <div className="p-5 space-y-4">
              {/* Doctor Info */}
              <div className="flex gap-4">
                <img
                  className="w-[65px] h-[65px] rounded-full object-cover"
                  src={doctor.image}
                  alt={doctor.name}
                />
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-medium text-[#232323]">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-[#7a7d84]">
                      {doctor.doctorBookingDetails.specialty} | {doctor.experience}
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-[#232323]">
                      {doctor.rating}
                    </span>
                    <span className="text-sm text-[#7a7d84]">
                      ({doctor.reviewCount} reviews)
                    </span>
                  </div> */}
                </div>
              </div>

              <div className="w-full h-px bg-[#E5E5E5]" />

              {/* Patients Per Day & Appointments */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#82889c]" />
                  <div>
                    <p className="text-sm font-medium text-[#232323]">
                      Patients Per Day
                    </p>
                    <p className="text-xs text-[#7a7d84]">
                      {doctor._count.doctorAppointments}/
                      {doctor.doctorBookingDetails.maxPatientsPerDay} scheduled
                      today
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#232323]">
                  Rs  {doctor.doctorBookingDetails.consultationFee}
                  </p>
                  <p className="text-xs text-[#7a7d84]">Consultation Fee</p>
                </div>
              </div>

              {/* Book Button */}
              <Link
                href={`/user/booking/${doctor.id}`}
                className="w-full p-2.5 bg-[#3a99b7] rounded-lg text-white text-sm font-medium hover:bg-[#2d7a93] transition-colors"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {doctors?.doctors?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#82889c]">
            No doctors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
