"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

// Dummy doctor data with lastBookedSlot tracking
const dummyDoctorSettings = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Cardiologist",
  location: "Colombo Central Hospital",
  workingHours: {
    monday: { start: "09:00", end: "17:00", isWorking: true },
    tuesday: { start: "09:00", end: "17:00", isWorking: true },
    wednesday: { start: "09:00", end: "17:00", isWorking: true },
    thursday: { start: "09:00", end: "17:00", isWorking: true },
    friday: { start: "09:00", end: "17:00", isWorking: true },
    saturday: { start: "09:00", end: "13:00", isWorking: true },
    sunday: { start: "09:00", end: "17:00", isWorking: false },
  },
  consultationFee: 2500,
  // Track last booked slot for each date
  lastBookedSlot: {
    "2024-03-13": 105,
    "2024-03-14": 98,
  },
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Helper function to get next available slot
const getNextSlot = (date, lastBookedSlot) => {
  if (!date) return null;
  const dateString = date.toISOString().split("T")[0];
  return (lastBookedSlot[dateString] || 0) + 1;
};

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [assignedSlot, setAssignedSlot] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);

  // Generate next 7 available days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
      if (bookingStep === 3) {
        setAssignedSlot(null);
      } else if (bookingStep === 2) {
        setSelectedDate(null);
      }
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const nextSlot = getNextSlot(date, dummyDoctorSettings.lastBookedSlot);
    setAssignedSlot(nextSlot);
    setBookingStep(2);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !assignedSlot) {
      alert("Something went wrong with slot assignment");
      return;
    }

    console.log("Booking confirmed:", {
      doctor: dummyDoctorSettings.name,
      date: formatDate(selectedDate),
      appointmentNumber: assignedSlot,
      location: dummyDoctorSettings.location,
      fee: dummyDoctorSettings.consultationFee,
      approximateTime: "Around 10:00 AM",
    });

    alert("Appointment booked successfully!");
    setSelectedDate(null);
    setAssignedSlot(null);
    setBookingStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Doctor Info Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="flex items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#232323]">
              Book Appointment with {dummyDoctorSettings.name}
            </h1>
            <p className="text-[#82889c]">{dummyDoctorSettings.specialty}</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-[#82889c]" />
              <p className="text-[#82889c]">{dummyDoctorSettings.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection Summary */}
      {(selectedDate || assignedSlot) && (
        <div className="bg-[#f8f9fa] rounded-lg p-4 flex items-center gap-4">
          {bookingStep > 1 && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#82889c]" />
            </button>
          )}
          <div className="flex flex-wrap gap-4">
            {selectedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3a99b7]" />
                <span className="text-sm font-medium">
                  {formatDate(selectedDate)}
                </span>
              </div>
            )}
            {assignedSlot && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3a99b7]" />
                <span className="text-sm font-medium">
                  Token #{assignedSlot}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Steps */}
      <div className="flex justify-between items-center">
        {["Select Date", "Review", "Confirm"].map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${index < 2 ? "flex-1" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bookingStep > index
                  ? "bg-[#3a99b7] text-white"
                  : bookingStep === index + 1
                  ? "bg-[#3a99b7] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  bookingStep > index + 1 ? "bg-[#3a99b7]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Calendar */}
      {bookingStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-6"
        >
          <h2 className="text-lg font-medium mb-4">Select Date</h2>
          <div className="grid grid-cols-7 gap-2">
            {availableDates.map((date) => {
              const isToday = new Date().toDateString() === date.toDateString();
              const dayName = date
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();
              const isAvailable =
                dummyDoctorSettings.workingHours[dayName]?.isWorking;

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => isAvailable && handleDateSelect(date)}
                  disabled={!isAvailable}
                  className={`
                    p-4 rounded-lg text-center relative
                    ${
                      isAvailable
                        ? "hover:bg-gray-50 cursor-pointer"
                        : "opacity-50 cursor-not-allowed bg-gray-50"
                    }
                    ${isToday ? "ring-2 ring-[#3a99b7] ring-opacity-50" : ""}
                  `}
                >
                  <p className="text-sm text-gray-500">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-lg font-medium">{date.getDate()}</p>
                  {isToday && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-[#3a99b7]">
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Review Details */}
      {bookingStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-6"
        >
          <h2 className="text-lg font-medium mb-4">Your Appointment Details</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Selected Date:</p>
              <p className="font-medium text-lg">{formatDate(selectedDate)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Your Token Number:</p>
              <p className="font-medium text-2xl text-[#3a99b7]">
                #{assignedSlot}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Approximate arrival time: Around 10:00 AM
              </p>
            </div>

            <button
              onClick={() => setBookingStep(3)}
              className="w-full p-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
            >
              Continue to Confirm
            </button>
          </div>
        </motion.div>
      )}

      {/* Confirmation */}
      {bookingStep === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-6"
        >
          <h2 className="text-lg font-medium mb-4">Confirm Appointment</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  {dummyDoctorSettings.name}
                </p>
                <p className="text-sm text-[#82889c]">
                  {dummyDoctorSettings.specialty}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  {formatDate(selectedDate)}
                </p>
                <p className="text-sm text-[#82889c]">Token #{assignedSlot}</p>
                <p className="text-sm text-[#82889c]">
                  Approximate time: Around 10:00 AM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  {dummyDoctorSettings.location}
                </p>
                <p className="text-sm text-[#82889c]">
                  Consultation Fee: LKR {dummyDoctorSettings.consultationFee}
                </p>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              className="w-full p-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
