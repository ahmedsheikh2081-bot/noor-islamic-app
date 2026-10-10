import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { toast } from "react-toastify";
import { auth } from "../firebase";

import logo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const {
    login,
    updateUserProfile,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==========================================
  // Firebase Error Messages
  // ==========================================
  const getFirebaseError = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";

      case "auth/user-disabled":
        return "This account has been disabled.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      case "auth/popup-closed-by-user":
        return "Google login was cancelled.";

      case "auth/popup-blocked":
        return "Google login popup was blocked. Please allow popups.";

      case "auth/cancelled-popup-request":
        return "Google login was cancelled.";

      default:
        return "Something went wrong. Please try again.";
    }
  };

  // ==========================================
  // Email / Password Login
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      await login(email, password);

      toast.success(
        "Login successful! Welcome back to Noor.",
        {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      setError(getFirebaseError(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Google Login
  // ==========================================
  const handleGoogleLogin = async () => {
    try {
      setError("");
      setIsGoogleLoading(true);

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      // Firebase Google popup
      const result = await signInWithPopup(
        auth,
        provider
      );

      const firebaseUser = result.user;

      if (!firebaseUser) {
        throw new Error(
          "Google account could not be authenticated."
        );
      }

      // ==========================================
      // IMPORTANT:
      // AuthContext / Firestore profile sync
      // ==========================================
      await updateUserProfile({
        name:
          firebaseUser.displayName || "",
        email:
          firebaseUser.email || "",
        photoURL:
          firebaseUser.photoURL || "",
      });

      toast.success(
        "Google login successful! Welcome back to Noor.",
        {
          position: "bottom-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Small delay gives Firebase/AuthContext
      // enough time to finish updating state.
      await new Promise((resolve) =>
        setTimeout(resolve, 150)
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setError(
        getFirebaseError(error.code)
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50">
      {/* =====================================================
          PAGE BACKGROUND
      ===================================================== */}

      <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-8 sm:px-6 sm:py-10">

        {/* Background glow */}

        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-2">

          {/* =================================================
              LEFT BRAND PANEL - DESKTOP
          ================================================= */}

          <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between">

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 rounded-2xl transition-transform duration-200 active:scale-[0.97]"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Noor Islamic"
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight">
                    Noor Islamic
                  </p>

                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Guidance • Knowledge • Peace
                  </p>
                </div>
              </Link>
            </div>

            <div className="relative max-w-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-500/10 text-emerald-400">
                <BookOpen className="h-7 w-7" />
              </div>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold leading-tight text-white">
                Continue your Islamic journey with Noor.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400">
                Keep your Quran bookmarks, duas, tasbeeh and Islamic
                activities connected in one peaceful place.
              </p>
            </div>

            <div className="relative flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />

              Your account stays protected
            </div>
          </div>

          {/* =================================================
              RIGHT LOGIN AREA
          ================================================= */}

          <div className="flex items-center p-5 sm:p-8 lg:p-12">
            <div className="mx-auto w-full max-w-md">

              {/* MOBILE BRAND */}

              <div className="mb-8 lg:hidden">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-3 rounded-2xl transition-transform duration-200 active:scale-[0.97]"
                >
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={logo}
                      alt="Noor Islamic"
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-lg font-bold tracking-tight text-slate-800">
                      Noor Islamic
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                      Guidance • Knowledge • Peace
                    </p>
                  </div>
                </Link>
              </div>

              {/* HEADER */}

              <div className="mb-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <Sparkles
                    size={13}
                    className="text-emerald-600"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    Welcome Back
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                  Login to Noor
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Continue your peaceful Islamic journey.
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                  <span>{error}</span>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="group relative">
                    <Mail className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={
                        isLoading ||
                        isGoogleLoading
                      }
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-600 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* OPTIONS */}

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-600"
                    />

                    <span className="text-xs font-medium text-slate-500">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Password recovery will be available soon."
                      )
                    }
                    className="rounded-md px-1 py-1 text-xs font-bold text-emerald-600 transition-colors hover:text-emerald-700 active:scale-[0.97]"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    isGoogleLoading
                  }
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Logging in...
                    </>
                  ) : (
                    <>
                      Login to Noor

                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* GOOGLE LOGIN */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={
                  isLoading ||
                  isGoogleLoading
                }
                className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isGoogleLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />

                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-base font-bold">
                      <span className="bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                        G
                      </span>
                    </span>

                    <span>
                      Continue with Google
                    </span>
                  </>
                )}
              </button>

              {/* SIGNUP */}

              <p className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="rounded-md px-1 py-1 font-bold text-emerald-600 transition-colors hover:text-emerald-700 active:text-emerald-800"
                >
                  Create Account
                </Link>
              </p>

              {/* BACK HOME */}

              <div className="mt-5 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-emerald-600 active:scale-[0.97]"
                >
                  ← Back to Noor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;