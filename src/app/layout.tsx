import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./shared/components/NavBar";
import Footer from "./shared/components/Footer";

export const metadata: Metadata = {
  title: "Gearfalcon",
  description: "Gearfalcon electromechanical services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  );
}

