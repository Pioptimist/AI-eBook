import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>     {/* //this sends the value to all the components that are using the authcontext. ie the custom hook useauth */}
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <App />
    </BrowserRouter>
    </AuthProvider> 
  </StrictMode>,
)
