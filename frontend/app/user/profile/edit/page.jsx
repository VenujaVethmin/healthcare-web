"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { AlertCircle, ArrowLeft, Camera, Shield, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

export default function EditProfilePage() {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR("/user/profile", fetcher);

  console.log(data);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    bloodType: "",
    allergies: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        phone: data.user.userProfile?.phone || "",
        location: data.user.userProfile?.address || "",
        bio: data.user.userProfile?.bio || "",
        bloodType: data.user.userProfile?.bloodType || "",
        allergies: data.user.userProfile?.allergies || "",
        emergencyContact: {
          name: data.user.userProfile?.emergencyContact?.name || "",
          phone: data.user.userProfile?.emergencyContact?.phone || "",
        },
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
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsFormDirty(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsFormDirty(true);
    if (name.includes("emergency")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSubmitError("Name is required");
      return false;
    }
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      setSubmitError("Invalid phone number format");
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
        imageFormData.append("imageFormData", imageFile);
        const imageResponse = await axiosInstance.post(
          "/cloudinary/profileImage",
          imageFormData
        );
        imageUrl = imageResponse.data.url;
      }

      const response = await axiosInstance.put("/user/profile", {
        ...formData,
        image: imageUrl,
      });

      if (response.status === 200) {
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        await mutate();
        setIsFormDirty(false);
        toast.success("Profile updated successfully");
        router.push("/user/profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSubmitError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isFormDirty) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        return;
      }
    }
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    router.push("/user/profile");
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a99b7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        Error loading profile
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <Link
          href="/user/profile"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Full Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Phone</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#3a99b7]"
              >
                <option value="">Select Blood Type</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Allergies</label>
              <Input
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Penicillin, Peanuts, Latex"
                className="w-full"
              />
              <p className="text-xs text-[#82889c]">
                Separate multiple allergies with commas
              </p>
            </div>

            <div className="col-span-full space-y-2">
              <label className="text-sm text-[#434966]">Bio</label>
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

        <div className="bg-white rounded-xl border border-black/10 p-6">
          <h3 className="text-[#434966] text-lg font-semibold mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#3a99b7]" />
            Emergency Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Contact Name</label>
              <Input
                name="emergency.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#434966]">Contact Phone</label>
              <Input
                name="emergency.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                className="w-full"
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
            className="bg-[#3a99b7] text-white hover:bg-[#2d7a93]"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
