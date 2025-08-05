import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  toast.error('Something went wrong', {
    description: 'An unexpected error occurred. Please try refreshing the page.',
    duration: 10000,
    action: {
      label: 'Refresh',
      onClick: () => window.location.reload()
    }
  });
  event.preventDefault();
});

// Global error handler for other errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  toast.error('Something went wrong', {
    description: 'An unexpected error occurred. Please try refreshing the page.',
    duration: 10000,
    action: {
      label: 'Refresh',
      onClick: () => window.location.reload()
    }
  });
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
