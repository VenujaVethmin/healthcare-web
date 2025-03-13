"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Users,
  CheckCircle,
  FileText,
  User,
  Plus,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const todaysAppointments = [
  {
    id: 1,
    patientName: "John Doe",
    time: "10:30 AM",
    status: "upcoming",
    age: "45",
    gender: "Male",
    reason: "Regular Checkup",
  },
  {
    id: 2,
    patientName: "Sarah Smith",
    time: "11:15 AM",
    status: "completed",
    age: "28",
    gender: "Female",
    reason: "Follow-up",
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    time: "2:00 PM",
    status: "upcoming",
    age: "35",
    gender: "Male",
    reason: "Consultation",
  },
];

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

export default function DoctorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [prescription, setPrescription] = useState({
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const stats = {
    upcoming: todaysAppointments.filter((apt) => apt.status === "upcoming")
      .length,
    completed: todaysAppointments.filter((apt) => apt.status === "completed")
      .length,
    total: todaysAppointments.length,
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
    setPrescription((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitPrescription = (appointmentId) => {
    // Add your prescription submission logic here
    console.log("Prescription submitted:", { ...prescription, appointmentId });
    setExpandedAppointment(null);
    // Reset prescription form
    setPrescription({
      medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Current Time */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Doctor Dashboard
            </h1>
            <p className="text-[#82889c]">Welcome back, Dr. Connor</p>
          </div>
          <div className="flex items-center gap-2 bg-[#3a99b7]/10 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-[#3a99b7]" />
            <span className="text-[#3a99b7] font-medium">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                {stats.total}
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
                {stats.upcoming}
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
              <p className="text-[#82889c]">Completed</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {stats.completed}
              </h3>
            </div>
            <CheckCircle className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#232323]">
              Today's Appointments
            </h2>
            <p className="text-[#82889c] text-sm">Manage your appointments</p>
          </div>
        </div>

        <div className="space-y-4">
          {todaysAppointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#3a99b7]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#232323]">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-[#82889c] mt-1">
                        {appointment.age} years • {appointment.gender}
                      </p>
                      <p className="text-sm text-[#82889c] mt-1">
                        Reason: {appointment.reason}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-[#82889c]" />
                        <span className="text-sm text-[#82889c]">
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {appointment.status === "upcoming" && (
                    <button
                      className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                      onClick={() =>
                        setExpandedAppointment(
                          expandedAppointment === appointment.id
                            ? null
                            : appointment.id
                        )
                      }
                    >
                      {expandedAppointment === appointment.id
                        ? "Close"
                        : "Start"}
                    </button>
                  )}
                </div>
              </div>

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
                            handleSubmitPrescription(appointment.id)
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
        </div>
      </div>
    </div>
  );
}
