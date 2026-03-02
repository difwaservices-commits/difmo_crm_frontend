import { describe, it, expect } from 'vitest';
import { formatTime12h, formatDate } from '../../dateUtils';

describe('dateUtils utilites', () => {
    describe('formatTime12h', () => {
        it('should format 24-hour time to 12-hour AM correctly', () => {
            expect(formatTime12h('09:30')).toBe('09:30 AM');
        });

        it('should format 24-hour time to 12-hour PM correctly', () => {
            expect(formatTime12h('14:45')).toBe('02:45 PM');
        });

        it('should handle midnight correctly', () => {
            expect(formatTime12h('00:15')).toBe('12:15 AM');
        });

        it('should handle noon correctly', () => {
            expect(formatTime12h('12:00')).toBe('12:00 PM');
        });

        it('should return --:-- for null or undefined input', () => {
            expect(formatTime12h(null)).toBe('--:--');
            expect(formatTime12h(undefined)).toBe('--:--');
        });
    });

    describe('formatDate', () => {
        it('should format date string correctly', () => {
            const testDate = '2023-10-15T12:00:00Z';
            // toLocaleDateString might vary by environment locale, but we expect something like "Oct 15, 2023"
            // if we specify en-US it should be consistent
            expect(formatDate(testDate)).toMatch(/Oct 15, 2023/);
        });

        it('should return N/A for null or undefined input', () => {
            expect(formatDate(null)).toBe('N/A');
            expect(formatDate(undefined)).toBe('N/A');
        });
    });
});
