import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='flex min-h-screen flex-col'>
            <div className='flex-shrink-0'>
                <Header />
            </div>

            <div className='flex-grow pb-28'>
                <main className='px-4 py-6 sm:px-6 lg:px-8'>{children}</main>
            </div>

            <div className='fixed bottom-0 left-0 right-0 h-16 bg-white shadow'>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
