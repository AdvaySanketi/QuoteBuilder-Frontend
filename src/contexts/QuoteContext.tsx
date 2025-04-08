import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Quote, QuoteFormData } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// const initialQuotes: Quote[] = [
//     {
//         id: '1',
//         clientName: 'ElectroMakes',
//         quoteNumber: 'QM-2024-001',
//         currency: 'INR',
//         validUntil: '2025-05-20',
//         status: 'ACCEPTED',
//         parts: [
//             {
//                 id: '1-1',
//                 partName: 'DI280101',
//                 moq: 100,
//                 priceQuantities: [
//                     { quantity: 100, price: 125 },
//                     { quantity: 250, price: 110 },
//                     { quantity: 500, price: 95 },
//                 ],
//             },
//             {
//                 id: '1-2',
//                 partName: 'KA090400',
//                 moq: 200,
//                 priceQuantities: [
//                     { quantity: 250, price: 240 },
//                     { quantity: 500, price: 220 },
//                 ],
//             },
//         ],
//         createdAt: '2024-06-15T00:00:00Z',
//         updatedAt: '2024-06-20T00:00:00Z',
//     },
//     {
//         id: '2',
//         clientName: 'GlobalTech Solutions',
//         quoteNumber: 'GT-2024-042',
//         currency: 'USD',
//         validUntil: '2024-12-31',
//         status: 'REJECTED',
//         parts: [
//             {
//                 id: '2-1',
//                 partName: 'AN191119',
//                 moq: 300,
//                 priceQuantities: [
//                     { quantity: 300, price: 310 },
//                     { quantity: 600, price: 290 },
//                 ],
//             },
//             {
//                 id: '2-2',
//                 partName: 'XT5500',
//                 moq: 50,
//                 priceQuantities: [
//                     { quantity: 50, price: 75 },
//                     { quantity: 100, price: 65 },
//                 ],
//             },
//         ],
//         createdAt: '2024-07-10T00:00:00Z',
//         updatedAt: '2024-07-15T00:00:00Z',
//     },
//     {
//         id: '3',
//         clientName: 'Precision Components Ltd',
//         quoteNumber: 'PC-2024-015',
//         currency: 'INR',
//         validUntil: '2025-03-15',
//         status: 'DRAFT',
//         parts: [
//             {
//                 id: '3-1',
//                 partName: 'MC8800',
//                 moq: 150,
//                 priceQuantities: [
//                     { quantity: 150, price: 180 },
//                     { quantity: 300, price: 160 },
//                 ],
//             },
//         ],
//         createdAt: '2024-08-05T00:00:00Z',
//         updatedAt: '2024-08-05T00:00:00Z',
//     },
//     {
//         id: '4',
//         clientName: 'Industrial Systems Inc',
//         quoteNumber: 'IS-2023-112',
//         currency: 'INR',
//         validUntil: '2024-01-30',
//         status: 'EXPIRED',
//         parts: [
//             {
//                 id: '4-1',
//                 partName: 'HV3200',
//                 moq: 75,
//                 priceQuantities: [
//                     { quantity: 75, price: 420 },
//                     { quantity: 150, price: 390 },
//                 ],
//             },
//             {
//                 id: '4-2',
//                 partName: 'LP4555',
//                 moq: 200,
//                 priceQuantities: [{ quantity: 200, price: 150 }],
//             },
//         ],
//         createdAt: '2023-12-01T00:00:00Z',
//         updatedAt: '2024-01-31T00:00:00Z',
//     },
//     {
//         id: '5',
//         clientName: 'Automation Partners',
//         quoteNumber: 'AP-2024-033',
//         currency: 'USD',
//         validUntil: '2025-02-28',
//         status: 'SENT',
//         parts: [
//             {
//                 id: '5-1',
//                 partName: 'QC9900',
//                 moq: 120,
//                 priceQuantities: [
//                     { quantity: 120, price: 85 },
//                     { quantity: 240, price: 75 },
//                 ],
//             },
//             {
//                 id: '5-2',
//                 partName: 'RT7700',
//                 moq: 80,
//                 priceQuantities: [{ quantity: 80, price: 110 }],
//             },
//             {
//                 id: '5-3',
//                 partName: 'SP2200',
//                 moq: 300,
//                 priceQuantities: [{ quantity: 300, price: 65 }],
//             },
//         ],
//         createdAt: '2024-09-01T00:00:00Z',
//         updatedAt: '2024-09-03T00:00:00Z',
//     },
//     {
//         id: '6',
//         clientName: 'Future Electronics',
//         quoteNumber: 'FE-2024-056',
//         currency: 'USD',
//         validUntil: '2025-04-15',
//         status: 'DRAFT',
//         parts: [
//             {
//                 id: '6-1',
//                 partName: 'ZP1001',
//                 moq: 500,
//                 priceQuantities: [
//                     { quantity: 500, price: 45 },
//                     { quantity: 1000, price: 40 },
//                 ],
//             },
//         ],
//         createdAt: '2024-10-10T00:00:00Z',
//         updatedAt: '2024-10-12T00:00:00Z',
//     },
//     {
//         id: '7',
//         clientName: 'ElectroMakes',
//         quoteNumber: 'QM-2024-078',
//         currency: 'INR',
//         validUntil: '2025-06-30',
//         status: 'SENT',
//         parts: [
//             {
//                 id: '7-1',
//                 partName: 'DI280101',
//                 moq: 100,
//                 priceQuantities: [
//                     { quantity: 100, price: 120 },
//                     { quantity: 250, price: 105 },
//                 ],
//             },
//         ],
//         createdAt: '2024-11-15T00:00:00Z',
//         updatedAt: '2024-11-18T00:00:00Z',
//     },
// ];

const initialQuotes: Quote[] = [];

interface QuoteContextType {
    quotes: Quote[];
    getQuoteById: (id: string) => Quote | undefined;
    addQuote: (quote: QuoteFormData) => string;
    updateQuote: (id: string, quote: QuoteFormData) => void;
    deleteQuote: (id: string) => void;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(
    undefined
);

interface QuoteProviderProps {
    children: ReactNode;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);

    useEffect(() => {
        console.log('Loading quotes from localStorage');
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            try {
                setQuotes(JSON.parse(storedQuotes));
                console.log('Loaded quotes from localStorage');
            } catch (e) {
                console.error('Error parsing stored quotes:', e);
            }
        } else {
            console.log('No stored quotes found, using initial data');
        }
    }, []);

    useEffect(() => {
        console.log('Saving quotes to localStorage:', quotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }, [quotes]);

    const getQuoteById = (id: string) => {
        return quotes.find((quote) => quote.id === id);
    };

    const addQuote = (quoteData: QuoteFormData): string => {
        const now = new Date().toISOString();
        const qid = Math.floor(Math.random() * 10000); // could use uuidv4() also
        const newQuote: Quote = {
            id: `Q-${qid}`,
            quoteNumber: `${qid}`,
            createdAt: now,
            updatedAt: now,
            ...quoteData,
        };

        setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
        return newQuote.id;
    };

    const updateQuote = (id: string, quoteData: QuoteFormData) => {
        setQuotes((prevQuotes) =>
            prevQuotes.map((quote) =>
                quote.id === id
                    ? {
                          ...quote,
                          ...quoteData,
                          updatedAt: new Date().toISOString(),
                      }
                    : quote
            )
        );
    };

    const deleteQuote = (id: string) => {
        setQuotes((prevQuotes) =>
            prevQuotes.filter((quote) => quote.id !== id)
        );
    };

    return (
        <QuoteContext.Provider
            value={{ quotes, getQuoteById, addQuote, updateQuote, deleteQuote }}
        >
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuoteContext = () => {
    const context = React.useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuoteContext must be used within a QuoteProvider');
    }
    return context;
};
