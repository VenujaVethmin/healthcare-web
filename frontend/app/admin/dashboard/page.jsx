"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  Activity,
  DollarSign,
  UserPlus,
  Building2,
  Search,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect } from "react";

const dashboardStats = {
  totalDoctors: 24,
  totalPatients: 150,
  totalAppointments: 89,
  revenue: 25000,
};

const recentActivities = [
  {
    id: 1,
    type: "New Registration",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "New Patient",
    name: "John Smith",
    timestamp: "3 hours ago",
    status: "approved",
  },
  {
    id: 3,
    type: "Appointment",
    name: "Emma Thompson",
    doctor: "Dr. Michael Clark",
    timestamp: "5 hours ago",
    status: "completed",
  },
];

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header with Current Time */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Admin Dashboard
            </h1>
            <p className="text-[#82889c]">Welcome back, Admin</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#82889c]">Total Doctors</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {dashboardStats.totalDoctors}
              </h3>
            </div>
            <Building2 className="w-8 h-8 text-[#3a99b7]" />
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
              <p className="text-[#82889c]">Total Patients</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {dashboardStats.totalPatients}
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
              <p className="text-[#82889c]">Total Appointments</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                {dashboardStats.totalAppointments}
              </h3>
            </div>
            <Activity className="w-8 h-8 text-[#3a99b7]" />
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
              <p className="text-[#82889c]">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-[#232323]">
                ${dashboardStats.revenue}
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-[#3a99b7]" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#232323]">
              Recent Activities
            </h2>
            <p className="text-[#82889c] text-sm">
              Monitor recent system activities
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e2e2e2] focus:border-[#3a99b7] focus:ring-2 focus:ring-[#3a99b7]/20 transition-colors"
            />
            <Search className="w-5 h-5 text-[#82889c] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#e2e2e2] p-4 hover:border-[#3a99b7] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
                    {activity.type === "New Registration" ? (
                      <UserPlus className="w-5 h-5 text-[#3a99b7]" />
                    ) : (
                      <Activity className="w-5 h-5 text-[#3a99b7]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#232323]">{activity.name}</h3>
                    <p className="text-sm text-[#82889c]">
                      {activity.type}
                      {activity.specialty && ` • ${activity.specialty}`}
                      {activity.doctor && ` with ${activity.doctor}`}
                    </p>
                    <p className="text-xs text-[#82889c] mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : activity.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activity.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-4 h-4 text-[#82889c]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}