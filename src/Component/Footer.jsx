import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  BookmarkCheck,
  Compass,
  HandHeart,
  Mail,
  ScrollText,
} from "lucide-react";

import logo from "../assets/logo.png";

function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Quran", path: "/quran" },
    { name: "Hadith", path: "/hadith" },
    { name: "Duas", path: "/duas" },
    { name: "Tasbeeh", path: "/tasbeeh" },
    { name: "Qibla", path: "/qibla" },
  ];

  const exploreLinks = [
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Read Quran", path: "/quran" },
    { name: "Daily Duas", path: "/duas" },
    { name: "Find Qibla", path: "/qibla" },
  ];

  return (
    <footer className="mt-20 overflow-hidden bg-slate-950 text-white">
      {/* TOP ACCENT */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-700" />

      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">

          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3 transition-transform duration-200 active:scale-[0.97]"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-emerald-500/20 group-active:scale-95">
                <img
                  src={logo}
                  alt="Noor Islamic"
                  className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Noor Islamic
                </h2>

                <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-400">
                  GUIDANCE • KNOWLEDGE • PEACE
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              A peaceful Islamic learning platform to explore the Quran,
              Hadith, Duas, Tasbeeh and Qibla in one place.
            </p>

            <Link
              to="/quran"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:text-emerald-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
            >
              Start Reading Quran
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h3>

            <div className="mt-6 space-y-3.5">
              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group flex w-fit items-center gap-2 rounded-md px-1 py-1 text-sm text-slate-400 transition-all duration-200 hover:bg-emerald-500/5 hover:text-emerald-400 active:scale-[0.97] active:text-emerald-300"
                >
                  {item.name}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Explore
            </h3>

            <div className="mt-6 space-y-3.5">
              {exploreLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="group flex w-fit items-center gap-2 rounded-md px-1 py-1 text-sm text-slate-400 transition-all duration-200 hover:bg-emerald-500/5 hover:text-emerald-400 active:scale-[0.97] active:text-emerald-300"
                >
                  {item.name}

                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* AUTHOR */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              About the Creator
            </h3>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.05]">
              {/* Creator */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-300 hover:bg-emerald-500/20 hover:scale-105">
                  <BookOpen size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Muhammad Ahmed
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Creator & Frontend Developer
                  </p>
                </div>
              </div>

              {/* Email */}
              <a
                href="mailto:Ahmedsheikh2081@gmail.com"
                className="group mt-5 flex items-start gap-3 rounded-lg border-t border-white/10 pt-4 transition-all duration-200 hover:text-emerald-400 active:scale-[0.98]"
              >
                <Mail
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-400 transition-transform duration-200 group-hover:scale-110"
                />

                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-400 transition-colors group-hover:text-emerald-400">
                    Ahmedsheikh2081@gmail.com
                  </p>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/muhammad-ahmed-56a42a3aa/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 flex items-center gap-3 rounded-lg border-t border-white/10 pt-4 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[11px] font-bold text-slate-400 transition-all duration-200 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-active:scale-95">
                  in
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    LinkedIn
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400 transition-colors group-hover:text-emerald-400">
                    Muhammad Ahmed
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* FEATURE STRIP */}
        <div className="mt-12 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Quran */}
          <Link
            to="/quran"
            className="group flex items-center gap-4 border-b border-white/10 p-5 transition-all duration-200 hover:bg-emerald-500/5 hover:-translate-y-0.5 active:scale-[0.98] active:bg-emerald-500/10 sm:border-r"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-200 group-hover:bg-emerald-500/20 group-hover:scale-105">
              <BookOpen size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-emerald-300">
                Quran
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Read & reflect
              </p>
            </div>
          </Link>

          {/* Hadith */}
          <Link
            to="/hadith"
            className="group flex items-center gap-4 border-b border-white/10 p-5 transition-all duration-200 hover:bg-emerald-500/5 hover:-translate-y-0.5 active:scale-[0.98] active:bg-emerald-500/10 lg:border-r"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-200 group-hover:bg-emerald-500/20 group-hover:scale-105">
              <ScrollText size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-emerald-300">
                Hadith
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Learn & discover
              </p>
            </div>
          </Link>

          {/* Duas */}
          <Link
            to="/duas"
            className="group flex items-center gap-4 border-b border-white/10 p-5 transition-all duration-200 hover:bg-emerald-500/5 hover:-translate-y-0.5 active:scale-[0.98] active:bg-emerald-500/10 sm:border-b-0 sm:border-r"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-200 group-hover:bg-emerald-500/20 group-hover:scale-105">
              <HandHeart size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-emerald-300">
                Duas
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Daily supplications
              </p>
            </div>
          </Link>

          {/* Qibla */}
          <Link
            to="/qibla"
            className="group flex items-center gap-4 p-5 transition-all duration-200 hover:bg-emerald-500/5 hover:-translate-y-0.5 active:scale-[0.98] active:bg-emerald-500/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-all duration-200 group-hover:bg-emerald-500/20 group-hover:scale-105">
              <Compass size={19} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-emerald-300">
                Qibla
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Find direction
              </p>
            </div>
          </Link>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Noor Islamic. All rights reserved.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Built with care by Muhammad Ahmed.
            </p>
          </div>

          <Link
            to="/bookmarks"
            className="group flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-all duration-200 hover:bg-emerald-500/5 hover:text-emerald-400 active:scale-[0.97]"
          >
            <BookmarkCheck
              size={15}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            My Bookmarks
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;