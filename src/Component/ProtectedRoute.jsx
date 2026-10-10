import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  LogIn,
  X,
  ShieldCheck,
  Sparkles,
  MailCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // =========================
  // WAIT FOR FIREBASE AUTH
  // =========================
  useEffect(() => {
    if (loading) {
      setAuthReady(false);
      return;
    }

    // Firebase auth state completely checked
    setAuthReady(true);

    // User login nahi hai
    if (!user) {
      setShowPopup(true);
      return;
    }

    // User login hai lekin email verify nahi
    if (user.emailVerified === false) {
      setShowPopup(false);

      navigate("/verify-email", {
        replace: true,
      });

      return;
    }

    // User verified hai
    setShowPopup(false);
  }, [loading, user, navigate]);

  // =========================
  // AUTH CHECKING
  // =========================
  if (!authReady || loading) {
    return (
      <div className="flex min-h-[calc(100vh-77px)] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // USER NOT LOGGED IN
  // =========================
  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-77px)] items-center justify-center bg-slate-50 px-4">
        {showPopup && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
          >
            {/* POPUP */}
            <div
              className="
                relative
                w-full
                max-w-md
                overflow-hidden
                rounded-[28px]
                border
                border-white/70
                bg-white
                shadow-[0_25px_80px_rgba(15,23,42,0.25)]
                animate-[popupIn_0.45s_cubic-bezier(0.16,1,0.3,1)]
              "
            >
              {/* GLOW */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 animate-pulse rounded-full bg-emerald-300/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-emerald-200/25 blur-3xl" />

              {/* CLOSE */}
              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);

                  setTimeout(() => {
                    navigate("/");
                  }, 180);
                }}
                className="
                  absolute
                  right-4
                  top-4
                  z-20
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-500
                  transition-all
                  duration-200
                  hover:rotate-90
                  hover:bg-slate-200
                  hover:text-slate-800
                  active:scale-90
                "
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative px-6 pb-7 pt-9 sm:px-8">
                {/* ICON */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-[22px] bg-emerald-200/50" />

                    <div
                      className="
                        relative
                        flex
                        h-[76px]
                        w-[76px]
                        animate-[iconFloat_2.8s_ease-in-out_infinite]
                        items-center
                        justify-center
                        rounded-[22px]
                        bg-gradient-to-br
                        from-emerald-50
                        to-emerald-100
                        text-emerald-600
                        shadow-lg
                        shadow-emerald-500/10
                        ring-8
                        ring-emerald-50/60
                      "
                    >
                      <LockKeyhole
                        size={32}
                        strokeWidth={2}
                      />

                      <Sparkles
                        size={15}
                        className="absolute -right-1 -top-1 animate-pulse text-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* HEADING */}
                <div className="mt-8 text-center">
                  <h2
                    id="login-required-title"
                    className="
                      animate-[textIn_0.55s_ease-out]
                      text-2xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      sm:text-[27px]
                    "
                  >
                    Login Required
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-3
                      max-w-sm
                      animate-[textIn_0.65s_ease-out]
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    Please login to your Noor account to
                    access your personal dashboard and
                    account information.
                  </p>
                </div>

                {/* SECURITY CARD */}
                <div
                  className="
                    mt-6
                    flex
                    animate-[slideUp_0.55s_ease-out]
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-emerald-100
                    bg-emerald-50/70
                    p-4
                  "
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Your account is protected
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Login to continue securely.
                    </p>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="
                    mt-6
                    flex
                    w-full
                    animate-[slideUp_0.65s_ease-out]
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-emerald-600
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    shadow-emerald-600/20
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-emerald-700
                    hover:shadow-xl
                    hover:shadow-emerald-600/25
                    active:translate-y-0
                    active:scale-[0.98]
                  "
                >
                  <LogIn size={18} />
                  Login to Continue
                </button>

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);

                    setTimeout(() => {
                      navigate("/");
                    }, 180);
                  }}
                  className="
                    mt-3
                    w-full
                    animate-[slideUp_0.75s_ease-out]
                    rounded-2xl
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-slate-500
                    transition-all
                    duration-200
                    hover:bg-slate-100
                    hover:text-slate-800
                    active:scale-[0.98]
                  "
                >
                  Cancel
                </button>

                {/* FOOTER */}
                <p className="mt-5 text-center text-[11px] font-medium tracking-wide text-slate-400">
                  Noor Islamic • Guidance • Knowledge • Peace
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ANIMATIONS */}
        <style>
          {`
            @keyframes popupIn {
              0% {
                opacity: 0;
                transform: translateY(35px) scale(0.88);
              }

              60% {
                opacity: 1;
                transform: translateY(-5px) scale(1.02);
              }

              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes iconFloat {
              0%,
              100% {
                transform: translateY(0);
              }

              50% {
                transform: translateY(-5px);
              }
            }

            @keyframes textIn {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }

              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes slideUp {
              0% {
                opacity: 0;
                transform: translateY(15px);
              }

              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // =========================
  // EMAIL NOT VERIFIED
  // =========================
  if (user.emailVerified === false) {
    return (
      <div className="flex min-h-[calc(100vh-77px)] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <MailCheck className="h-6 w-6 text-emerald-600" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Redirecting to email verification...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // VERIFIED USER
  // =========================
  return children;
}

export default ProtectedRoute;