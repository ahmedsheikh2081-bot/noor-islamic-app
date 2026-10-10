
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Compass,
  Heart,
  Moon,
  Quote,
  ScrollText,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";

import PrayerTimes from "../Component/PrayerTimes";
import AdBanner from "../Component/AdBanner";

/* =========================================================
   DAILY AYAH DATA
========================================================= */

const DAILY_AYAHS = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    reference: "Surah Ash-Sharh • 94:6",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    reference: "Surah Al-Baqarah • 2:152",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    reference: "Surah Al-Baqarah • 2:153",
  },
  {
    arabic: "وَقُلْ رَبِّ زِدْنِي عِلْمًا",
    translation: "And say, My Lord, increase me in knowledge.",
    reference: "Surah Taha • 20:114",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation:
      "And whoever relies upon Allah, then He is sufficient for him.",
    reference: "Surah At-Talaq • 65:3",
  },
  {
    arabic:
      "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    translation:
      "Indeed, Allah does not change the condition of a people until they change what is in themselves.",
    reference: "Surah Ar-Ra'd • 13:11",
  },
  {
    arabic: "وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
    translation:
      "Allah is the best guardian, and He is the most merciful of the merciful.",
    reference: "Surah Yusuf • 12:64",
  },
  {
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
    translation:
      "And whoever is mindful of Allah, He will make a way out for them.",
    reference: "Surah At-Talaq • 65:2",
  },
  {
    arabic:
      "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
    translation:
      "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.",
    reference: "Surah Al-Baqarah • 2:222",
  },
  {
    arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    translation: "And do not despair of the mercy of Allah.",
    reference: "Surah Yusuf • 12:87",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const getDayNumber = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  /* LIVE CLOCK */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* GREGORIAN DATE */

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(currentTime);
  }, [currentTime]);

  /* ISLAMIC / HIJRI DATE */

  const islamicDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(currentTime);
    } catch {
      return "Islamic Calendar";
    }
  }, [currentTime]);

  /* DAILY AYAH */

  const dailyAyah = useMemo(() => {
    const dayNumber = getDayNumber(currentTime);

    return DAILY_AYAHS[dayNumber % DAILY_AYAHS.length];
  }, [currentTime]);

  /* QUICK FEATURES */

  const quickFeatures = [
    {
      title: "Read Quran",
      description:
        "Read the Holy Quran with Arabic and Urdu translation.",
      icon: BookOpen,
      link: "/quran",
      label: "Explore Quran",
      featured: true,
    },
    {
      title: "Hadith",
      description:
        "Explore authentic Hadith and learn from the Sunnah.",
      icon: ScrollText,
      link: "/hadith",
      label: "Explore Hadith",
    },
    {
      title: "Daily Duas",
      description:
        "Beautiful duas for your everyday life and worship.",
      icon: Heart,
      link: "/duas",
      label: "Explore Duas",
    },
    {
      title: "Qibla Finder",
      description:
        "Find the direction of the Kaaba from your location.",
      icon: Compass,
      link: "/qibla",
      label: "Find Qibla",
    },
  ];

  /* DUAS */

  const duas = [
    {
      title: "Morning & Evening",
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
      description:
        "Begin and end your day with remembrance of Allah.",
    },
    {
      title: "For Peace",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي",
      description:
        "A beautiful dua for ease, peace and comfort.",
    },
    {
      title: "For Guidance",
      arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      description:
        "Ask Allah to keep you upon the straight path.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf8] text-slate-900">
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#10241d]">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* HERO LEFT */}

            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-emerald-200 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                <span>Guidance • Knowledge • Peace</span>
              </div>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Assalamu Alaikum
              </p>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Your journey
                <span className="block text-emerald-300">
                  closer to Allah.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Discover the Quran, authentic Hadith, daily Duas,
                prayer times, Qibla and more — all in one peaceful
                Islamic platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/quran"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300"
                >
                  <BookOpen className="h-5 w-5" />
                  Start Reading Quran
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/duas"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  <Heart className="h-5 w-5" />
                  Explore Duas
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Quran & Hadith
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Prayer Times
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  Qibla Finder
                </span>
              </div>
            </div>

            

            {/* HERO RIGHT */}

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-emerald-300">
                        Today
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        {formattedDate}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <Moon className="h-5 w-5 text-amber-200" />
                    </div>
                  </div>

                  <div className="my-7 border-t border-white/10" />

                  <div className="text-center">
                    <p className="font-['Amiri'] text-3xl leading-relaxed text-amber-100 sm:text-4xl">
                      وَاذْكُرْ رَبَّكَ إِذَا نَسِيتَ
                    </p>

                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      And remember your Lord when you forget.
                    </p>

                    <div className="mt-4 text-xs font-medium text-emerald-300">
                      Surah Al-Kahf • 18:24
                    </div>
                  </div>

                  <div className="my-7 border-t border-white/10" />

                  <div className="grid grid-cols-3 gap-3">
                    <Link
                      to="/quran"
                      className="rounded-2xl bg-white/5 p-4 text-center transition hover:bg-white/10"
                    >
                      <BookOpen className="mx-auto h-5 w-5 text-emerald-300" />
                      <span className="mt-2 block text-xs text-slate-300">
                        Quran
                      </span>
                    </Link>

                    <Link
                      to="/qibla"
                      className="rounded-2xl bg-white/5 p-4 text-center transition hover:bg-white/10"
                    >
                      <Compass className="mx-auto h-5 w-5 text-emerald-300" />
                      <span className="mt-2 block text-xs text-slate-300">
                        Qibla
                      </span>
                    </Link>

                    <Link
                      to="/tasbeeh"
                      className="rounded-2xl bg-white/5 p-4 text-center transition hover:bg-white/10"
                    >
                      <CircleDot className="mx-auto h-5 w-5 text-emerald-300" />
                      <span className="mt-2 block text-xs text-slate-300">
                        Tasbeeh
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl sm:flex sm:items-center sm:gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Stay Connected
                  </p>
                  <p className="text-[11px] text-slate-500">
                    With your faith
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-6 rounded-t-[50%] bg-[#fafaf8]" />
      </section>

      {/* DATE STRIP */}

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 sm:grid-cols-2">
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Gregorian Date
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-slate-100 p-5 sm:border-l sm:border-t-0 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
              <Moon className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Islamic Date
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {islamicDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRAYER TIMES */}

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Stay on time
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Prayer Times
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Keep your five daily prayers close and never miss
              the moment of worship.
            </p>
          </div>
        </div>

        <PrayerTimes />
      </section>

      {/* =====================================================
          ADVERTISEMENT
          Prayer Times ke baad, Features se pehle
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Advertisement
          </p>

          <AdBanner />
        </div>
      </section>

      {/* FEATURES */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Everything in one place
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore your Islamic journey
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Simple tools and authentic content designed to make
            your daily connection with Islam easier.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                to={feature.link}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 ${
                  feature.featured
                    ? "border-emerald-200 bg-[#10241d] text-white shadow-xl shadow-emerald-950/10"
                    : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5"
                }`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${
                    feature.featured
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3
                  className={`text-lg font-bold ${
                    feature.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {feature.title}
                </h3>

                <p
                  className={`mt-3 text-sm leading-6 ${
                    feature.featured ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {feature.description}
                </p>

                <div
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                    feature.featured ? "text-emerald-300" : "text-emerald-700"
                  }`}
                >
                  {feature.label}
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>

                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-400/5 blur-2xl transition group-hover:bg-emerald-400/10" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ISLAMIC CALENDAR */}

      <section className="bg-[#f1f5f1] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#10241d] p-7 text-white sm:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <CalendarDays className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                      Islamic Calendar
                    </p>
                    <p className="text-sm text-slate-400">Today in Hijri</p>
                  </div>
                </div>

                <div className="mt-10">
                  <p className="font-['Amiri'] text-4xl text-amber-100 sm:text-5xl">
                    {islamicDate}
                  </p>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    Keep track of the Islamic date alongside your
                    daily worship and spiritual routine.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs text-slate-400">Calendar</p>
                    <p className="mt-1 text-sm font-semibold">Hijri</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-xs text-slate-400">Today</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Make every day meaningful
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Read a few verses, remember Allah, make a dua
                and take one small step closer to your faith every day.
              </p>

              <Link
                to="/duas"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
              >
                Discover Duas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY AYAH */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative grid lg:grid-cols-[0.35fr_1fr]">
            <div className="flex flex-col justify-center bg-[#10241d] p-7 text-white sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10">
                <BookOpen className="h-6 w-6 text-emerald-300" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Daily Ayah
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                A moment with the Quran
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A new verse every day to reflect, remember and grow.
              </p>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <Quote className="h-8 w-8 text-emerald-200" />

              <p
                key={dailyAyah.reference}
                className="mt-5 font-['Amiri'] text-3xl leading-[1.9] text-slate-800 sm:text-4xl"
              >
                {dailyAyah.arabic}
              </p>

              <p className="mt-5 text-base leading-7 text-slate-600">
                {dailyAyah.translation}
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    {dailyAyah.reference}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Today's reflection
                  </p>
                </div>

                <Link
                  to="/quran"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-emerald-700"
                >
                  Read Quran
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAS */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
                Remember Allah
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Beautiful Duas for every day
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep meaningful supplications close to your heart
                throughout the day.
              </p>
            </div>

            <Link
              to="/duas"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"
            >
              View all Duas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {duas.map((dua) => (
              <div
                key={dua.title}
                className="group rounded-3xl border border-slate-200 bg-[#fafaf8] p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Heart className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    Dua
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {dua.title}
                </h3>

                <p className="mt-5 text-right font-['Amiri'] text-2xl leading-relaxed text-emerald-800">
                  {dua.arabic}
                </p>

                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {dua.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HADITH */}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
              Words of the Prophet ﷺ
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Learn from the Sunnah
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore authentic Hadith and bring the beautiful teachings
              of the Prophet Muhammad ﷺ into your everyday life.
            </p>

            <Link
              to="/hadith"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#10241d] px-5 py-3 font-semibold text-white transition hover:bg-emerald-900"
            >
              Explore Hadith
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#f1f5f1] p-7 sm:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative">
              <Quote className="h-9 w-9 text-emerald-300" />

              <p className="mt-6 text-lg font-medium leading-8 text-slate-800 sm:text-xl sm:leading-9">
                “The best of people are those who are most beneficial
                to others.”
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                  <Star className="h-4 w-4 text-amber-500" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Hadith
                  </p>
                  <p className="text-xs text-slate-500">
                    Learn • Reflect • Practice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#10241d] px-6 py-14 text-center sm:px-10 sm:py-16">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Sun className="h-7 w-7 text-amber-200" />
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make Noor part of your daily routine
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Read the Quran, remember Allah, learn from the Sunnah
              and stay connected with your faith — one day at a time.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/quran"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                <BookOpen className="h-5 w-5" />
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/tasbeeh"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                <CircleDot className="h-5 w-5" />
                Open Tasbeeh
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;