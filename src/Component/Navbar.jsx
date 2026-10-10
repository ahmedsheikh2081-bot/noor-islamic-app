
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/logo.png";
import icos from "../assets/icos.png";

import { useAuth } from "../context/AuthContext";

import {
  Home,
  BookOpen,
  ScrollText,
  HandHeart,
  CircleGauge,
  BookmarkCheck,
  Search,
  Bell,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
  Compass,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const bookmarks = useSelector(
    (state) => state.bookmark?.bookmarks || []
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [animatedText, setAnimatedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef(null);

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Quran",
      path: "/quran",
      icon: BookOpen,
    },
    {
      name: "Hadith",
      path: "/hadith",
      icon: ScrollText,
    },
    {
      name: "Duas",
      path: "/duas",
      icon: HandHeart,
    },
    {
      name: "Tasbeeh",
      path: "/tasbeeh",
      icon: CircleGauge,
    },
    {
      name: "Qibla",
      path: "/qibla",
      icon: Compass,
    },
  ];

  const searchSuggestions = [
    {
      title: "Quran",
      description: "Search Quran and Surahs",
      query: "quran",
      icon: BookOpen,
    },
    {
      title: "Duas",
      description: "Find Duas and supplications",
      query: "dua",
      icon: HandHeart,
    },
    {
      title: "Hadith",
      description: "Explore Hadith collections",
      query: "hadith",
      icon: ScrollText,
    },
    {
      title: "Surahs",
      description: "Find a Surah by name",
      query: "surah",
      icon: BookOpen,
    },
  ];

  const searchWords = [
    "Search Quran...",
    "Find a Surah...",
    "Search Duas...",
    "Search Hadith...",
  ];

  // ================= TYPING PLACEHOLDER =================
  useEffect(() => {
    const currentWord = searchWords[wordIndex];
    const typingSpeed = isDeleting ? 45 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setAnimatedText(
          currentWord.substring(0, animatedText.length + 1)
        );

        if (animatedText.length === currentWord.length) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1200);
        }
      } else {
        setAnimatedText(
          currentWord.substring(0, animatedText.length - 1)
        );

        if (animatedText.length === 0) {
          setIsDeleting(false);

          setWordIndex(
            (prev) => (prev + 1) % searchWords.length
          );
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    animatedText,
    isDeleting,
    wordIndex,
  ]);

  // ================= CLOSE PROFILE ON OUTSIDE CLICK =================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [profileOpen]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      navigate("/", {
        replace: true,
      });

      await logout();

      setProfileOpen(false);
      setMenuOpen(false);
      setSearchOpen(false);
      setSearch("");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      navigate("/", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(
      `/search?q=${encodeURIComponent(query)}`
    );

    setSearch("");
    setSearchOpen(false);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSuggestion = (query) => {
    navigate(
      `/search?q=${encodeURIComponent(query)}`
    );

    setSearch("");
    setSearchOpen(false);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const filteredSuggestions = search
    ? searchSuggestions.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          item.description
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      )
    : searchSuggestions;

  // ================= CLOSE MENUS =================
  const closeAllMenus = () => {
    setProfileOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // ================= ANIMATED PLACEHOLDER =================
  const AnimatedPlaceholder = ({
    mobile = false,
  }) => (
    <span
      className={`pointer-events-none absolute ${
        mobile
          ? "left-0 text-sm"
          : "left-0 text-[12px]"
      } top-1/2 z-0 -translate-y-1/2 whitespace-nowrap text-slate-400`}
    >
      {animatedText}

      <span className="ml-0.5 inline-block h-3.5 w-[1px] translate-y-[2px] animate-pulse bg-emerald-500" />
    </span>
  );

  return (
    <>
      {/* =========================================================
          DESKTOP NAVBAR
      ========================================================= */}
      <header className="fixed left-0 right-0 top-0 z-50 hidden bg-white lg:block">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="flex h-[84px] items-center">

            {/* ================= LOGO ================= */}
            <Link
              to="/"
              onClick={closeAllMenus}
              className="group flex shrink-0 items-center"
            >
              <img
                src={logo}
                alt="Noor Islamic"
                className="h-[68px] w-auto max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="mx-6 h-9 w-px shrink-0 bg-slate-200" />

            {/* ================= NAV LINKS ================= */}
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <div className="flex items-center gap-0.5">

                {navLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={closeAllMenus}
                      className={({ isActive }) =>
                        `group flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                        }`
                      }
                    >
                      <Icon className="h-[15px] w-[15px] shrink-0" />

                      <span className="whitespace-nowrap">
                        {link.name}
                      </span>
                    </NavLink>
                  );
                })}

                {/* ================= BOOKMARKS ================= */}
                <NavLink
                  to="/bookmarks"
                  onClick={closeAllMenus}
                  className={({ isActive }) =>
                    `group flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[12px] font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                    }`
                  }
                >
                  <BookmarkCheck className="h-[15px] w-[15px] shrink-0" />

                  <span className="whitespace-nowrap">
                    Bookmarks
                  </span>

                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      bookmarks.length > 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {bookmarks.length > 9
                      ? "9+"
                      : bookmarks.length}
                  </span>
                </NavLink>
              </div>
            </div>

            {/* ================= RIGHT ACTIONS ================= */}
            <div className="ml-8 flex shrink-0 items-center gap-2">

              {/* ================= SEARCH ================= */}
              <div className="relative">
                <form
                  onSubmit={handleSearch}
                  className={`flex h-10 items-center overflow-hidden rounded-xl border bg-slate-50 transition-all duration-200 ${
                    searchOpen
                      ? "w-[190px] border-emerald-200 bg-white shadow-sm"
                      : "w-10 border-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(
                        (prev) => !prev
                      );

                      if (!searchOpen) {
                        setProfileOpen(false);
                      }
                    }}
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <Search className="h-[17px] w-[17px]" />
                  </button>

                  {searchOpen && (
                    <div className="relative flex min-w-0 flex-1 items-center pr-3">

                      {!search && (
                        <AnimatedPlaceholder />
                      )}

                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        autoFocus
                        className="relative z-10 w-full bg-transparent text-[12px] font-medium text-slate-700 outline-none placeholder:text-transparent"
                      />

                      {search && (
                        <button
                          type="button"
                          onClick={
                            clearSearch
                          }
                          className="relative z-20 ml-1 text-xs font-bold text-slate-400 hover:text-slate-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </form>

                {/* SEARCH SUGGESTIONS */}
                {searchOpen && (
                  <div className="absolute right-0 top-[48px] w-[280px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50">

                    <div className="px-3 pb-2 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Quick Search
                      </p>
                    </div>

                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map(
                        (item) => {
                          const Icon =
                            item.icon;

                          return (
                            <button
                              key={
                                item.title
                              }
                              type="button"
                              onClick={() =>
                                handleSuggestion(
                                  item.query
                                )
                              }
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-emerald-50"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Icon className="h-4 w-4" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-[12px] font-bold text-slate-700">
                                  {
                                    item.title
                                  }
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                  {
                                    item.description
                                  }
                                </p>
                              </div>
                            </button>
                          );
                        }
                      )
                    ) : (
                      <div className="px-3 py-5 text-center">
                        <p className="text-xs font-medium text-slate-400">
                          No results found
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ================= BELL ================= */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                <Bell className="h-[17px] w-[17px]" />
              </button>

              {/* ================= PROFILE ================= */}
              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(
                      (prev) => !prev
                    );

                    setSearchOpen(false);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    profileOpen
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  <UserRound className="h-[17px] w-[17px]" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[48px] w-[240px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50">

                    {/* ================= LOGGED IN ================= */}
                    {user ? (
                      <>
                        <div className="mb-2 rounded-xl bg-emerald-50 px-3 py-3">
                          <p className="text-[12px] font-bold text-emerald-700">
                            Welcome back
                          </p>

                          <p className="mt-1 truncate text-[10px] leading-4 text-slate-500">
                            {user.name ||
                              user.email}
                          </p>

                          {user.name && (
                            <p className="mt-0.5 truncate text-[9px] text-slate-400">
                              {
                                user.email
                              }
                            </p>
                          )}
                        </div>

                        {/* DASHBOARD */}
                        <Link
                          to="/dashboard"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <LayoutDashboard className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Dashboard
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                              Your personal
                              dashboard
                            </p>
                          </div>
                        </Link>

                        {/* BOOKMARKS */}
                        <Link
                          to="/bookmarks"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <BookmarkCheck className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Bookmarks
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                              Your saved
                              content
                            </p>
                          </div>
                        </Link>

                        {/* ACCOUNT SETTINGS */}
                        <Link
                          to="/account-settings"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <Settings className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Account Settings
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                              Manage your
                              account
                            </p>
                          </div>
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        {/* LOGOUT */}
                        <button
                          type="button"
                          disabled={
                            loggingOut
                          }
                          onClick={
                            handleLogout
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                            <LogOut className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              {loggingOut
                                ? "Logging out..."
                                : "Logout"}
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-red-300">
                              Sign out from
                              your account
                            </p>
                          </div>
                        </button>
                      </>
                    ) : (
                      /* ================= LOGGED OUT ================= */
                      <>
                        <div className="mb-2 rounded-xl bg-slate-50 px-3 py-3">
                          <p className="text-[12px] font-bold text-slate-700">
                            Welcome to Noor
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-slate-400">
                            Login to save your
                            Islamic journey
                            and access your
                            dashboard.
                          </p>
                        </div>

                        {/* LOGIN */}
                        <Link
                          to="/login"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <LogIn className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Login
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                              Access your
                              account
                            </p>
                          </div>
                        </Link>

                        {/* SIGN UP */}
                        <Link
                          to="/signup"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <UserPlus className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-bold">
                              Create Account
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                              Join Noor today
                            </p>
                          </div>
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        {/* BOOKMARKS */}
                        <Link
                          to="/bookmarks"
                          onClick={
                            closeAllMenus
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <BookmarkCheck className="h-4 w-4" />
                          Bookmarks
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* =================================================
                  LOGIN + SIGN UP
                  ONLY SHOW WHEN USER IS LOGGED OUT
              ================================================= */}
              {!user && (
                <>
                  {/* LOGIN BUTTON */}
                  <Link
                    to="/login"
                    onClick={closeAllMenus}
                    className="hidden xl:inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <LogIn className="h-4 w-4" />

                    <span>
                      Login
                    </span>
                  </Link>

                  {/* SIGN UP BUTTON */}
                  <Link
                    to="/signup"
                    onClick={closeAllMenus}
                    className="hidden xl:inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-[11px] font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <UserPlus className="h-4 w-4" />

                    <span>
                      Sign Up
                    </span>
                  </Link>
                </>
              )}

              {/* ================= READ QURAN ================= */}
              <Link
                to="/quran"
                onClick={closeAllMenus}
                className="group flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-[11px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700"
              >
                <BookOpen className="h-4 w-4" />

                <span className="whitespace-nowrap">
                  Read Quran
                </span>

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </header>

      {/* =========================================================
          MOBILE NAVBAR
      ========================================================= */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-white lg:hidden">
        <div className="px-4">
          <div className="relative flex h-[76px] items-center justify-between">

            {/* ================= LEFT ================= */}
            <Link
              to="/"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className="group flex items-center"
            >
              <img
                src={logo}
                alt="Noor Islamic"
                className="h-16 w-auto max-w-[190px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* ================= CENTER ================= */}
            <Link
              to="/"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <img
                src={icos}
                alt="Noor"
                className="mr-10 h-[240px] w-[300px] object-contain"
              />
            </Link>

            {/* ================= RIGHT ================= */}
            <div className="flex items-center gap-1.5">

              {/* BOOKMARKS */}
              <Link
                to="/bookmarks"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-emerald-600"
              >
                <BookmarkCheck className="h-5 w-5" />

                {bookmarks.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[8px] font-bold text-white">
                    {bookmarks.length > 9
                      ? "9+"
                      : bookmarks.length}
                  </span>
                )}
              </Link>

              {/* SEARCH */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(
                    (prev) => !prev
                  );

                  setMenuOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  searchOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                }`}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* MENU */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(
                    (prev) => !prev
                  );

                  setSearchOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  menuOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                }`}
              >
                {menuOpen ? (
                  <X className="h-[22px] w-[22px]" />
                ) : (
                  <Menu className="h-[22px] w-[22px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE SEARCH
        ===================================================== */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-2">

            <form
              onSubmit={handleSearch}
              className="relative flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3"
            >
              <Search className="mr-2 h-4 w-4 shrink-0 text-slate-400" />

              <div className="relative flex min-w-0 flex-1 items-center">

                {!search && (
                  <AnimatedPlaceholder mobile />
                )}

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  autoFocus
                  className="relative z-10 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-transparent"
                />
              </div>

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-2 text-sm font-bold text-slate-400"
                >
                  ×
                </button>
              )}
            </form>

            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">

              {filteredSuggestions.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        handleSuggestion(
                          item.query
                        )
                      }
                      className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-emerald-50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {
                            item.description
                          }
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}
        {menuOpen && (
          <div className="fixed left-0 right-0 top-[77px] max-h-[calc(100vh-77px)] overflow-y-auto border-t border-slate-100 bg-white shadow-xl">

            <div className="px-4 pb-6 pt-4">

              {/* ================= EXPLORE ================= */}
              <div className="mb-5">

                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Explore
                </p>

                <div className="grid grid-cols-2 gap-2">

                  {navLinks.map((link) => {
                    const Icon =
                      link.icon;

                    return (
                      <NavLink
                        key={
                          link.path
                        }
                        to={
                          link.path
                        }
                        onClick={() =>
                          setMenuOpen(
                            false
                          )
                        }
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl border p-3 transition ${
                            isActive
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                          }`
                        }
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                          <Icon className="h-4 w-4" />
                        </div>

                        <span className="text-xs font-semibold">
                          {
                            link.name
                          }
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              {/* ================= BOOKMARKS ================= */}
              <Link
                to="/bookmarks"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="mb-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-emerald-50"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <BookmarkCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Bookmarks
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Your saved content
                    </p>
                  </div>
                </div>

                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-100 px-2 text-[10px] font-bold text-emerald-700">
                  {bookmarks.length}
                </span>
              </Link>

              {/* ================= QIBLA ================= */}
              <Link
                to="/qibla"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="mt-2 flex items-center justify-between rounded-2xl bg-emerald-600 p-4 text-white shadow-sm transition hover:bg-emerald-700"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <Compass className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Qibla Compass
                    </p>

                    <p className="mt-0.5 text-[10px] text-emerald-100">
                      Find the direction of Qibla
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4" />
              </Link>

              {/* ================= ACCOUNT ================= */}
              <div className="mt-5">

                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Account
                </p>

                {/* DASHBOARD */}
                <Link
                  to="/dashboard"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mb-2 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 transition hover:bg-emerald-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Dashboard
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Your personal dashboard
                    </p>
                  </div>
                </Link>

                {/* ACCOUNT SETTINGS */}
                {user && (
                  <Link
                    to="/account-settings"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="mb-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 transition hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Settings className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Account Settings
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Manage your account
                      </p>
                    </div>
                  </Link>
                )}

                {/* MOBILE LOGOUT */}
                {user && (
                  <button
                    type="button"
                    disabled={
                      loggingOut
                    }
                    onClick={
                      handleLogout
                    }
                    className="mb-2 flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-3 text-left transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm">
                      <LogOut className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-red-600">
                        {loggingOut
                          ? "Logging out..."
                          : "Logout"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-red-400">
                        Sign out from
                        your account
                      </p>
                    </div>
                  </button>
                )}

                {/* ================= MOBILE LOGIN ================= */}
                {!user && (
                  <Link
                    to="/login"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="mb-2 flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <LogIn className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Login
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Access your account
                      </p>
                    </div>
                  </Link>
                )}

                {/* ================= MOBILE SIGN UP ================= */}
                {!user && (
                  <Link
                    to="/signup"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-emerald-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <UserPlus className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Create Account
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Join Noor today
                      </p>
                    </div>
                  </Link>
                )}
              </div>

              {/* ================= READ QURAN ================= */}
              <Link
                to="/quran"
                onClick={() =>
                  setMenuOpen(false)
                }
                className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white"
              >
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <BookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Read Quran
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Continue your Quran journey
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4" />
              </Link>

              {/* ================= MOBILE FOOTER ================= */}
              <div className="mt-6 border-t border-slate-100 pt-4 text-center">

                <p className="text-[10px] font-medium text-slate-400">
                  Noor Islamic
                </p>

                <p className="mt-1 text-[9px] text-slate-300">
                  Your peaceful Islamic companion
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </header>

      {/* ================= NAVBAR SPACING ================= */}
      <div className="h-[85px] w-full" />
    </>
  );
}

export default Navbar;
