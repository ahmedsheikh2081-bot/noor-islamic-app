import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  LogOut,
} from "lucide-react";

import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

function VerifyEmail() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    checkEmailVerification,
    resendVerificationEmail,
    logout,
  } = useAuth();

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  // =========================
  // IF USER IS NOT LOGGED IN
  // =========================
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", {
        replace: true,
      });
    }
  }, [user, loading, navigate]);

  // =========================
  // IF EMAIL ALREADY VERIFIED
  // =========================
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [user, loading, navigate]);

  // =========================
  // CHECK VERIFICATION
  // =========================
  const handleCheckVerification =
    async () => {
      try {
        setChecking(true);

        const verified =
          await checkEmailVerification();

        if (verified) {
          toast.success(
            "Email verified successfully! Welcome to Noor.",
            {
              position: "top-right",
              autoClose: 2500,
            }
          );

          navigate("/dashboard", {
            replace: true,
          });
        } else {
          toast.info(
            "Your email is not verified yet. Please check your inbox.",
            {
              position: "top-right",
              autoClose: 3500,
            }
          );
        }
      } catch (error) {
        console.error(
          "Verification check error:",
          error
        );

        toast.error(
          "Unable to check verification. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      } finally {
        setChecking(false);
      }
    };

  // =========================
  // RESEND EMAIL
  // =========================
  const handleResendEmail =
    async () => {
      try {
        setResending(true);

        await resendVerificationEmail();

        toast.success(
          "Verification email sent again. Please check your inbox.",
          {
            position: "top-right",
            autoClose: 3500,
          }
        );
      } catch (error) {
        console.error(
          "Resend email error:",
          error
        );

        if (
          error?.code ===
          "auth/too-many-requests"
        ) {
          toast.error(
            "Too many requests. Please wait a little before trying again.",
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        } else {
          toast.error(
            "Could not send verification email. Please try again.",
            {
              position: "top-right",
              autoClose: 3500,
            }
          );
        }
      } finally {
        setResending(false);
      }
    };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // WAIT FOR REDIRECT
  // =========================
  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50">
      <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10 sm:px-6">

        {/* Background Glow */}
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl" />

        {/* MAIN CARD */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

          {/* TOP GREEN AREA */}
          <div className="relative overflow-hidden bg-slate-950 px-6 py-10 text-center sm:px-10">

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* ICON */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-500/10 shadow-lg shadow-emerald-950/20">
              <Mail className="h-9 w-9 text-emerald-400" />
            </div>

            <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
              One More Step
            </p>

            <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Verify your email
            </h1>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              We sent a verification link to your email
              address. Please open it to activate your Noor
              account.
            </p>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">

            {/* EMAIL */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    Verification email
                  </p>

                  <p className="mt-1 break-all text-sm font-bold text-slate-700">
                    {user.email}
                  </p>
                </div>

              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="mt-6 space-y-4">

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-xs font-bold text-emerald-700">
                    1
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Open your email inbox and find the
                  verification email from Noor.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-xs font-bold text-emerald-700">
                    2
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Click the verification link inside the
                  email.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <span className="text-xs font-bold text-emerald-700">
                    3
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Come back here and click{" "}
                  <span className="font-bold text-slate-700">
                    Check Verification
                  </span>
                  .
                </p>
              </div>

            </div>

            {/* CHECK BUTTON */}
            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={checking || resending}
              className="group mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {checking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Check Verification
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* RESEND */}
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={checking || resending}
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  resending
                    ? "animate-spin"
                    : ""
                }`}
              />

              {resending
                ? "Sending..."
                : "Resend Verification Email"}
            </button>

            {/* HELP */}
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-slate-500">
                  Can't find the email? Check your{" "}
                  <span className="font-semibold text-slate-700">
                    Spam
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-slate-700">
                    Promotions
                  </span>{" "}
                  folder.
                </p>

              </div>
            </div>

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="mx-auto mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Use a different account
            </button>

            {/* HOME */}
            <div className="mt-3 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-600"
              >
                ← Back to Noor
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

export default VerifyEmail;