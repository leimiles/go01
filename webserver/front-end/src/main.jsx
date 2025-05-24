import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './css/index.css'
import App from './components/App.jsx'
import ContentPage from './components/ContentPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/api/*" element={null} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
