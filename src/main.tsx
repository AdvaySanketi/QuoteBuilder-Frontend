import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QuoteProvider } from './contexts/QuoteContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <HelmetProvider>
                <QuoteProvider>
                    <App />
                </QuoteProvider>
            </HelmetProvider>
        </BrowserRouter>
    </React.StrictMode>
);
