// /app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (!email || !password) {
      setAlert({ message: "Please enter email and password!", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // Mock login logic based on email
      let role = "user";
      if (email === "admin@example.com") role = "admin";
      else if (email === "owner@example.com") role = "owner";

      const loggedInUser = {
        id: 1,
        name: email.split("@")[0],
        email,
        avatar: "/users/default-avatar.svg",
        role,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("isLoggedIn", "true");

      // Update context
      if (setUser) setUser(loggedInUser);

      setAlert({ message: `Welcome ${loggedInUser.name} (${role})!`, type: "success" });

      // Redirect based on role
      setTimeout(() => {
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "owner") {
          router.push("/dashboard/owner");
        } else {
          router.push("/dashboard/user/homepage");
        }
      }, 1000);

    } catch (error) {
      setAlert({ message: "Login failed. Please try again.", type: "error" });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setAlert({ message: "Please enter your email first!", type: "error" });
      return;
    }
    
    setAlert({ 
      message: `Password reset link sent to ${email}. Check your email!`, 
      type: "success" 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-6">
      <div className="bg-white/20 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        {alert && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            alert.type === "success" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            <div className="flex justify-between items-center">
              <span>{alert.message}</span>
              <button 
                onClick={() => setAlert(null)} 
                className="ml-2 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">Logo</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-white">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-white hover:text-yellow-200 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/30">
          <p className="text-center text-white/80 mb-3">
            Don't have an account?
          </p>
          <Link 
            href="/register" 
            className="block w-full bg-white/20 text-white font-semibold py-3 rounded-xl text-center transition hover:bg-white/30"
          >
            Create New Account
          </Link>
        </div>

        <div className="mt-6 p-4 bg-white/10 rounded-xl">
          <p className="text-sm text-white/80 text-center mb-2">Demo Accounts:</p>
          <div className="text-xs text-white/70 space-y-1">
            <p>• Regular User: any email (e.g., user@example.com)</p>
            <p>• Admin: admin@example.com</p>
            <p>• Owner: owner@example.com</p>
            <p className="mt-1">Password: any (not validated in demo)</p>
          </div>
        </div>
      </div>
    </div>
  );
}