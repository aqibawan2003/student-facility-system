const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_ORDER);
const Order = require('../../models/student/Order');

// Webhook handler for Stripe events
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the signature of the event
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different Stripe event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      // Find the corresponding order in your database using the session ID
      const order = await Order.findOne({ stripeSessionId: session.id });
      
      if (!order) {
        return res.status(404).send('Order not found');
      }

      // Mark the order as paid
      order.paymentStatus = 'paid';
      order.status = 'completed';
      await order.save();

      console.log('Payment succeeded and order updated:', order);
      break;
    }
    case 'payment_intent.payment_failed': {
      // Handle the failed payment intent
      console.log('Payment failed:', event.data.object);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
