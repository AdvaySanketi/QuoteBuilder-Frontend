export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface PriceQuantity {
  quantity: number;
  price: number;
}

export interface QuotePart {
  id: string;
  partName: string;
  moq: number;
  priceQuantities: PriceQuantity[];
}

export interface Quote {
  id: string;
  clientName: string;
  quoteNumber: string;
  currency: "INR" | "USD";
  validUntil: string;
  status: QuoteStatus;
  parts: QuotePart[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteFormData {
  clientName: string;
  currency: "INR" | "USD";
  validUntil: string;
  status: QuoteStatus;
  parts: QuotePart[];
}
