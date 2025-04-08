import React from 'react';
import { QuotePart } from '../../models/types';
import Button from '../ui/Button';

interface QuotePartsProps {
    parts: QuotePart[];
    currency: 'INR' | 'USD';
    onDeletePart: (id: string) => void;
}

const QuoteParts: React.FC<QuotePartsProps> = ({
    parts,
    currency,
    onDeletePart,
}) => {
    if (parts.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center px-4 py-12 text-center'>
                <div className='mb-4 rounded-full bg-gray-100 p-3'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-8 w-8 text-gray-500'
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

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
                <thead>
                    <tr className='bg-gray-50'>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                        >
                            Part Name
                        </th>
                        <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                        >
                            MOQ
                        </th>
                        {allQuantities.map((qty) => (
                            <th
                                key={qty}
                                scope='col'
                                className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'
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
                            className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                    {parts.map((part, partIndex) => (
                        <tr
                            key={part.id}
                            className={
                                partIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }
                        >
                            <td className='whitespace-nowrap px-6 py-4'>
                                <div className='flex items-center'>
                                    <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100'>
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
                            </td>
                            <td className='whitespace-nowrap px-6 py-4'>
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
                                        key={`${part.id}-${qty}`}
                                        className='whitespace-nowrap px-6 py-4 text-center text-sm'
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
                            <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                                <Button
                                    onClick={() => onDeletePart(part.id)}
                                    variant='danger'
                                    size='sm'
                                    className='flex items-center'
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
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4'>
                <div className='flex items-center'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-2 h-5 w-5 text-indigo-500'
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
                        column represents a different quantity tier with its
                        corresponding price. Add multiple pricing tiers to offer
                        volume discounts.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuoteParts;
