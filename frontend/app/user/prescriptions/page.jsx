"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, User ,ArrowLeft} from "lucide-react";
import Link from "next/link";
const prescriptions = [
  {
    id: 1,
    prescribedBy: "Dr. Sarah Connor",
    date: "March 1, 2024",
    medicines: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily" },
      { name: "Paracetamol", dosage: "650mg", frequency: "Every 6 hours" },
      { name: "Cetirizine", dosage: "10mg", frequency: "Once daily" },
      { name: "Vitamin C", dosage: "500mg", frequency: "Once daily" },
      { name: "Vitamin D3", dosage: "60,000 IU", frequency: "Once weekly" },
      { name: "Zinc", dosage: "50mg", frequency: "Once daily" },
    ],
  },
  {
    id: 2,
    prescribedBy: "Dr. John Smith",
    date: "February 28, 2024",
    medicines: [
      { name: "Omeprazole", dosage: "20mg", frequency: "Once daily" },
      { name: "Ibuprofen", dosage: "400mg", frequency: "Twice daily" },
      { name: "B-Complex", dosage: "1 tablet", frequency: "Once daily" },
      { name: "Iron", dosage: "150mg", frequency: "Once daily" },
      { name: "Calcium", dosage: "500mg", frequency: "Twice daily" },
      { name: "Folic Acid", dosage: "5mg", frequency: "Once daily" },
    ],
  },
];

export default function PrescriptionsPage() {
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
        {prescriptions.map((prescription) => (
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
                    {prescription.prescribedBy}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-[#82889c]" />
                  <span className="text-sm text-[#82889c]">
                    {prescription.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescription.medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium text-[#232323]">
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-[#82889c]">
                    {medicine.dosage} - {medicine.frequency}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
