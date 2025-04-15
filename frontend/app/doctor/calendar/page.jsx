"use client";

import axiosInstance from "@/lib/axiosInstance";
import { format, isAfter, isToday, isTomorrow, parseISO } from "date-fns";
import { Building, Calendar, Clock, Stethoscope } from "lucide-react";
import useSWR from "swr";

import { formatInTimeZone } from 'date-fns-tz';

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const formatAppointmentTime = (timeString) => {
  const time = new Date(timeString);
  return format(time, "h:mm a");
};


function getUtcTimeOnly(isoTime) {
  return formatInTimeZone(parseISO(isoTime), 'UTC', 'h:mm a');
}


export default function PatientAppointmentsPage() {
  const { data, error, isLoading } = useSWR("/doctor/calender", fetcher);

  // Function to group appointments by date category
  const groupAppointments = (appointments) => {
    if (!appointments) return { today: [], tomorrow: [], upcoming: [] };

    return appointments.reduce(
      (acc, appointment) => {
        const appointmentDate = new Date(appointment.date);
        const appointmentData = {
          id: appointment.id,
          doctorName: appointment?.patient?.name,
          specialty: appointment.specialty || "General",
          room: appointment?.doctor?.doctorBookingDetails.room  || "TBD",
          time: getUtcTimeOnly(appointment.time),
          date: appointment.date,
          status: appointment.status.toLowerCase(),
          contact: appointment.contact || "Not provided",
        };

        if (isToday(appointmentDate)) {
          acc.today.push(appointmentData);
        } else if (isTomorrow(appointmentDate)) {
          acc.tomorrow.push(appointmentData);
        } else if (isAfter(appointmentDate, new Date())) {
          acc.upcoming.push(appointmentData);
        }

        return acc;
      },
      { today: [], tomorrow: [], upcoming: [] }
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const AppointmentCard = ({ appointment, showDate = false }) => (
    <div className="bg-white rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-6 h-6 text-[#3a99b7]" />
          </div>
          <div>
            <h3 className="font-medium text-[#232323]">
              {appointment.doctorName}
            </h3>
            <p className="text-sm text-[#82889c]">{appointment.specialty}</p>
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
              <Building className="w-4 h-4 text-[#82889c]" />
              <span className="text-sm text-[#232323]">{appointment.room}</span>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3a99b7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading appointments
      </div>
    );
  }

  const appointmentsByDate = groupAppointments(data?.calender);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              My Appointments
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
          {appointmentsByDate.today.length === 0 && (
            <p className="text-center text-[#82889c] py-4">
              No appointments scheduled for today
            </p>
          )}
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
          {appointmentsByDate.tomorrow.length === 0 && (
            <p className="text-center text-[#82889c] py-4">
              No appointments scheduled for tomorrow
            </p>
          )}
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
          {appointmentsByDate.upcoming.length === 0 && (
            <p className="text-center text-[#82889c] py-4">
              No upcoming appointments
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
