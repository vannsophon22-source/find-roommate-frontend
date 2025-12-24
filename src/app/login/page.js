// /app/login/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "owner") {
        router.push("/dashboard/owner");
      } else {
        router.push("/dashboard/user/homepage");
      }
    }
  }, [user, router]);

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
    
    // Mock password reset logic
    console.log(`Password reset requested for: ${email}`);
  };

  // If user is already logged in, show loading screen
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-6">
      <div className="bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl font-bold">Logo</span>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-white drop-shadow-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 backdrop-blur-sm transition"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-white drop-shadow-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 backdrop-blur-sm transition"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-white hover:text-yellow-200 transition underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition transform ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl"
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

        <div className="mt-8 pt-6 border-t border-white/30">
          <p className="text-center text-white/80 mb-4">
            Don't have an account?
          </p>
          <Link 
            href="/register" 
            className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-2xl shadow-lg text-center transition transform hover:scale-105 hover:shadow-2xl"
          >
            Create New Account
          </Link>
        </div>

        <div className="mt-8 p-4 bg-white/10 rounded-xl">
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

function Alert({ message, type = "success", onClose }) {
  const bgColor = type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg ${bgColor} z-50`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold text-xl leading-none hover:opacity-70 transition">&times;</button>
      </div>
    </div>
  );
}