import { useState, useEffect } from 'react';
import { detectLocation, formatCurrency, formatDateTime, getCurrencySymbol } from '../utils/localeUtils';

/**
 * Hook to manage detected locale, currency, and time data
 */
export const useLocale = () => {
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const detected = await detectLocation();
            setLocation(detected);
            setIsLoading(false);
        };
        init();
    }, []);

    const formatPrice = (amount, currencyCode) => {
        return formatCurrency(amount, currencyCode || location?.currency);
    };

    const formatDate = (date, options) => {
        return formatDateTime(date, options);
    };

    const currencySymbol = getCurrencySymbol();

    return {
        location,
        isLoading,
        formatPrice,
        formatDate,
        currencySymbol,
        currency: location?.currency || 'USD',
        timezone: location?.timezone || 'UTC'
    };
};

export default useLocale;
