// app/doctor/profile/edit/page.jsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { AlertCircle, ArrowLeft, Camera, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function EditDoctorProfilePage() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(
    "/doctor/profile",
    fetcher
  );

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialty: "",
    experience: "",
    qualifications: "",
    education: "",
    
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        bio: data.user.doctorProfile?.bio || "",
        specialty: data.user.doctorProfile?.specialty || "",
        experience: data.user.doctorProfile?.experience || "",
        qualifications: data.user.doctorProfile?.qualifications || "",
        education: data.user.doctorProfile?.education || "",
       
      });
      setPreviewUrl(data.user.image);
    }
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        window.alert("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsFormDirty(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsFormDirty(true);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitError("Name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setSaving(true);
    try {
      let imageUrl = data?.user?.image;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        const imageResponse = await axiosInstance.post(
          "/api/user/upload-image", // Ensure this endpoint exists
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrl = imageResponse.data.url;
      }

      await axiosInstance.put("/doctor/profile", {
        ...formData,
        image: imageUrl,
      });

      await mutate();
      setIsFormDirty(false);
      router.push("/doctor/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitError(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      isFormDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      )
    ) {
      return;
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    router.push("/doctor/profile");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/doctor/profile"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-[#434966]" />
        </Link>
        <h1 className="text-2xl font-semibold text-[#434966]">Edit Profile</h1>
      </div>

      {submitError && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-black/10 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#3a99b7] flex items-center justify-center">
                  <span className="text-white text-2xl font-medium">
                    {formData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer">
                <Camera className="w-4 h-4 text-[#3a99b7]" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div>
              <h3 className="text-[#434966] font-medium">Profile Picture</h3>
              <p className="text-sm text-[#82889c]">
                JPG, GIF or PNG. Max size of 2MB
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/10 p-6">
          <h3 className="text-[#434966] text-lg font-semibold mb-6 flex items-center">
            <User className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Professional Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Full Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Specialty</label>
              <Input
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Experience</label>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Education</label>
              <Input
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm text-[#434966]">Qualifications</label>
              <Input
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm text-[#434966]">Professional Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7]"
              />
            </div>
           
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || !isFormDirty}
            className="bg-[#3a99b7] text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
