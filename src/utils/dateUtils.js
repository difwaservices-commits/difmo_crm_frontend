/**
 * Utility functions for date and time formatting
 */

/**
 * Formats a 24-hour time string (HH:mm[:ss]) to a 12-hour format with AM/PM
 * @param {string} timeStr - The time string to format
 * @returns {string} - Formatted time (e.g., "10:30 AM")
 */
export const formatTime12h = (timeStr) => {
    if (!timeStr) return '--:--';
    try {
        const parts = timeStr.split(':');
        if (parts.length < 2) return timeStr;

        const hours = parseInt(parts[0]);
        const minutes = parts[1];

        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;

        return `${h12}:${minutes} ${ampm}`;
    } catch (e) {
        console.error('Error formatting time:', e);
        return timeStr;
    }
};

/**
 * Formats a date string to a human-readable format
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date (e.g., "Oct 15, 2023")
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (e) {
        return date;
    }
};
