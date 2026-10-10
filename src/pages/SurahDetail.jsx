
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-toastify";

import {
    addBookmark,
    removeBookmark,
} from "../redux/bookmarkSlice";

function SurahDetail() {
    const { surahNumber } = useParams();
    const location = useLocation();

    const dispatch = useDispatch();

    const bookmarks = useSelector(
        (state) => state.bookmark?.bookmarks ?? []
    );

    const [surah, setSurah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [playingAyah, setPlayingAyah] = useState(null);

    const audioRefs = useRef({});
    const targetAyahRef = useRef(null);

    // =====================================================
    // BOOKMARK SE OPEN KI GAYI AYAH
    // =====================================================

    const targetAyahNumber = location.state?.ayahNumber;

    // =====================================================
    // FETCH SURAH
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const fetchSurah = async () => {
            try {
                setLoading(true);
                setError("");
                setSurah(null);
                setPlayingAyah(null);

                // Previous audio stop
                Object.values(audioRefs.current).forEach((audio) => {
                    if (audio) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                });

                audioRefs.current = {};

                const [
                    arabicResponse,
                    urduResponse,
                    audioResponse,
                ] = await Promise.all([
                    axios.get(
                        `https://api.alquran.cloud/v1/surah/${surahNumber}`
                    ),

                    axios.get(
                        `https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`
                    ),

                    axios.get(
                        `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
                    ),
                ]);

                if (!isMounted) return;

                const arabicSurah = arabicResponse.data.data;
                const urduSurah = urduResponse.data.data;
                const audioSurah = audioResponse.data.data;

                // Arabic + Urdu + Audio combine
                const combinedAyahs = arabicSurah.ayahs.map(
                    (ayah, index) => ({
                        ...ayah,

                        urduText:
                            urduSurah.ayahs[index]?.text ||
                            "Tarjuma available nahi hai.",

                        audioUrl:
                            audioSurah.ayahs[index]?.audio || "",
                    })
                );

                setSurah({
                    ...arabicSurah,
                    ayahs: combinedAyahs,
                });
            } catch (err) {
                console.error("Surah fetch error:", err);

                if (isMounted) {
                    setError(
                        "Surah load nahi ho saki. Internet check karein aur dobara try karein."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSurah();

        return () => {
            isMounted = false;

            Object.values(audioRefs.current).forEach((audio) => {
                if (audio) {
                    audio.pause();
                }
            });
        };
    }, [surahNumber]);

    // =====================================================
    // BOOKMARK SE OPEN HUI AYAH PAR AUTO SCROLL
    // =====================================================

    useEffect(() => {
        if (!surah || !targetAyahNumber) return;

        const timer = setTimeout(() => {
            targetAyahRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [surah, targetAyahNumber]);

    // =====================================================
    // AYAH BOOKMARK
    // =====================================================

    const toggleBookmark = (ayah) => {
        const bookmarkId =
            `quran-ayah-${surah.number}-${ayah.numberInSurah}`;

        const existingBookmark = bookmarks.find(
            (bookmark) =>
                bookmark.type === "quran-ayah" &&
                bookmark.bookmarkId === bookmarkId
        );

        // =================================================
        // REMOVE BOOKMARK
        // =================================================

        if (existingBookmark) {
            dispatch(removeBookmark(existingBookmark));

            toast.success("Bookmark removed", {
                position: "bottom-right",
                autoClose: 1800,
            });

            return;
        }

        // =================================================
        // ADD BOOKMARK
        // =================================================

        dispatch(
            addBookmark({
                type: "quran-ayah",

                bookmarkId,

                // Surah information
                surahNumber: surah.number,
                surahName: surah.name,
                surahEnglishName: surah.englishName,

                // Ayah information
                ayahNumber: ayah.number,
                ayahNumberInSurah: ayah.numberInSurah,

                // Text
                arabicText: ayah.text,
                urduText: ayah.urduText || "",

                // Audio
                audioUrl: ayah.audioUrl || "",
            })
        );

        toast.success("Ayah bookmarked", {
            position: "bottom-right",
            autoClose: 1800,
        });
    };

    // =====================================================
    // AUDIO HANDLER
    // =====================================================

    const handleAudioPlay = (ayahNumber) => {
        Object.entries(audioRefs.current).forEach(
            ([number, audio]) => {
                if (
                    number !== String(ayahNumber) &&
                    audio &&
                    !audio.paused
                ) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }
        );

        setPlayingAyah(ayahNumber);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Surah load ho rahi hai...
                    </p>

                </div>

            </main>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-5">

                <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-500">
                        !
                    </div>

                    <h2 className="mb-2 text-lg font-bold text-slate-800">
                        Something went wrong
                    </h2>

                    <p className="mb-6 text-sm leading-relaxed text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-95"
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }

    if (!surah) return null;

    return (
        <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

            <div className="mx-auto max-w-4xl">

                {/* ================================================= */}
                {/* SURAH HEADER */}
                {/* ================================================= */}

                <section className="mb-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <div className="bg-emerald-700 px-5 py-8 text-center text-white sm:px-8 sm:py-10">

                        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-emerald-100 sm:text-sm">
                            THE HOLY QURAN
                        </p>

                        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
                            {surah.englishName}
                        </h1>

                        <p className="mb-4 text-sm text-emerald-100">
                            {surah.englishNameTranslation}
                        </p>

                        <h2
                            dir="rtl"
                            className="text-4xl leading-relaxed sm:text-5xl"
                            style={{
                                fontFamily: "Amiri, serif",
                            }}
                        >
                            {surah.name}
                        </h2>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">

                            <span className="rounded-full border border-emerald-500 px-3 py-1.5">
                                Surah {surah.number}
                            </span>

                            <span className="rounded-full border border-emerald-500 px-3 py-1.5">
                                {surah.revelationType}
                            </span>

                            <span className="rounded-full border border-emerald-500 px-3 py-1.5">
                                {surah.numberOfAyahs} Ayahs
                            </span>

                        </div>

                    </div>

                    {/* BISMILLAH */}

                    <div className="px-5 py-6 text-center sm:px-8">

                        <p
                            dir="rtl"
                            className="text-2xl leading-loose text-slate-800 sm:text-3xl"
                            style={{
                                fontFamily: "Amiri, serif",
                            }}
                        >
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>

                        <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                            Allah ke naam se jo nihayat meherban,
                            bohat reham karne wala hai.
                        </p>

                    </div>

                </section>

                {/* ================================================= */}
                {/* AYAH HEADING */}
                {/* ================================================= */}

                <div className="mb-5 flex items-end justify-between gap-3">

                    <div>

                        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                            Ayahs
                        </h2>

                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Arabic text aur Urdu tarjuma
                        </p>

                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:text-sm">
                        {surah.ayahs.length} Ayahs
                    </span>

                </div>

                {/* ================================================= */}
                {/* AYAH LIST */}
                {/* ================================================= */}

                <div className="space-y-4 sm:space-y-5">

                    {surah.ayahs.map((ayah) => {

                        const bookmarkId =
                            `quran-ayah-${surah.number}-${ayah.numberInSurah}`;

                        const isBookmarked = bookmarks.some(
                            (bookmark) =>
                                bookmark.type === "quran-ayah" &&
                                bookmark.bookmarkId === bookmarkId
                        );

                        const isTargetAyah =
                            Number(targetAyahNumber) ===
                            Number(ayah.numberInSurah);

                        return (
                            <article
                                key={ayah.number}
                                id={`ayah-${ayah.numberInSurah}`}
                                ref={
                                    isTargetAyah
                                        ? targetAyahRef
                                        : null
                                }
                                className={`rounded-2xl border bg-white p-4 shadow-sm transition-all duration-500 sm:p-7 ${
                                    isTargetAyah
                                        ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-100"
                                        : isBookmarked
                                            ? "border-emerald-300 ring-1 ring-emerald-100"
                                            : "border-slate-200 hover:border-emerald-200 hover:shadow-md"
                                }`}
                            >

                                {/* SAVED AYAH */}

                                {isTargetAyah && (
                                    <div className="mb-4 flex justify-center">

                                        <span className="animate-pulse rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                                            Saved Ayah
                                        </span>

                                    </div>
                                )}

                                {/* NUMBER + BOOKMARK */}

                                <div className="mb-6 flex items-center justify-between">

                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-700 sm:h-10 sm:w-10 sm:text-sm">
                                        {ayah.numberInSurah}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleBookmark(ayah)
                                        }
                                        title={
                                            isBookmarked
                                                ? "Remove bookmark"
                                                : "Save bookmark"
                                        }
                                        aria-label={
                                            isBookmarked
                                                ? "Remove bookmark"
                                                : "Save bookmark"
                                        }
                                        className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 active:scale-90 ${
                                            isBookmarked
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                : "border-slate-200 bg-white text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                                        }`}
                                    >

                                        {isBookmarked ? (
                                            <BookmarkCheck
                                                size={20}
                                                strokeWidth={2.2}
                                            />
                                        ) : (
                                            <Bookmark
                                                size={20}
                                                strokeWidth={2}
                                                className="transition-transform duration-200 group-hover:scale-110"
                                            />
                                        )}

                                    </button>

                                </div>

                                {/* ARABIC */}

                                <p
                                    dir="rtl"
                                    className="mb-6 text-right text-2xl leading-[2.3] text-slate-800 sm:text-4xl sm:leading-[2.2]"
                                    style={{
                                        fontFamily: "Amiri, serif",
                                    }}
                                >
                                    {ayah.text}
                                </p>

                                {/* URDU */}

                                <div className="border-t border-slate-100 pt-5">

                                    <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700 sm:text-xs">
                                        Urdu Translation
                                    </p>

                                    <p
                                        dir="rtl"
                                        className="text-right text-lg leading-loose text-slate-600 sm:text-xl"
                                        style={{
                                            fontFamily: "Amiri, serif",
                                        }}
                                    >
                                        {ayah.urduText}
                                    </p>

                                </div>

                                {/* AUDIO */}

                                <div className="mt-6 border-t border-slate-100 pt-5">

                                    {ayah.audioUrl ? (
                                        <>
                                            <audio
                                                ref={(element) => {
                                                    if (element) {
                                                        audioRefs.current[
                                                            ayah.number
                                                        ] = element;
                                                    } else {
                                                        delete audioRefs.current[
                                                            ayah.number
                                                        ];
                                                    }
                                                }}
                                                controls
                                                preload="none"
                                                src={ayah.audioUrl}
                                                className="h-10 w-full"
                                                onPlay={() =>
                                                    handleAudioPlay(
                                                        ayah.number
                                                    )
                                                }
                                                onPause={() => {
                                                    setPlayingAyah(
                                                        (current) =>
                                                            current ===
                                                            ayah.number
                                                                ? null
                                                                : current
                                                    );
                                                }}
                                                onEnded={() => {
                                                    setPlayingAyah(null);
                                                }}
                                            >
                                                Your browser does not support audio.
                                            </audio>

                                            {playingAyah === ayah.number && (
                                                <p className="mt-2 text-xs font-medium text-emerald-600">
                                                    Ayah {ayah.numberInSurah} play ho rahi hai.
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            Audio available nahi hai.
                                        </p>
                                    )}

                                </div>

                            </article>
                        );
                    })}

                </div>

                {/* ================================================= */}
                {/* BOTTOM NOTE */}
                {/* ================================================= */}

                <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center sm:mt-8">

                    <p className="text-xs leading-relaxed text-emerald-800 sm:text-sm">
                        Quran ko parhein, samjhein aur apni zindagi
                        mein amal karne ki koshish karein.
                    </p>

                </div>

            </div>
        </main>
    );
}

export default SurahDetail;
