
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Heart,
  Clock3,
  UserRound,
  LogOut,
  ArrowRight,
  Settings,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const bookmarks = useSelector(
    (state) => state.bookmark?.bookmarks || []
  );

  const quranBookmarks = bookmarks.filter(
    (item) =>
      item.type === "quran" ||
      item.type === "quran-ayah"
  );

  const duaBookmarks = bookmarks.filter(
    (item) => item.type === "dua"
  );

  // ================= USER NAME =================
  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Noor User";

  // ================= LOGOUT =================
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      // Pehle dashboard se bahar
      navigate("/", { replace: true });

      // Phir Firebase logout
      await logout();
    } catch (error) {
      console.error("Logout error:", error);

      navigate("/dashboard", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-77px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                Noor Islamic
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-800 sm:text-3xl">
                Dashboard
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Welcome back. Manage your Islamic journey, bookmarks and
            personalized activity from one place.
          </p>
        </div>

        {/* ================= PROFILE / WELCOME CARD ================= */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">

              {/* USER INFO */}
              <div className="flex items-start gap-4">

                {/* AVATAR */}
                <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm ring-4 ring-emerald-50">

                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={`${displayName} profile`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    {/* FALLBACK AVATAR */}
                    <div
                      className={`${
                        user?.photoURL ? "hidden" : "flex"
                      } h-full w-full items-center justify-center`}
                    >
                      <UserRound className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                    <UserRound className="h-3.5 w-3.5" />
                    Your Account
                  </div>

                  <h2 className="break-words text-2xl font-black text-slate-800 sm:text-3xl">
                    Assalamu Alaikum, {displayName} 👋
                  </h2>

                  {user?.email && (
                    <p className="mt-1 break-all text-sm text-slate-400">
                      {user.email}
                    </p>
                  )}

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    This is your personal Noor dashboard. Your saved content,
                    reading activity and personalized features will appear
                    here.
                  </p>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {loggingOut ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* BOOKMARKS */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Bookmark className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Saved
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-800">
              {bookmarks.length}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Bookmarks
            </p>

            <button
              type="button"
              onClick={() => navigate("/bookmarks")}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 transition hover:text-emerald-700"
            >
              View bookmarks
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* QURAN */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <BookOpen className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Quran
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-800">
              {quranBookmarks.length}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Saved Quran Items
            </p>

            <button
              type="button"
              onClick={() => navigate("/quran")}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-600 transition hover:text-sky-700"
            >
              Read Quran
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* DUAS */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Heart className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Personal
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-800">
              {duaBookmarks.length}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Saved Duas
            </p>

            <button
              type="button"
              onClick={() => navigate("/duas")}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-500 transition hover:text-rose-600"
            >
              Explore Duas
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* ACTIVITY */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Activity
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-800">
              0
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Recent Activity
            </p>

            <p className="mt-4 text-xs font-medium text-slate-400">
              Activity tracking coming soon
            </p>
          </div>
        </section>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
                Quick Access
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-800">
                Continue your Noor journey
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access your favorite Islamic resources.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            {/* QURAN */}
            <button
              type="button"
              onClick={() => navigate("/quran")}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-emerald-100 hover:bg-emerald-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                  Read Quran
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Continue reading
                </p>
              </div>

              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
            </button>

            {/* BOOKMARKS */}
            <button
              type="button"
              onClick={() => navigate("/bookmarks")}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-emerald-100 hover:bg-emerald-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Bookmark className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                  My Bookmarks
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  View saved content
                </p>
              </div>

              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
            </button>

            {/* SETTINGS */}
            <button
              type="button"
              onClick={() => navigate("/account-settings")}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-emerald-100 hover:bg-emerald-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm group-hover:text-emerald-600">
                <Settings className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                  Account Settings
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Manage your account
                </p>
              </div>

              <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
            </button>
          </div>
        </section>

        {/* ================= COMING SOON ================= */}
        <section className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <LayoutDashboard className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-black text-slate-800">
            Your personalized Noor journey
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            More personalized features will be added here, including reading
            progress, saved content, activity history and account settings.
          </p>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;

