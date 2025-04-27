"use client";

import { useState, useMemo } from "react";
import { Search, Users, Star, Filter } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const {
    data: doctors,
    error,
    isLoading,
  } = useSWR("/user/findDoctors", fetcher);

  // Dynamic specialties from actual data
  const specialties = useMemo(() => {
    if (!doctors?.doctors) return ["All"];
    const uniqueSpecialties = [
      ...new Set(
        doctors.doctors.map((doctor) => doctor.doctorBookingDetails.specialty)
      ),
    ];
    return ["All", ...uniqueSpecialties];
  }, [doctors]);

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    if (!doctors?.doctors) return [];

    let filtered = doctors.doctors;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.doctorBookingDetails.specialty
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply specialty filter
    if (selectedSpecialty !== "All") {
      filtered = filtered.filter(
        (doctor) => doctor.doctorBookingDetails.specialty === selectedSpecialty
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "fee-low":
          return (
            a.doctorBookingDetails.consultationFee -
            b.doctorBookingDetails.consultationFee
          );
        case "fee-high":
          return (
            b.doctorBookingDetails.consultationFee -
            a.doctorBookingDetails.consultationFee
          );
        case "availability":
          return (
            b.doctorBookingDetails.maxPatientsPerDay -
            b._count.doctorAppointments -
            (a.doctorBookingDetails.maxPatientsPerDay -
              a._count.doctorAppointments)
          );
        default:
          return 0;
      }
    });
  }, [doctors, searchQuery, selectedSpecialty, sortBy]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading doctors
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
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
              placeholder="Search by doctor name or specialty"
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
            <option value="availability">Most Available</option>
            <option value="fee-low">Lowest Fee</option>
            <option value="fee-high">Highest Fee</option>
          </select>
        </div>
      </div>

      {/* Results Summary with Loading State */}
      <div className="text-sm text-[#82889c]">
        {isLoading
          ? "Loading doctors..."
          : `Found ${filteredDoctors.length} doctors`}
      </div>

      {/* Doctors Grid with Loading State */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4 animate-pulse"
                >
                  <div className="flex gap-4">
                    <div className="w-[65px] h-[65px] rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-full h-px bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
          : filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-5 space-y-4">
                  {/* Doctor Info */}
                  <Link href={`/user/find-doctors/profile/${doctor.id}`}>
                    <div className="flex gap-4">
                      <Image
                        className="w-[65px] h-[65px] rounded-full object-cover"
                        src={doctor.image}
                        alt={doctor.name}
                        width={65}
                        height={65}
                        priority={false}
                      />
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-medium text-[#232323]">
                          Dr.  {doctor.name}
                          </h3>
                          <p className="text-sm text-[#7a7d84]">
                            {doctor.doctorBookingDetails.specialty}
                            {doctor.doctorProfile?.experience &&
                              ` | ${doctor.doctorProfile.experience}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="w-full h-px bg-[#E5E5E5]" />

                  {/* Availability & Fee */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#82889c]" />
                      <div>
                        <p className="text-sm font-medium text-[#232323]">
                          Availability
                        </p>
                        <p className="text-xs text-[#7a7d84]">
                          {doctor._count.doctorAppointments}/
                          {doctor.doctorBookingDetails.maxPatientsPerDay} booked
                          today
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#232323]">
                        Rs {doctor.doctorBookingDetails.consultationFee}
                      </p>
                      <p className="text-xs text-[#7a7d84]">Consultation Fee</p>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/user/booking/${doctor.id}`}
                    className={`w-full p-2.5 text-center rounded-lg text-sm font-medium transition-colors ${
                      doctor._count.doctorAppointments >=
                      doctor.doctorBookingDetails.maxPatientsPerDay
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#3a99b7] hover:bg-[#2d7a93] text-white"
                    }`}
                    {...(doctor._count.doctorAppointments >=
                      doctor.doctorBookingDetails.maxPatientsPerDay && {
                      onClick: (e) => e.preventDefault(),
                    })}
                  >
                    {doctor._count.doctorAppointments >=
                    doctor.doctorBookingDetails.maxPatientsPerDay
                      ? "Fully Booked"
                      : "Book Appointment"}
                  </Link>
                </div>
              </div>
            ))}
      </div>

      {/* No Results */}
      {!isLoading && filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <p className="text-[#82889c]">
            No doctors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
