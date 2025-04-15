"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Package2, Pill as Pills } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";

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
       
        toast.success("Status updated successfully");
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
      toast.error("Failed to update  status");
      
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a99b7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error loading dashboard. Please try again later.</p>
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
        {[
          {
            label: "Total Prescriptions",
            value: stats.total,
            icon: <Pills className="w-8 h-8 text-[#3a99b7]" />,
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: <Package2 className="w-8 h-8 text-orange-500" />,
          },
          {
            label: "Ready for Pickup",
            value: stats.ready,
            icon: <Package2 className="w-8 h-8 text-yellow-500" />,
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-black/10 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#82889c]">{stat.label}</p>
                <h3 className="text-2xl font-semibold text-[#232323]">
                  {stat.value}
                </h3>
              </div>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h2 className="text-lg font-semibold text-[#232323] mb-4">
          Prescriptions
        </h2>
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pills className="w-12 h-12 text-[#82889c] mx-auto mb-4" />
            <p className="text-[#82889c]">No prescriptions available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((item) => (
              <div
                key={item.prescriptions.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
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
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                        aria-label="Mark as Ready"
                      >
                        Mark Ready
                      </button>
                    )}
                    {item.pStatus === "READY" && (
                      <button
                        onClick={() =>
                          handleStatusChange(item.prescriptions.id, "COMPLETED")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        aria-label="Mark as Completed"
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
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
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
        )}
      </div>
    </div>
  );
}
