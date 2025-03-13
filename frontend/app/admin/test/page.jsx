"use client";

import { useState } from "react";
import { Clock, Save, Plus, X, Search, Upload } from "lucide-react";

export default function DoctorSettings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Pediatric Specialist",
      workingHours: {
        monday: { start: "09:00", end: "17:00", isWorking: true },
        tuesday: { start: "09:00", end: "17:00", isWorking: true },
        wednesday: { start: "09:00", end: "17:00", isWorking: true },
        thursday: { start: "09:00", end: "17:00", isWorking: true },
        friday: { start: "09:00", end: "17:00", isWorking: true },
        saturday: { start: "09:00", end: "13:00", isWorking: true },
        sunday: { start: "09:00", end: "17:00", isWorking: false },
      },
      appointmentDuration: 15,
      maxPatientsPerDay: 20,
      consultationFee: 2500,
      isPublished: false,
    },
    // Add more doctors as needed
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSaveSettings = (doctorId, settings) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === doctorId ? { ...doc, ...settings } : doc
      )
    );
    alert("Settings saved successfully!");
  };

  const handlePublishSchedule = (doctorId) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === doctorId ? { ...doc, isPublished: true } : doc
      )
    );
    alert(
      "Schedule published successfully! Patients can now book appointments."
    );
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold text-[#232323]">
          Doctor Schedule Management
        </h1>
        <p className="text-[#82889c]">
          Set and publish doctor schedules for appointment booking
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#82889c]" />
        <input
          type="text"
          placeholder="Search doctors by name or specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] text-[#434966]"
        />
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-xl border border-black/10 p-6">
        <div className="space-y-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-[#232323]">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-[#82889c]">{doctor.specialty}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      doctor.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doctor.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setSelectedDoctor(
                      doctor.id === selectedDoctor ? null : doctor.id
                    )
                  }
                  className="px-4 py-2 text-sm bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors"
                >
                  {selectedDoctor === doctor.id ? "Close" : "Edit Schedule"}
                </button>
              </div>

              {selectedDoctor === doctor.id && (
                <div className="space-y-4">
                  {/* Working Hours */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(doctor.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-24">
                          <span className="text-sm font-medium capitalize">
                            {day}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={hours.isWorking}
                          onChange={(e) => {
                            const updatedHours = {
                              ...doctor.workingHours,
                              [day]: { ...hours, isWorking: e.target.checked },
                            };
                            handleSaveSettings(doctor.id, {
                              workingHours: updatedHours,
                            });
                          }}
                        />
                        <input
                          type="time"
                          value={hours.start}
                          disabled={!hours.isWorking}
                          onChange={(e) => {
                            const updatedHours = {
                              ...doctor.workingHours,
                              [day]: { ...hours, start: e.target.value },
                            };
                            handleSaveSettings(doctor.id, {
                              workingHours: updatedHours,
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={hours.end}
                          disabled={!hours.isWorking}
                          onChange={(e) => {
                            const updatedHours = {
                              ...doctor.workingHours,
                              [day]: { ...hours, end: e.target.value },
                            };
                            handleSaveSettings(doctor.id, {
                              workingHours: updatedHours,
                            });
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Other Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={doctor.appointmentDuration}
                        onChange={(e) =>
                          handleSaveSettings(doctor.id, {
                            appointmentDuration: parseInt(e.target.value),
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Patients Per Day
                      </label>
                      <input
                        type="number"
                        value={doctor.maxPatientsPerDay}
                        onChange={(e) =>
                          handleSaveSettings(doctor.id, {
                            maxPatientsPerDay: parseInt(e.target.value),
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Fee (LKR)
                      </label>
                      <input
                        type="number"
                        value={doctor.consultationFee}
                        onChange={(e) =>
                          handleSaveSettings(doctor.id, {
                            consultationFee: parseInt(e.target.value),
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-gray-200 w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={() => handleSaveSettings(doctor.id, doctor)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Update Schedule
                    </button>

                    {!doctor.isPublished && (
                      <button
                        onClick={() => handlePublishSchedule(doctor.id)}
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
