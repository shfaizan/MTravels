const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { serviceType, amount } = req.body;

  // Create a Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: serviceType === 'one-time' ? 'One-Time Transport' : 'Monthly Subscription',
        },
        unit_amount: amount * 100, // Stripe uses cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/canceled`,
  });

  res.status(200).json({ id: session.id });
};
