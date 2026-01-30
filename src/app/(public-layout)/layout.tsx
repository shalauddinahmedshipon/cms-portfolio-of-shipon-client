import Navbar from "@/components/shared/Navbar";


export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <main
        className={` min-h-screen bg-gray-200 text-foreground antialiased`}
      >
      
           <Navbar />
          {children}

    
        
      </main>

  );
}
