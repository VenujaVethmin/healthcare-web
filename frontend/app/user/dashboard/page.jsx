"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  Pill,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { format } from "date-fns";
import { useState, useEffect } from "react";
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// Time conversion utilities
const convertToSLTime = (utcDate) => {
  if (!utcDate) return "Not scheduled";
  const date = new Date(utcDate);
  const slDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  return slDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const convertToSLTime1 = (utcDate) => {
  if (!utcDate) return "Not scheduled";
  const date = new Date(utcDate);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Colombo",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const getSLTimeDate = (utcDate) => {
  if (!utcDate) return null;
  const date = new Date(utcDate);
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

const formatDate = (date) => {
  if (!date) return "Not scheduled";
  const slDate = getSLTimeDate(date);
  return format(slDate, "MMMM d, yyyy");
};

// Components
const PrescriptionStatusBadge = ({ status }) => {
  const statusConfig = {
    READY: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <Pill className="w-4 h-4" />,
      label: "Ready for pickup",
    },
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Processing",
    },
    COMPLETED: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: <Pill className="w-4 h-4" />,
      label: "Recived",
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <div className="flex items-center gap-1.5">
        {config.icon}
        {config.label}
      </div>
    </div>
  );
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
          {convertToSLTime1(appointment.time)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#82889c]" />
        <span className="text-sm text-[#232323]">
          {formatDate(appointment.time)}
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


const PrescriptionCard = ({ prescription }) => (
  <div className="p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-[#3a99b7]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#82889c]" />
            <span className="text-[#232323] font-medium">
              Dr. {prescription?.doctor?.name || "Not specified"}
            </span>
          </div>
          <PrescriptionStatusBadge status={prescription?.appointment.pStatus} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4 text-[#82889c]" />
          <span className="text-sm text-[#82889c]">
            {formatDate(prescription.prescriptionDate)}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prescription.medicine.map((medicine, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-[#232323]">{medicine.name}</h3>
          <p className="text-sm text-[#82889c]">
            {medicine.dosage} - {medicine.frequency}
          </p>
        </div>
      ))}
    </div>

    {prescription.status === "READY" && (
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Pill className="w-4 h-4 mt-0.5 text-green-800" />
          <div>
            <p className="text-green-800 text-sm">
              Your medications are ready for pickup at the pharmacy
            </p>
            <p className="text-green-600 text-xs mt-1">
              Please collect within 24 hours
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Main Component
export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/user/dashboard", fetcher);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    if (data?.nextAppointment) {
      const timer = setInterval(() => {
        const newCountdowns = {};
        const nowUTC = new Date();
        const now = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000);

        data.nextAppointment.forEach((appointment) => {
          const appointmentTime = getSLTimeDate(appointment.time);
          if (!appointmentTime) {
            newCountdowns[appointment.id] = "Not scheduled";
            return;
          }

          const timeDiff = appointmentTime - now;

          if (timeDiff > 0) {
            const totalSeconds = Math.floor(timeDiff / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            let countdownStr = "";
            if (days > 0) countdownStr += `${days}d `;
            if (hours > 0 || days > 0) countdownStr += `${hours}h `;
            countdownStr += `${minutes}m`;

            newCountdowns[appointment.id] = countdownStr.trim() + " remaining";
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
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load dashboard data
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a99b7]" />
      </div>
    );
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
          <Link
            href="/user/find-doctors"
            className="w-full sm:w-auto md:hidden"
          >
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">Find Doctors</span>
            </button>
          </Link>
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
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[#82889c] mx-auto mb-2" />
                <p className="text-[#82889c]">No upcoming appointments</p>
                <Link
                  href="/user/find-doctors"
                  className="text-[#3a99b7] text-sm hover:underline mt-2 inline-block"
                >
                  Book an appointment
                </Link>
              </div>
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
              <PrescriptionCard prescription={data.prescription} />
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#82889c] mx-auto mb-2" />
                <p className="text-[#82889c]">No recent prescriptions</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 lg:col-span-2">
          <div>
            <h2 className="text-lg font-semibold text-[#232323] mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/user/find-doctors">
                <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                  <Calendar className="w-5 h-5 text-[#3a99b7] mb-2" />
                  <h3 className="font-medium text-[#232323]">
                    Book Appointment
                  </h3>
                  <p className="text-sm text-[#82889c]">Schedule a new visit</p>
                </button>
              </Link>
              <Link href="/user/medical-records">
                <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                  <FileText className="w-5 h-5 text-[#3a99b7] mb-2" />
                  <h3 className="font-medium text-[#232323]">View Records</h3>
                  <p className="text-sm text-[#82889c]">
                    Access medical history
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
