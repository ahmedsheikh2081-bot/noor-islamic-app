const API_BASE =
    "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

// Cache editions so they are downloaded only once
let editionsPromise = null;


// ---------------------------------------------
// Fetch complete edition with fallback
// ---------------------------------------------
async function fetchEdition(edition) {
    const urls = [
        `${API_BASE}/${edition}.min.json`,
        `${API_BASE}/${edition}.json`,
        `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${edition}.min.json`,
        `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${edition}.json`,
    ];

    let lastError;

    for (const url of urls) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data.hadiths)) {
                throw new Error(
                    `Invalid edition format: ${edition}`
                );
            }

            return data.hadiths;
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(
        `Unable to load ${edition}: ${
            lastError?.message || "Unknown error"
        }`
    );
}


// ---------------------------------------------
// Get non-empty text
// ---------------------------------------------
function getText(hadith) {
    return typeof hadith?.text === "string"
        ? hadith.text.trim()
        : "";
}


// ---------------------------------------------
// Load and cache all 3 editions
// ---------------------------------------------
async function loadAllEditions() {
    if (!editionsPromise) {
        editionsPromise = Promise.all([
            fetchEdition("ara-muslim"),
            fetchEdition("eng-muslim"),
            fetchEdition("urd-muslim"),
        ])
            .then(([arabicList, englishList, urduList]) => {
                const toMap = (list) =>
                    new Map(
                        list.map((item) => [
                            Number(item.hadithnumber),
                            item,
                        ])
                    );

                const arabicMap = toMap(arabicList);
                const englishMap = toMap(englishList);
                const urduMap = toMap(urduList);

                // Keep only Hadiths available in all languages
                const commonNumbers = [...arabicMap.keys()]
                    .filter((number) => {
                        const arabic = arabicMap.get(number);
                        const english = englishMap.get(number);
                        const urdu = urduMap.get(number);

                        return (
                            !!getText(arabic) &&
                            !!getText(english) &&
                            !!getText(urdu)
                        );
                    })
                    .sort((a, b) => a - b);

                return commonNumbers.map((number) => {
                    const arabic = arabicMap.get(number);
                    const english = englishMap.get(number);
                    const urdu = urduMap.get(number);

                    return {
                        hadithnumber: number,
                        arabic: getText(arabic),
                        english: getText(english),
                        urdu: getText(urdu),
                        chapter: "",
                        narrator: "",
                    };
                });
            })
            .catch((error) => {
                // Allow retry if the initial download fails
                editionsPromise = null;
                throw error;
            });
    }

    return editionsPromise;
}


// ---------------------------------------------
// Public function used by Hadith.jsx
// ---------------------------------------------
async function getHadiths(startId = 1, count = 10) {
    const start = Math.max(1, Number(startId) || 1);
    const limit = Math.max(1, Number(count) || 10);

    const allHadiths = await loadAllEditions();

    const available = allHadiths.filter(
        (hadith) => hadith.hadithnumber >= start
    );

    const hadiths = available.slice(0, limit);

    const nextId =
        hadiths.length > 0
            ? hadiths[hadiths.length - 1].hadithnumber + 1
            : start;

    return {
        hadiths,
        nextId,
        hasMore: available.length > hadiths.length,
    };
}

export default getHadiths;