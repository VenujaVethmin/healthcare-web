"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function PrescriptionsPage() {
  const {
    data: prescriptions,
    error,
    isLoading,
    mutate,
  } = useSWR("/user/getPrescription", fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3a99b7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading prescriptions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/user/dashboard"
              className="p-2 hover:bg-[#f6f6f6] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#434966]" />
            </Link>
            <h1 className="text-xl font-semibold text-[#232323]">
              Prescriptions
              <p className="text-[#82889c]">Your prescription history</p>
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {prescriptions?.prescriptions?.map((prescription) => (
          <motion.div
            key={prescription.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-black/10 p-4 sm:p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#3a99b7]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#82889c]" />
                  <span className="text-[#232323] font-medium">
                   Dr. {prescription.doctor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-[#82889c]" />
                  <span className="text-sm text-[#82889c]">
                    {new Date(
                      prescription.prescriptionDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescription.medicine.map((medicine, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors space-y-2"
                  >
                    <h3 className="font-medium text-[#232323]">
                      {medicine.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-[#82889c] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#3a99b7] rounded-full"></span>
                        Dosage: {medicine.dosage}
                      </p>
                      <p className="text-sm text-[#82889c] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#3a99b7] rounded-full"></span>
                        {medicine.frequency}
                      </p>
                      <p className="text-sm text-[#82889c] flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration: {medicine.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {prescription.notes && (
                <div className="p-4 rounded-lg bg-[#3a99b7]/5 border border-[#3a99b7]/10">
                  <h4 className="font-medium text-[#232323] mb-2">Notes</h4>
                  <p className="text-sm text-[#82889c]">{prescription.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
