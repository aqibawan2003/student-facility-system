const Stripe = require('stripe');

// Initialize Stripe with your platform's secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY2, {
  apiVersion: '2022-11-15',
});

module.exports = stripe;
