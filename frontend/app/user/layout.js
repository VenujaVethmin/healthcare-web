
import Navbar from "@/components/UserComponents/navbar";
import Sidebar from "@/components/UserComponents/sidebar";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="md:pl-[205px]">
        {" "}
        {/* Sidebar width offset */}
        <Navbar />
        <main className="md:pt-16 px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Navbar height offset */}
          <div className="max-w-7xl mx-auto pt-4 pb-20 ">{children}</div>
        </main>
        <Toaster />
      </div>
    </div>
  );
}
