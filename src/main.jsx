import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from './context/ThemeContext'; // ✅ استيراد الـ Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* ✅ نحيط التطبيق بالـ Provider */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
