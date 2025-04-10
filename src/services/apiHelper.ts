import axios from 'axios';
import { KJUR } from 'jsrsasign';
import { QuoteStatus, QuotePart } from '../models/types';

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

interface PaginationParams {
    page?: number;
    limit?: number;
    status?: QuoteStatus;
    clientName?: string;
}

interface QuotationInput {
    id: string;
    clientName: string;
    currency: 'INR' | 'USD';
    validUntil: string;
    parts?: QuotePart[];
}

export const QuotationApi = {
    getAllQuotations: async (params: PaginationParams = {}) => {
        try {
            const response = await api.get('/quotations', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getQuotationById: async (id: string) => {
        try {
            const response = await api.get(`/quotations/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    createQuotation: async (quotationData: QuotationInput) => {
        try {
            const response = await api.post('/quotations', quotationData);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

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

    deleteQuotation: async (id: string) => {
        try {
            const response = await api.delete(`/quotations/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

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
};

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

function createJWT(payload: any) {
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
