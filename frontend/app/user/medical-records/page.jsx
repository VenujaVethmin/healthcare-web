"use client";

import { useState } from "react";
import { Search, FileText, Download, Eye, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Sample records data - Replace with your API data
const medicalRecords = [
  {
    id: 1,
    title: "Blood Test Report",
    doctor: "Dr. Sarah Johnson",
    date: "2024-03-15",
    type: "Laboratory Report",
    fileSize: "1.2 MB",
    url: "/reports/blood-test.pdf",
  },
  {
    id: 2,
    title: "X-Ray Report",
    doctor: "Dr. Michael Clark",
    date: "2024-03-10",
    type: "Radiology Report",
    fileSize: "2.5 MB",
    url: "/reports/xray.pdf",
  },
];

export default function MedicalRecords() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPDF = (url) => {
    window.open(url, '_blank');
  };

  const handleDownloadPDF = (url, title) => {
    // Implement PDF download logic
    console.log(`Downloading ${title}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Medical Records
        </h1>
        <p className="text-[#82889c]">
          View and download your medical reports and documents
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
        <input
          type="text"
          placeholder="Search records by title, doctor, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
        />
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl border border-black/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-[#3a99b7] mr-3" />
                      <div>
                        <div className="text-sm font-medium text-[#232323]">
                          {record.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#82889c]">{record.doctor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#82889c]">
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#3a99b7]/10 text-[#3a99b7]">
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#82889c]">{record.fileSize}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewPDF(record.url)}
                        className="p-2 hover:bg-[#3a99b7]/10 rounded-full text-[#3a99b7] transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(record.url, record.title)}
                        className="p-2 hover:bg-[#3a99b7]/10 rounded-full text-[#3a99b7] transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[#82889c]">
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