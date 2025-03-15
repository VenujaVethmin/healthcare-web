"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  File,
  X,
  Search,
  Calendar,
  User,
  ChevronRight,
} from "lucide-react";

// Sample patients data - Replace with API call
const patientsList = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: "45",
    records: [],
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    age: "32",
    records: [],
  },
];

export default function PharmacistRecords() {
  const [patients, setPatients] = useState(patientsList);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    doctorName: "",
    type: "Prescription Record",
    date: new Date().toISOString().split("T")[0],
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedPatient) return;

    const newRecord = {
      id: Date.now(),
      patientName: selectedPatient.name,
      ...uploadForm,
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
    };

    // Update the patient's records
    setPatients(
      patients.map((patient) =>
        patient.id === selectedPatient.id
          ? { ...patient, records: [newRecord, ...(patient.records || [])] }
          : patient
      )
    );

    setSelectedFile(null);
    setUploadForm({
      doctorName: "",
      type: "Prescription Record",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#232323]">
              Patient Records
            </h1>
            <p className="text-[#82889c]">
              Select patient to manage their records
            </p>
          </div>
          {selectedPatient && (
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-[#3a99b7] hover:text-[#2d7a93]"
            >
              Back to Patients
            </button>
          )}
        </div>
      </div>

      {!selectedPatient ? (
        // Patient Selection Section
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-[#232323]">
              Select Patient
            </h2>
            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#3a99b7] transition-colors cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#3a99b7]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#232323]">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-[#82889c]">{patient.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#82889c]" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // Record Upload and Management Section for Selected Patient
        <>
          <div className="bg-white rounded-xl border border-black/10 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#3a99b7]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#232323]">
                  {selectedPatient.name}
                </h2>
                <p className="text-[#82889c]">{selectedPatient.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#232323] mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.doctorName}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        doctorName: e.target.value,
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#232323] mb-1">
                    Record Type
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) =>
                      setUploadForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                  >
                    <option value="Prescription Record">
                      Prescription Record
                    </option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Medical History">Medical History</option>
                  </select>
                </div>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive
                    ? "border-[#3a99b7] bg-[#3a99b7]/5"
                    : "border-gray-300"
                }`}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-4">
                    <File className="w-8 h-8 text-[#3a99b7]" />
                    <div className="text-left">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-[#82889c]">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-2 hover:bg-red-50 rounded-full text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-[#3a99b7] mx-auto mb-2" />
                    <p className="text-[#232323] font-medium">
                      Drag and drop your file here, or{" "}
                      <label className="text-[#3a99b7] cursor-pointer hover:text-[#2d7a93]">
                        browse
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-[#82889c] mt-1">
                      Supports: PDF files only
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Record
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold text-[#232323] mb-6">
              Patient Records History
            </h2>
            <div className="space-y-4">
              {selectedPatient.records && selectedPatient.records.length > 0 ? (
                selectedPatient.records.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#3a99b7] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#3a99b7]/10 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-[#3a99b7]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-[#232323]">
                              {record.fileName}
                            </h3>
                            <p className="text-sm text-[#82889c]">
                              Size: {record.fileSize}
                            </p>
                          </div>
                          <button className="px-4 py-2 text-sm text-[#3a99b7] hover:bg-[#3a99b7]/10 rounded-lg transition-colors">
                            Download
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-[#82889c]">
                            <User className="w-4 h-4" />
                            <span>{record.patientName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#82889c]">
                            <User className="w-4 h-4" />
                            <span>{record.doctorName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#82889c]">
                            <Calendar className="w-4 h-4" />
                            <span>{record.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-[#82889c] py-8">
                  No records found for this patient
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
