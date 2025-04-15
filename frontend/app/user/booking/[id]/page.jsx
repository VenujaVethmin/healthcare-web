"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

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

// Helper function to format time from HH:mm to 12-hour format
const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function BookAppointment() {
  const router = useRouter();
  const params = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate next 7 available days starting from tomorrow
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow
    date.setHours(0, 0, 0, 0);
    return date;
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.post(`/user/doctors/${params.id}`);
        setDoctorData(res.data.doctor);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching doctor details");
        toast.error("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [params.id]);

  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
      if (bookingStep === 2) {
        setSelectedDate(null);
        setEstimatedTime(null);
      }
    }
  };

  const handleDateSelect = async (date) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(`user/doctors/${params.id}`, {
        date: date.toISOString(),
      });

      setSelectedDate(date);
      setDoctorData(res.data.doctor);
      setEstimatedTime(res.data.estimatedTime);
      setBookingStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Error checking date availability");
      toast.error("Failed to check date availability");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      setLoading(true);
      const appointmentDate = new Date(selectedDate);

      await axiosInstance.post(`/user/bookAppoitnment`, {
        doctorId: params.id,
        date: appointmentDate,
      });

      toast.success("Appointment booked successfully!");
      router.push("/user/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3a99b7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!doctorData) return null;

  const isDateAvailable = (date) => {
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    return doctorData.workingHours.some(
      (hours) => hours.day === dayName && hours.isWorking
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Doctor Info Header */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:justify-between">
          <div className="flex gap-4 items-start">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={doctorData.doctor.image}
                alt={doctorData.doctor.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
                Book Appointment with Dr.{doctorData.doctor.name}
              </h1>
              <p className="text-[#82889c]">
                {doctorData.specialty || "Doctor"}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto bg-[#3a99b7]/10 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-center">
            <p className="text-[#3a99b7] font-semibold text-xl sm:text-2xl">
              LKR {doctorData.consultationFee.toLocaleString()}
            </p>
            <p className="text-sm text-[#82889c]">Consultation Fee</p>
          </div>
        </div>
      </div>

      {/* Current Selection Summary */}
      {selectedDate && (
        <div className="bg-[#f8f9fa] rounded-lg p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {bookingStep > 1 && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#82889c]" />
              </button>
            )}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3a99b7]" />
                <span className="text-sm font-medium">
                  {formatDate(selectedDate)}
                </span>
              </div>
              {estimatedTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3a99b7]" />
                  <span className="text-sm font-medium">
                    Around {formatTime(estimatedTime)}
                  </span>
                </div>
              )}
            </div>
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
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                bookingStep > index
                  ? "bg-[#3a99b7] text-white"
                  : bookingStep === index + 1
                  ? "bg-[#3a99b7] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <span className="text-xs sm:text-sm">{index + 1}</span>
            </div>
            {index < 2 && (
              <div
                className={`flex-1 h-1 mx-1 sm:mx-2 ${
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
          className="bg-white rounded-xl border border-black/10 p-4 sm:p-6"
        >
          <h2 className="text-lg font-medium mb-4">Select Date</h2>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {availableDates.map((date) => {
              const isAvailable = isDateAvailable(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => isAvailable && handleDateSelect(date)}
                  disabled={!isAvailable || loading}
                  className={`
                    p-3 sm:p-4 rounded-lg text-center relative
                    ${
                      isAvailable && !loading
                        ? "hover:bg-gray-50 cursor-pointer"
                        : "opacity-50 cursor-not-allowed bg-gray-50"
                    }
                  `}
                >
                  <p className="text-xs sm:text-sm text-gray-500">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p className="text-base sm:text-lg font-medium">
                    {date.getDate()}
                  </p>
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
          className="bg-white rounded-xl border border-black/10 p-4 sm:p-6"
        >
          <h2 className="text-lg font-medium mb-4">
            Review Appointment Details
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Selected Date:</p>
              <p className="font-medium text-lg">{formatDate(selectedDate)}</p>
            </div>

            {estimatedTime && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#3a99b7]" />
                  <p className="text-gray-600">Estimated Time:</p>
                </div>
                <p className="font-medium text-xl text-[#3a99b7]">
                  Around {formatTime(estimatedTime)}
                </p>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">Consultation Fee:</p>
              <p className="font-medium text-xl text-[#3a99b7]">
                LKR {doctorData.consultationFee.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setBookingStep(3)}
              disabled={loading}
              className="w-full p-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors disabled:opacity-50"
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
          className="bg-white rounded-xl border border-black/10 p-4 sm:p-6"
        >
          <h2 className="text-lg font-medium mb-4">Confirm Appointment</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  Dr. {doctorData.doctor.name}
                </p>
                <p className="text-sm text-[#82889c]">
                  {doctorData.specialty || "Doctor"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  {formatDate(selectedDate)}
                </p>
                {estimatedTime && (
                  <p className="text-[#3a99b7] font-medium">
                    Around {formatTime(estimatedTime)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-[#82889c]" />
              <div>
                <p className="font-medium text-[#232323]">
                  Consultation Details
                </p>
                <p className="text-[#3a99b7] font-medium">
                  LKR {doctorData.consultationFee.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={handleBookAppointment}
              disabled={loading}
              className="w-full p-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
