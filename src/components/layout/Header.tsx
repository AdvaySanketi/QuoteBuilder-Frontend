import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className='bg-white shadow-sm'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 justify-between'>
                    <div className='flex'>
                        <div className='flex flex-shrink-0 items-center'>
                            <Link to='/' className='flex items-center'>
                                <img
                                    src='/logo.svg'
                                    height={'30vh'}
                                    width={'30vh'}
                                />
                                <span className='ml-2 text-xl font-bold text-gray-900'>
                                    QuoteBuilder
                                </span>
                            </Link>
                        </div>
                        <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                            <Link
                                to='/'
                                className={`${
                                    isActive('/')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium`}
                            >
                                Quotes
                            </Link>
                            <Link
                                to='/quote/new'
                                className={`${
                                    isActive('/quote/new')
                                        ? 'border-indigo-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium`}
                            >
                                Create Quote
                            </Link>
                        </div>
                    </div>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                        <div className='relative ml-3'>
                            <div>
                                <button
                                    type='button'
                                    className='rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                >
                                    <span className='sr-only'>
                                        View notifications
                                    </span>
                                    <svg
                                        className='h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        aria-hidden='true'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='relative ml-3'>
                            <div>
                                <button
                                    type='button'
                                    className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                    id='user-menu-button'
                                    aria-expanded='false'
                                    aria-haspopup='true'
                                >
                                    <span className='sr-only'>
                                        Open user menu
                                    </span>
                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100'>
                                        <span className='font-medium text-indigo-800'>
                                            JD
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='-mr-2 flex items-center sm:hidden'>
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            type='button'
                            className='inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                            aria-controls='mobile-menu'
                            aria-expanded='false'
                        >
                            <span className='sr-only'>Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg
                                    className='block h-6 w-6'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className='block h-6 w-6'
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    aria-hidden='true'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
                id='mobile-menu'
            >
                <div className='space-y-1 pb-3 pt-2'>
                    <Link
                        to='/'
                        className={`${
                            isActive('/')
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                        } block border-l-4 py-2 pl-3 pr-4 text-base font-medium`}
                    >
                        Quotes
                    </Link>
                    <Link
                        to='/quote/new'
                        className={`${
                            isActive('/quote/new')
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                        } block border-l-4 py-2 pl-3 pr-4 text-base font-medium`}
                    >
                        Create Quote
                    </Link>
                </div>
                <div className='border-t border-gray-200 pb-3 pt-4'>
                    <div className='flex items-center px-4'>
                        <div className='flex-shrink-0'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100'>
                                <span className='font-medium text-indigo-800'>
                                    JD
                                </span>
                            </div>
                        </div>
                        <div className='ml-3'>
                            <div className='text-base font-medium text-gray-800'>
                                John Doe
                            </div>
                            <div className='text-sm font-medium text-gray-500'>
                                john@example.com
                            </div>
                        </div>
                        <button
                            type='button'
                            className='ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        >
                            <span className='sr-only'>View notifications</span>
                            <svg
                                className='h-6 w-6'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
