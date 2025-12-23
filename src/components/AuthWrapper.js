"use client";

import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthWrapper({ children }) {
  const { user, loading } = useUser(); // Assume your context provides a 'loading' state
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"]; // Add your public paths here

  // 1. Show nothing while checking auth state (optional, better than flash)
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // 2. If user is NOT logged in AND trying to access a protected route ➡ redirect to login
  if (!user && !publicRoutes.includes(pathname)) {
    router.push("/login");
    return null; // Render nothing during redirect
  }

  // 3. If user IS logged in AND trying to access login/signup ➡ redirect to dashboard
  if (user && publicRoutes.includes(pathname)) {
    router.push("/dashboard"); // Or your main app page
    return null;
  }

  // 4. Otherwise, render the children (page content)
  return <>{children}</>;
}