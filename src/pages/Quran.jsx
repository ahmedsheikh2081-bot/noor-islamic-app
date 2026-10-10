import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Bookmark,
    BookmarkCheck,
    BookOpen,
    Search,
    Sparkles,
    LoaderCircle,
    MapPin,
    ChevronRight,
} from "lucide-react";

import { toast } from "react-toastify";

import getSurahs from "../service/QuranApi";

import {
    addBookmark,
    removeBookmark,
} from "../redux/bookmarkSlice";

function Quran() {
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    const bookmarks = useSelector(
        (state) => state.bookmark?.bookmarks ?? []
    );

    // ================= FETCH SURAHS =================

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                setLoading(true);

                const data = await getSurahs();

                console.log("Quran API:", data);

                setSurahs(data);
            } catch (error) {
                console.error("Quran API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahs();
    }, []);

    // ================= BOOKMARK ID =================

    const getBookmarkId = (surahNumber) => {
        return `quran-surah-${surahNumber}`;
    };

    // ================= CHECK BOOKMARK =================

    const isBookmarked = (surahNumber) => {
        const bookmarkId = getBookmarkId(surahNumber);

        return bookmarks.some(
            (bookmark) =>
                bookmark.type === "quran" &&
                bookmark.bookmarkId === bookmarkId
        );
    };

    // ================= ADD / REMOVE BOOKMARK =================

    const handleBookmark = (surah) => {
        const bookmarkId = getBookmarkId(surah.number);

        const existingBookmark = bookmarks.find(
            (bookmark) =>
                bookmark.type === "quran" &&
                bookmark.bookmarkId === bookmarkId
        );

        // REMOVE
        if (existingBookmark) {
            dispatch(
                removeBookmark({
                    bookmarkId,
                })
            );

            toast.success("Surah removed from bookmarks");

            return;
        }

        // ADD
        dispatch(
            addBookmark({
                type: "quran",

                bookmarkId,

                number: surah.number,

                name: surah.name,

                englishName: surah.englishName,

                englishNameTranslation:
                    surah.englishNameTranslation,

                numberOfAyahs:
                    surah.numberOfAyahs,

                revelationType:
                    surah.revelationType,
            })
        );

        toast.success("Surah bookmarked");
    };

    // ================= SEARCH =================

    const filteredSurahs = surahs.filter((surah) => {
        const value = search.toLowerCase().trim();

        return (
            surah.englishName
                ?.toLowerCase()
                .includes(value) ||

            surah.englishNameTranslation
                ?.toLowerCase()
                .includes(value) ||

            surah.name
                ?.toLowerCase()
                .includes(value) ||

            String(surah.number).includes(value)
        );
    });

    // ================= UI =================

    return (
        <main className="min-h-screen bg-[#f6f9f7] text-slate-800">

            {/* ================= HERO ================= */}

            <section className="relative overflow-hidden bg-gradient-to-br from-[#052e25] via-[#065f46] to-[#047857]">

                {/* Decorative Elements */}

                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />

                <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

                    <div className="mx-auto max-w-3xl text-center">

                        {/* Badge */}

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 shadow-sm backdrop-blur-sm">

                            <BookOpen
                                size={15}
                                className="text-emerald-200"
                            />

                            Holy Quran

                        </div>

                        {/* Heading */}

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">

                            Read the Quran

                            <span className="mt-2 block bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                                With Peace & Reflection
                            </span>

                        </h1>

                        {/* Description */}

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base">

                            Explore all 114 Surahs of the Holy Quran
                            in a peaceful and simple reading experience.

                        </p>

                        {/* Small Stats */}

                        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-medium text-white backdrop-blur-sm">

                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                                    <BookOpen size={16} />
                                </span>

                                <span>
                                    <span className="block text-left text-[9px] uppercase tracking-widest text-emerald-100/70">
                                        Total
                                    </span>

                                    <span className="font-bold">
                                        114 Surahs
                                    </span>
                                </span>

                            </div>

                            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-medium text-white backdrop-blur-sm">

                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                                    <Sparkles size={16} />
                                </span>

                                <span>
                                    <span className="block text-left text-[9px] uppercase tracking-widest text-emerald-100/70">
                                        Explore
                                    </span>

                                    <span className="font-bold">
                                        Read & Reflect
                                    </span>
                                </span>

                            </div>

                        </div>

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 h-5 w-full rounded-t-[50%] bg-[#f6f9f7]" />

            </section>

            {/* ================= MAIN ================= */}

            <section className="mx-auto max-w-7xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8">

                {/* ================= SEARCH CARD ================= */}

                <div className="mx-auto max-w-2xl">

                    <div className="rounded-3xl border border-emerald-100 bg-white p-3 shadow-[0_8px_35px_rgba(6,95,70,0.06)] sm:p-4">

                        <div className="relative">

                            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-emerald-600">

                                <Search size={20} />

                            </div>

                            <input
                                type="text"
                                placeholder="Search Surah by name, translation or number..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/40 py-4 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 sm:text-base"
                            />

                        </div>

                        {/* Search Result Count */}

                        {!loading && (
                            <div className="flex items-center justify-between px-2 pt-3 text-xs text-slate-500">

                                <span>
                                    {search
                                        ? `${filteredSurahs.length} Surahs found`
                                        : `${surahs.length} Surahs available`}
                                </span>

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        className="font-semibold text-emerald-700 transition hover:text-emerald-900"
                                    >
                                        Clear search
                                    </button>
                                )}

                            </div>
                        )}

                    </div>

                </div>

                {/* ================= LOADING ================= */}

                {loading ? (

                    <div className="flex min-h-[380px] items-center justify-center">

                        <div className="rounded-3xl border border-emerald-100 bg-white px-8 py-10 text-center shadow-sm">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                                <LoaderCircle
                                    size={28}
                                    className="animate-spin"
                                />

                            </div>

                            <p className="mt-5 text-sm font-bold text-slate-700">
                                Surahs load ho rahi hain...
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Please wait a moment
                            </p>

                        </div>

                    </div>

                ) : (

                    /* ================= SURAH GRID ================= */

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredSurahs.length === 0 ? (

                            /* ================= NO RESULT ================= */

                            <div className="col-span-full rounded-3xl border border-emerald-100 bg-white px-5 py-14 text-center shadow-sm">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                                    <Search size={27} />

                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-800">
                                    No Surah Found
                                </h3>

                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Try another Surah name, translation
                                    or number.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-95"
                                >
                                    Show All Surahs
                                </button>

                            </div>

                        ) : (

                            filteredSurahs.map((surah) => {

                                const saved =
                                    isBookmarked(
                                        surah.number
                                    );

                                return (

                                    <div
                                        key={surah.number}
                                        className={`group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_6px_25px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(6,95,70,0.10)] ${
                                            saved
                                                ? "border-emerald-300 ring-1 ring-emerald-100"
                                                : "border-slate-200 hover:border-emerald-200"
                                        }`}
                                    >

                                        {/* Saved Indicator */}

                                        {saved && (
                                            <div className="absolute right-0 top-0 rounded-bl-2xl bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                Saved
                                            </div>
                                        )}

                                        {/* ================= TOP ================= */}

                                        <div className="flex items-start justify-between gap-3">

                                            {/* NUMBER + NAME */}

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-sm font-bold text-emerald-700 shadow-sm">

                                                    {surah.number}

                                                </div>

                                                <div className="min-w-0">

                                                    <h2 className="truncate text-lg font-bold text-slate-900">
                                                        {surah.englishName}
                                                    </h2>

                                                    <p className="mt-1 truncate text-xs font-medium text-slate-500 sm:text-sm">
                                                        {surah.englishNameTranslation}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* BOOKMARK */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleBookmark(
                                                        surah
                                                    )
                                                }
                                                title={
                                                    saved
                                                        ? "Remove bookmark"
                                                        : "Save bookmark"
                                                }
                                                aria-label={
                                                    saved
                                                        ? "Remove bookmark"
                                                        : "Save bookmark"
                                                }
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-90 ${
                                                    saved
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                        : "border-slate-200 bg-white text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                                                }`}
                                            >

                                                {saved ? (
                                                    <BookmarkCheck
                                                        size={19}
                                                        strokeWidth={2.2}
                                                    />
                                                ) : (
                                                    <Bookmark
                                                        size={19}
                                                        strokeWidth={2}
                                                    />
                                                )}

                                            </button>

                                        </div>

                                        {/* ================= ARABIC ================= */}

                                        <div className="mt-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/60 px-4 py-5 text-center">

                                            <p
                                                dir="rtl"
                                                lang="ar"
                                                className="text-2xl leading-relaxed text-emerald-950 sm:text-3xl"
                                                style={{
                                                    fontFamily:
                                                        "Amiri, serif",
                                                }}
                                            >
                                                {surah.name}
                                            </p>

                                            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">

                                                <BookOpen
                                                    size={13}
                                                    className="text-emerald-600"
                                                />

                                                {surah.numberOfAyahs} Ayahs

                                            </div>

                                        </div>

                                        {/* ================= DIVIDER ================= */}

                                        <div className="my-5 border-t border-slate-100" />

                                        {/* ================= BOTTOM ================= */}

                                        <div className="flex items-center justify-between gap-3">

                                            {/* Revelation */}

                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">

                                                <MapPin size={12} />

                                                {surah.revelationType}

                                            </span>

                                            {/* Read Button */}

                                            <Link
                                                to={`/quran/${surah.number}`}
                                                className="group/read inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-700/10 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-800 hover:to-emerald-700 active:scale-95 sm:text-sm"
                                            >
                                                Read Surah

                                                <ChevronRight
                                                    size={15}
                                                    className="transition-transform duration-200 group-hover/read:translate-x-0.5"
                                                />
                                            </Link>

                                        </div>

                                    </div>
                                );
                            })
                        )}

                    </div>
                )}

            </section>

        </main>
    );
}

export default Quran;