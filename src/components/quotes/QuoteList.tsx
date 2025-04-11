import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuoteContext } from '../../contexts/QuoteContext';
import QuoteCard from './QuoteCard';
import Button from '../ui/Button';

const QuoteList: React.FC = () => {
    const { quotes } = useQuoteContext();
    const navigate = useNavigate();

    return (
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-0'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>
                        Quotes
                    </h1>
                    <p className='mt-1 text-sm text-gray-500 sm:text-base'>
                        Manage and track all your client quotes
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/quote/new')}
                    className='flex items-center justify-center bg-indigo-600 px-3 py-2 shadow-md transition-colors hover:bg-indigo-700 sm:px-4 sm:py-2'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mr-2 h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                            clipRule='evenodd'
                        />
                    </svg>
                    Create New Quote
                </Button>
            </div>

            {quotes.length === 0 ? (
                <div className='my-6 rounded-lg border border-gray-100 bg-white p-6 text-center shadow-md sm:my-10 sm:p-12'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 sm:mb-6 sm:h-24 sm:w-24'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-8 w-8 text-indigo-500 sm:h-12 sm:w-12'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                        </svg>
                    </div>
                    <h2 className='mb-2 text-lg font-semibold text-gray-800 sm:text-xl'>
                        No Quotes yet
                    </h2>
                    <p className='mx-auto mb-4 max-w-md text-sm text-gray-500 sm:mb-6 sm:text-base'>
                        Create your first quote to start tracking client
                        proposals and manage your business more effectively.
                    </p>
                    <Button
                        onClick={() => navigate('/quote/new')}
                        className='bg-indigo-600 px-4 py-2 shadow-md transition-colors hover:bg-indigo-700 sm:px-6 sm:py-2'
                    >
                        Create Your First Quote
                    </Button>
                </div>
            ) : (
                <>
                    <div className='mb-4 rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-3 shadow-sm sm:mb-6 sm:p-4'>
                        <div className='flex items-start space-x-2 sm:items-center sm:space-x-3'>
                            <div className='rounded-full bg-indigo-100 p-1.5 sm:p-2'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-4 w-4 text-indigo-600 sm:h-5 sm:w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <p className='text-xs font-medium text-indigo-700 sm:text-sm'>
                                You have{' '}
                                <span className='font-bold'>
                                    {quotes.length}
                                </span>{' '}
                                active quote{quotes.length !== 1 ? 's' : ''}.
                                Click on any quote to view details or edit.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
                        {quotes.map((quote) => (
                            <QuoteCard key={quote._id} quote={quote} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuoteList;
