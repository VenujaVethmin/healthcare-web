"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  User,
  MapPin,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Connor",
      specialty: "Cardiologist",
      date: "2024-03-08",
      time: "10:30 AM",
      room: "001",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. John Smith",
      specialty: "Neurologist",
      date: "2024-03-10",
      time: "2:15 PM",
      room: "102",
      status: "pending",
    },
  ];

  const recentPrescriptions = [
    {
      id: 1,
      prescribedBy: "Dr. Sarah Connor",
      date: "2024-03-01",
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily" },
        { name: "Paracetamol", dosage: "650mg", frequency: "Every 6 hours" },
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily" },
        { name: "Vitamin C", dosage: "500mg", frequency: "Once daily" },
        { name: "Vitamin D3", dosage: "60,000 IU", frequency: "Once weekly" },
        { name: "Zinc", dosage: "50mg", frequency: "Once daily" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Welcome Back, John!
            </h1>
            <p className="text-[#82889c]">Here's your health summary</p>
          </div>
          <button className="w-full sm:w-auto md:hidden flex items-center justify-center gap-2 px-4 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors">
            <Search className="w-4 h-4" />
            <Link href={"/user/find-doctors"} className="text-sm">
              Find Doctors
            </Link>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#232323]">
                Next Appointment
              </h2>
              <p className="text-[#82889c] text-sm">Upcoming schedule</p>
            </div>
            <Calendar className="w-5 h-5 text-[#3a99b7]" />
          </div>

          {upcomingAppointments[0] && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#3a99b7]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#232323]">
                    {upcomingAppointments[0].doctor}
                  </h3>
                  <p className="text-sm text-[#82889c]">
                    {upcomingAppointments[0].specialty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#82889c]" />
                  <span className="text-sm text-[#232323]">
                    {upcomingAppointments[0].time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#82889c]" />
                  <span className="text-sm text-[#232323]">
                    {upcomingAppointments[0].date}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#82889c] mt-0.5" />
                <span className="text-sm text-[#232323]">
                 Room {upcomingAppointments[0].room}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#232323]">
                Recent Prescription
              </h2>
              <p className="text-[#82889c] text-sm">Latest medications</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/user/prescriptions"
                className="flex items-center gap-1 text-sm text-[#3a99b7] hover:text-[#2d7a93]"
              >
                Show All
                <ChevronRight className="w-4 h-4" />
              </Link>
              <FileText className="w-5 h-5 text-[#3a99b7]" />
            </div>
          </div>

          <div className="space-y-4">
            {recentPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#3a99b7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#82889c]" />
                      <span className="text-[#232323] font-medium">
                        {prescription.prescribedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-[#82889c]" />
                      <span className="text-sm text-[#82889c]">
                        {prescription.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-medium text-[#232323]">
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-[#82889c]">
                        {medicine.dosage} - {medicine.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#232323] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/user/find-doctors">
              <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                <Calendar className="w-5 h-5 text-[#3a99b7] mb-2" />
                <h3 className="font-medium text-[#232323]">Book Appointment</h3>
                <p className="text-sm text-[#82889c]">Schedule a new visit</p>
              </button>
            </Link>
            <Link href="/user/medical-records">
              <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                <FileText className="w-5 h-5 text-[#3a99b7] mb-2" />
                <h3 className="font-medium text-[#232323]">View Records</h3>
                <p className="text-sm text-[#82889c]">Access medical history</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
