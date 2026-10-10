
import { useEffect, useMemo, useState } from "react";

import {
    BookOpen,
    Bookmark,
    BookmarkCheck,
    LoaderCircle,
    AlertCircle,
    RefreshCw,
    ChevronDown,
    Search,
    Languages,
    Sparkles,
    BookMarked,
    X,
    Quote,
} from "lucide-react";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import getHadiths from "../service/HadithApi";

import {
    addBookmark,
    removeBookmark,
} from "../redux/bookmarkSlice";


const HADITHS_PER_PAGE = 10;


function Hadith() {
    const dispatch = useDispatch();

    const bookmarks = useSelector(
        (state) => state.bookmark?.bookmarks || []
    );

    const [hadiths, setHadiths] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");

    // Fetch Hadiths
    const fetchHadiths = async (
        startId = 1,
        loadMore = false
    ) => {
        try {
            setError("");

            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const result = await getHadiths(
                startId,
                HADITHS_PER_PAGE
            );

            const newHadiths = result?.hadiths || [];

            if (newHadiths.length === 0) {
                if (loadMore) {
                    setHasMore(false);
                    toast.info("No more Hadiths available.");
                    return;
                }

                throw new Error(
                    "No Hadiths were returned by the API."
                );
            }

            setHadiths((previous) => {
                if (!loadMore) {
                    return newHadiths;
                }

                const existingIds = new Set(
                    previous.map((item) => item.hadithnumber)
                );

                return [
                    ...previous,
                    ...newHadiths.filter(
                        (item) =>
                            !existingIds.has(item.hadithnumber)
                    ),
                ];
            });

            setNextId(result.nextId);
            setHasMore(Boolean(result.hasMore));

        } catch (err) {
            console.error("Hadith API Error:", err);

            const message =
                err?.message || "Unable to load Hadiths.";

            if (loadMore) {
                toast.error("Could not load more Hadiths.");
            } else {
                setError(message);
                toast.error("Hadiths load nahi ho sake.");
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchHadiths(1, false);
    }, []);

    const handleLoadMore = () => {
        if (loadingMore || loading || !hasMore) return;

        fetchHadiths(nextId, true);
    };

    // Search loaded Hadiths
    const filteredHadiths = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return hadiths;

        return hadiths.filter((hadith) => {
            const searchableText = [
                hadith.hadithnumber,
                hadith.arabic,
                hadith.english,
                hadith.urdu,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [hadiths, search]);

    // Bookmark helpers
    const getBookmarkId = (hadith) =>
        `hadith-${hadith.hadithnumber}`;

    const isBookmarked = (hadith) => {
        const bookmarkId = getBookmarkId(hadith);

        return bookmarks.some(
            (item) => item.bookmarkId === bookmarkId
        );
    };

    const handleBookmark = (hadith) => {
        const bookmarkId = getBookmarkId(hadith);

        if (isBookmarked(hadith)) {
            dispatch(removeBookmark(bookmarkId));

            toast.info(
                `Hadith ${hadith.hadithnumber} removed from bookmarks.`
            );

            return;
        }

        dispatch(
            addBookmark({
                bookmarkId,
                type: "hadith",
                title: `Hadith ${hadith.hadithnumber}`,
                text:
                    hadith.english ||
                    hadith.urdu ||
                    hadith.arabic ||
                    "",
                arabic: hadith.arabic || "",
                english: hadith.english || "",
                urdu: hadith.urdu || "",
                translation:
                    hadith.urdu || hadith.english || "",
                reference: "Sahih Muslim",
                hadithnumber: hadith.hadithnumber,
                chapter: hadith.chapter || "",
                narrator: hadith.narrator || "",
            })
        );

        toast.success(
            `Hadith ${hadith.hadithnumber} bookmarked!`
        );
    };

    // Loading screen
    if (loading && hadiths.length === 0) {
        return (
            <main className="min-h-screen bg-[#f5f8f6]">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#073d32] via-[#0b5544] to-[#11745a] px-5 py-20 text-center">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/10" />

                    <div className="relative mx-auto max-w-3xl">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-emerald-100">
                            <BookOpen size={30} />
                        </div>

                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-emerald-200">
                            The Book of Hadith
                        </p>

                        <h1 className="text-3xl font-bold text-white sm:text-5xl">
                            Sahih Muslim
                        </h1>

                        <p className="mt-4 text-sm text-emerald-50/80">
                            Preparing your reading experience...
                        </p>

                        <div className="mx-auto mt-8 max-w-md space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-3 animate-pulse rounded-full bg-white/15"
                                    style={{
                                        width: `${100 - item * 15}%`,
                                    }}
                                />
                            ))}
                        </div>

                        <LoaderCircle
                            className="mx-auto mt-7 animate-spin text-emerald-200"
                            size={26}
                        />
                    </div>
                </div>
            </main>
        );
    }

    // Error screen
    if (error && hadiths.length === 0) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f8f6] px-5 py-12">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertCircle size={30} />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900">
                        Unable to load Hadiths
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchHadiths(1, false)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                    >
                        <RefreshCw size={17} />
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f8f6] text-slate-800">

            {/* Hero */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#073d32] via-[#0b5544] to-[#11745a]">
                <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-10 -top-16 -z-10 h-64 w-64 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

                <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:py-24">
                    <div className="mx-auto max-w-3xl text-center">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50 backdrop-blur">
                            <Sparkles size={15} />
                            KNOWLEDGE • FAITH • WISDOM
                        </div>

                        <div className="mx-auto mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-[26px] border border-white/20 bg-white/10 text-emerald-100 shadow-lg shadow-black/10">
                            <BookOpen size={35} strokeWidth={1.5} />
                        </div>

                        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-emerald-200">
                            THE COLLECTION OF HADITH
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Sahih Muslim
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                            Explore Hadith in three languages.
                            Read, reflect and save the teachings
                            for your daily journey.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white">
                                <Languages size={15} />
                                Arabic · English · Urdu
                            </span>

                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white">
                                <Bookmark size={15} />
                                Save your favourites
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:gap-5">
                        <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 text-center backdrop-blur-sm">
                            <p className="text-3xl font-bold text-white">
                                {hadiths.length}
                            </p>
                            <p className="mt-1 text-xs text-emerald-100/80">
                                Hadiths loaded
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 text-center backdrop-blur-sm">
                            <p className="text-3xl font-bold text-white">
                                {bookmarks.filter(
                                    (item) => item.type === "hadith"
                                ).length}
                            </p>
                            <p className="mt-1 text-xs text-emerald-100/80">
                                Saved Hadiths
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-1 w-full bg-gradient-to-r from-emerald-300/0 via-emerald-200/70 to-emerald-300/0" />
            </section>

            {/* Content */}
            <section className="mx-auto max-w-5xl px-4 py-9 sm:px-6 sm:py-12">

                {/* Section heading */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                            <BookMarked size={17} />
                            Your reading space
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Explore Hadiths
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Browse the collection and save the
                            Hadiths you want to revisit.
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Sahih Muslim collection
                    </span>
                </div>

                {/* Search */}
                <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-600/20">
                        <Search
                            size={20}
                            className="shrink-0 text-emerald-700"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search Arabic, English, Urdu or number..."
                            aria-label="Search Hadiths"
                            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                            >
                                <X size={17} />
                            </button>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-500">
                        <span>
                            {search
                                ? `${filteredHadiths.length} matching Hadiths`
                                : "Arabic, English and Urdu"}
                        </span>

                        <span>
                            {hadiths.length} loaded
                        </span>
                    </div>
                </div>

                {/* Cards */}
                {filteredHadiths.length > 0 ? (
                    <div className="space-y-6">
                        {filteredHadiths.map((hadith) => {
                            const bookmarked =
                                isBookmarked(hadith);

                            return (
                                <article
                                    key={`hadith-${hadith.hadithnumber}`}
                                    className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_3px_18px_rgba(15,23,42,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)]"
                                >
                                    {/* Card header */}
                                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/40 px-4 py-4 sm:px-6">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md shadow-emerald-900/10">
                                                <BookOpen
                                                    size={22}
                                                    strokeWidth={1.7}
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900">
                                                    Hadith{" "}
                                                    {hadith.hadithnumber}
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Sahih Muslim
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleBookmark(hadith)
                                            }
                                            aria-label={
                                                bookmarked
                                                    ? "Remove bookmark"
                                                    : "Save bookmark"
                                            }
                                            title={
                                                bookmarked
                                                    ? "Remove bookmark"
                                                    : "Save Hadith"
                                            }
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition duration-200 active:scale-95 ${
                                                bookmarked
                                                    ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                                                    : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                            }`}
                                        >
                                            {bookmarked ? (
                                                <BookmarkCheck
                                                    size={21}
                                                />
                                            ) : (
                                                <Bookmark
                                                    size={21}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {/* Arabic */}
                                    <div className="px-5 py-7 sm:px-8 sm:py-9">
                                        <div className="mb-5 flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                                <Languages size={16} />
                                            </span>

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                                                    Arabic
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    النص العربي
                                                </p>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-emerald-100/80 bg-[#f6faf7] px-4 py-6 sm:px-6 sm:py-8">
                                            <p
                                                dir="rtl"
                                                lang="ar"
                                                className="text-right font-serif text-2xl leading-[2.2] text-slate-800 sm:text-3xl sm:leading-[2.15]"
                                            >
                                                {hadith.arabic}
                                            </p>
                                        </div>
                                    </div>

                                    {/* English */}
                                    <div className="border-t border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
                                        <div className="mb-4 flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                                                <Quote size={16} />
                                            </span>

                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-800">
                                                English translation
                                            </p>
                                        </div>

                                        <p className="text-sm leading-8 text-slate-600 sm:text-base sm:leading-8">
                                            {hadith.english}
                                        </p>
                                    </div>

                                    {/* Urdu */}
                                    <div className="border-t border-slate-100 px-5 py-6 sm:px-8 sm:py-7">
                                        <div className="mb-4 flex items-center justify-end gap-3">
                                            <p className="text-xs font-bold tracking-wide text-violet-800">
                                                اردو ترجمہ
                                            </p>

                                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                                                <Languages size={16} />
                                            </span>
                                        </div>

                                        <div className="rounded-2xl bg-violet-50/60 px-4 py-5 sm:px-6 sm:py-6">
                                            <p
                                                dir="rtl"
                                                lang="ur"
                                                className="text-right text-lg leading-[2.2] text-slate-700 sm:text-xl"
                                            >
                                                {hadith.urdu}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-8">
                                        <span className="text-xs text-slate-400">
                                            Reference: Sahih Muslim #{hadith.hadithnumber}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                                            <BookMarked size={14} />
                                            Hadith
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Search size={25} />
                        </div>

                        <h3 className="text-lg font-bold text-slate-800">
                            No Hadiths found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            Try another keyword or clear your
                            search to browse the loaded Hadiths.
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* API error after some cards have loaded */}
                {error && hadiths.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-red-700">
                            Could not load additional Hadiths.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fetchHadiths(nextId, true)
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                )}

                {/* Load more */}
                {hadiths.length > 0 &&
                    hasMore &&
                    !search && (
                        <div className="mt-10 text-center">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="inline-flex min-w-48 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loadingMore ? (
                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Loading Hadiths...
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={19} />
                                        Load More Hadiths
                                    </>
                                )}
                            </button>

                            <p className="mt-3 text-xs text-slate-400">
                                Continue exploring Sahih Muslim
                            </p>
                        </div>
                    )}

                {!hasMore && hadiths.length > 0 && !search && (
                    <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-6 text-center">
                        <BookMarked
                            size={24}
                            className="mx-auto mb-2 text-emerald-700"
                        />

                        <p className="font-semibold text-emerald-900">
                            You have reached the end
                        </p>

                        <p className="mt-1 text-sm text-emerald-800/70">
                            No more matching Hadiths are available.
                        </p>
                    </div>
                )}
            </section>

            {/* Bottom note */}
            <footer className="border-t border-slate-200/80 bg-white px-5 py-7">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                        <BookOpen size={18} />
                        Sahih Muslim
                    </div>

                    <p className="max-w-xl text-xs leading-6 text-slate-400">
                        Read thoughtfully and verify references
                        when studying or sharing Hadith.
                    </p>
                </div>
            </footer>
        </main>
    );
}

export default Hadith;
