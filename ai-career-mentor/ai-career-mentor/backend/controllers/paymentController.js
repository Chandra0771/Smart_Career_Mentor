const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const User = require('../models/User');

const PRO_PRICE_ID = 'price_pro_monthly'; // Create this in Stripe dashboard

// @POST /api/payment/create-checkout
exports.createCheckout = async (req, res) => {
  try {
    const user = req.user;

    // Create/retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: user.name });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'AI Career Mentor Pro', description: 'Unlimited AI mentoring, resume analysis, and more' },
          unit_amount: 1999, // $19.99/month
          recurring: { interval: 'month' }
        },
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?payment=cancelled`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment session creation failed.' });
  }
};

// @POST /api/payment/webhook
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed.' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await User.findOneAndUpdate(
      { stripeCustomerId: session.customer },
      { isPro: true }
    );
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await User.findOneAndUpdate(
      { stripeCustomerId: subscription.customer },
      { isPro: false }
    );
  }

  res.json({ received: true });
};

// @GET /api/payment/status
exports.getPaymentStatus = async (req, res) => {
  res.json({ isPro: req.user.isPro, plan: req.user.isPro ? 'pro' : 'free' });
};
