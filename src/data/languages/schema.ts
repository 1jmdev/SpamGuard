// ============================================================================
// Language Dataset Schema
// Defines the structure for multilingual spam detection datasets
// ============================================================================

/**
 * Spam word entry with score and category
 */
export interface SpamWord {
    word: string;
    score: number;
    category:
        | "finance"
        | "urgency"
        | "adult"
        | "health"
        | "scam"
        | "marketing"
        | "phishing"
        | "lottery"
        | "drugs"
        | "crypto";
    caseSensitive?: boolean;
}

/**
 * Spam subject pattern with regex and score
 */
export interface SpamSubjectPattern {
    pattern: string; // Regex pattern as string (will be compiled at runtime)
    score: number;
    name: string;
}

/**
 * Token probability for Bayesian analysis
 */
export interface TokenProbability {
    spam: number; // P(token|spam)
    ham: number; // P(token|ham)
}

/**
 * Complete language dataset for spam detection
 */
export interface LanguageDataset {
    /** ISO 639-1 language code (e.g., "en", "es", "fr") */
    language: string;

    /** Human-readable language name */
    languageName: string;

    /** Spam phrases and words with scores */
    spamWords: SpamWord[];

    /** Single word triggers (obfuscated words like "v1agra") */
    spamSingleWords: Record<string, number>;

    /** Subject line patterns (regex strings) */
    spamSubjectPatterns: SpamSubjectPattern[];

    /** Ham words that reduce spam score */
    hamWords: Record<string, number>;

    /** Bayesian token probabilities */
    bayesianTokens: Record<string, TokenProbability>;

    /** Urgency words for pattern matching */
    urgencyWords: string[];

    /** Greeting words (hello, dear, etc.) */
    greetingWords: string[];

    /** Generic greeting patterns (dear sir/madam, etc.) */
    genericGreetings: string[];
}

/**
 * Supported language codes
 */
export const SUPPORTED_LANGUAGES = [
    "en", // English
    "es", // Spanish
    "fr", // French
    "de", // German
    "pt", // Portuguese
    "it", // Italian
    "nl", // Dutch
    "pl", // Polish
    "ru", // Russian
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Language names for display
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    it: "Italian",
    nl: "Dutch",
    pl: "Polish",
    ru: "Russian",
};

/**
 * Check if a language code is supported
 */
export function isSupportedLanguage(code: string): code is SupportedLanguage {
    return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}
