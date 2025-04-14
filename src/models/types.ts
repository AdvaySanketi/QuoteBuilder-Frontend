export type QuoteStatus =
    | 'DRAFT'
    | 'SENT'
    | 'APPROVED'
    | 'REJECTED'
    | 'EXPIRED';

export interface PriceQuantity {
    quantity: number;
    price: number;
}

export interface QuotePart {
    partName: string;
    moq: number;
    priceQuantities: PriceQuantity[];
}

export interface Quote {
    _id?: string;
    id: string;
    clientName: string;
    quoteNumber: string;
    currency: 'INR' | 'USD';
    validUntil: string;
    status: QuoteStatus;
    parts: QuotePart[];
    createdAt: string;
    updatedAt: string;
}

export interface QuoteFormData {
    _id: string;
    clientName: string;
    currency: 'INR' | 'USD';
    validUntil: string;
    status: QuoteStatus;
    parts: QuotePart[];
}

export interface ConvRate {
    rate: number;
    lastUpdated: string;
    isFallback: boolean;
}
