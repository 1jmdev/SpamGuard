// ============================================================================
// Language Dataset Loader
// Loads and manages multilingual spam detection datasets
// ============================================================================

import type {
    LanguageDataset,
    SupportedLanguage,
    SpamWord,
    SpamSubjectPattern,
    TokenProbability,
} from "./schema";
import { SUPPORTED_LANGUAGES, isSupportedLanguage } from "./schema";

// Static imports for all language datasets
import enData from "./en.json";
import esData from "./es.json";
import frData from "./fr.json";
import deData from "./de.json";
import ptData from "./pt.json";
import itData from "./it.json";
import nlData from "./nl.json";
import plData from "./pl.json";
import ruData from "./ru.json";

/**
 * Type for the raw JSON data (before processing)
 */
interface RawLanguageData {
    language: string;
    languageName: string;
    spamWords: SpamWord[];
    spamSingleWords: Record<string, number>;
    spamSubjectPatterns: Array<{ pattern: string; score: number; name: string }>;
    hamWords: Record<string, number>;
    bayesianTokens: Record<string, TokenProbability>;
    urgencyWords: string[];
    greetingWords: string[];
    genericGreetings: string[];
}

/**
 * Cached and processed language datasets
 */
const datasetCache = new Map<string, LanguageDataset>();

/**
 * Map of available language data files
 * Add new languages here as they are generated
 */
const languageDataMap: Record<string, RawLanguageData | null> = {
    en: enData as RawLanguageData,
    es: esData as RawLanguageData,
    fr: frData as RawLanguageData,
    de: deData as RawLanguageData,
    pt: ptData as RawLanguageData,
    it: itData as RawLanguageData,
    nl: nlData as RawLanguageData,
    pl: plData as RawLanguageData,
    ru: ruData as RawLanguageData,
};

/**
 * Process raw JSON data into a LanguageDataset
 * Compiles regex patterns and prepares data structures
 */
function processDataset(raw: RawLanguageData): LanguageDataset {
    return {
        language: raw.language,
        languageName: raw.languageName,
        spamWords: raw.spamWords,
        spamSingleWords: raw.spamSingleWords,
        spamSubjectPatterns: raw.spamSubjectPatterns.map((p) => ({
            pattern: p.pattern,
            score: p.score,
            name: p.name,
        })),
        hamWords: raw.hamWords,
        bayesianTokens: raw.bayesianTokens,
        urgencyWords: raw.urgencyWords,
        greetingWords: raw.greetingWords,
        genericGreetings: raw.genericGreetings,
    };
}

/**
 * Get a language dataset by language code
 *
 * @param langCode - ISO 639-1 language code (e.g., "en", "es")
 * @returns Language dataset (falls back to English if not available)
 */
export function getLanguageData(langCode: string): LanguageDataset {
    // Normalize language code
    const normalizedCode = langCode.toLowerCase().trim();

    // Check cache first
    if (datasetCache.has(normalizedCode)) {
        return datasetCache.get(normalizedCode)!;
    }

    // Try to get the requested language
    const rawData = languageDataMap[normalizedCode];

    if (rawData) {
        const dataset = processDataset(rawData);
        datasetCache.set(normalizedCode, dataset);
        return dataset;
    }

    // Fall back to English
    if (normalizedCode !== "en") {
        console.warn(
            `Language "${normalizedCode}" not available, falling back to English`
        );
    }

    // Get or create English dataset
    if (!datasetCache.has("en")) {
        const enDataset = processDataset(enData as RawLanguageData);
        datasetCache.set("en", enDataset);
    }

    return datasetCache.get("en")!;
}

/**
 * Check if a language has a dataset available
 *
 * @param langCode - ISO 639-1 language code
 * @returns true if language dataset is available
 */
export function hasLanguageData(langCode: string): boolean {
    const normalizedCode = langCode.toLowerCase().trim();
    return languageDataMap[normalizedCode] !== null && languageDataMap[normalizedCode] !== undefined;
}

/**
 * Get list of available languages (languages with datasets)
 *
 * @returns Array of available language codes
 */
export function getAvailableLanguages(): string[] {
    return Object.entries(languageDataMap)
        .filter(([, data]) => data !== null)
        .map(([code]) => code);
}

/**
 * Get all supported language codes (including those without datasets yet)
 *
 * @returns Array of all supported language codes
 */
export function getAllSupportedLanguages(): readonly string[] {
    return SUPPORTED_LANGUAGES;
}

/**
 * Preload all available language datasets into cache
 * Useful for warming up before handling requests
 */
export function preloadAllLanguages(): void {
    for (const [code, data] of Object.entries(languageDataMap)) {
        if (data && !datasetCache.has(code)) {
            datasetCache.set(code, processDataset(data));
        }
    }
}

/**
 * Clear the dataset cache
 * Useful for testing or memory management
 */
export function clearCache(): void {
    datasetCache.clear();
}

/**
 * Get spam words for a language
 */
export function getSpamWords(langCode: string): SpamWord[] {
    return getLanguageData(langCode).spamWords;
}

/**
 * Get ham words for a language
 */
export function getHamWords(langCode: string): Record<string, number> {
    return getLanguageData(langCode).hamWords;
}

/**
 * Get Bayesian tokens for a language
 */
export function getBayesianTokens(
    langCode: string
): Record<string, TokenProbability> {
    return getLanguageData(langCode).bayesianTokens;
}

/**
 * Get urgency words for a language
 */
export function getUrgencyWords(langCode: string): string[] {
    return getLanguageData(langCode).urgencyWords;
}

// Re-export types and utilities from schema
export type { LanguageDataset, SupportedLanguage, SpamWord, SpamSubjectPattern, TokenProbability };
export { SUPPORTED_LANGUAGES, isSupportedLanguage };
