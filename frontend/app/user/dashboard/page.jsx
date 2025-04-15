"use client";

import axiosInstance from "@/lib/axiosInstance";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Clock,
  FileText,
  MapPin,
  Pill,
  Search,
  User,
  Heart,
  Brain,
  Baby,
  Stethoscope,
  Syringe,
  Activity,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';

// Fetcher for API calls
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

// Banner Data
const featuredServices = [
  {
    title: "Annual Health Checkup",
    description: "Comprehensive health screening package",
    image:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2791",
    icon: <Activity className="w-6 h-6 text-white" />,
    gradient: "from-blue-500/90 to-cyan-500/90",
    link: "/user/find-doctors",
  },
  {
    title: "Mental Health Care",
    description: "Professional counseling services",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940",
    icon: <Brain className="w-6 h-6 text-white" />,
    gradient: "from-purple-500/90 to-pink-500/90",
    link: "/user/find-doctors",
  },
  {
    title: "Heart Health",
    description: "Cardiac care excellence",
    image:
      "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=2940",
    icon: <Heart className="w-6 h-6 text-white" />,
    gradient: "from-red-500/90 to-rose-500/90",
    link: "/user/find-doctors",
  },
];

const specializedServices = [
  {
    title: "Pediatric Care",
    description: "Specialized care for children",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=2940",
    icon: <Baby className="w-6 h-6 text-white" />,
    gradient: "from-emerald-500/90 to-teal-500/90",
  },
  {
    title: "Diagnostic Services",
    description: "Advanced medical testing",
    image:
      "https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2940",
    icon: <Stethoscope className="w-6 h-6 text-white" />,
    gradient: "from-blue-500/90 to-indigo-500/90",
  },
  {
    title: "Vaccination Center",
    description: "Immunization services",
    image:
      "https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2940",
    icon: <Syringe className="w-6 h-6 text-white" />,
    gradient: "from-violet-500/90 to-purple-500/90",
  },
  {
    title: "Women's Health",
    description: "Specialized care for women",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2880",
    icon: <Heart className="w-6 h-6 text-white" />,
    gradient: "from-pink-500/90 to-rose-500/90",
  },
];

function getUtcTimeOnly(isoTime) {
  return formatInTimeZone(parseISO(isoTime), 'UTC', 'h:mm a');
}




const getSLTimeDate = (utcDate) => {
  if (!utcDate) return null;
  const date = new Date(utcDate);
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

const formatDate = (date) => {
  if (!date) return "Not scheduled";
  const slDate = getSLTimeDate(date);
  return format(slDate, "MMMM d, yyyy");
};

// Components
const PrescriptionStatusBadge = ({ status }) => {
  const statusConfig = {
    READY: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <Pill className="w-4 h-4" />,
      label: "Ready for pickup",
    },
    PENDING: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Processing",
    },
    COMPLETED: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: <Pill className="w-4 h-4" />,
      label: "Received",
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      <div className="flex items-center gap-1.5">
        {config.icon}
        {config.label}
      </div>
    </div>
  );
};

const AppointmentCard = ({ appointment, countdown }) => (
  <div className="p-4 border border-[#e2e2e2] rounded-lg hover:border-[#3a99b7] transition-colors">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-[#3a99b7]" />
      </div>
      <div>
        <h3 className="font-medium text-[#232323]">
          Dr. {appointment.doctor.name}
        </h3>
        <p className="text-sm text-[#82889c]">
          {appointment.specialty || "General Consultation"}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#82889c]" />
        <span className="text-sm text-[#232323]">
          {getUtcTimeOnly(appointment.time)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#82889c]" />
        <span className="text-sm text-[#232323]">
          {formatDate(appointment.time)}
        </span>
      </div>
    </div>

    <div className="flex items-start gap-2 mb-4">
      <MapPin className="w-4 h-4 text-[#82889c] mt-0.5" />
      <span className="text-sm text-[#232323]">
        {appointment.doctor.doctorBookingDetails.room || "TBA"}
      </span>
    </div>

    <div className="p-3 bg-[#3a99b7]/10 rounded-lg">
      <p className="text-sm text-[#3a99b7] font-medium">
        Time until appointment: {countdown || "Calculating..."}
      </p>
    </div>
  </div>
);

const PrescriptionCard = ({ prescription }) => (
  <div className="p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] transition-colors">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 bg-[#3a99b7]/10 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-[#3a99b7]" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#82889c]" />
            <span className="text-[#232323] font-medium">
              Dr. {prescription?.doctor?.name || "Not specified"}
            </span>
          </div>
          <PrescriptionStatusBadge
            status={prescription?.appointment?.pStatus}
          />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4 text-[#82889c]" />
          <span className="text-sm text-[#82889c]">
            {formatDate(prescription.prescriptionDate)}
          </span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prescription.medicine.map((medicine, index) => (
        <div
          key={index}
          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-[#232323]">{medicine.name}</h3>
          <p className="text-sm text-[#82889c]">
            {medicine.dosage} - {medicine.frequency}
          </p>
        </div>
      ))}
    </div>

    {prescription.status === "READY" && (
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Pill className="w-4 h-4 mt-0.5 text-green-800" />
          <div>
            <p className="text-green-800 text-sm">
              Your medications are ready for pickup at the pharmacy
            </p>
            <p className="text-green-600 text-xs mt-1">
              Please collect within 24 hours
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const FeaturedBanner = ({ service }) => (
  <Link href={service.link}>
    <div className="relative h-[200px] rounded-xl overflow-hidden group cursor-pointer">
      <Image
        src={service.image}
        alt={service.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        priority={false}
        quality={75}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${service.gradient}`}
      />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
          {service.icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-white/90">{service.description}</p>
      </div>
    </div>
  </Link>
);

const ScrollableServices = ({ services }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {services.map((service, index) => (
          <div key={index} className="flex-none w-[300px]">
            <Link href="/user/find-doctors">
              <div className="relative h-[180px] rounded-xl overflow-hidden group cursor-pointer">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority={false}
                  quality={75}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${service.gradient}`}
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/90">{service.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>
    </div>
  );
};

// Main Component
export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/user/dashboard", fetcher);
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    if (!data?.nextAppointment) return;

    const timer = setInterval(() => {
      const newCountdowns = {};
      const nowUTC = new Date();
      const sriLankaOffsetInMs = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const now = new Date(nowUTC.getTime() + sriLankaOffsetInMs);


      data.nextAppointment.forEach((appointment) => {
        // Parse the appointment time directly as Sri Lankan time
        const appointmentTime = parseISO(appointment.time); // Assuming appointment.time is like "2025-04-16 09:00:00"

        if (!appointmentTime || isNaN(appointmentTime)) {
          newCountdowns[appointment.id] = "Not scheduled";
          return;
        }

        const timeDiff = appointmentTime - now;

        if (timeDiff > 0) {
          const totalSeconds = Math.floor(timeDiff / 1000);
          const days = Math.floor(totalSeconds / (3600 * 24));
          const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);

          let countdownStr = "";
          if (days > 0) countdownStr += `${days}d `;
          if (hours > 0 || days > 0) countdownStr += `${hours}h `;
          countdownStr += `${minutes}m`;

          newCountdowns[appointment.id] = countdownStr.trim() + " remaining";
        } else {
          newCountdowns[appointment.id] = "Appointment time passed";
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.nextAppointment]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        <AlertCircle className="w-5 h-5 mr-2" />
        Failed to load dashboard data
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a99b7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#232323]">
              Welcome Back!
            </h1>
            <p className="text-[#82889c]">Here&apos;s your health summary</p>
          </div>
          <Link href="/user/find-doctors" className="w-full sm:w-auto md:hidden">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#3a99b7] text-white rounded-lg hover:bg-[#2d7a93] transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">Find Doctors</span>
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointments */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#232323]">
                Next Appointments
              </h2>
              <p className="text-[#82889c] text-sm">Upcoming schedules</p>
            </div>
            <Calendar className="w-5 h-5 text-[#3a99b7]" />
          </div>

          <div className="space-y-4">
            {data?.nextAppointment?.length > 0 ? (
              data.nextAppointment.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  countdown={countdowns[appointment.id]}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[#82889c] mx-auto mb-2" />
                <p className="text-[#82889c]">No upcoming appointments</p>
                <Link
                  href="/user/find-doctors"
                  className="text-[#3a99b7] text-sm hover:underline mt-2 inline-block"
                >
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#232323]">
                Recent Prescription
              </h2>
              <p className="text-[#82889c] text-sm">Latest medications</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/user/prescriptions"
                className="flex items-center gap-1 text-sm text-[#3a99b7] hover:text-[#2d7a93]"
              >
                Show All
                <ChevronRight className="w-4 h-4" />
              </Link>
              <FileText className="w-5 h-5 text-[#3a99b7]" />
            </div>
          </div>

          <div className="space-y-4">
            {data?.prescription ? (
              <PrescriptionCard prescription={data.prescription} />
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-[#82889c] mx-auto mb-2" />
                <p className="text-[#82889c]">No recent prescriptions</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#232323] mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/user/find-doctors">
              <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                <Calendar className="w-5 h-5 text-[#3a99b7] mb-2" />
                <h3 className="font-medium text-[#232323]">Book Appointment</h3>
                <p className="text-sm text-[#82889c]">Schedule a new visit</p>
              </button>
            </Link>
            <Link href="/user/medical-records">
              <button className="w-full p-4 rounded-lg border border-[#e2e2e2] hover:border-[#3a99b7] hover:bg-[#f8f7fe] transition-colors text-left">
                <FileText className="w-5 h-5 text-[#3a99b7] mb-2" />
                <h3 className="font-medium text-[#232323]">View Records</h3>
                <p className="text-sm text-[#82889c]">Access medical history</p>
              </button>
            </Link>
          </div>
        </div>

        {/* Featured Services */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#232323] mb-6">
            Featured Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <FeaturedBanner key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Specialized Services */}
        <div className="bg-white rounded-xl border border-black/10 p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[#232323] mb-6">
            Specialized Services
          </h2>
          <ScrollableServices services={specializedServices} />
        </div>
      </div>
    </div>
  );
}
