import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Clock3,
  LocateFixed,
  MapPin,
  Moon,
  RefreshCw,
  Sun,
} from "lucide-react";

const DEFAULT_LOCATION = {
  latitude: 24.8607,
  longitude: 67.0011,
  city: "Karachi",
  country: "Pakistan",
};

const PRAYER_CONFIG = [
  { key: "Fajr", label: "Fajr", icon: Moon },
  { key: "Dhuhr", label: "Dhuhr", icon: Sun },
  { key: "Asr", label: "Asr", icon: Sun },
  { key: "Maghrib", label: "Maghrib", icon: Moon },
  { key: "Isha", label: "Isha", icon: Moon },
];

function formatTime(time) {
  if (!time) return "--:--";

  const cleanTime = time.split(" ")[0];
  const [hoursString, minutesString] = cleanTime.split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPrayerDate(time, baseDate) {
  if (!time) return null;

  const cleanTime = time.split(" ")[0];
  const [hoursString, minutesString] = cleanTime.split(":");

  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);

  return date;
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}

/* =========================================================
   REVERSE GEOCODING
   Coordinates -> City, Country
========================================================= */
async function getLocationName(latitude, longitude) {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      `&zoom=10` +
      `&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to detect city.");
    }

    const data = await response.json();

    const address = data?.address || {};

    const city =
      address.city ||
      address.town ||
      address.municipality ||
      address.village ||
      address.county ||
      "Your Location";

    const country = address.country || "";

    return {
      city,
      country,
    };
  } catch (error) {
    console.error("Location name error:", error);

    return {
      city: "Your Location",
      country: "",
    };
  }
}

function PrayerTimes() {
  const [prayerData, setPrayerData] = useState(null);

  const [location, setLocation] = useState(DEFAULT_LOCATION);

  const [currentTime, setCurrentTime] = useState(new Date());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [locationLoading, setLocationLoading] =
    useState(false);

  /* =========================================================
     LIVE CLOCK
  ========================================================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =========================================================
     FETCH PRAYER TIMES
  ========================================================= */
  const fetchPrayerTimes = useCallback(
    async (latitude, longitude) => {
      setLoading(true);
      setError("");

      try {
        const today = new Date();

        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(
          2,
          "0"
        );
        const year = today.getFullYear();

        const url =
          `https://api.aladhan.com/v1/timings/` +
          `${day}-${month}-${year}` +
          `?latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&method=1`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Unable to fetch prayer times."
          );
        }

        const result = await response.json();

        if (
          result.code !== 200 ||
          !result.data?.timings
        ) {
          throw new Error(
            "Prayer times are currently unavailable."
          );
        }

        setPrayerData(result.data);
      } catch (err) {
        console.error("Prayer times error:", err);

        setError(
          "Prayer times could not be loaded. Please check your internet connection."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =========================================================
     GET USER LOCATION + CITY NAME
  ========================================================= */
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);

      fetchPrayerTimes(
        DEFAULT_LOCATION.latitude,
        DEFAULT_LOCATION.longitude
      );

      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const locationName = await getLocationName(
            latitude,
            longitude
          );

          setLocation({
            latitude,
            longitude,
            city: locationName.city,
            country: locationName.country,
          });

          await fetchPrayerTimes(
            latitude,
            longitude
          );
        } catch (error) {
          console.error(error);

          setLocation({
            latitude,
            longitude,
            city: "Your Location",
            country: "",
          });

          await fetchPrayerTimes(
            latitude,
            longitude
          );
        } finally {
          setLocationLoading(false);
        }
      },

      async () => {
        setLocation(DEFAULT_LOCATION);

        await fetchPrayerTimes(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, [fetchPrayerTimes]);

  /* =========================================================
     INITIAL LOCATION
  ========================================================= */
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  /* =========================================================
     NEXT PRAYER
  ========================================================= */
  const nextPrayer = useMemo(() => {
    if (!prayerData?.timings) return null;

    const today = new Date(currentTime);

    const prayerList = PRAYER_CONFIG.map((prayer) => {
      const rawTime =
        prayerData.timings[prayer.key];

      const prayerDate = getPrayerDate(
        rawTime,
        today
      );

      return {
        ...prayer,
        time: rawTime,
        date: prayerDate,
      };
    }).filter((prayer) => prayer.date);

    const upcomingPrayer = prayerList.find(
      (prayer) =>
        prayer.date.getTime() >
        currentTime.getTime()
    );

    if (upcomingPrayer) {
      return upcomingPrayer;
    }

    /* After Isha -> tomorrow Fajr */
    const tomorrow = new Date(currentTime);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const fajrTime =
      prayerData.timings.Fajr;

    const fajrDate = getPrayerDate(
      fajrTime,
      tomorrow
    );

    return {
      ...PRAYER_CONFIG[0],
      time: fajrTime,
      date: fajrDate,
      isTomorrow: true,
    };
  }, [prayerData, currentTime]);

  /* =========================================================
     COUNTDOWN
  ========================================================= */
  const remainingTime = useMemo(() => {
    if (!nextPrayer?.date) {
      return "00:00:00";
    }

    return formatCountdown(
      nextPrayer.date.getTime() -
        currentTime.getTime()
    );
  }, [nextPrayer, currentTime]);

  /* =========================================================
     DATE
  ========================================================= */
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  }, [currentTime]);

  /* =========================================================
     HIJRI DATE
  ========================================================= */
  const hijriDate =
    prayerData?.date?.hijri;

  const hijriText = hijriDate
    ? `${hijriDate.day} ${hijriDate.month?.en} ${hijriDate.year} AH`
    : "Hijri date unavailable";

  /* =========================================================
     REFRESH LOCATION
  ========================================================= */
  const handleRefreshLocation = () => {
    getUserLocation();
  };

  /* =========================================================
     LOADING
  ========================================================= */
  if (loading && !prayerData) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
        <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-7">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-slate-800" />

            <div className="mt-4 h-10 w-36 rounded bg-slate-800" />

            <div className="mt-8 h-4 w-28 rounded bg-slate-800" />

            <div className="mt-3 h-12 w-52 rounded bg-slate-800" />

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="h-3 w-24 rounded bg-slate-800" />

              <div className="mt-2 h-5 w-20 rounded bg-slate-800" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-32 rounded bg-slate-100" />

            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
            <div className="h-11 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-5">

      {/* =====================================================
          NEXT PRAYER CARD
      ===================================================== */}
      <div className="group relative overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.99] sm:p-7">

        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -left-20 h-44 w-44 rounded-full bg-emerald-400/5 blur-3xl" />

        <div className="relative">

          {/* Header */}
          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 sm:text-xs">
                Next Prayer
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                {nextPrayer?.label || "Prayer"}
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/10 bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-105">
              <Clock3 size={21} />
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-7 sm:mt-9">

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
              Remaining Time
            </p>

            <p className="mt-2 font-mono text-3xl font-bold tracking-wider text-white sm:text-5xl">
              {remainingTime}
            </p>
          </div>

          {/* Prayer + Location */}
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Prayer Time
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {formatTime(nextPrayer?.time)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">

              <MapPin
                size={14}
                className="text-emerald-400"
              />

              <span>
                {location.city}
                {location.country
                  ? `, ${location.country}`
                  : ""}
              </span>
            </div>
          </div>

          {/* Hijri + Location Button */}
          <div className="mt-5 flex flex-wrap items-center gap-2">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-slate-400">

              <CalendarDays
                size={13}
                className="text-emerald-400"
              />

              {hijriText}
            </div>

            <button
              type="button"
              onClick={handleRefreshLocation}
              disabled={locationLoading}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={13}
                className={
                  locationLoading
                    ? "animate-spin"
                    : ""
                }
              />

              {locationLoading
                ? "Detecting..."
                : "Update Location"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRAYER TIMES LIST
      ===================================================== */}
      <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-xs">
              Today
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-800">
              Prayer Times
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Clock3 size={19} />
          </div>
        </div>

        {/* Location Badge */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2">

          <MapPin
            size={15}
            className="shrink-0 text-emerald-600"
          />

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
              Location
            </p>

            <p className="truncate text-xs font-semibold text-slate-700 sm:text-sm">
              {location.city}
              {location.country
                ? `, ${location.country}`
                : ""}
            </p>
          </div>
        </div>

        {/* Prayer List */}
        <div className="space-y-2">

          {PRAYER_CONFIG.map((prayer) => {
            const Icon = prayer.icon;

            const rawTime =
              prayerData?.timings?.[
                prayer.key
              ];

            const isNext =
              prayer.key ===
              nextPrayer?.key;

            return (
              <div
                key={prayer.key}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 active:scale-[0.98] ${
                  isNext
                    ? "bg-emerald-50 ring-1 ring-emerald-100"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      isNext
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    <Icon size={15} />
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      isNext
                        ? "text-emerald-700"
                        : "text-slate-700"
                    }`}
                  >
                    {prayer.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  {isNext && (
                    <span className="hidden rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white sm:inline">
                      Next
                    </span>
                  )}

                  <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                    {formatTime(rawTime)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <LocateFixed
              size={14}
              className="text-emerald-600"
            />

            <span>
              {location.city}
              {location.country
                ? `, ${location.country}`
                : ""}
            </span>
          </div>

          <div className="text-xs font-medium text-slate-400">
            {formattedDate}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-700">

            <AlertCircle
              size={15}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrayerTimes;