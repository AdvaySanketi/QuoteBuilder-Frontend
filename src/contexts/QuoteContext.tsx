/**
 * QuoteContext.tsx
 *
 * Context provider for managing quote data throughout the application.
 * Handles API communication, state management, and CRUD operations.
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Quote, QuoteFormData, QuoteStatus } from '../models/types';
import { QuotationApi } from '../services/apiHelper';

/**
 * Interface defining the shape of the Quote context.
 * Provides methods and state for interacting with quotes.
 */
interface QuoteContextType {
    /** List of all quotes retrieved from the API */
    quotes: Quote[];

    /** Indicates whether quotes are currently being loaded */
    loading: boolean;

    /** Error message if quote operations fail */
    error: string | null;

    /**
     * Retrieves a specific quote by its ID
     * @param id - The unique identifier of the quote
     * @returns Promise resolving to the quote or undefined if not found
     */
    getQuoteById: (id: string) => Promise<Quote | undefined>;

    /**
     * Creates a new quote with the provided data
     * @param quote - The quote data to use for creation
     * @returns Promise resolving to the ID of the newly created quote
     */
    addQuote: (quote: QuoteFormData) => Promise<string>;

    /**
     * Updates an existing quote with new data
     * @param id - The ID of the quote to update
     * @param quote - The updated quote data
     */
    updateQuote: (id: string, quote: QuoteFormData) => Promise<void>;

    /**
     * Updates only the status of a quote
     * @param id - The ID of the quote to update
     * @param status - The new status to apply
     */
    updateQuoteStatus: (id: string, status: QuoteStatus) => Promise<void>;

    /**
     * Permanently removes a quote
     * @param id - The ID of the quote to delete
     */
    deleteQuote: (id: string) => Promise<void>;

    /**
     * Refreshes the quote list from the API
     */
    refreshQuotes: () => Promise<void>;
}

export const QuoteContext = createContext<QuoteContextType | undefined>(
    undefined
);

interface QuoteProviderProps {
    children: ReactNode;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [idMapping, setIdMapping] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuotes = async () => {
        try {
            setLoading(true);
            const response = await QuotationApi.getAllQuotations();
            const quotesData = Array.isArray(response)
                ? response
                : response.data;

            const newMapping = quotesData.reduce(
                (acc: Record<string, string>, quote: Quote) => {
                    if (quote.id && quote._id) {
                        acc[quote.id] = quote._id;
                    }
                    return acc;
                },
                {} as Record<string, string>
            );

            setQuotes(quotesData);
            setIdMapping(newMapping);
            setError(null);
        } catch (err) {
            console.error('Error fetching quotations:', err);
            setError('Failed to load quotes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const refreshQuotes = async () => {
        await fetchQuotes();
    };

    const getQuoteById = async (id: string) => {
        try {
            const qid = idMapping[id] || id;
            const response = await QuotationApi.getQuotationById(qid);
            return response.data || response;
        } catch (err) {
            console.error('Error fetching quote:', err);
            setError('Failed to fetch quote details.');
            return undefined;
        }
    };

    const addQuote = async (quoteData: QuoteFormData): Promise<string> => {
        try {
            const now = new Date().toISOString();
            const qid = Math.floor(Math.random() * 10000); // could use uuidv4() also
            const newQuote: Quote = {
                ...quoteData,
                id: `Q-${qid}`,
                quoteNumber: `${qid}`,
                createdAt: now,
                updatedAt: now,
                parts: quoteData.parts || [],
            };

            const createdQuote = await QuotationApi.createQuotation(newQuote);

            await refreshQuotes();

            return createdQuote.id;
        } catch (err) {
            console.error('Error adding quote:', err);
            setError('Failed to create quote.');
            throw err;
        }
    };

    const updateQuote = async (id: string, quoteData: QuoteFormData) => {
        try {
            const updatedQuote = {
                ...quoteData,
                updatedAt: new Date().toISOString(),
            };

            await QuotationApi.updateQuotation(id, updatedQuote);

            await refreshQuotes();
        } catch (err) {
            console.error('Error updating quote:', err);
            setError('Failed to update quote.');
            throw err;
        }
    };

    const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
        try {
            await QuotationApi.changeQuotationStatus(id, status);

            await refreshQuotes();
        } catch (err) {
            console.error('Error updating quote:', err);
            setError('Failed to update quote.');
            throw err;
        }
    };

    const deleteQuote = async (id: string) => {
        try {
            await QuotationApi.deleteQuotation(id);

            await refreshQuotes();
        } catch (err) {
            console.error('Error deleting quote:', err);
            setError('Failed to delete quote.');
            throw err;
        }
    };

    return (
        <QuoteContext.Provider
            value={{
                quotes,
                loading,
                error,
                getQuoteById,
                addQuote,
                updateQuote,
                updateQuoteStatus,
                deleteQuote,
                refreshQuotes,
            }}
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
