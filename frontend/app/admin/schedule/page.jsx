"use client";

import axiosInstance from "@/lib/axiosInstance";
import { Save, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorSettings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState({});
  const [doctorSettings, setDoctorSettings] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const {
    data: doctors,
    error,
    isLoading,
    mutate,
  } = useSWR("/admin/getDoctorSchedule", fetcher);

  useEffect(() => {
    if (doctors) {
      const settings = {};
      doctors.forEach((doctor) => {
        settings[doctor.id] = { ...doctor };
      });
      setDoctorSettings(settings);
    }
  }, [doctors]);

  const handleSaveSettings = async (doctorId) => {
    try {
      const settings = doctorSettings[doctorId];
      const response = await axiosInstance.put(
        `/admin/updateDoctorSchedule/${doctorId}`,
        settings
      );

      if (response.data.success) {
        await mutate();
        setHasChanges((prev) => ({ ...prev, [doctorId]: false }));
     
         toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
     
       toast.error("Failed to save settings");
    }
  };

  const handleChange = (doctorId, newSettings) => {
    setDoctorSettings((prev) => ({
      ...prev,
      [doctorId]: newSettings,
    }));
    setHasChanges((prev) => ({ ...prev, [doctorId]: true }));
  };

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor?.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="text-lg text-gray-600 flex items-center justify-center min-h-screen">
        Loading doctor schedules...
      </div>
    );
  if (error)
    return (
      <div className="text-lg text-red-600 flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Doctor Schedule Management
        </h1>
        <p className="text-[#82889c]">
          Manage doctor working hours and details
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
        />
      </div>

      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="space-y-6">
          {filteredDoctors?.map((doctor) => {
            const settings = doctorSettings[doctor?.id];
            return (
              <div
                key={doctor?.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#232323]">
                     Dr. {doctor?.doctor?.name}
                    </h3>
                    <p className="text-sm text-[#82889c]">
                      {doctor?.doctor?.email}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedDoctor(
                        doctor?.id === selectedDoctor ? null : doctor?.id
                      )
                    }
                    className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                  >
                    {selectedDoctor === doctor?.id ? "Close" : "Edit Schedule"}
                  </button>
                </div>

                {selectedDoctor === doctor?.id && settings && (
                  <div className="space-y-6">
                    {/* Doctor Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Specialty
                        </label>
                        <input
                          type="text"
                          value={settings?.specialty || ""}
                          onChange={(e) =>
                            handleChange(doctor.id, {
                              ...settings,
                              specialty: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                          placeholder="Enter specialty"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Room Number
                        </label>
                        <input
                          type="text"
                          value={settings?.room || ""}
                          onChange={(e) =>
                            handleChange(doctor.id, {
                              ...settings,
                              room: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                          placeholder="Enter room number"
                        />
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {settings?.workingHours?.map((hour) => (
                        <div key={hour?.id} className="flex items-center gap-4">
                          <div className="w-24">
                            <span className="text-sm font-medium capitalize">
                              {hour?.day?.toLowerCase()}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={hour?.isWorking}
                            onChange={(e) => {
                              const updatedHours = settings.workingHours.map(
                                (h) =>
                                  h.id === hour.id
                                    ? { ...h, isWorking: e.target.checked }
                                    : h
                              );
                              handleChange(doctor.id, {
                                ...settings,
                                workingHours: updatedHours,
                              });
                            }}
                            className="h-4 w-4 text-[#3a99b7] rounded border-gray-300 focus:ring-[#3a99b7]"
                          />
                          <input
                            type="time"
                            value={hour?.startTime || "09:00"}
                            disabled={!hour?.isWorking}
                            onChange={(e) => {
                              const updatedHours = settings.workingHours.map(
                                (h) =>
                                  h.id === hour.id
                                    ? { ...h, startTime: e.target.value }
                                    : h
                              );
                              handleChange(doctor.id, {
                                ...settings,
                                workingHours: updatedHours,
                              });
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:bg-gray-100"
                          />
                          <span className="text-[#82889c]">to</span>
                          <input
                            type="time"
                            value={hour?.endTime || "17:00"}
                            disabled={!hour?.isWorking}
                            onChange={(e) => {
                              const updatedHours = settings.workingHours.map(
                                (h) =>
                                  h.id === hour.id
                                    ? { ...h, endTime: e.target.value }
                                    : h
                              );
                              handleChange(doctor.id, {
                                ...settings,
                                workingHours: updatedHours,
                              });
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:bg-gray-100"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Additional Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Appointment Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings?.appointmentDuration ?? ""}
                          onChange={(e) =>
                            handleChange(doctor.id, {
                              ...settings,
                              appointmentDuration:
                                parseInt(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Max Patients Per Day
                        </label>
                        <input
                          type="number"
                          value={settings?.maxPatientsPerDay ?? ""}
                          onChange={(e) =>
                            handleChange(doctor.id, {
                              ...settings,
                              maxPatientsPerDay: parseInt(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#232323] mb-2">
                          Consultation Fee (LKR)
                        </label>
                        <input
                          type="number"
                          value={settings?.consultationFee ?? ""}
                          onChange={(e) =>
                            handleChange(doctor.id, {
                              ...settings,
                              consultationFee: parseInt(e.target.value) || 0,
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                        />
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={() => handleSaveSettings(doctor.id)}
                        disabled={!hasChanges[doctor.id]}
                        className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${
                          hasChanges[doctor.id]
                            ? "bg-[#3a99b7] text-white hover:bg-[#2d7a93]"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
