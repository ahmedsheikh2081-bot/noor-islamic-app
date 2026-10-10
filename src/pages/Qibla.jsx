
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  LocateFixed,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from "lucide-react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function getQiblaBearing(latitude, longitude) {
  const lat1 = (latitude * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const deltaLng = ((KAABA_LNG - longitude) * Math.PI) / 180;

  const y = Math.sin(deltaLng);
  const x =
    Math.cos(lat1) * Math.tan(lat2) -
    Math.sin(lat1) * Math.cos(deltaLng);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function getShortestAngle(angle, target) {
  return ((angle - target + 540) % 360) - 180;
}

function getClosestCardinal(degree) {
  const directions = [
    { name: "N", degree: 0 },
    { name: "E", degree: 90 },
    { name: "S", degree: 180 },
    { name: "W", degree: 270 },
  ];

  return directions.reduce(
    (closest, direction) => {
      const difference = Math.abs(
        getShortestAngle(degree, direction.degree)
      );

      return difference < closest.difference
        ? { name: direction.name, difference }
        : closest;
    },
    { name: "", difference: Infinity }
  ).name;
}

function getDirectionName(degree) {
  const directions = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
  ];

  return directions[Math.round(degree / 45) % 8];
}

function getLocationError(error) {
  if (error.code === 1) {
    return "Location permission denied. Allow location access in your browser settings, then try again.";
  }

  if (error.code === 2) {
    return "Your location is unavailable. Turn on device location services and try again.";
  }

  if (error.code === 3) {
    return "Location request timed out. Move to an area with a better GPS signal and retry.";
  }

  return "Unable to detect your location. Check your browser permissions and try again.";
}

export default function Qibla() {
  const [location, setLocation] = useState(null);
  const [qiblaBearing, setQiblaBearing] = useState(null);
  const [heading, setHeading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compassLoading, setCompassLoading] = useState(false);
  const [error, setError] = useState("");
  const [compassMessage, setCompassMessage] = useState("");
  const [compassActive, setCompassActive] = useState(false);

  const requestId = useRef(0);

  const getLocation = useCallback(() => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError("");

    const isLocalhost = [
      "localhost",
      "127.0.0.1",
      "::1",
    ].includes(window.location.hostname);

    if (!window.isSecureContext && !isLocalhost) {
      setError(
        "Location requires HTTPS. Open Noor Islamic using its secure HTTPS website address."
      );
      setLoading(false);
      return;
    }

    if (!("geolocation" in navigator)) {
      setError(
        "Geolocation is unavailable in this browser. Try an updated version of Chrome, Safari, or Firefox."
      );
      setLoading(false);
      return;
    }

    const success = (position) => {
      if (currentRequest !== requestId.current) return;

      const { latitude, longitude } = position.coords;

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        setError("The browser returned invalid location coordinates.");
        setLoading(false);
        return;
      }

      setLocation({ latitude, longitude });
      setQiblaBearing(getQiblaBearing(latitude, longitude));
      setError("");
      setLoading(false);
    };

    const fallback = (firstError) => {
      if (currentRequest !== requestId.current) return;

      // Do not retry when the user has denied permission.
      if (firstError.code === 1) {
        setError(getLocationError(firstError));
        setLoading(false);
        return;
      }

      // Retry with a lower-accuracy location method.
      navigator.geolocation.getCurrentPosition(
        success,
        (secondError) => {
          if (currentRequest !== requestId.current) return;

          setError(getLocationError(secondError));
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 20000,
          maximumAge: 300000,
        }
      );
    };

    navigator.geolocation.getCurrentPosition(
      success,
      fallback,
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    getLocation();

    return () => {
      requestId.current += 1;
    };
  }, [getLocation]);

  useEffect(() => {
    if (!compassActive) return;

    const handleOrientation = (event) => {
      let compassHeading = null;

      // iPhone Safari provides a compass heading in degrees.
      if (typeof event.webkitCompassHeading === "number") {
        compassHeading = event.webkitCompassHeading;
      } else if (
        event.absolute === true &&
        typeof event.alpha === "number"
      ) {
        compassHeading = (360 - event.alpha) % 360;
      }

      if (
        compassHeading !== null &&
        Number.isFinite(compassHeading)
      ) {
        setHeading((compassHeading + 360) % 360);
        setCompassMessage("");
      }
    };

    window.addEventListener(
      "deviceorientation",
      handleOrientation,
      true
    );

    return () => {
      window.removeEventListener(
        "deviceorientation",
        handleOrientation,
        true
      );
    };
  }, [compassActive]);

  const activateCompass = async () => {
    setCompassLoading(true);
    setCompassMessage("");

    try {
      if (typeof window.DeviceOrientationEvent === "undefined") {
        setCompassActive(false);
        setHeading(null);
        setCompassMessage(
          "This browser does not expose a compass sensor. The calculated Qibla bearing remains available."
        );
        return;
      }

      if (
        typeof window.DeviceOrientationEvent.requestPermission ===
        "function"
      ) {
        const permission =
          await window.DeviceOrientationEvent.requestPermission();

        if (permission !== "granted") {
          setCompassMessage(
            "Compass permission was not granted. You can still use the calculated bearing."
          );
          return;
        }
      }

      setHeading(null);
      setCompassActive(true);
      setCompassMessage(
        "Move your phone gently. If the heading does not appear, this browser may not provide compass data."
      );
    } catch (err) {
      console.error("Compass activation error:", err);

      setCompassMessage(
        "Unable to activate the compass. Check device permissions or use the calculated Qibla bearing."
      );
    } finally {
      setCompassLoading(false);
    }
  };

  const relativeQibla =
    qiblaBearing === null
      ? 0
      : heading !== null
        ? (qiblaBearing - heading + 360) % 360
        : qiblaBearing;

  const closestCardinal = getClosestCardinal(relativeQibla);

  const cardinalClass = (direction) =>
    closestCardinal === direction
      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
      : "text-slate-400";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Compass size={30} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Qibla Compass
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
            Find the direction of the Holy Kaaba from your current location.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Your Qibla direction
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {heading !== null
                    ? "Live compass mode"
                    : "Direction relative to north"}
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {heading !== null ? "Live" : "Bearing"}
              </span>
            </div>

            <div className="relative mx-auto aspect-square w-full max-w-[310px]">
              <div className="absolute inset-0 rounded-full border-[10px] border-slate-100 bg-slate-50 shadow-inner" />
              <div className="absolute inset-3 rounded-full border border-slate-200" />

              <span className={`absolute left-1/2 top-5 z-10 flex h-9 min-w-9 -translate-x-1/2 items-center justify-center rounded-full px-2 text-sm font-bold ${cardinalClass("N")}`}>
                N
              </span>

              <span className={`absolute right-5 top-1/2 z-10 flex h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full px-2 text-sm font-bold ${cardinalClass("E")}`}>
                E
              </span>

              <span className={`absolute bottom-5 left-1/2 z-10 flex h-9 min-w-9 -translate-x-1/2 items-center justify-center rounded-full px-2 text-sm font-bold ${cardinalClass("S")}`}>
                S
              </span>

              <span className={`absolute left-5 top-1/2 z-10 flex h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full px-2 text-sm font-bold ${cardinalClass("W")}`}>
                W
              </span>

              <div className="absolute inset-7 rounded-full border border-dashed border-slate-200" />

              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${relativeQibla}deg)` }}
              >
                <div className="relative flex h-[68%] w-8 flex-col items-center">
                  <Navigation
                    size={36}
                    strokeWidth={2.5}
                    className="shrink-0 fill-emerald-500 text-emerald-600 drop-shadow-sm"
                  />

                  <div className="mt-1 h-full w-1 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-100" />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-lg">
                <Compass size={27} />
              </div>
            </div>

            <div className="mt-6 text-center">
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <RefreshCw size={16} className="animate-spin" />
                  Detecting your location...
                </div>
              ) : error ? (
                <div className="mx-auto flex max-w-sm items-start gap-2 rounded-xl bg-red-50 p-3 text-left text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold tracking-tight text-emerald-600">
                    {qiblaBearing?.toFixed(1)}°
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {getDirectionName(qiblaBearing ?? 0)}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {heading !== null
                      ? "Arrow adjusted to your phone's heading."
                      : "Bearing measured clockwise from north."}
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">
              Location & Compass
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Allow location access to calculate your Qibla direction.
              Live compass support depends on your device and browser.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Your location
                  </p>

                  {location ? (
                    <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                      {location.latitude.toFixed(5)},{" "}
                      {location.longitude.toFixed(5)}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      {loading
                        ? "Getting your coordinates..."
                        : "Location not available"}
                    </p>
                  )}
                </div>

                {location && (
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-emerald-500"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <Smartphone
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-900">
                    {heading !== null
                      ? "Compass is responding"
                      : "Live compass"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    {heading !== null
                      ? `Current heading: ${heading.toFixed(1)}°. Keep your phone flat for better results.`
                      : "If no compass sensor is available, use the calculated bearing and align your device with north."}
                  </p>
                </div>
              </div>
            </div>

            {compassMessage && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                {compassMessage}
              </p>
            )}

            <div className="mt-auto space-y-3 pt-6">
              <button
                type="button"
                onClick={activateCompass}
                disabled={compassLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {compassLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Compass size={18} />
                )}

                {compassLoading
                  ? "Activating compass..."
                  : "Activate live compass"}
              </button>

              <button
                type="button"
                onClick={getLocation}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed
                  size={18}
                  className={loading ? "animate-pulse" : ""}
                />

                {loading ? "Getting location..." : "Refresh location"}
              </button>
            </div>
          </section>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-slate-400">
          For best results, enable device location services and keep your
          phone away from magnets or magnetic interference.
        </p>
      </div>
    </main>
  );
}

