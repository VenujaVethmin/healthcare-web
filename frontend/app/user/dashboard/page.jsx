"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";

const convertToSLTime = (utcDate) => {
  if (!utcDate) return "Not scheduled";
  const date = new Date(utcDate);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Colombo",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const formatDate = (date) => {
  if (!date) return "Not scheduled";
  return format(new Date(date), "MMMM d, yyyy");
};

const AppointmentCard = ({ appointment, countdown }) => (
  <div className="p-4 border border-[#e2e2e2] rounded-lg hover:border-[#3a99b7] transition-colors">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-[#3a99b7]" />
      </div>
      <div>
        <h3 className="font-medium text-[#232323]">
          Dr. {appointment.doctor.name}
        </h3>
        <p className="text-sm text-[#82889c]">
          {appointment.specialty || "General Consultation"}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#82889c]" />
        <span className="text-sm text-[#232323]">
          {convertToSLTime(appointment.time)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#82889c]" />
        <span className="text-sm text-[#232323]">
          {formatDate(appointment.date)}
        </span>
      </div>
    </div>

    <div className="flex items-start gap-2 mb-4">
      <MapPin className="w-4 h-4 text-[#82889c] mt-0.5" />
      <span className="text-sm text-[#232323]">
        Room {appointment.room || "TBA"}
      </span>
    </div>

    <div className="p-3 bg-[#3a99b7]/10 rounded-lg">
      <p className="text-sm text-[#3a99b7] font-medium">
        Time until appointment: {countdown}
      </p>
    </div>
  </div>
);

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/user/dashboard", fetcher);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    if (data?.nextAppointment) {
      const timer = setInterval(() => {
        const newCountdowns = {};
        data.nextAppointment.forEach((appointment) => {
          const appointmentDate = new Date(appointment.date);
          const now = new Date();

          if (appointmentDate > now) {
            newCountdowns[appointment.id] = formatDistanceToNow(
              appointmentDate,
              {
                addSuffix: true,
              }
            );
          } else {
            newCountdowns[appointment.id] = "Appointment time passed";
          }
        });
        setCountdowns(newCountdowns);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data?.nextAppointment]);

  if (error) {
    return <div className="text-red-500">Failed to load dashboard data</div>;
  }

  if (isLoading) {
    return <div className="text-[#82889c]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Welcome Back!
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
        {/* Next Appointments */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#232323]">
                Next Appointments
              </h2>
              <p className="text-[#82889c] text-sm">Upcoming schedules</p>
            </div>
            <Calendar className="w-5 h-5 text-[#3a99b7]" />
          </div>

          <div className="space-y-4">
            {data?.nextAppointment?.length > 0 ? (
              data.nextAppointment.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  countdown={countdowns[appointment.id]}
                />
              ))
            ) : (
              <p className="text-[#82889c]">No upcoming appointments</p>
            )}
          </div>
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
            {data?.prescription ? (
              <div className="p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#3a99b7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#82889c]" />
                      <span className="text-[#232323] font-medium">
                        Dr. {data.prescription.doctor?.name || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-[#82889c]" />
                      <span className="text-sm text-[#82889c]">
                        {formatDate(data.prescription.prescriptionDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.prescription.medicine.map((medicine, index) => (
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
            ) : (
              <p className="text-[#82889c]">No recent prescriptions</p>
            )}
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
