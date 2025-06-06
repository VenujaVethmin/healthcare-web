"use client";

import { useState } from "react";
import { Search, UserPlus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";
import { toast } from "sonner";

const usersList = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    isDoctor: false,
  },
  {
    id: 2,
    name: "Dr. Sarah Johnson",
    email: "sarah.j@example.com",
    isDoctor: true,
    specialization: "Cardiologist",
    location: "Colombo Central Hospital",
  },
];

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorsManagement() {
  const [emailSearch, setEmailSearch] = useState("");
  const [users, setUsers] = useState(usersList);
  const [showSearchResult, setShowSearchResult] = useState(false);
 const[searchedUser , setSearchedUser] = useState(null);
  
  

  
   const { data : doctors, error, isLoading } = useSWR("/admin/getDoctors", fetcher);


  // const doctors = users.filter((user) => user.isDoctor);

  const handleSearch = async () => {
    const res = await axiosInstance.get(
      `/admin/getUserById/${emailSearch}`
    );
    console.log(res.data);
    setSearchedUser(res.data);

    setShowSearchResult(true);
  };

  const handleMakeDoctor = async () => {
    
    const res = await axiosInstance.post("/admin/changeRole", {
      userId: searchedUser.id,
    });
    if (res.status== 200) {
       toast.success("User has been converted to doctor successfully", {
         duration: 3000,
         style: {
           background: "#3a99b7",
           color: "#fff",
         },
       });
       console.log(res.data);
       setUsers([...users, searchedUser]);
       setSearchedUser(null);
       setEmailSearch("");
       setShowSearchResult(false);
    }
   
  };

  const handleDeleteDoctor =async (doctorId) => {
    const res = await axiosInstance.delete(`/admin/deleteDoctor/${doctorId}`);
 if (res.status== 200) {
       toast.success("User has been converted to a Patient successfully", {
         duration: 3000,
         style: {
           background: "#3a99b7",
           color: "#fff",
         },
       });
    
    }
    
    
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#232323]">
              Doctors Management
            </h1>
            <p className="text-[#82889c]">
              Convert users to doctors and manage doctor list
            </p>
          </div>
        </div>
      </div>

      {/* Email Search */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#232323]">
            Convert User to Doctor
          </h2>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
              <input
                type="email"
                placeholder="Search user by email..."
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.target.value);
                  setShowSearchResult(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!emailSearch}
              className="px-6 py-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>

          {showSearchResult && emailSearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {searchedUser ? (
                <>
                  <div>
                    <p className="font-medium text-[#232323]">
                      {searchedUser.name}
                    </p>
                    <p className="text-sm text-[#82889c]">
                      {searchedUser.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMakeDoctor(searchedUser.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Make Doctor
                  </button>
                </>
              ) : (
                <p className="text-[#82889c]">
                  No user found with this email or user is already a doctor
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h2 className="text-lg font-medium text-[#232323] mb-4">
          Doctors List ({doctors?.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Specialization
                </th>
                
                <th className="px-6 py-3 text-right text-xs font-medium text-[#82889c] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors?.map((doctor) => (
                <motion.tr
                  key={doctor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#232323]">
                      {doctor.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#82889c]">{doctor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#3a99b7]">
                      {doctor.specialization || "-"}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {doctors?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-[#82889c]"
                  >
                    No doctors found
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
