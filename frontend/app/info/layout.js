
import FooterStaff from "@/components/footerStaff";
export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
     
      
        
          
          {/* Navbar height offset */}
          <div className="max-w-7xl mx-auto pt-4 pb-20 ">{children}</div>
          <FooterStaff/>
       
       
      
    </div>
  );
}
