"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/shared/hooks/useAuth";

type JwtPayload = {
	role?: string;
	[sub: string]: unknown;
};

function decodeJwt(token: string): JwtPayload | null {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = parts[1]
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const json = decodeURIComponent(
			atob(payload)
				.split("")
				.map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
				.join("")
		);
		return JSON.parse(json);
	} catch {
		return null;
	}
}

const FeaturesRedirectPage = () => {
	const router = useRouter();
	const { accessToken } = useAuth();

	useEffect(() => {
		if (!accessToken) {
			router.replace("/login");
			return;
		}
		const payload = decodeJwt(accessToken);
		const role = (payload?.role as string | undefined) || "";
		if (role.toLowerCase() === "admin") {
			router.replace("/features/admin");
		} else if (role.toLowerCase() === "customer") {
			router.replace("/features/customer");
		} else {
			// default to login if role is unknown
			router.replace("/login");
		}
	}, [accessToken, router]);

	return (
		<main className="min-h-[calc(100vh-4rem)] pt-24 px-4">
			<div className="mx-auto max-w-2xl">
				<p className="text-slate-600">Redirecting…</p>
			</div>
		</main>
	);
};

export default FeaturesRedirectPage;


