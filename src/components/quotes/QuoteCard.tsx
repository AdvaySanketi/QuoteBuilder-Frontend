import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Quote } from '../../models/types';
import { isDateInFuture } from '../../utils/helpers';

interface QuoteCardProps {
    quote: Quote;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
    const navigate = useNavigate();

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    badgeBg: 'bg-yellow-100',
                    icon: (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 text-yellow-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                        </svg>
                    ),
                };
            case 'SENT':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    textColor: 'text-blue-800',
                    badgeBg: 'bg-blue-100',
                    icon: (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 text-blue-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                        </svg>
                    ),
                };
            case 'APPROVED':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    textColor: 'text-green-800',
                    badgeBg: 'bg-green-100',
                    icon: (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 text-green-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                            />
                        </svg>
                    ),
                };
            case 'REJECTED':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    textColor: 'text-red-800',
                    badgeBg: 'bg-red-100',
                    icon: (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 text-red-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    ),
                };
            case 'EXPIRED':
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    textColor: 'text-gray-800',
                    badgeBg: 'bg-gray-100',
                    icon: (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 text-gray-600'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                clipRule='evenodd'
                            />
                        </svg>
                    ),
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    textColor: 'text-gray-800',
                    badgeBg: 'bg-gray-100',
                    icon: null,
                };
        }
    };

    const statusInfo = getStatusInfo(quote.status);
    const formattedDate = new Date(quote.validUntil).toLocaleDateString(
        'en-US',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }
    );

    const isValid = isDateInFuture(quote.validUntil);

    return (
        <div
            className={`rounded-lg border ${statusInfo.border} transform cursor-pointer overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md`}
            onClick={() => navigate(`/quote/${quote.id}`)}
        >
            <div
                className={`${statusInfo.bg} border-b px-4 py-3 ${statusInfo.border}`}
            >
                <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-gray-900'>
                        {quote.clientName}
                    </h3>
                    <div
                        className={`flex items-center ${statusInfo.badgeBg} ${statusInfo.textColor} rounded-full px-2 py-1 text-xs font-medium`}
                    >
                        {statusInfo.icon && (
                            <span className='mr-1'>{statusInfo.icon}</span>
                        )}
                        {quote.status}
                    </div>
                </div>
                <p className='mt-1 text-xs text-gray-500'>
                    {quote.quoteNumber}
                </p>
            </div>

            <div className='bg-white p-4'>
                <div className='mb-3 flex items-center justify-between text-sm text-gray-500'>
                    <div className='flex items-center'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='mr-1 h-4 w-4 text-gray-400'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                        </svg>
                        <span>
                            {quote.parts.length}{' '}
                            {quote.parts.length === 1 ? 'Part' : 'Parts'}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className={`mr-1 h-4 w-4 ${
                                isValid ? 'text-gray-400' : 'text-red-400'
                            }`}
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                            />
                        </svg>
                        <span
                            className={
                                isValid ? 'text-gray-500' : 'text-red-500'
                            }
                        >
                            {isValid
                                ? `Valid until ${formattedDate}`
                                : `Expired on ${formattedDate}`}
                        </span>
                    </div>
                </div>

                <div className='mt-2 flex justify-end border-t border-gray-100 pt-2'>
                    <button className='text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none'>
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteCard;
