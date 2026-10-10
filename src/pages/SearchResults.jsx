
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  BookOpen,
  HandHeart,
  ScrollText,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

import getDuas from "../service/DuasApi.js";
import getSurahs from "../service/QuranApi.js";

// =====================================================
// CONSTANTS
// =====================================================

const HADITH_BOOKS = [
  {
    id: "bukhari",
    name: "Sahih Bukhari",
  },
  {
    id: "muslim",
    name: "Sahih Muslim",
  },
  {
    id: "abudawud",
    name: "Sunan Abu Dawud",
  },
  {
    id: "tirmidzi",
    name: "Jami Tirmidhi",
  },
  {
    id: "nasai",
    name: "Sunan Nasai",
  },
  {
    id: "ibnmajah",
    name: "Sunan Ibn Majah",
  },
];

const MAX_RESULTS = 12;

// Cache Hadith books so they don't download again
// whenever the user searches a new keyword.
const hadithCache = new Map();

// =====================================================
// HELPERS
// =====================================================

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesQuery(value, query) {
  return normalizeText(value).includes(
    normalizeText(query)
  );
}

function getDuaSearchText(dua) {
  return [
    dua?.title,
    dua?.name,
    dua?.arabic,
    dua?.arabicText,
    dua?.transliteration,
    dua?.translation,
    dua?.source,
    dua?.reference,
    dua?.category,
    dua?.english,
    dua?.meaning,
  ]
    .filter(Boolean)
    .join(" ");
}

function getHadithSearchText(item) {
  return [
    item?.arab,
    item?.arabic,
    item?.id,
    item?.translation,
    item?.english,
    item?.number,
  ]
    .filter(Boolean)
    .join(" ");
}

// =====================================================
// HADITH API
// =====================================================

function getHadithBook(book) {
  if (!hadithCache.has(book.id)) {
    const request = fetch(
      `https://api.hadith.gading.dev/books/${book.id}?range=1-300`
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `${book.name} request failed: ${response.status}`
          );
        }

        const payload = await response.json();

        const records = payload?.data?.hadith;

        if (!Array.isArray(records)) {
          throw new Error(
            `Invalid response for ${book.name}`
          );
        }

        return records;
      })
      .catch((error) => {
        // Allow failed request to be retried later.
        hadithCache.delete(book.id);
        throw error;
      });

    hadithCache.set(book.id, request);
  }

  return hadithCache.get(book.id);
}

// =====================================================
// REUSABLE UI
// =====================================================

function SectionHeading({
  icon: Icon,
  title,
  count,
  subtitle,
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={20} />
        </div>

        <div className="min-w-0">

          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>
      </div>

      <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
        {count}
      </span>
    </div>
  );
}

function EmptySection({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
      <p className="text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}

function ErrorSection({ text, onRetry }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

      <div className="flex items-start gap-3">

        <AlertCircle
          size={19}
          className="mt-0.5 shrink-0 text-amber-700"
        />

        <div className="flex-1">

          <p className="text-sm leading-6 text-amber-900">
            {text}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-950"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

function LoadingCards({ count = 2 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">

      {Array.from(
        { length: count },
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >

            <div className="h-4 w-20 rounded bg-slate-200" />

            <div className="mt-4 h-5 w-2/3 rounded bg-slate-200" />

            <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />

            <div className="mt-7 h-9 w-28 rounded-xl bg-slate-100" />

          </div>
        )
      )}

    </div>
  );
}

// =====================================================
// MAIN COMPONENT
// =====================================================

function SearchResults() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const query =
    searchParams.get("search") ||
    searchParams.get("q") ||
    "";

  const searchQuery = query.trim();

  const [surahs, setSurahs] = useState([]);
  const [duas, setDuas] = useState([]);
  const [hadith, setHadith] = useState([]);

  const [loading, setLoading] = useState(false);

  const [surahError, setSurahError] =
    useState(false);

  const [duaError, setDuaError] =
    useState(false);

  const [hadithError, setHadithError] =
    useState(false);

  const [retryKey, setRetryKey] = useState(0);

  // ===================================================
  // LOAD SEARCH RESULTS
  // ===================================================

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      if (!searchQuery) {
        setSurahs([]);
        setDuas([]);
        setHadith([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      setSurahs([]);
      setDuas([]);
      setHadith([]);

      setSurahError(false);
      setDuaError(false);
      setHadithError(false);

      const normalizedQuery =
        normalizeText(searchQuery);

      // =================================================
      // SEARCH TASKS
      // =================================================

      const tasks = [

        // -----------------------------------------------
        // QURAN SURAH SEARCH
        // -----------------------------------------------

        (async () => {
          try {
            const response = await getSurahs();

            const allSurahs = Array.isArray(response)
              ? response
              : [];

            const results = allSurahs.filter(
              (surah) => {
                const number = String(
                  surah?.number ?? ""
                );

                const searchable = [
                  surah?.englishName,
                  surah?.englishNameTranslation,
                  surah?.name,
                  number,
                  `surah ${number}`,
                ];

                return searchable.some(
                  (value) =>
                    matchesQuery(
                      value,
                      normalizedQuery
                    )
                );
              }
            );

            if (!cancelled) {
              setSurahs(
                results.slice(0, MAX_RESULTS)
              );
            }
          } catch (error) {
            console.error(
              "Surah search error:",
              error
            );

            if (!cancelled) {
              setSurahError(true);
            }
          }
        })(),

        // -----------------------------------------------
        // DUAS SEARCH
        // -----------------------------------------------

        (async () => {
          try {
            const response = await getDuas();

            const allDuas = Array.isArray(response)
              ? response
              : [];

            const results = allDuas.filter(
              (dua) =>
                matchesQuery(
                  getDuaSearchText(dua),
                  normalizedQuery
                )
            );

            if (!cancelled) {
              setDuas(
                results.slice(0, MAX_RESULTS)
              );
            }
          } catch (error) {
            console.error(
              "Dua search error:",
              error
            );

            if (!cancelled) {
              setDuaError(true);
            }
          }
        })(),

        // -----------------------------------------------
        // HADITH SEARCH
        // -----------------------------------------------

        (async () => {
          const responses =
            await Promise.allSettled(
              HADITH_BOOKS.map(async (book) => {
                const records =
                  await getHadithBook(book);

                return {
                  book,
                  records,
                };
              })
            );

          const successfulResponses =
            responses.filter(
              (result) =>
                result.status === "fulfilled"
            );

          const results = [];

          successfulResponses.forEach(
            (result) => {
              const {
                book,
                records,
              } = result.value;

              records.forEach((item) => {
                if (
                  matchesQuery(
                    getHadithSearchText(item),
                    normalizedQuery
                  )
                ) {
                  results.push({
                    book: book.name,
                    bookId: book.id,
                    number:
                      item?.number ?? "",
                    arabic:
                      item?.arab ||
                      item?.arabic ||
                      "",
                    translation:
                      item?.id ||
                      item?.translation ||
                      item?.english ||
                      "",
                  });
                }
              });
            }
          );

          if (!cancelled) {
            setHadith(
              results.slice(0, MAX_RESULTS)
            );

            // Show error only if all books failed.
            setHadithError(
              successfulResponses.length === 0
            );
          }
        })(),
      ];

      await Promise.allSettled(tasks);

      if (!cancelled) {
        setLoading(false);
      }
    }

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, retryKey]);

  // ===================================================
  // RESULT COUNTS
  // ===================================================

  const totalResults = useMemo(
    () =>
      surahs.length +
      duas.length +
      hadith.length,
    [surahs, duas, hadith]
  );

  const hasError =
    surahError ||
    duaError ||
    hadithError;

  // ===================================================
  // ACTIONS
  // ===================================================

  const clearSearch = () => {
    setSearchParams({});
  };

  const retrySearch = () => {
    setRetryKey(
      (previous) => previous + 1
    );
  };

  // ===================================================
  // EMPTY QUERY
  // ===================================================

  if (!searchQuery) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">

        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Search size={28} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
            Noor Islamic App
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What are you looking for?
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
            Search the Quran, discover Duas, and
            explore Hadith from one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">

            {[
              "Al-Fatiha",
              "Patience",
              "Prayer",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  setSearchParams({
                    q: suggestion,
                  })
                }
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {suggestion}
              </button>
            ))}

          </div>

        </div>
      </main>
    );
  }

  // ===================================================
  // RESULTS PAGE
  // ===================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="mb-10">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
              <Search size={21} />
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Noor Search
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Search Results
              </h1>

            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Sparkles size={18} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-slate-500">
                  Searching for
                </p>

                <p className="mt-1 break-words text-base font-semibold text-slate-900 sm:text-lg">
                  {query}
                </p>

                <p className="mt-1 text-xs text-slate-500">

                  {loading
                    ? "Searching across available sources..."
                    : `${totalResults} result${
                        totalResults !== 1
                          ? "s"
                          : ""
                      } found`}

                </p>

              </div>

              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                title="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>

          </div>

        </header>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="space-y-10">

            <section>
              <div className="mb-4 h-6 w-44 animate-pulse rounded bg-slate-200" />
              <LoadingCards />
            </section>

            <section>
              <div className="mb-4 h-6 w-32 animate-pulse rounded bg-slate-200" />
              <LoadingCards />
            </section>

            <section>
              <div className="mb-4 h-6 w-36 animate-pulse rounded bg-slate-200" />
              <LoadingCards />
            </section>

          </div>
        )}

        {/* ================================================= */}
        {/* RESULTS */}
        {/* ================================================= */}

        {!loading && (
          <div className="space-y-12">

            {/* ================================================= */}
            {/* QURAN & SURAHS */}
            {/* ================================================= */}

            <section>

              <SectionHeading
                icon={BookOpen}
                title="Quran & Surahs"
                count={surahs.length}
                subtitle="Find a Surah by name or number"
              />

              {surahError ? (

                <ErrorSection
                  text="Surah information could not be loaded."
                  onRetry={retrySearch}
                />

              ) : surahs.length > 0 ? (

                <div className="grid gap-4 md:grid-cols-2">

                  {surahs.map((surah) => (
                    <article
                      key={surah.number}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-6"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                            {surah.number}
                          </div>

                          <div className="min-w-0">

                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                              Surah
                            </p>

                            <h3 className="mt-1 break-words text-lg font-bold text-slate-900">
                              {surah.englishName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                surah.englishNameTranslation
                              }
                            </p>

                          </div>

                        </div>

                        <div className="shrink-0 text-right">

                          <p
                            dir="rtl"
                            className="text-2xl text-slate-800"
                            style={{
                              fontFamily:
                                "Amiri, serif",
                            }}
                          >
                            {surah.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {surah.numberOfAyahs} Ayahs
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {surah.revelationType}
                        </span>

                        <Link
                          to={`/quran/${surah.number}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          Read Surah
                          <ArrowUpRight size={15} />
                        </Link>

                      </div>

                    </article>
                  ))}

                </div>

              ) : (

                <EmptySection
                  text="No matching Surah found. Try a name such as Al-Fatiha or a Surah number."
                />

              )}

            </section>

            {/* ================================================= */}
            {/* DUAS */}
            {/* ================================================= */}

            <section>

              <SectionHeading
                icon={HandHeart}
                title="Duas"
                count={duas.length}
                subtitle="Search supplications and their meanings"
              />

              {duaError ? (

                <ErrorSection
                  text="Duas could not be loaded. Please try again."
                  onRetry={retrySearch}
                />

              ) : duas.length > 0 ? (

                <div className="grid gap-4 lg:grid-cols-2">

                  {duas.map((dua, index) => (
                    <article
                      key={
                        dua.id ||
                        `${dua.title || dua.name}-${index}`
                      }
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
                    >

                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Dua
                      </span>

                      <h3 className="mt-3 text-lg font-bold text-slate-900">
                        {dua.title ||
                          dua.name ||
                          "Dua"}
                      </h3>

                      {(dua.arabic ||
                        dua.arabicText) && (
                        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-5">

                          <p
                            dir="rtl"
                            className="text-right text-2xl leading-[2.2] text-slate-800"
                            style={{
                              fontFamily:
                                "Amiri, serif",
                            }}
                          >
                            {dua.arabic ||
                              dua.arabicText}
                          </p>

                        </div>
                      )}

                      {dua.transliteration && (
                        <p className="mt-4 text-sm italic leading-7 text-slate-500">
                          {dua.transliteration}
                        </p>
                      )}

                      {(dua.translation ||
                        dua.english ||
                        dua.meaning) && (
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                          {dua.translation ||
                            dua.english ||
                            dua.meaning}
                        </p>
                      )}

                      {(dua.source ||
                        dua.reference) && (
                        <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-400">
                          Source:{" "}
                          {dua.source ||
                            dua.reference}
                        </p>
                      )}

                    </article>
                  ))}

                </div>

              ) : (

                <EmptySection
                  text="No matching Duas found. Try searching by title, meaning, or transliteration."
                />

              )}

            </section>

            {/* ================================================= */}
            {/* HADITH */}
            {/* ================================================= */}

            <section>

              <SectionHeading
                icon={ScrollText}
                title="Hadith"
                count={hadith.length}
                subtitle="Search available Hadith collections"
              />

              {hadithError ? (

                <ErrorSection
                  text="Hadith services are unavailable right now. Please try again later."
                  onRetry={retrySearch}
                />

              ) : hadith.length > 0 ? (

                <div className="space-y-4">

                  {hadith.map((item, index) => (
                    <article
                      key={`${item.bookId}-${item.number}-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
                    >

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                            Hadith
                          </p>

                          <h3 className="mt-1 font-bold text-slate-900">
                            {item.book}
                          </h3>

                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          #{item.number}
                        </span>

                      </div>

                      {item.arabic && (
                        <p
                          dir="rtl"
                          className="mt-5 text-right text-2xl leading-[2.2] text-slate-800"
                          style={{
                            fontFamily:
                              "Amiri, serif",
                          }}
                        >
                          {item.arabic}
                        </p>
                      )}

                      {item.translation && (
                        <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-7 text-slate-600">
                          {item.translation}
                        </p>
                      )}

                    </article>
                  ))}

                </div>

              ) : (

                <EmptySection
                  text="No matching Hadith found in the available records."
                />

              )}

            </section>

            {/* ================================================= */}
            {/* NO RESULTS */}
            {/* ================================================= */}

            {totalResults === 0 &&
              !hasError && (
                <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:py-16">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Search size={24} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    No Results Found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                    We couldn't find anything
                    matching "{query}". Check the
                    spelling or try a different
                    keyword.
                  </p>

                  <button
                    type="button"
                    onClick={clearSearch}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Search size={16} />
                    Start a new search
                  </button>

                </div>
              )}

            {/* ================================================= */}
            {/* PARTIAL ERROR */}
            {/* ================================================= */}

            {totalResults > 0 &&
              hasError && (
                <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-6 text-slate-500">
                  Some search sources could not be
                  reached. The results shown above
                  are from the sources that responded.
                </p>
              )}

          </div>
        )}
      </div>
    </main>
  );
}

export default SearchResults;
