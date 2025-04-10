import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote } from '../models/types';
import { isDateInFuture } from '../utils/helpers';
import { QuotationApi } from './apiHelper';

export const generatePDFLegacy = async (quote: Quote): Promise<void> => {
    const doc = new jsPDF();
    const currencySymbol = quote.currency === 'INR' ? '₹' : '$';

    doc.setFontSize(20);
    doc.text('Quotation', 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Quote ID: #${quote.id}`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);
    {
        isDateInFuture(quote.validUntil)
            ? doc.text(
                  `Valid Until: ${new Date(
                      quote.validUntil
                  ).toLocaleDateString()}`,
                  14,
                  40
              )
            : doc.text(
                  `Expired On: ${new Date(
                      quote.validUntil
                  ).toLocaleDateString()}`,
                  14,
                  40
              );
    }

    doc.setFontSize(12);
    doc.text('Client Information:', 14, 50);
    doc.setFontSize(10);
    doc.text(`Client: ${quote.clientName}`, 14, 55);

    const allQuantities = Array.from(
        new Set(
            quote.parts
                .flatMap((part) =>
                    part.priceQuantities.map((pq) => pq.quantity)
                )
                .sort((a, b) => a - b)
        )
    );

    const headers = [
        'Part Name',
        'MOQ',
        ...allQuantities.map((qty) => `Price (${qty} Qty)`),
    ];

    const rows = quote.parts.map((part) => {
        return [
            part.partName,
            part.moq.toString(),
            ...allQuantities.map((qty) => {
                const priceQty = part.priceQuantities.find(
                    (pq) => pq.quantity === qty
                );
                return priceQty
                    ? `${currencySymbol} ${priceQty.price.toFixed(2)}`
                    : '-';
            }),
        ];
    });

    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 65,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text('Terms & Conditions:', 14, finalY);
    doc.setFontSize(8);
    doc.text('1. Prices are quoted in ' + quote.currency, 14, finalY + 5);
    doc.text(
        '2. Delivery time to be confirmed upon order confirmation.',
        14,
        finalY + 10
    );
    doc.text(
        '3. Payment terms: 50% advance, balance before dispatch.',
        14,
        finalY + 15
    );
    doc.text(
        '4. Quotation is valid until the date specified above.',
        14,
        finalY + 20
    );

    doc.text('For any queries, please contact us.', 14, finalY + 30);
    doc.text('Authorized Signatory', 150, finalY + 40);

    doc.save(`Quotation_${quote.id}_${quote.clientName}.pdf`);
};

export const GeneratePDF = async (quote: Quote): Promise<void> => {
    const pdfResponse = await QuotationApi.generatePDF(quote);
    const url = window.URL.createObjectURL(pdfResponse);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quotation_${quote.id}_${quote.clientName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};
