"use client";

import { useState } from "react";
import { Search, Image, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function MedicalRecords() {
  const {
    data: records,
    error,
    isLoading,
  } = useSWR("/user/medicalRecords", fetcher);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredRecords = records?.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleViewImage = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading records: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Medical Records
        </h1>
        <p className="text-[#82889c]">View your medical reports and images</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
        <input
          type="text"
          placeholder="Search records by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
          disabled={isLoading}
        />
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl border border-black/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center text-[#82889c]">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Image className="w-5 h-5 text-[#3a99b7] mr-3" />
                        <div>
                          <div className="text-sm font-medium text-[#232323]">
                            {record.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#82889c]">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {record.link ? (
                          <button
                            onClick={() => handleViewImage(record.link)}
                            className="p-2 hover:bg-[#3a99b7]/10 rounded-full text-[#3a99b7] transition-colors"
                            title="View Image"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="p-2 text-gray-300 cursor-not-allowed"
                            title="No image available"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-[#82889c]">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}