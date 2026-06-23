import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import './index.css';
import App from './App';


// Load Stripe with your publishable key
// const stripePromise = loadStripe('pk_test_51PuC3W06x5pbtGdcxGdUP2BvusUJDiIMGJ8qjxLruaKQaLJx90223ViXuHJH44Vf0oKQDA59YHRuLNbao88m7TBM00OPESRQBq');
const stripePromise = loadStripe('pk_test_51Pt35iP2ehImy2wSPgITh4dPbPxSQaKYGG8Q8D15WGMIMgZpxIgxVPwZEY0p2qv27KKLxahchM2xDmrc4dziYhR300d87CUntQ');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Elements stripe={stripePromise}>
    <ToastContainer  
        position="bottom-right" // This will fix it at the bottom right
        autoClose={5000} // Auto-close after 5 seconds
        hideProgressBar={false} // Show the progress bar
        newestOnTop={false} // Toasts are stacked oldest to newest
        closeOnClick
        rtl={false} // Default is left-to-right layout
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ top: '70px' }}
        />
      <App />
    </Elements>
  </Provider>
);
