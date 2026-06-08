import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { IS_MOCK } from './Services/mockAuth.js';
import App from './App.jsx'

const app = IS_MOCK ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <StrictMode>
    <GoogleOAuthProvider clientId="283271970934-353ubog56mdvg8q0i2aoted2pkmanib5.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

createRoot(document.getElementById('root')).render(app);