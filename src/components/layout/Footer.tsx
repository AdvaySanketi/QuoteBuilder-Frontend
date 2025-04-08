import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className='absolute bottom-0  mt-12 w-full border-t border-gray-200 bg-white'>
            <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center justify-between md:flex-row'>
                    <div className='mb-4 flex items-center gap-2 md:mb-0'>
                        <img src='/logo.svg' height={'28vh'} width={'28vh'} />
                        <span className='text-gray-500'>QuoteBuilder</span>
                    </div>
                    <p className='text-sm text-gray-500'>
                        © {new Date().getFullYear()} Advay Sanketi. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
