"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import {
  Activity,
  Building2,
  CalendarDays,
  DollarSign,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const doctorsList = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    location: "Colombo Central Hospital",
    appointmentsToday: 12,
    isPublished: true,
    consultationFee: 2500,
    totalPatients: 150,
    experience: "15 years",
    totalAppointments: 89,
    revenue: 25000,
  },
  {
    id: 2,
    name: "Dr. Michael Clark",
    specialty: "Pediatrician",
    location: "City Medical Center",
    appointmentsToday: 8,
    isPublished: false,
    consultationFee: 2000,
    totalPatients: 120,
    experience: "10 years",
    totalAppointments: 65,
    revenue: 18000,
  },
];

export default function DoctorsManagement() {

  
   const { data, error, isLoading } = useSWR("/admin/dashboard", fetcher);
   
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState(doctorsList);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handlePublishToggle = async (data) => {

    try {

      const res = await axiosInstance.put(
        `/admin/updatePublishStatus/${data.id}`,
        {
          isPublished: !data.isPublished,
        }
      );
      if (res.status === 200) {
        window.alert("Publish status updated successfully");
      }
      
    } catch (error) {
      console.error("Error updating publish status:", error);
    }
  };


  // Calculate total stats
  const totalStats = {
    doctors: data?.doctorCount,
    patients: data?.patientCount,
    appointments: data?.todayAppointmentCount,
    revenue: doctors.reduce((sum, doc) => sum + doc.revenue, 0),
  };

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
            href={"/admin/doctors"}
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
        {data?.card?.map((doctor) => (
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
                    {doctor.doctor._count.doctorAppointments} appointments today
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
                <div className="flex items-center gap-2"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
 