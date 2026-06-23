const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../../controllers/paymentController/webhookController');

// Webhook route for Stripe events
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;
