"use client";

import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  File,
  Loader2,
  Search,
  Upload,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PharmacistRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [recordName, setRecordName] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setError("");
    try {
      const res = await axiosInstance.get(
        `/pharmacist/userInfo/${searchQuery.trim()}`
      );

      if (res.data) {
        setSearchResult(res.data);
        setRecords(res.data.medicalRecords || []);
      } else {
        setError("No patient found with this email or name");
        setSearchResult(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error searching for patient");
      setSearchResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !searchResult || !recordName.trim()) {
      setError("Please provide both an image and record name");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", recordName.trim());

    try {
      const res = await axiosInstance.post(
        `/cloudinary/fileUpload/${searchResult.id}`,
        formData
      );

      if (res.data && res.data._id) {
        const newRecord = res.data;
        setRecords((prev) => [newRecord, ...prev]);
        setSelectedFile(null);
        setRecordName("");
        toast.success("uploaded");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading image");
      console.error("Error during file upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Medical Records
        </h1>
        <p className="text-[#82889c]">
          Search patient by email to manage records
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
            <input
              type="text"
              placeholder="Enter patient email or full name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
          >
            Search Patient
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {searchResult && (
        <>
          {/* Upload Section */}
          <div className="bg-white rounded-xl border border-black/10 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#3a99b7]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#232323]">
                  {searchResult.name}
                </h2>
                <p className="text-[#82889c]">{searchResult.email}</p>
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
                <div className="space-y-4">
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
                  <input
                    type="text"
                    placeholder="Enter record name..."
                    value={recordName}
                    onChange={(e) => setRecordName(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3a99b7]"
                  />
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-[#3a99b7] mx-auto mb-2" />
                  <p className="text-[#232323] font-medium">
                    Drag and drop your image here, or{" "}
                    <label className="text-[#3a99b7] cursor-pointer hover:text-[#2d7a93]">
                      browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-[#82889c] mt-1">
                    Supports: JPG, PNG, GIF, WEBP (Max 5MB)
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !recordName.trim() || isUploading}
                className="px-6 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload Record"}
              </button>
            </div>
          </div>

          {/* Records History */}
          <div className="bg-white rounded-xl border border-black/10 p-6">
            <h2 className="text-lg font-semibold text-[#232323] mb-6">
              Records History
            </h2>
            <div className="space-y-4">
              {records && records.length > 0 ? (
                records.map((record) => (
                  <motion.div
                    key={record._id || record.id}
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
                              {record.name}
                            </h3>
                            <p className="text-sm text-[#82889c]">
                              {record.fileName}
                            </p>
                            <p className="text-sm text-[#82889c]">
                              Size: {record.fileSize}
                            </p>
                          </div>
                          <a
                            href={record.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm text-[#3a99b7] hover:bg-[#3a99b7]/10 rounded-lg transition-colors"
                          >
                            View Image
                          </a>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-[#82889c]">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(record.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <File className="w-12 h-12 text-[#82889c] mx-auto mb-2" />
                  <p className="text-[#82889c]">No records found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
