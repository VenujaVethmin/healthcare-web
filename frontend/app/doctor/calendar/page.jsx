"use client";

import { useState } from "react";
import {
  Clock,
  MapPin,
  User,
  Phone,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { format, addDays, parseISO } from "date-fns";

export default function DoctorSchedulePage() {
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Sample appointments data grouped by date
  const appointmentsByDate = {
    today: [
      {
        id: 1,
        patientName: "John Doe",
        age: "45",
        gender: "Male",
        time: "10:30 AM",
        reason: "Regular Checkup",
        status: "upcoming",
        contact: "+1 234-567-8900",
      },
      {
        id: 2,
        patientName: "Sarah Smith",
        age: "28",
        gender: "Female",
        time: "2:15 PM",
        reason: "Follow-up",
        status: "upcoming",
        contact: "+1 234-567-8901",
      },
    ],
    tomorrow: [
      {
        id: 3,
        patientName: "Mike Johnson",
        age: "35",
        gender: "Male",
        time: "11:00 AM",
        reason: "Consultation",
        status: "scheduled",
        contact: "+1 234-567-8902",
      },
    ],
    upcoming: [
      {
        id: 4,
        patientName: "Emily Davis",
        age: "52",
        gender: "Female",
        date: format(addDays(new Date(), 3), "yyyy-MM-dd"),
        time: "3:30 PM",
        reason: "Test Results",
        status: "scheduled",
        contact: "+1 234-567-8903",
      },
      {
        id: 5,
        patientName: "Robert Wilson",
        age: "41",
        gender: "Male",
        date: format(addDays(new Date(), 4), "yyyy-MM-dd"),
        time: "1:15 PM",
        reason: "Follow-up",
        status: "scheduled",
        contact: "+1 234-567-8904",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const AppointmentCard = ({ appointment, showDate = false }) => (
    <div className="bg-white rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-[#3a99b7]" />
          </div>
          <div>
            <h3 className="font-medium text-[#232323]">
              {appointment.patientName}
            </h3>
            <p className="text-sm text-[#82889c]">
              {appointment.age} years • {appointment.gender}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-[#82889c]" />
              <span className="text-sm text-[#232323]">{appointment.time}</span>
              {showDate && (
                <>
                  <Calendar className="w-4 h-4 text-[#82889c] ml-2" />
                  <span className="text-sm text-[#232323]">
                    {format(parseISO(appointment.date), "MMM d, yyyy")}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-[#82889c]" />
              <span className="text-sm text-[#232323]">
                {appointment.reason}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </span>
         
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Appointments Schedule
            </h1>
            <p className="text-[#82889c]">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#3a99b7]/10 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-[#3a99b7]" />
            <span className="text-[#3a99b7] font-medium">
              {format(new Date(), "h:mm a")}
            </span>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#232323] mb-4">
          Today's Appointments
        </h2>
        <div className="space-y-4">
          {appointmentsByDate.today.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>

      {/* Tomorrow's Appointments */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#232323] mb-4">
          Tomorrow's Appointments
        </h2>
        <div className="space-y-4">
          {appointmentsByDate.tomorrow.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-[#232323] mb-4">
          Upcoming Appointments
        </h2>
        <div className="space-y-4">
          {appointmentsByDate.upcoming.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showDate={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
