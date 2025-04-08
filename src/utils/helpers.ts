export const formatCurrency = (
    amount: number,
    currency: 'INR' | 'USD' = 'INR',
    locale = 'en-IN'
): string => {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    });

    return formatter.format(amount);
};

export const isDateInFuture = (date: string | Date): boolean => {
    const compareDate = new Date(date);
    const currentDate = new Date();

    compareDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    return compareDate > currentDate;
};

export const formatDate = (
    date: string | Date,
    format: 'short' | 'medium' | 'long' = 'medium'
): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: format === 'short' ? '2-digit' : 'long',
        day: 'numeric',
    };

    return dateObj.toLocaleDateString('en-US', options);
};

export const generateId = (): string => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

export const isEmptyObject = (obj: Record<string, any>): boolean => {
    return Object.keys(obj).length === 0;
};

export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};
