/**
 * apiHelper.ts
 *
 * Service for API communication.
 * Handles authentication, requests, and error handling.
 */

import axios from 'axios';
import { KJUR } from 'jsrsasign';
import { QuoteStatus, QuotePart } from '../models/types';

// Base URL from environment or fallback
const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Axios instance configured with base URL and content type
 */
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Intercepts requests to add JWT authentication token
 */
api.interceptors.request.use((config) => {
    const payload = {
        iat: Math.floor(Date.now() / 1000),
    };

    const token = createJWT(payload);
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

/**
 * Parameters for pagination and filtering quotes
 */
interface PaginationParams {
    /** Page number for pagination */
    page?: number;

    /** Number of items per page */
    limit?: number;

    /** Filter quotes by status */
    status?: QuoteStatus;

    /** Filter quotes by client name */
    clientName?: string;
}

/**
 * Input shape for creating or updating quotations
 */
interface QuotationInput {
    /** Unique identifier for the quote */
    id: string;

    /** Name of the client */
    clientName: string;

    /** Currency for the quote prices */
    currency: 'INR' | 'USD';

    /** Date until which the quote is valid */
    validUntil: string;

    /** Parts included in the quote with their pricing */
    parts?: QuotePart[];
}

/**
 * API service object for quotation operations
 */
export const QuotationApi = {
    /**
     * Gets all quotations with optional filtering
     * @param params - Pagination and filtering parameters
     * @returns Promise resolving to the quotations data
     */
    getAllQuotations: async (params: PaginationParams = {}) => {
        try {
            const response = await api.get('/quotations', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Gets a specific quotation by its ID
     * @param id - The unique identifier of the quotation
     * @returns Promise resolving to the quotation data
     */
    getQuotationById: async (id: string) => {
        try {
            const response = await api.get(`/quotations/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Creates a new quotation in the system
     * @param quotationData - The data for the new quotation
     * @returns Promise resolving to the created quotation data
     */
    createQuotation: async (quotationData: QuotationInput) => {
        try {
            const response = await api.post('/quotations', quotationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Updates an existing quotation with new data
     * @param id - The ID of the quotation to update
     * @param quotationData - The partial data to update
     * @returns Promise resolving to the updated quotation data
     */
    updateQuotation: async (
        id: string,
        quotationData: Partial<QuotationInput>
    ) => {
        try {
            const response = await api.put(`/quotations/${id}`, quotationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Permanently deletes a quotation from the system
     * @param id - The ID of the quotation to delete
     * @returns Promise resolving to the confirmation response
     */
    deleteQuotation: async (id: string) => {
        try {
            const response = await api.delete(`/quotations/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Updates only the status of an existing quotation
     * @param id - The ID of the quotation to update
     * @param status - The new status to apply
     * @returns Promise resolving to the updated quotation data
     */
    changeQuotationStatus: async (id: string, status: QuoteStatus) => {
        try {
            const response = await api.patch(`/quotations/${id}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Generates a PDF version of a quotation
     * @param quotationData - The quotation data to include in the PDF
     * @returns Promise resolving to a Blob containing the PDF data
     */
    generatePDF: async (quotationData: QuotationInput) => {
        try {
            const response = await api.post('/quotations/pdf', quotationData, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getConvRate: async () => {
        try {
            const response = await api.get('/convrate');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

/**
 * Standardizes error handling for API requests
 * @param error - The error that occurred during the API request
 * @returns A standardized Error object with an appropriate message
 */
function handleApiError(error: any): Error {
    if (axios.isAxiosError(error)) {
        const message =
            error.response?.data?.message ||
            error.message ||
            'An error occurred';
        return new Error(message);
    }
    return error instanceof Error
        ? error
        : new Error('An unknown error occurred');
}

/**
 * Creates a JSON Web Token (JWT) for API authentication
 * @param payload - The data to include in the JWT payload
 * @returns The signed JWT string
 * @throws Error if JWT secret is not configured
 */
function createJWT(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const secret = import.meta.env.VITE_JWT_SECRET;

    if (!secret) {
        throw handleApiError(new Error('JWT Secret not configured on server'));
    }

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);

    const sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);
    return sJWT;
}

export default {
    QuotationApi,
};
