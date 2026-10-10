
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Bookmark,
    BookmarkX,
    BookOpen,
    HandHeart,
    ScrollText,
    Quote,
} from "lucide-react";

import { removeBookmark } from "../redux/bookmarkSlice";

function Bookmarks() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ================= REDUX BOOKMARKS =================

    const bookmarks = useSelector(
        (state) => state.bookmark?.bookmarks ?? []
    );


    // ================= FILTER BOOKMARKS =================

    // Quran Surah
    const quranBookmarks = bookmarks.filter(
        (bookmark) => bookmark.type === "quran"
    );

    // Quran Ayah
    const quranAyahBookmarks = bookmarks.filter(
        (bookmark) => bookmark.type === "quran-ayah"
    );

    // Duas
    const duaBookmarks = bookmarks.filter(
        (bookmark) => bookmark.type === "dua"
    );

    // Hadith
    const hadithBookmarks = bookmarks.filter(
        (bookmark) => bookmark.type === "hadith"
    );


    // ================= REMOVE =================

    const handleRemove = (bookmark) => {
        dispatch(
            removeBookmark({
                bookmarkId: bookmark.bookmarkId,
            })
        );
    };


    // ================= READ AYAH =================

    const handleReadAyah = (bookmark) => {
        navigate(`/quran/${bookmark.surahNumber}`, {
            state: {
                ayahNumber: bookmark.ayahNumberInSurah,
            },
        });
    };


    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Bookmark size={22} />
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                                My Bookmarks
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Your saved Quran, Hadith and Duas
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================= */}
                {/* SAVED HADITHS */}
                {/* ================================= */}

                {hadithBookmarks.length > 0 && (

                    <section className="mb-10">

                        <div className="mb-4 flex items-center gap-2">

                            <ScrollText
                                size={20}
                                className="text-emerald-600"
                            />

                            <h2 className="text-xl font-bold text-slate-800">
                                Saved Hadith
                            </h2>

                        </div>


                        <div className="grid gap-5 lg:grid-cols-2">

                            {hadithBookmarks.map((bookmark) => (

                                <div
                                    key={bookmark.bookmarkId}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                                >

                                    {/* Top */}

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                                <Quote size={19} />
                                            </div>

                                            <div>

                                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                                                    {bookmark.category}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Hadith #{bookmark.hadithNumber}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Hadith Text */}

                                    <p className="mt-6 text-base leading-8 text-slate-700 sm:text-lg">
                                        {bookmark.text}
                                    </p>


                                    {/* Reference */}

                                    <div className="mt-6 border-t border-slate-100 pt-5">

                                        <p className="text-sm font-semibold text-slate-700">
                                            {bookmark.reference}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Hadith #{bookmark.hadithNumber}
                                        </p>

                                    </div>


                                    {/* Remove */}

                                    <button
                                        onClick={() =>
                                            handleRemove(bookmark)
                                        }
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >

                                        <BookmarkX size={17} />

                                        Remove

                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>

                )}


                {/* ================================= */}
                {/* SAVED AYahs */}
                {/* ================================= */}

                {quranAyahBookmarks.length > 0 && (

                    <section className="mb-10">

                        <div className="mb-4 flex items-center gap-2">

                            <BookOpen
                                size={20}
                                className="text-emerald-600"
                            />

                            <h2 className="text-xl font-bold text-slate-800">
                                Saved Ayahs
                            </h2>

                        </div>


                        <div className="space-y-4">

                            {quranAyahBookmarks.map((bookmark) => (

                                <div
                                    key={bookmark.bookmarkId}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >

                                    {/* Surah Information */}

                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                                        <div>

                                            <h3 className="font-bold text-slate-800">
                                                {bookmark.surahEnglishName}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {bookmark.surahName}
                                            </p>

                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            Ayah {bookmark.ayahNumberInSurah}
                                        </span>

                                    </div>


                                    {/* Arabic */}

                                    <p
                                        dir="rtl"
                                        className="mb-4 text-right font-serif text-2xl leading-[2.2] text-slate-800"
                                    >
                                        {bookmark.arabicText}
                                    </p>


                                    {/* Urdu */}

                                    {bookmark.urduText && (

                                        <p
                                            dir="rtl"
                                            className="mb-5 rounded-xl bg-slate-50 p-4 text-right leading-8 text-slate-600"
                                        >
                                            {bookmark.urduText}
                                        </p>

                                    )}


                                    {/* Buttons */}

                                    <div className="flex flex-wrap gap-3">

                                        <button
                                            onClick={() =>
                                                handleReadAyah(bookmark)
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            <BookOpen size={17} />
                                            Read Ayah
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleRemove(bookmark)
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <BookmarkX size={17} />
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                )}


                {/* ================================= */}
                {/* SAVED DUAS */}
                {/* ================================= */}

                {duaBookmarks.length > 0 && (

                    <section className="mb-10">

                        <div className="mb-4 flex items-center gap-2">

                            <HandHeart
                                size={20}
                                className="text-emerald-600"
                            />

                            <h2 className="text-xl font-bold text-slate-800">
                                Saved Duas
                            </h2>

                        </div>


                        <div className="space-y-4">

                            {duaBookmarks.map((bookmark) => (

                                <div
                                    key={bookmark.bookmarkId}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >

                                    <h3 className="mb-3 text-lg font-bold text-slate-800">
                                        {bookmark.title}
                                    </h3>


                                    {/* Arabic */}

                                    <p
                                        dir="rtl"
                                        className="mb-4 text-right font-serif text-xl leading-[2.2] text-slate-800"
                                    >
                                        {bookmark.arabic}
                                    </p>


                                    {/* Transliteration */}

                                    {bookmark.transliteration && (

                                        <p className="mb-3 text-sm italic text-slate-500">
                                            {bookmark.transliteration}
                                        </p>

                                    )}


                                    {/* Translation */}

                                    {bookmark.translation && (

                                        <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                                            {bookmark.translation}
                                        </p>

                                    )}


                                    {/* Source */}

                                    {bookmark.source && (

                                        <p className="mt-4 text-xs font-medium text-slate-400">
                                            Source: {bookmark.source}
                                        </p>

                                    )}


                                    {/* Remove */}

                                    <button
                                        onClick={() =>
                                            handleRemove(bookmark)
                                        }
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        <BookmarkX size={17} />
                                        Remove
                                    </button>

                                </div>

                            ))}

                        </div>

                    </section>

                )}


                {/* ================================= */}
                {/* SAVED SURAHS */}
                {/* ================================= */}

                {quranBookmarks.length > 0 && (

                    <section className="mb-10">

                        <div className="mb-4 flex items-center gap-2">

                            <BookOpen
                                size={20}
                                className="text-emerald-600"
                            />

                            <h2 className="text-xl font-bold text-slate-800">
                                Saved Surahs
                            </h2>

                        </div>


                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {quranBookmarks.map((bookmark) => (

                                <div
                                    key={bookmark.bookmarkId}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    <h3 className="font-bold text-slate-800">
                                        {bookmark.englishName}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {bookmark.name}
                                    </p>

                                    <p className="mt-3 text-xs text-slate-400">
                                        {bookmark.numberOfAyahs} Ayahs
                                    </p>


                                    <div className="mt-4 flex flex-wrap gap-2">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/quran/${bookmark.number}`
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                        >
                                            <BookOpen size={16} />
                                            Open Surah
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleRemove(bookmark)
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <BookmarkX size={16} />
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                )}


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {bookmarks.length === 0 && (

                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                        <Bookmark
                            size={40}
                            className="mx-auto mb-4 text-slate-300"
                        />

                        <h2 className="text-xl font-bold text-slate-700">
                            No bookmarks yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Save your favorite Quran Ayahs, Surahs,
                            Hadith or Duas and they will appear here.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Bookmarks;