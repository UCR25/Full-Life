import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// move this somewhere else (this is just for testing)
const CLIENT_ID = "906188913076-v4cjt228sine3kj5vtiu9sn10l6ob4vc.apps.googleusercontent.com"

import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "340277123834-2sr9kanlusljq392mac22ovbql8ons86.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
