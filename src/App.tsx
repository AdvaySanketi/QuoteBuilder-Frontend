import './App.css';
import { Routes, Route } from 'react-router-dom';
import AllQuotesPage from './pages/AllQuotesPage';
import QuoteDetailPage from './pages/QuoteDetailPage';

function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<AllQuotesPage />} />
                <Route path='/quote/:id' element={<QuoteDetailPage />} />
            </Routes>
        </div>
    );
}

export default App;
