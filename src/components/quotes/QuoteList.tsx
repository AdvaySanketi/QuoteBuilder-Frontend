import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuoteContext } from '../../contexts/QuoteContext';
import QuoteCard from './QuoteCard';
import Button from '../ui/Button';

const QuoteList: React.FC = () => {
    const { quotes } = useQuoteContext();
    const navigate = useNavigate();

    return (
        <div className='mx-auto max-w-7xl'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Quotes</h1>
                    <p className='mt-1 text-gray-500'>
                        Manage and track all your client quotes
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/quote/new')}
                    className='flex items-center bg-indigo-600 shadow-md transition-colors hover:bg-indigo-700'
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
                <div className='my-10 rounded-lg border border-gray-100 bg-white p-12 text-center shadow-md'>
                    <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-12 w-12 text-indigo-500'
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
                    <h2 className='mb-2 text-xl font-semibold text-gray-800'>
                        No Quotes yet
                    </h2>
                    <p className='mx-auto mb-6 max-w-md text-gray-500'>
                        Create your first quote to start tracking client
                        proposals and manage your business more effectively.
                    </p>
                    <Button
                        onClick={() => navigate('/quote/new')}
                        className='bg-indigo-600 shadow-md transition-colors hover:bg-indigo-700'
                    >
                        Create Your First Quote
                    </Button>
                </div>
            ) : (
                <>
                    <div className='mb-6 rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 shadow-sm'>
                        <div className='flex items-center space-x-3'>
                            <div className='rounded-full bg-indigo-100 p-2'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-indigo-600'
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
                            <p className='text-sm font-medium text-indigo-700'>
                                You have{' '}
                                <span className='font-bold'>
                                    {quotes.length}
                                </span>{' '}
                                active quote{quotes.length !== 1 ? 's' : ''}.
                                Click on any quote to view details or edit.
                            </p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
