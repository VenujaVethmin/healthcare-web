"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Package2, Pill as Pills } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function PharmacistDashboard() {
  const { data, error, isLoading } = useSWR("/pharmacist/dashboard", fetcher);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data?.data) {
      setPrescriptions(data.data);
    }
  }, [data]);

  const stats = {
    total: data?.totalPrescriptions || 0,
    pending: data?.pending || 0,
    ready: data?.ready || 0,
    completed: data?.completed || 0,
  };

  const handleStatusChange = async (prescriptionId, newStatus) => {
    try {
      const res = await axiosInstance.put(
        `/pharmacist/pstatus/${prescriptionId}`,
        {
          pStatus: newStatus,
        }
      );

      if (res.status === 200) {
        window.alert("Status updated successfully");
        setPrescriptions(
          prescriptions.map((prescription) =>
            prescription.prescriptions.id === prescriptionId
              ? { ...prescription, pStatus: newStatus }
              : prescription
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      window.alert("Failed to update status");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dashboard</div>;

  return (
    // ... rest of your JSX remains the same
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Pharmacy Dashboard
            </h1>
            <p className="text-[#82889c]">Manage prescriptions and inventory</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Total Prescriptions</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {stats.total}
              </h3>
            </div>
            <Pills className="w-8 h-8 text-[#3a99b7]" />
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
              <p className="text-[#82889c]">Pending</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {stats.pending}
              </h3>
            </div>
            <Package2 className="w-8 h-8 text-orange-500" />
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
              <p className="text-[#82889c]">Ready for Pickup</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {stats.ready}
              </h3>
            </div>
            <Package2 className="w-8 h-8 text-yellow-500" />
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
              <p className="text-[#82889c]">Completed</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {stats.completed}
              </h3>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="space-y-4">
          {prescriptions.map((item) => (
            <div
              key={item.prescriptions.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-lg">{item.patient.name}</h3>
                  <p className="text-[#82889c]">
                    Prescribed by: {item.doctor.name}
                  </p>
                  <p className="text-[#82889c]">
                    Date: {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.pStatus === "PENDING" && (
                    <button
                      onClick={() =>
                        handleStatusChange(item.prescriptions.id, "READY")
                      }
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                      Mark Ready
                    </button>
                  )}
                  {item.pStatus === "READY" && (
                    <button
                      onClick={() =>
                        handleStatusChange(item.prescriptions.id, "COMPLETED")
                      }
                      className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Complete
                    </button>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.pStatus === "PENDING"
                        ? "bg-orange-100 text-orange-800"
                        : item.pStatus === "READY"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.pStatus}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Medicines:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item?.prescriptions?.medicine.map((medicine, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{medicine.name}</p>
                      <p className="text-sm text-[#82889c]">
                        {medicine.dosage} - {medicine.frequency}
                      </p>
                      <p className="text-sm text-[#82889c]">
                        Duration: {medicine.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}