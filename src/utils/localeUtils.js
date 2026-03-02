/**
 * Utility functions for handling locale, currency, and time based on user location
 */

// Default values
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_TIMEZONE = 'UTC';

// In-memory cache for location data
let cachedLocation = null;

/**
 * Fetches location data based on the user's IP
 * @returns {Promise<Object>} - Location data
 */
export const detectLocation = async () => {
    if (cachedLocation) return cachedLocation;

    // Check localStorage first
    const saved = localStorage.getItem('user_location');
    if (saved) {
        try {
            cachedLocation = JSON.parse(saved);
            return cachedLocation;
        } catch (e) {
            console.warn('Failed to parse saved location');
        }
    }

    try {
        // Using a free IP info API (no key required for basic usage)
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch location from IP');

        const data = await response.json();

        // Map common country codes to currency
        const countryCurrencyMap = {
            'IN': 'INR',
            'US': 'USD',
            'GB': 'GBP',
            'EU': 'EUR',
            'AE': 'AED',
            'CA': 'CAD',
            'AU': 'AUD'
            // Add more as needed
        };

        const location = {
            country: data.country_name || 'United States',
            countryCode: data.country_code || 'US',
            city: data.city || 'Unknown',
            currency: countryCurrencyMap[data.country_code] || data.currency || DEFAULT_CURRENCY,
            timezone: data.timezone || DEFAULT_TIMEZONE,
            locale: data.country_code === 'IN' ? 'en-IN' : (data.languages ? data.languages.split(',')[0] : DEFAULT_LOCALE)
        };

        localStorage.setItem('user_location', JSON.stringify(location));
        cachedLocation = location;
        return location;
    } catch (error) {
        console.error('Error detecting location:', error);
        return {
            country: 'United States',
            countryCode: 'US',
            city: 'Unknown',
            currency: DEFAULT_CURRENCY,
            timezone: DEFAULT_TIMEZONE,
            locale: DEFAULT_LOCALE
        };
    }
};

/**
 * Formats a number as currency based on the detected or provided currency code
 * @param {number} amount - The amount to format
 * @param {string} [overrideCurrency] - Optional currency code to override the detected one
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, overrideCurrency) => {
    const location = cachedLocation || (localStorage.getItem('user_location') ? JSON.parse(localStorage.getItem('user_location')) : null);
    const currency = overrideCurrency || location?.currency || DEFAULT_CURRENCY;
    const locale = location?.locale || DEFAULT_LOCALE;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

/**
 * Formats a date string according to the user's timezone and locale
 * @param {string|Date} date - The date to format
 * @param {Object} [options] - Optional Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDateTime = (date, options = {}) => {
    if (!date) return 'N/A';

    const location = cachedLocation || (localStorage.getItem('user_location') ? JSON.parse(localStorage.getItem('user_location')) : null);
    const locale = location?.locale || DEFAULT_LOCALE;
    const timezone = location?.timezone || DEFAULT_TIMEZONE;

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
        ...options
    };

    try {
        return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
    } catch (e) {
        console.error('Error formatting date/time:', e);
        return new Date(date).toLocaleString();
    }
};

/**
 * Gets the current currency symbol
 * @returns {string}
 */
export const getCurrencySymbol = () => {
    const location = cachedLocation || (localStorage.getItem('user_location') ? JSON.parse(localStorage.getItem('user_location')) : null);
    const currency = location?.currency || DEFAULT_CURRENCY;
    const locale = location?.locale || DEFAULT_LOCALE;

    return (0).toLocaleString(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).replace(/\d/g, '').trim();
};
