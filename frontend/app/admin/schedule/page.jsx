"use client";

import axiosInstance from "@/lib/axiosInstance";
import { Save, Search, Upload } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function DoctorSettings() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: doctors,
    error,
    isLoading,
    mutate,
  } = useSWR("/admin/getDoctorSchedule", fetcher);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSaveSettings = async (doctorId, settings) => {
    try {
      const response = await axiosInstance.put(
        `/admin/updateDoctorSchedule/${doctorId}`,
        settings
      );

      if (response.data.success) {
        await mutate();
        window.alert("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      window.alert("Failed to save settings");
    }
  };

  const handlePublishSchedule = async (doctorId) => {
    try {
      const response = await axiosInstance.put(
        `/admin/publishSchedule/${doctorId}`,
        {
          isPublished: true,
        }
      );

      if (response.data.success) {
        await mutate();
        window.alert("Schedule published successfully!");
      }
    } catch (error) {
      console.error("Error publishing schedule:", error);
      window.alert("Failed to publish schedule");
    }
  };

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor?.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading doctor schedules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">
          Error loading doctors: {error.message}
        </p>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No doctors found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Doctor Schedule Management
        </h1>
        <p className="text-[#82889c]">
          Set and publish doctor schedules for appointment booking
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
          {filteredDoctors?.map((doctor) => (
            <div key={doctor?.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#232323]">
                    {doctor?.doctor?.name}
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

              {selectedDoctor === doctor?.id && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor?.workingHours?.map((hour) => (
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
                            const updatedHours = doctor.workingHours.map((h) =>
                              h.id === hour.id
                                ? { ...h, isWorking: e.target.checked }
                                : h
                            );
                            handleSaveSettings(doctor.id, {
                              ...doctor,
                              workingHours: updatedHours,
                            });
                          }}
                          className="h-4 w-4 text-[#3a99b7] rounded border-gray-300 focus:ring-[#3a99b7]"
                        />
                        <input
                          type="time"
                          value={hour?.startTime}
                          disabled={!hour?.isWorking}
                          onChange={(e) => {
                            const updatedHours = doctor.workingHours.map((h) =>
                              h.id === hour.id
                                ? { ...h, startTime: e.target.value }
                                : h
                            );
                            handleSaveSettings(doctor.id, {
                              ...doctor,
                              workingHours: updatedHours,
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <span className="text-[#82889c]">to</span>
                        <input
                          type="time"
                          value={hour?.endTime}
                          disabled={!hour?.isWorking}
                          onChange={(e) => {
                            const updatedHours = doctor.workingHours.map((h) =>
                              h.id === hour.id
                                ? { ...h, endTime: e.target.value }
                                : h
                            );
                            handleSaveSettings(doctor.id, {
                              ...doctor,
                              workingHours: updatedHours,
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#232323] mb-2">
                        Appointment Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={doctor?.appointmentDuration}
                        onChange={(e) =>
                          handleSaveSettings(doctor?.id, {
                            ...doctor,
                            appointmentDuration: parseInt(e.target.value),
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
                        value={doctor?.maxPatientsPerDay}
                        onChange={(e) =>
                          handleSaveSettings(doctor?.id, {
                            ...doctor,
                            maxPatientsPerDay: parseInt(e.target.value),
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
                        value={doctor?.consultationFee}
                        onChange={(e) =>
                          handleSaveSettings(doctor?.id, {
                            ...doctor,
                            consultationFee: parseInt(e.target.value),
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() =>
                        handleSaveSettings(doctor?.id, {
                          ...doctor,
                          workingHours: doctor?.workingHours,
                        })
                      }
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Update Schedule
                    </button>

                    {!doctor?.isPublished && (
                      <button
                        onClick={() => handlePublishSchedule(doctor?.id)}
                        className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Publish Schedule
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
