import { useEffect, useState } from "react";

import {
    RotateCcw,
    Sparkles,
    Target,
    CheckCircle2,
    Fingerprint,
    Heart,
    ChevronDown,
    BookOpen,
    RefreshCw,
    CircleCheck,
} from "lucide-react";

const dhikrOptions = [
    "SubhanAllah",
    "Alhamdulillah",
    "Allahu Akbar",
    "Astaghfirullah",
    "Durood Sharif",
];

const targetOptions = [33, 99, 100, 300, 500, 1000];

const arabicDhikr = {
    SubhanAllah: "سُبْحَانَ اللَّه",
    Alhamdulillah: "الْحَمْدُ لِلَّه",
    "Allahu Akbar": "اللَّهُ أَكْبَر",
    Astaghfirullah: "أَسْتَغْفِرُ اللَّه",
    "Durood Sharif": "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّد",
};

function getSavedTasbeeh() {
    const defaultData = {
        count: 0,
        target: 33,
        dhikr: "SubhanAllah",
    };

    try {
        const savedData = localStorage.getItem("noor-tasbeeh");

        if (!savedData) {
            return defaultData;
        }

        const parsedData = JSON.parse(savedData);

        return {
            count:
                Number.isInteger(parsedData.count) &&
                parsedData.count >= 0
                    ? parsedData.count
                    : 0,

            target: targetOptions.includes(parsedData.target)
                ? parsedData.target
                : 33,

            dhikr: dhikrOptions.includes(parsedData.dhikr)
                ? parsedData.dhikr
                : "SubhanAllah",
        };
    } catch (error) {
        console.error("Tasbeeh localStorage error:", error);

        return defaultData;
    }
}

function Tasbeeh() {
    /*
     * IMPORTANT:
     * Initial values directly localStorage se aa rahi hain.
     * Is wajah se refresh par old data overwrite nahi hoga.
     */
    const [savedData] = useState(() => getSavedTasbeeh());

    const [count, setCount] = useState(savedData.count);
    const [target, setTarget] = useState(savedData.target);
    const [dhikr, setDhikr] = useState(savedData.dhikr);

    /*
     * State change hone par localStorage update hoga.
     */
    useEffect(() => {
        localStorage.setItem(
            "noor-tasbeeh",
            JSON.stringify({
                count,
                target,
                dhikr,
            })
        );
    }, [count, target, dhikr]);

    const progress = Math.min((count / target) * 100, 100);

    const isCompleted = count >= target;

    // Count
    const handleCount = () => {
        if (count < target) {
            setCount((previousCount) => previousCount + 1);
        }
    };

    // Reset count
    const handleReset = () => {
        setCount(0);
    };

    // Change target
    const handleTargetChange = (event) => {
        const newTarget = Number(event.target.value);

        setTarget(newTarget);
        setCount(0);
    };

    // Change Dhikr
    const handleDhikrChange = (event) => {
        const newDhikr = event.target.value;

        setDhikr(newDhikr);
        setCount(0);
    };

    return (
        <main className="min-h-screen overflow-hidden bg-[#f6f9f7] pb-12 text-slate-800 sm:pb-16">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#052e25] via-[#065f46] to-[#047857]">

                <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />

                <div className="relative mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-sm backdrop-blur-sm">
                        <Sparkles
                            size={16}
                            className="text-emerald-200"
                        />

                        Your Daily Dhikr
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Digital Tasbeeh

                        <span className="mt-2 block bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                            Find Your Peace
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                        Take a moment, remember Allah, and keep
                        track of your daily dhikr.
                    </p>

                    <div className="mt-7 flex justify-center">

                        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-sm backdrop-blur-sm">

                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                                <Target size={18} />
                            </span>

                            <span>
                                <span className="block text-left text-[10px] uppercase tracking-widest text-emerald-100/70">
                                    Your Target
                                </span>

                                <span className="font-bold">
                                    {target} counts
                                </span>
                            </span>

                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 h-5 w-full rounded-t-[50%] bg-[#f6f9f7]" />
            </section>

            {/* ================= MAIN ================= */}
            <div className="mx-auto max-w-2xl px-4 pt-7 sm:px-6 sm:pt-9">

                <section className="overflow-hidden rounded-3xl border border-emerald-100/80 bg-white shadow-[0_8px_35px_rgba(6,95,70,0.06)]">

                    {/* HEADER */}
                    <div className="border-b border-emerald-50 px-5 py-5 sm:px-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 shadow-sm">

                                <Fingerprint
                                    size={25}
                                    strokeWidth={1.8}
                                />

                            </div>

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Tasbeeh Counter
                                </h2>

                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    Your personal dhikr space
                                </p>

                            </div>

                            <div className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Heart size={18} />
                            </div>

                        </div>
                    </div>

                    <div className="p-4 sm:p-8">

                        {/* ================= DHIKR SELECT ================= */}
                        <div>

                            <label
                                htmlFor="dhikr"
                                className="mb-3 flex items-center gap-3 text-sm font-bold text-slate-800"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                                    <BookOpen size={19} />
                                </span>

                                <span>
                                    Select Dhikr

                                    <span className="mt-1 block text-xs font-normal text-slate-500">
                                        Choose your daily remembrance
                                    </span>
                                </span>

                            </label>

                            <div className="relative">

                                <select
                                    id="dhikr"
                                    value={dhikr}
                                    onChange={handleDhikrChange}
                                    className="w-full appearance-none rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white py-4 pl-4 pr-12 text-sm font-semibold text-slate-800 shadow-sm outline-none transition duration-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                >

                                    {dhikrOptions.map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </option>
                                    ))}

                                </select>

                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-emerald-700">
                                    <ChevronDown size={20} />
                                </span>

                            </div>
                        </div>

                        {/* ================= ARABIC ================= */}
                        <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#eff8f1] via-white to-[#edf8f5] px-4 py-7 text-center sm:py-9">

                            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-emerald-100/80" />

                            <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full border border-emerald-100/80" />

                            <div className="relative">

                                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm">
                                    <Sparkles size={13} />
                                    Remember Allah
                                </span>

                                <p
                                    dir="rtl"
                                    lang="ar"
                                    className="break-words text-3xl leading-[2.1] text-emerald-950 sm:text-4xl"
                                    style={{
                                        fontFamily: "Amiri, serif",
                                    }}
                                >
                                    {arabicDhikr[dhikr]}
                                </p>

                                <p className="mt-3 text-sm font-bold tracking-wide text-emerald-700">
                                    {dhikr}
                                </p>

                            </div>
                        </div>

                        {/* ================= COUNTER ================= */}
                        <div className="mt-6 rounded-2xl border border-slate-100 bg-[#fbfcfb] px-4 py-7 text-center sm:mt-7 sm:py-8">

                            <div className="mb-3 flex items-center justify-center gap-2">

                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Fingerprint size={16} />
                                </span>

                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                    Current Count
                                </p>

                            </div>

                            <div
                                className="my-3 break-all text-7xl font-bold tabular-nums tracking-tight text-emerald-800 sm:text-8xl"
                                aria-live="polite"
                            >
                                {count}
                            </div>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">

                                <Target size={15} />

                                Target: {target}

                            </div>

                            {/* PROGRESS */}
                            <div className="mt-7 text-left">

                                <div className="mb-2 flex items-center justify-between gap-3 text-xs">

                                    <span className="flex items-center gap-2 font-semibold text-slate-600">

                                        <CircleCheck
                                            size={15}
                                            className="text-emerald-600"
                                        />

                                        Your Progress

                                    </span>

                                    <span className="font-bold tabular-nums text-emerald-700">
                                        {Math.round(progress)}%
                                    </span>

                                </div>

                                <div
                                    className="h-3 overflow-hidden rounded-full border border-emerald-100/70 bg-emerald-50"
                                    role="progressbar"
                                    aria-valuenow={Math.round(progress)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-400 transition-all duration-300"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />

                                </div>

                                <div className="mt-3 flex justify-between gap-3 text-[11px] text-slate-500 sm:text-xs">

                                    <span>
                                        {count} completed
                                    </span>

                                    <span>
                                        {Math.max(
                                            target - count,
                                            0
                                        )}{" "}
                                        remaining
                                    </span>

                                </div>

                            </div>
                        </div>

                        {/* ================= COUNT BUTTON ================= */}
                        <button
                            type="button"
                            onClick={handleCount}
                            disabled={isCompleted}
                            className="mt-6 flex min-h-[68px] w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-600 px-4 text-base font-bold text-white shadow-lg shadow-emerald-900/15 transition duration-200 hover:-translate-y-0.5 hover:from-emerald-900 hover:to-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-emerald-300 disabled:to-emerald-300 disabled:shadow-none sm:text-lg"
                        >

                            {isCompleted ? (
                                <>
                                    <CheckCircle2 size={23} />
                                    Target Completed
                                </>
                            ) : (
                                <>
                                    <Fingerprint size={25} />
                                    Count +1
                                </>
                            )}

                        </button>

                        {/* ================= RESET ================= */}
                        <button
                            type="button"
                            onClick={handleReset}
                            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-600 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.99]"
                        >

                            <RotateCcw size={17} />

                            Reset Counter

                        </button>

                        {/* ================= TARGET ================= */}
                        <div className="mt-7 border-t border-slate-100 pt-6">

                            <label
                                htmlFor="target"
                                className="mb-3 flex items-center gap-3 text-sm font-bold text-slate-800"
                            >

                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
                                    <Target size={19} />
                                </span>

                                <span>
                                    Set Your Target

                                    <span className="mt-1 block text-xs font-normal text-slate-500">
                                        Select your preferred count goal
                                    </span>
                                </span>

                            </label>

                            <div className="relative">

                                <select
                                    id="target"
                                    value={target}
                                    onChange={handleTargetChange}
                                    className="w-full appearance-none rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white py-4 pl-4 pr-12 text-sm font-semibold text-slate-800 shadow-sm outline-none transition duration-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                >

                                    {targetOptions.map((option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            {option} Counts
                                        </option>
                                    ))}

                                </select>

                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-emerald-700">
                                    <ChevronDown size={20} />
                                </span>

                            </div>
                        </div>

                        {/* ================= COMPLETE ================= */}
                        {isCompleted && (
                            <div className="mt-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center sm:p-6">

                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                                    <CheckCircle2 size={26} />
                                </div>

                                <p className="font-bold text-emerald-900">
                                    Alhamdulillah! Target complete.
                                </p>

                                <p className="mt-2 text-sm leading-6 text-emerald-800">
                                    Aap apni tasbeeh dobara shuru kar sakte hain.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                                >
                                    <RefreshCw size={15} />
                                    Start Again
                                </button>

                            </div>
                        )}

                    </div>
                </section>

                {/* ================= FOOTER ================= */}
                <div className="mt-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-5 sm:px-5">

                    <div className="flex items-center justify-center gap-3 text-center">

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-sm">
                            <Heart size={19} />
                        </span>

                        <p className="text-xs leading-6 text-emerald-800 sm:text-sm">
                            Noor — Your companion for Quran, Duas,
                            Hadith, and daily dhikr.
                        </p>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default Tasbeeh;