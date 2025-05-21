const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
require('dotenv').config(); // in case you ever want to test locally

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, phoneNumber, specialInstructions } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or missing' });
    }

    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'Hotdog Combo',
          description: [
            item.toppings?.length ? `Toppings: ${item.toppings.join(', ')}` : '',
            item.chip ? `Chip: ${item.chip}` : '',
            item.drink ? `Drink: ${item.drink}` : '',
            specialInstructions ? `Note: ${specialInstructions}` : '',
          ].filter(Boolean).join(' | ')
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://rubymountainhotdogs.com/success', // replace with real success URL
      cancel_url: 'https://rubymountainhotdogs.com/cancel',   // replace with real cancel URL
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Something went wrong creating session.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
