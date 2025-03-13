"use client";

import { motion } from "framer-motion";
import {
  Search,
  Clock,
  CheckCircle,
  MessageSquare,
  Activity,
} from "lucide-react";
import Link from "next/link";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Pediatric Specialist",
    experience: "12 years experience",
    avatar: "https://i.pravatar.cc/65?img=1",
    badge: "Pediatric",
    schedule: "Mon, Wed, Fri",
    timing: "09:00 AM-05:00 PM",
    fee: "2500",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cardiology Specialist",
    experience: "15 years experience",
    avatar: "https://i.pravatar.cc/65?img=2",
    badge: "Cardiology",
    schedule: "Tue, Thu",
    timing: "10:00 AM-06:00 PM",
    fee: "3000",
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    specialty: "Dental Surgeon",
    experience: "8 years experience",
    avatar: "https://i.pravatar.cc/65?img=3",
    badge: "Dentistry",
    schedule: "Wed, Sat",
    timing: "11:00 AM-07:00 PM",
    fee: "2800",
  },
];

const features = [
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access healthcare services anytime, anywhere",
  },
  {
    icon: CheckCircle,
    title: "Verified Doctors",
    description: "All our doctors are verified professionals",
  },
  {
    icon: MessageSquare,
    title: "Instant Consultation",
    description: "Connect with doctors instantly",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#e2e2e2] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3a99b7] to-[#2d7a93] flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#3a99b7] to-[#2d7a93] bg-clip-text text-transparent">
                Healthi
              </span>
            </Link>

            <p> patient section here <Link href={"/user/dashboard"}>[click]</Link></p>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="hidden md:inline-flex text-gray-600 hover:text-[#3a99b7] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-[#3a99b7] text-white px-6 py-2 rounded-lg hover:bg-[#2d7a93] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#3a99b7] to-[#2d7a93] text-white rounded-2xl p-12 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Quality Healthcare at Your Fingertips
                </h1>
                <p className="text-xl text-white/80">
                  Connect with top doctors online for consultations anytime,
                  anywhere
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/40?img=${i}`}
                        alt={`Doctor ${i}`}
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-white/80">+180 doctors online</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-xl">
                <h3 className="text-gray-800 text-xl font-semibold mb-4">
                  Find your doctor
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center bg-gray-50 rounded-lg p-2">
                    <input
                      type="text"
                      placeholder="Search by name, specialty..."
                      className="w-full px-4 py-2 bg-transparent outline-none text-gray-800"
                    />
                    <button className="bg-[#3a99b7] text-white p-2 rounded-lg hover:bg-[#2d7a93] transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Pediatric", "Cardiology", "Dentistry", "Neurology"].map(
                      (specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-[#eafefa] text-[#3a99b7] rounded-full text-sm cursor-pointer hover:bg-[#3a99b7] hover:text-white transition-colors"
                        >
                          {specialty}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Doctors Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Specialists</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Book appointments with qualified doctors and specialists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                    <span className="inline-block px-3 py-1 bg-[#eafefa] text-[#3a99b7] rounded-full text-xs mt-2">
                      {doctor.badge}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{doctor.schedule}</p>
                      <p className="text-gray-500">{doctor.timing}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">LKR {doctor.fee}</p>
                      <p className="text-gray-500">Per Visit</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-[#3a99b7] text-white py-2 rounded-lg hover:bg-[#2d7a93] transition-colors">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the best healthcare service with our platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#eafefa] rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#3a99b7]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
