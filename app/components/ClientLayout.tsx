"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import WhatsappButton from "./WhatsappButton";
import SplashScreen from "./SplashScreen";

export default function ClientLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/invoice");
  const isVerify = pathname === "/checkout/verify";

  return (
    <>
      {!isAdmin && <SplashScreen />}
      {!isAdmin && !isVerify && <Navbar />}
      {children}
      {!isAdmin && !isVerify && footer}
      {!isAdmin && !isVerify && <WhatsappButton />}
    </>
  );
}
