"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  CalendarDays,
  DollarSign,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorsManagement() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/dashboard",
    fetcher
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handlePublishToggle = async (doctor) => {
    try {
      // Optimistically update the UI
      const updatedCards = data.card.map((d) => {
        if (d.id === doctor.id) {
          return {
            ...d,
            isPublished: !d.isPublished,
          };
        }
        return d;
      });

      // Update local state immediately
      mutate(
        {
          ...data,
          card: updatedCards,
        },
        false // Set false to avoid revalidation before the API call
      );

      // Make API call
      const res = await axiosInstance.put(
        `/admin/updatePublishStatus/${doctor.id}`,
        {
          isPublished: !doctor.isPublished,
        }
      );

      if (res.status === 200) {
        toast.success("Doctor status updated successfully");
        // Revalidate to ensure sync with server
        mutate();
      }
    } catch (error) {
      console.error("Error updating publish status:", error);
      toast.error("Failed to update doctor status");
      // Revert optimistic update on error
      mutate();
    }
  };

  // Filter doctors based on search query
  const filteredDoctors =
    data?.card?.filter(
      (doctor) =>
        doctor.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Calculate total stats
  const totalStats = {
    doctors: data?.doctorCount || 0,
    patients: data?.patientCount || 0,
    appointments: data?.todayAppointmentCount || 0,
    revenue: data?.totalRevenue || 0,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Total Doctors</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {totalStats.doctors}
              </h3>
            </div>
            <Building2 className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Total Patients</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {totalStats.patients}
              </h3>
            </div>
            <Users className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Today's Appointments</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {totalStats.appointments}
              </h3>
            </div>
            <Activity className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                LKR {totalStats.revenue}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#232323]">
              Doctors Management
            </h1>
            <p className="text-[#82889c]">Manage and monitor doctor profiles</p>
          </div>
          <Link
            href="/admin/doctors"
            className="px-4 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
          >
            Add New Doctor
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#e2e2e2] p-6 hover:border-[#3a99b7] transition-colors"
            >
              <div className="space-y-4">
                {/* Doctor Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-[#232323] text-lg">
                      {doctor.doctor.name}
                    </h3>
                    <p className="text-[#82889c]">{doctor.specialty}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={doctor.isPublished}
                      onChange={() => handlePublishToggle(doctor)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3a99b7]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3a99b7]"></div>
                  </label>
                </div>

                {/* Doctor Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#82889c]">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {doctor.doctor._count.doctorAppointments} appointments
                      today
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#82889c]">
                    <DollarSign className="w-4 h-4" />
                    <span>LKR {doctor.consultationFee}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-[#82889c]">Room</p>
                    <p className="text-lg font-medium text-[#232323]">
                      {doctor.room}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-[#82889c]">Ap. Duration</p>
                    <p className="text-lg font-medium text-[#232323]">
                      {doctor.appointmentDuration} minutes
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-[#82889c]">Patients/Day</p>
                    <p className="text-lg font-medium text-[#232323]">
                      {doctor.maxPatientsPerDay}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-[#82889c]">Revenue</p>
                    <p className="text-lg font-medium text-[#232323]">
                      LKR {doctor.revenue}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doctor.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No doctors found
          </div>
        )}
      </div>
    </div>
  );
}
