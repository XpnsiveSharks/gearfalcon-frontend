import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/_shared/components/NavBar";
import Footer from "@/app/_shared/components/Footer";
import { AuthProvider } from "@/app/_shared/hooks/useAuth";

export const metadata: Metadata = {
	title: "Gearfalcon",
	description: "Gearfalcon electromechanical services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>
					<NavBar/>
					<main>{children}</main>
					<Footer/>
				</AuthProvider>
			</body>
		</html>
	);
}

