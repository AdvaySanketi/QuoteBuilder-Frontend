import React, { useState, useEffect } from 'react';
import { QuotePart } from '../../models/types';
import Button from '../ui/Button';

interface QuotePartsProps {
    parts: QuotePart[];
    currency: 'INR' | 'USD';
    onDeletePart: (id: string) => void;
    disabled: boolean;
}

interface ConversionResponse {
    result: string;
    base_code: string;
    target_code: string;
    conversion_rate: number;
    conversion_result: number;
}

const QuoteParts: React.FC<QuotePartsProps> = ({
    parts,
    currency,
    onDeletePart,
    disabled,
}) => {
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [convertedParts, setConvertedParts] = useState<QuotePart[]>(parts);
    const [showMobileView, setShowMobileView] = useState(
        window.innerWidth < 768
    );

    const exchangeRateApiUrl = import.meta.env.VITE_EXCHANGE_RATE_API_URL;

    useEffect(() => {
        const handleResize = () => {
            setShowMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchConversionRate = async () => {
            if (currency !== 'INR') {
                setIsLoading(true);
                setError(null);

                try {
                    const response = await fetch(`${exchangeRateApiUrl}/1`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch conversion rate');
                    }

                    const data: ConversionResponse = await response.json();

                    if (data.result === 'success') {
                        setConversionRate(data.conversion_rate);
                    } else {
                        throw new Error('API returned unsuccessful result');
                    }
                } catch (err) {
                    console.error('Error fetching conversion rate:', err);
                    setError('Could not load currency conversion rates');
                    setConversionRate(0.012); // fallback
                } finally {
                    setIsLoading(false);
                }
            } else {
                setConversionRate(null);
            }
        };

        fetchConversionRate();
    }, [currency, exchangeRateApiUrl]);

    useEffect(() => {
        if (currency === 'USD' && conversionRate) {
            const converted = parts.map((part) => ({
                ...part,
                priceQuantities: part.priceQuantities.map((pq) => ({
                    ...pq,
                    originalPrice: pq.price,
                    price: Number((pq.price * conversionRate).toFixed(2)),
                })),
            }));
            setConvertedParts(converted);
        } else {
            setConvertedParts(parts);
        }
    }, [parts, currency, conversionRate]);

    if (parts.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12'>
                <div className='mb-4 rounded-full bg-gray-100 p-3'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-gray-500 sm:h-8 sm:w-8'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                        />
                    </svg>
                </div>
                <p className='mb-1 font-medium text-gray-600'>
                    No parts added yet
                </p>
                <p className='max-w-md text-sm text-gray-500'>
                    Add parts to your quote to specify pricing for different
                    quantities. Your client will be able to see all pricing
                    tiers.
                </p>
            </div>
        );
    }

    const allQuantities = Array.from(
        new Set(
            parts
                .flatMap((part) =>
                    part.priceQuantities.map((pq) => pq.quantity)
                )
                .sort((a, b) => a - b)
        )
    );

    const currencySymbol = currency === 'INR' ? '₹' : '$';

    const StatusNotifications = () => (
        <>
            {isLoading && (
                <div className='mb-4 rounded-md bg-blue-50 p-2 text-sm text-blue-700'>
                    <div className='flex items-center'>
                        <svg
                            className='mr-2 h-4 w-4 animate-spin text-blue-600'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        Loading currency conversion rates...
                    </div>
                </div>
            )}

            {error && (
                <div className='mb-4 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800'>
                    <div className='flex items-center'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mr-2 h-4 w-4 text-yellow-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                                clipRule='evenodd'
                            />
                        </svg>
                        {error} - Using estimated conversion rates.
                    </div>
                </div>
            )}

            {currency === 'USD' && conversionRate && (
                <div className='mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800'>
                    <div className='flex items-center'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mr-2 h-5 w-5 text-green-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                            />
                        </svg>
                        Showing prices in USD (1 INR ={' '}
                        {conversionRate.toFixed(5)} USD)
                    </div>
                </div>
            )}
        </>
    );

    const DesktopTableView = () => (
        <div className='overflow-x-auto pb-2'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                    <tr className='bg-gray-50'>
                        <th
                            scope='col'
                            className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6'
                        >
                            Part Name
                        </th>
                        <th
                            scope='col'
                            className='px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6'
                        >
                            MOQ
                        </th>
                        {allQuantities.map((qty) => (
                            <th
                                key={qty}
                                scope='col'
                                className='px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6'
                            >
                                <div className='flex flex-col items-center'>
                                    <span className='mb-1 text-sm font-semibold text-indigo-600'>
                                        {qty}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        units
                                    </span>
                                </div>
                            </th>
                        ))}
                        <th
                            scope='col'
                            className='px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6'
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                    {convertedParts.map((part, partIndex) => (
                        <tr
                            key={part.partName}
                            className={
                                partIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }
                        >
                            <td className='whitespace-nowrap px-3 py-4 sm:px-6'>
                                <div className='flex items-center'>
                                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100'>
                                        <span className='text-sm font-medium text-indigo-600'>
                                            {partIndex + 1}
                                        </span>
                                    </div>
                                    <div className='ml-3 max-w-[100px] overflow-hidden sm:max-w-full'>
                                        <div className='truncate text-sm font-medium text-gray-900'>
                                            {part.partName}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className='whitespace-nowrap px-3 py-4 sm:px-6'>
                                <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                                    {part.moq} units
                                </span>
                            </td>
                            {allQuantities.map((qty) => {
                                const priceObj = part.priceQuantities.find(
                                    (pq) => pq.quantity === qty
                                );
                                return (
                                    <td
                                        key={`${part.partName}-${qty}`}
                                        className='whitespace-nowrap px-3 py-4 text-center text-sm sm:px-6'
                                    >
                                        {priceObj ? (
                                            <span className='font-medium text-gray-900'>
                                                {currencySymbol}{' '}
                                                {priceObj.price.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span className='text-gray-400'>
                                                —
                                            </span>
                                        )}
                                    </td>
                                );
                            })}
                            <td className='whitespace-nowrap px-3 py-4 text-right text-sm font-medium sm:px-6'>
                                <Button
                                    onClick={() => onDeletePart(part.partName)}
                                    variant='danger'
                                    size='sm'
                                    className='flex items-center'
                                    disabled={disabled}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='mr-1 h-4 w-4'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                    <span className='hidden sm:inline'>
                                        Remove
                                    </span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const MobileCardView = () => (
        <div className='space-y-4 px-4'>
            {convertedParts.map((part, partIndex) => (
                <div
                    key={part.partName}
                    className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'
                >
                    <div className='flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3'>
                        <div className='flex items-center'>
                            <div className='flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100'>
                                <span className='text-sm font-medium text-indigo-600'>
                                    {partIndex + 1}
                                </span>
                            </div>
                            <div className='ml-3'>
                                <div className='text-sm font-medium text-gray-900'>
                                    {part.partName}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <span className='mr-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800'>
                                MOQ: {part.moq}
                            </span>
                            {!disabled && (
                                <button
                                    onClick={() => onDeletePart(part.partName)}
                                    className='text-red-500 hover:text-red-700'
                                    disabled={disabled}
                                    aria-label='Remove part'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-5 w-5'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='divide-y divide-gray-200'>
                        {part.priceQuantities.map((pq) => (
                            <div
                                key={`${part.partName}-${pq.quantity}`}
                                className='flex items-center justify-between px-4 py-3'
                            >
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-900'>
                                        {pq.quantity} units
                                    </span>
                                </div>
                                <div>
                                    <span className='font-medium text-gray-900'>
                                        {currencySymbol} {pq.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <StatusNotifications />

            <div className='mb-4 px-4 md:hidden'>
                <button
                    onClick={() => setShowMobileView(!showMobileView)}
                    className='w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
                >
                    {showMobileView
                        ? 'Switch to Table View'
                        : 'Switch to Card View'}
                </button>
            </div>

            <div className='hidden md:block'>
                <DesktopTableView />
            </div>

            <div className='md:hidden'>
                {showMobileView ? <MobileCardView /> : <DesktopTableView />}
            </div>

            <div className='mx-4 mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4 sm:mx-0'>
                <div className='flex items-start sm:items-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-2 h-5 w-5 flex-shrink-0 text-indigo-500'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                        />
                    </svg>
                    <p className='text-sm text-indigo-800'>
                        <span className='font-medium'>Pricing tiers:</span> Each
                        {showMobileView ? ' row ' : ' column '}
                        represents a different quantity tier with its
                        corresponding price. Add multiple pricing tiers to offer
                        volume discounts.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuoteParts;
