"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function News() {
  const newsArticles = [
    {
      id: 1,
      title: "New Advanced Medical Center Opening Soon",
      excerpt:
        "State-of-the-art medical facility set to open its doors next month, featuring cutting-edge technology and specialized care units.",
      image:
        "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=2940",
      date: "April 25, 2024",
      readTime: "5 min read",
      category: "Facility Updates",
      tags: ["Healthcare", "Technology", "Innovation"],
    },
    {
      id: 2,
      title: "Breakthrough in Telemedicine Services",
      excerpt:
        "Our platform now offers enhanced virtual consultations with improved diagnostic capabilities and real-time monitoring.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2940",
      date: "April 23, 2024",
      readTime: "4 min read",
      category: "Technology",
      tags: ["Telemedicine", "Digital Health", "Patient Care"],
    },
    {
      id: 3,
      title: "Healthcare Excellence Award 2024",
      excerpt:
        "Healthi recognized for outstanding patient care and innovative healthcare solutions at annual healthcare summit.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2940",
      date: "April 20, 2024",
      readTime: "3 min read",
      category: "Awards",
      tags: ["Achievement", "Healthcare", "Recognition"],
    },
    {
      id: 4,
      title: "New Specialist Doctors Join Our Team",
      excerpt:
        "Welcome our new team of specialist doctors bringing expertise in cardiology, neurology, and pediatric care.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2940",
      date: "April 18, 2024",
      readTime: "4 min read",
      category: "Team Updates",
      tags: ["Doctors", "Specialists", "Healthcare Team"],
    },
  ];

  const categories = [
    "All News",
    "Facility Updates",
    "Technology",
    "Awards",
    "Team Updates",
    "Patient Stories",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eafefa] to-white">
      {/* Header Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-[#232323] mb-6">
              News & Media
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Stay updated with the latest healthcare news, facility updates,
              and achievements.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {categories.map((category, index) => (
              <button
                key={index}
                className="px-6 py-2 rounded-full bg-white text-[#3a99b7] hover:bg-[#3a99b7] hover:text-white transition-colors shadow-sm"
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* News Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1 rounded-full bg-white/90 text-[#3a99b7] text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-[#232323] mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#3a99b7]" />
                      <div className="flex gap-2">
                        {article.tags.map((tag, index) => (
                          <span key={index} className="text-sm text-[#3a99b7]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/news/${article.id}`}
                      className="flex items-center gap-1 text-[#3a99b7] hover:gap-2 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
