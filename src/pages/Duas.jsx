
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
    Bookmark,
    BookmarkCheck,
    BookOpen,
    Search,
    Sparkles,
    Heart,
    X,
    ArrowUpRight,
} from "lucide-react";

import { toast } from "react-toastify";

import getDuas from "../service/DuasApi.js";

import {
    addBookmark,
    removeBookmark,
} from "../redux/bookmarkSlice.js";

function Duas() {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [duas, setDuas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Redux bookmarks
    const bookmarks = useSelector(
        (state) => state.bookmark?.bookmarks ?? []
    );

    // Keep URL search synchronized
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        setSearch(urlSearch);
    }, [searchParams]);

    // Fetch Duas
    useEffect(() => {
        const fetchDuas = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDuas();

                setDuas(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Duas Error:", err);

                setError(
                    "We’re having trouble loading the Duas right now."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDuas();
    }, []);

    // Search
    const handleSearchChange = (e) => {
        const value = e.target.value;

        setSearch(value);

        if (value.trim()) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearch("");
        setSearchParams({});
    };

    // Filter Duas
    const filteredDuas = duas.filter((dua) => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) return true;

        return (
            dua.title?.toLowerCase().includes(searchText) ||
            dua.translation?.toLowerCase().includes(searchText) ||
            dua.transliteration?.toLowerCase().includes(searchText) ||
            dua.arabic?.includes(searchText) ||
            dua.source?.toLowerCase().includes(searchText)
        );
    });

    // Bookmark ID
    const getBookmarkId = (duaId) => `dua-${duaId}`;

    // Check bookmark
    const isBookmarked = (dua) => {
        const bookmarkId = getBookmarkId(dua.id);

        return bookmarks.some(
            (bookmark) =>
                bookmark.type === "dua" &&
                bookmark.bookmarkId === bookmarkId
        );
    };

    // Add / remove bookmark
    const handleBookmark = (dua) => {
        const bookmarkId = getBookmarkId(dua.id);

        const existingBookmark = bookmarks.find(
            (bookmark) =>
                bookmark.type === "dua" &&
                bookmark.bookmarkId === bookmarkId
        );

        if (existingBookmark) {
            dispatch(removeBookmark({ bookmarkId }));

            toast.success("Dua removed from bookmarks");
            return;
        }

        dispatch(
            addBookmark({
                type: "dua",
                bookmarkId,
                id: dua.id,
                title: dua.title || "",
                arabic: dua.arabic || "",
                transliteration: dua.transliteration || "",
                translation: dua.translation || "",
                source: dua.source || "",
            })
        );

        toast.success("Dua bookmarked");
    };

    const savedDuasCount = bookmarks.filter(
        (bookmark) => bookmark.type === "dua"
    ).length;

    return (
        <main className="min-h-screen overflow-hidden bg-[#f6f9f7] pb-16 text-slate-800">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#052e25] via-[#065f46] to-[#047857]">

                {/* Decorative background */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10" />

                <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20">

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 backdrop-blur-sm">
                            <Sparkles size={15} />
                            Noor • Daily Reminders
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Daily Duas
                            <span className="mt-2 block bg-gradient-to-r from-emerald-200 to-teal-100 bg-clip-text text-transparent">
                                Words of Peace
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-emerald-50/80 sm:text-base sm:leading-8">
                            Find comfort in beautiful supplications,
                            strengthen your connection with Allah, and
                            keep your favourite Duas close to your heart.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                                <BookOpen size={17} className="text-emerald-200" />
                                <span>
                                    {loading
                                        ? "Loading Duas..."
                                        : `${duas.length} ${duas.length === 1 ? "Dua" : "Duas"}`}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white backdrop-blur-sm">
                                <BookmarkCheck size={17} className="text-emerald-200" />
                                <span>{savedDuasCount} Saved</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom curve */}
                <div className="absolute bottom-0 left-0 h-5 w-full rounded-t-[50%] bg-[#f6f9f7]" />
            </section>

            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">

                {/* Section heading */}
                <div className="mb-7 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            <span className="h-px w-7 bg-emerald-500" />
                            Spiritual Collection
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Explore Duas
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Read, reflect, and save the supplications
                            that matter most to you.
                        </p>
                    </div>

                    {!loading && !error && (
                        <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5 text-sm shadow-sm sm:self-auto">
                            <Heart size={16} className="text-emerald-600" />

                            <span className="font-medium text-slate-600">
                                {search
                                    ? `${filteredDuas.length} results`
                                    : `${duas.length} available`}
                            </span>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="mb-8 rounded-2xl border border-emerald-100/80 bg-white p-3 shadow-sm sm:mb-10 sm:p-4">
                    <div className="relative">

                        <Search
                            size={20}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search by Dua name, translation, or source..."
                            className="w-full rounded-xl border border-transparent bg-[#f6f9f7] py-4 pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                                title="Clear search"
                                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {!loading && !error && (
                        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-3 text-xs text-slate-400">
                            <span>
                                {search
                                    ? `${filteredDuas.length} ${filteredDuas.length === 1 ? "result" : "results"} found`
                                    : "Discover supplications for your daily life"}
                            </span>

                            {savedDuasCount > 0 && (
                                <span className="font-semibold text-emerald-700">
                                    {savedDuasCount} saved for later
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-emerald-100 bg-white px-5 py-12 text-center shadow-sm">

                        <div>
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-emerald-100 border-t-emerald-600" />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800">
                                Preparing your Duas
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Please wait while we load your collection.
                            </p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-14 text-center shadow-sm sm:px-10">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <BookOpen size={28} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Unable to load Duas
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                            {error} Please check your internet connection
                            and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.98]"
                        >
                            Try Again
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filteredDuas.length === 0 && (
                    <div className="rounded-3xl border border-emerald-100 bg-white px-6 py-14 text-center shadow-sm sm:px-10">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Search size={28} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                            No Duas Found
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                            We couldn't find anything matching your search.
                            Try another keyword.
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}

                {/* Duas grid */}
                {!loading && !error && filteredDuas.length > 0 && (
                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">

                        {filteredDuas.map((dua) => {
                            const saved = isBookmarked(dua);

                            return (
                                <article
                                    key={dua.id}
                                    className={`group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7 ${
                                        saved
                                            ? "border-emerald-300 ring-1 ring-emerald-100"
                                            : "border-slate-200/80 hover:border-emerald-200"
                                    }`}
                                >
                                    {/* Card accent */}
                                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-800 via-emerald-500 to-teal-300 opacity-80" />

                                    {/* Card header */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">
                                            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                                <Sparkles size={12} />
                                                Daily Dua
                                            </div>

                                            <h3 className="mt-3 break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                                                {dua.title || "Untitled Dua"}
                                            </h3>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleBookmark(dua)}
                                            aria-label={
                                                saved
                                                    ? "Remove bookmark"
                                                    : "Save bookmark"
                                            }
                                            title={
                                                saved
                                                    ? "Remove from saved"
                                                    : "Save for later"
                                            }
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-90 ${
                                                saved
                                                    ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/10"
                                                    : "border-emerald-100 bg-white text-emerald-700 hover:border-emerald-700 hover:bg-emerald-700 hover:text-white"
                                            }`}
                                        >
                                            {saved ? (
                                                <BookmarkCheck size={20} />
                                            ) : (
                                                <Bookmark size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Arabic */}
                                    {dua.arabic && (
                                        <div className="relative mt-6 overflow-hidden rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-[#f1f8f3] to-[#f8fbf8] px-4 py-6 sm:px-6 sm:py-8">

                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                                                    Arabic
                                                </span>

                                                <span className="h-px w-10 bg-emerald-200" />
                                            </div>

                                            <p
                                                dir="rtl"
                                                lang="ar"
                                                className="text-right text-2xl leading-[2.2] text-slate-800 sm:text-3xl sm:leading-[2.1]"
                                                style={{
                                                    fontFamily: "Amiri, serif",
                                                }}
                                            >
                                                {dua.arabic}
                                            </p>

                                            <div className="mt-4 flex justify-center">
                                                <div className="h-1 w-10 rounded-full bg-emerald-300/80" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Transliteration */}
                                    {dua.transliteration && (
                                        <div className="mt-6">
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="h-5 w-1 rounded-full bg-teal-500" />
                                                <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                                    Transliteration
                                                </h4>
                                            </div>

                                            <p className="text-sm italic leading-7 text-slate-600 sm:text-base">
                                                {dua.transliteration}
                                            </p>
                                        </div>
                                    )}

                                    {/* Translation */}
                                    {dua.translation && (
                                        <div className="mt-6 border-t border-slate-100 pt-5">
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="h-5 w-1 rounded-full bg-emerald-600" />
                                                <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-800">
                                                    Translation
                                                </h4>
                                            </div>

                                            <p className="text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                                                {dua.translation}
                                            </p>
                                        </div>
                                    )}

                                    {/* Source */}
                                    {dua.source && (
                                        <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                                            <BookOpen
                                                size={16}
                                                className="mt-0.5 shrink-0 text-emerald-700"
                                            />

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                    Source
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {dua.source}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Saved indicator */}
                                    {saved && (
                                        <div className="mt-5 flex items-center gap-2 border-t border-emerald-100 pt-4 text-xs font-semibold text-emerald-700">
                                            <BookmarkCheck size={15} />
                                            Saved to your collection
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Bottom note */}
                {!loading && !error && duas.length > 0 && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-6 sm:mt-10 sm:px-8">

                        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                                <Heart size={22} />
                            </div>

                            <div>
                                <h3 className="font-bold text-emerald-950">
                                    Keep your favourite Duas close
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-emerald-800/80">
                                    Use the bookmark icon to save supplications
                                    and find them easily whenever you need them.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Duas;
