// /app/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to appropriate dashboard
        if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else if (user.role === "owner") {
          router.push("/dashboard/owner");
        } else {
          router.push("/dashboard/user/homepage");
        }
      } else {
        // User is not logged in, redirect to login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}