import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='flex h-screen flex-col'>
            <div className='flex-shrink-0'>
                <Header />
            </div>

            <div className='mb-[14vh] flex-grow overflow-auto md:mb-[10vh]'>
                <main className='min-h-full px-4 py-6 sm:px-6 lg:px-8'>
                    {children}
                </main>
            </div>

            <div className='flex-shrink-0'>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
