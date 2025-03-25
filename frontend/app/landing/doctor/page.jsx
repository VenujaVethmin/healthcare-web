"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { Camera, ArrowRight, Clock } from "lucide-react";

export default function DoctorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    education: "",
    experience: "",
    phone: "",
    location: "",
    availability: "",
    bio: "",
    consultationFee: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (step === 1) {
      return formData.name && formData.specialty && formData.education;
    } else {
      return formData.phone && formData.location && formData.availability;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await axiosInstance.post("/doctor/complete-profile", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        router.push("/doctor/dashboard");
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      alert(error.response?.data?.message || "An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-black/10 p-4 sm:p-6"
        >
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Complete Your Doctor Profile
            </h1>
            <p className="text-sm text-[#82889c] mt-2">
              Set up your professional profile
            </p>
          </div>

          <div className="space-y-6">
            {step === 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#3a99b7]/10 flex items-center justify-center">
                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#3a99b7]" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-[#3a99b7]" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="e.g., Cardiologist"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="e.g., MD - Cardiology"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="e.g., 10 years"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => validateForm() && setStep(2)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!validateForm()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Location/Clinic Address
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="Enter your clinic address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="e.g., Mon-Fri, 9:00 AM - 5:00 PM"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Consultation Fee
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7]"
                      placeholder="Enter consultation fee"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#232323] mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#e2e2e2] focus:outline-none focus:border-[#3a99b7] min-h-[100px] resize-none"
                      placeholder="Tell us about your professional experience"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full sm:w-1/2 px-6 py-3 text-[#434966] hover:bg-gray-50 rounded-lg order-2 sm:order-1 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !validateForm()}
                    className="w-full sm:w-1/2 px-6 py-3 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 transition-colors"
                  >
                    {loading ? "Saving..." : "Complete Profile"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}