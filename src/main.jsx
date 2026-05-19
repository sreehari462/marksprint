import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import QuizPage from './pages/QuizPage.jsx';
const PortfolioUrl = '/PortfolioPage.html';
import AboutPage from './pages/AboutPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import './index.css';

const PortfolioPage = () => (
  <iframe 
    src={PortfolioUrl} 
    style={{ width: '100%', height: '100vh', border: 'none' }} 
    title='Portfolio'
  />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/quiz/:subject' element={<QuizPage />} />
            <Route path='/portfolio' element={<PortfolioPage />} />
            <Route path='/about' element={<AboutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);