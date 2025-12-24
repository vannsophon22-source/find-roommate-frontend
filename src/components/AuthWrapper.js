"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // ⛔ wait for hydration

    if (!user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
    }
  }, [user, loading, pathname, router]);

  // ✅ While loading, render nothing (or spinner)
  if (loading) return null;

  // ✅ If unauthenticated and on protected route
  if (!user && pathname !== "/login" && pathname !== "/register") {
    return null;
  }

  return children;
}
