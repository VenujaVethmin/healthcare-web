"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  User,
  Plus,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

const dosageOptions = [
  "50mg",
  "100mg",
  "200mg",
  "250mg",
  "500mg",
  "750mg",
  "1000mg",
];

const frequencyOptions = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "As needed",
];

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// Helper function to format time to Sri Lanka time
const formatSriLankaTime = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Colombo",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
};

export default function DoctorDashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
  });

  const { data, error, isLoading, mutate } = useSWR(
    "/doctor/dashboard",
    fetcher
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleViewProfile = async (patientId) => {
    try {
      router.push(`/doctor/patients/${patientId}`);
    } catch (error) {
      console.error("Error navigating to patient profile:", error);
      alert("Failed to view patient profile");
    }
  };

  const handleStartAppointment = async (appointmentId) => {
    try {
      if (expandedAppointment === appointmentId) {
        setExpandedAppointment(null);
        return;
      }

      setExpandedAppointment(appointmentId);
      mutate();
    } catch (error) {
      console.error("Error starting appointment:", error);
      alert("Failed to start appointment");
    }
  };

  const handleAddMedicine = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...prescription.medicines];
    newMedicines[index][field] = value;
    setPrescription((prev) => ({
      ...prev,
      medicines: newMedicines,
    }));
  };

  const handleRemoveMedicine = (index) => {
    if (prescription.medicines.length > 1) {
      setPrescription((prev) => ({
        ...prev,
        medicines: prev.medicines.filter((_, i) => i !== index),
      }));
    }
  };
const handleSubmitPrescription = async (appointment) => {
  try {
    // Validate prescription data
    const isValid = prescription.medicines.every(
      (medicine) =>
        medicine.name &&
        medicine.dosage &&
        medicine.frequency &&
        medicine.duration
    );

    if (!isValid) {
      alert("Please fill in all medicine details");
      return;
    }

    await axiosInstance.post(`/doctor/createPrescription`, {
      appointmentId: appointment.id,
      patientId: appointment.patientId, // Assuming appointment has patientId, adjust if needed
      medicine: prescription.medicines,
      notes: prescription.notes,
    });

    setExpandedAppointment(null);
    setPrescription({
      medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
    });

    // Refresh dashboard data
    mutate();
    alert("Prescription submitted successfully");
  } catch (error) {
    console.error("Error submitting prescription:", error);
    alert("Failed to submit prescription");
  }
};

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
        Error loading dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Doctor Dashboard
            </h1>
            <p className="text-[#82889c]">
              Welcome back, Dr. {data?.doctor?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#3a99b7]/10 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-[#3a99b7]" />
            <span className="text-[#3a99b7] font-medium">
              {formatSriLankaTime(currentTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Today's Appointments</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {data?.todayCount || 0}
              </h3>
            </div>
            <Calendar className="w-8 h-8 text-[#3a99b7]" />
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
              <p className="text-[#82889c]">Upcoming</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {data?.upcomingCount || 0}
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
              <p className="text-[#82889c]">Completed Today</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {data?.completedCount || 0}
              </h3>
            </div>
            <CheckCircle className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#232323]">
              Today's Appointments
            </h2>
            <p className="text-[#82889c] text-sm">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {data?.appoinments?.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors overflow-hidden"
            >
              {/* Appointment Card Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#3a99b7]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#232323]">
                        {appointment.patient.name}
                      </h3>
                      <p className="text-sm text-[#82889c] mt-1">
                        {appointment.patient.age} years •{" "}
                        {appointment.patient.gender}
                      </p>
                      <p className="text-sm text-[#82889c] mt-1">
                        Number: {appointment.number}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-[#82889c]" />
                        <span className="text-sm text-[#82889c]">
                          {formatSriLankaTime(appointment.time)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleViewProfile(appointment.patient.id)
                        }
                        className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => handleStartAppointment(appointment.id)}
                        className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                      >
                        {expandedAppointment === appointment.id
                          ? "Close"
                          : "Start"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription Form */}
              <AnimatePresence>
                {expandedAppointment === appointment.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-[#e2e2e2]"
                  >
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium text-[#232323] mb-4">
                        Write Prescription
                      </h4>

                      <div className="space-y-4">
                        {prescription.medicines.map((medicine, index) => (
                          <div key={index} className="flex gap-4 items-start">
                            <div className="flex-1 grid grid-cols-4 gap-4">
                              <input
                                type="text"
                                placeholder="Medicine name"
                                value={medicine.name}
                                onChange={(e) =>
                                  handleMedicineChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="p-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors"
                              />
                              <select
                                value={medicine.dosage}
                                onChange={(e) =>
                                  handleMedicineChange(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                                className="p-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors"
                              >
                                <option value="">Select dosage</option>
                                {dosageOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={medicine.frequency}
                                onChange={(e) =>
                                  handleMedicineChange(
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                                className="p-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors"
                              >
                                <option value="">Select frequency</option>
                                {frequencyOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="Duration (e.g., 7 days)"
                                value={medicine.duration}
                                onChange={(e) =>
                                  handleMedicineChange(
                                    index,
                                    "duration",
                                    e.target.value
                                  )
                                }
                                className="p-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors"
                              />
                            </div>
                            {index > 0 && (
                              <button
                                onClick={() => handleRemoveMedicine(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <textarea
                        placeholder="Additional notes or instructions..."
                        value={prescription.notes}
                        onChange={(e) =>
                          setPrescription((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        className="mt-4 w-full p-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors min-h-[100px]"
                      />

                      <div className="flex justify-between mt-4">
                        <button
                          onClick={handleAddMedicine}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#3a99b7] hover:bg-[#3a99b7]/10 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Medicine
                        </button>

                        <button
                          onClick={() =>
                            handleSubmitPrescription(appointment)
                          }
                          className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                        >
                          Complete & Submit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {!data?.appointments?.length && (
            <p className="text-center text-[#82889c] py-4">
              No appointments scheduled for today
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
